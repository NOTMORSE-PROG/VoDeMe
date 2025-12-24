export interface LevelProgress {
  level: number
  score: number
  completed: boolean
  timestamp: number
}

export interface GameProgress {
  [gameName: string]: {
    currentLevel: number
    levels: LevelProgress[]
  }
}

// Custom error for authentication failures
export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication required') {
    super(message)
    this.name = 'AuthenticationError'
  }
}

const MIN_SCORE_TO_PASS = 7 // Need at least 7/10 to unlock next level

// Cache for game progress to reduce API calls
let progressCache: GameProgress | null = null
let cacheTimestamp = 0
const CACHE_DURATION = 30000 // 30 seconds

// Helper to fetch progress from API
async function fetchProgressFromAPI(): Promise<GameProgress> {
  const response = await fetch('/api/games/progress')

  // Handle authentication errors specifically
  if (response.status === 401) {
    throw new AuthenticationError('Please log in to save your game progress')
  }

  if (!response.ok) {
    throw new Error('Failed to fetch game progress')
  }

  const data = await response.json()
  const apiProgress = data.progress || []

  // Convert API format to our GameProgress format
  const gameProgress: GameProgress = {}

  apiProgress.forEach((record: any) => {
    if (!gameProgress[record.gameName]) {
      gameProgress[record.gameName] = {
        currentLevel: 1,
        levels: []
      }
    }

    gameProgress[record.gameName].levels.push({
      level: record.level,
      score: record.score,
      completed: record.completed,
      timestamp: new Date(record.updatedAt).getTime()
    })

    // Update current level (next level after highest completed)
    if (record.completed && record.score >= MIN_SCORE_TO_PASS) {
      const nextLevel = record.level + 1
      if (nextLevel > gameProgress[record.gameName].currentLevel) {
        gameProgress[record.gameName].currentLevel = nextLevel
      }
    }
  })

  return gameProgress
}

// Fallback to localStorage
function getLocalStorageProgress(): GameProgress {
  if (typeof window === "undefined") return {}

  try {
    const stored = localStorage.getItem("vodeme_game_progress")
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.error("Error reading from localStorage:", error)
    return {}
  }
}

// Get all game progress
export async function getGameProgress(): Promise<GameProgress> {
  if (typeof window === "undefined") return {}

  // Use cache if available and fresh
  const now = Date.now()
  if (progressCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return progressCache
  }

  try {
    // Fetch fresh data
    const progress = await fetchProgressFromAPI()
    progressCache = progress
    cacheTimestamp = now

    return progress
  } catch (error) {
    // Re-throw authentication errors so components can handle them
    if (error instanceof AuthenticationError) {
      throw error
    }

    // For other errors, log and return empty progress
    console.error('Error fetching game progress:', error)
    return {}
  }
}

// Get progress for a specific game
export async function getProgress(gameName: string) {
  const allProgress = await getGameProgress()
  return allProgress[gameName] || { currentLevel: 1, levels: [] }
}

// Check if a level is unlocked
export async function isLevelUnlocked(gameName: string, level: number): Promise<boolean> {
  if (level === 1) return true // Level 1 is always unlocked

  const progress = await getProgress(gameName)
  const previousLevel = progress.levels.find(l => l.level === level - 1)

  // Previous level must be completed with passing score
  return previousLevel ? previousLevel.completed && previousLevel.score >= MIN_SCORE_TO_PASS : false
}

// Get the highest unlocked level
export async function getHighestUnlockedLevel(gameName: string): Promise<number> {
  const progress = await getProgress(gameName)
  let highestLevel = 1

  for (let i = 1; i <= 10; i++) {
    if (await isLevelUnlocked(gameName, i)) {
      highestLevel = i
    } else {
      break
    }
  }

  return highestLevel
}

// Save level completion
export async function saveLevelProgress(
  gameName: string,
  level: number,
  score: number,
  totalQuestions: number = 10
): Promise<{ isFirstAttempt: boolean; message: string; recordedScore?: number; currentScore?: number }> {
  if (typeof window === "undefined") {
    return { isFirstAttempt: false, message: '' }
  }

  // Save to API
  const response = await fetch('/api/games/progress', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      gameName,
      level,
      score,
    }),
  })

  // Handle authentication errors
  if (response.status === 401) {
    throw new AuthenticationError('Please log in to save your game progress')
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to save progress')
  }

  const data = await response.json()

  // Clear cache to force refresh on next read
  progressCache = null

  return {
    isFirstAttempt: data.isFirstAttempt ?? true,
    message: data.message || '',
    recordedScore: data.recordedScore,
    currentScore: data.currentScore,
  }
}

// Reset progress for a game
export async function resetGameProgress(gameName: string): Promise<void> {
  if (typeof window === "undefined") return

  try {
    // Note: You may want to add a DELETE endpoint for this
    // For now, we'll just clear cache and localStorage
    progressCache = null

    const allProgress = getLocalStorageProgress()
    delete allProgress[gameName]
    localStorage.setItem("vodeme_game_progress", JSON.stringify(allProgress))
  } catch (error) {
    console.error("Error resetting game progress:", error)
  }
}

// Get level status (locked, unlocked, completed)
export async function getLevelStatus(gameName: string, level: number): Promise<"locked" | "unlocked" | "completed"> {
  const progress = await getProgress(gameName)
  const levelProgress = progress.levels.find(l => l.level === level)

  if (levelProgress?.completed && levelProgress.score >= MIN_SCORE_TO_PASS) {
    return "completed"
  }

  if (await isLevelUnlocked(gameName, level)) {
    return "unlocked"
  }

  return "locked"
}

// Get star rating based on score (1-3 stars)
export function getStarRating(score: number, total: number = 10): number {
  const percentage = (score / total) * 100
  if (percentage >= 90) return 3
  if (percentage >= 70) return 2
  if (percentage >= 50) return 1
  return 0
}

// Migration helper: Import localStorage data to database
export async function migrateLocalStorageToDatabase(): Promise<void> {
  if (typeof window === "undefined") return

  const localProgress = getLocalStorageProgress()

  // If no local progress, nothing to migrate
  if (Object.keys(localProgress).length === 0) {
    return
  }

  try {
    // Send each game's progress to the API
    for (const gameName of Object.keys(localProgress)) {
      const gameData = localProgress[gameName]

      for (const levelData of gameData.levels) {
        await fetch('/api/games/progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            gameName,
            level: levelData.level,
            score: levelData.score,
          }),
        })
      }
    }

    console.log('Successfully migrated localStorage data to database')
  } catch (error) {
    console.error('Error migrating localStorage data:', error)
  }
}

export { MIN_SCORE_TO_PASS }
