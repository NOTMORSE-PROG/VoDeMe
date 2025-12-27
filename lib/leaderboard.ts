/**
 * Leaderboard utility functions
 */

export interface LeaderboardEntry {
  id: string
  email: string
  name: string
  profilePicture: string | null
  points: number
  rank: number
}

/**
 * Fetch leaderboard data from API
 */
export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const response = await fetch('/api/leaderboard', {
      cache: 'no-store', // Always fetch fresh data
    })

    if (!response.ok) {
      throw new Error('Failed to fetch leaderboard')
    }

    const data = await response.json()
    return data.leaderboard || []
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return []
  }
}

/**
 * Get user's rank from leaderboard by email
 */
export function getUserRank(leaderboard: LeaderboardEntry[], userEmail: string): number {
  const entry = leaderboard.find(entry => entry.email === userEmail)
  return entry?.rank || 0
}

/**
 * Get top N entries from leaderboard
 */
export function getTopEntries(leaderboard: LeaderboardEntry[], count: number): LeaderboardEntry[] {
  return leaderboard.slice(0, count)
}
