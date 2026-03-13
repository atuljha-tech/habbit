export function calculateStreak(logs: any[]) {
  if (!logs || logs.length === 0) {
    return { currentStreak: 0, longestStreak: 0 }
  }

  // sort logs by date
  logs.sort((a, b) => a.date.localeCompare(b.date))

  let longestStreak = 0
  let currentCount = 0

  for (let i = 0; i < logs.length; i++) {
    if (logs[i].completed) {
      currentCount++
      longestStreak = Math.max(longestStreak, currentCount)
    } else {
      currentCount = 0
    }
  }

  // calculate current streak from the end
  let currentStreak = 0

  for (let i = logs.length - 1; i >= 0; i--) {
    if (logs[i].completed) {
      currentStreak++
    } else {
      break
    }
  }

  return {
    currentStreak,
    longestStreak,
  }
}