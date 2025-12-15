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

const STORAGE_KEY = "vodeme_game_progress"
const MIN_SCORE_TO_PASS = 7 // Need at least 7/10 to unlock next level

// Get all game progress from localStorage
export function getGameProgress(): GameProgress {
  if (typeof window === "undefined") return {}

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.error("Error reading game progress:", error)
    return {}
  }
}

// Get progress for a specific game
export function getProgress(gameName: string) {
  const allProgress = getGameProgress()
  return allProgress[gameName] || { currentLevel: 1, levels: [] }
}

// Check if a level is unlocked
export function isLevelUnlocked(gameName: string, level: number): boolean {
  if (level === 1) return true // Level 1 is always unlocked

  const progress = getProgress(gameName)
  const previousLevel = progress.levels.find(l => l.level === level - 1)

  // Previous level must be completed with passing score
  return previousLevel ? previousLevel.completed && previousLevel.score >= MIN_SCORE_TO_PASS : false
}

// Get the highest unlocked level
export function getHighestUnlockedLevel(gameName: string): number {
  const progress = getProgress(gameName)
  let highestLevel = 1

  for (let i = 1; i <= 10; i++) {
    if (isLevelUnlocked(gameName, i)) {
      highestLevel = i
    } else {
      break
    }
  }

  return highestLevel
}

// Save level completion
export function saveLevelProgress(
  gameName: string,
  level: number,
  score: number,
  totalQuestions: number = 10
): void {
  if (typeof window === "undefined") return

  try {
    const allProgress = getGameProgress()
    const gameProgress = allProgress[gameName] || { currentLevel: 1, levels: [] }

    // Find existing level progress or create new
    const levelIndex = gameProgress.levels.findIndex(l => l.level === level)
    const completed = score >= MIN_SCORE_TO_PASS
    const levelProgress: LevelProgress = {
      level,
      score,
      completed,
      timestamp: Date.now()
    }

    if (levelIndex >= 0) {
      // Update existing level (only if new score is better)
      if (score > gameProgress.levels[levelIndex].score) {
        gameProgress.levels[levelIndex] = levelProgress
      }
    } else {
      // Add new level progress
      gameProgress.levels.push(levelProgress)
    }

    // Update current level if this level was completed
    if (completed && level >= gameProgress.currentLevel) {
      gameProgress.currentLevel = level + 1
    }

    // Sort levels
    gameProgress.levels.sort((a, b) => a.level - b.level)

    // Save back to localStorage
    allProgress[gameName] = gameProgress
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress))
  } catch (error) {
    console.error("Error saving game progress:", error)
  }
}

// Reset progress for a game
export function resetGameProgress(gameName: string): void {
  if (typeof window === "undefined") return

  try {
    const allProgress = getGameProgress()
    delete allProgress[gameName]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress))
  } catch (error) {
    console.error("Error resetting game progress:", error)
  }
}

// Get level status (locked, unlocked, completed)
export function getLevelStatus(gameName: string, level: number): "locked" | "unlocked" | "completed" {
  const progress = getProgress(gameName)
  const levelProgress = progress.levels.find(l => l.level === level)

  if (levelProgress?.completed && levelProgress.score >= MIN_SCORE_TO_PASS) {
    return "completed"
  }

  if (isLevelUnlocked(gameName, level)) {
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

export { MIN_SCORE_TO_PASS }
