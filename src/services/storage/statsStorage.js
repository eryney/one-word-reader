const STATS_KEY = 'speed_reader_stats';

// Get reading stats
export function getStats() {
  const data = localStorage.getItem(STATS_KEY);
  return data ? JSON.parse(data) : {
    totalWordsRead: 0,
    totalTimeReading: 0, // in seconds
    sessions: [],
    dailyStats: {}
  };
}

// Start a reading session
export function startSession(bookId) {
  return {
    bookId,
    startTime: Date.now(),
    wordsRead: 0,
    startIndex: 0
  };
}

// End a reading session and save stats
export function endSession(session, endIndex) {
  const stats = getStats();
  const duration = Math.floor((Date.now() - session.startTime) / 1000); // seconds
  const wordsRead = Math.max(0, endIndex - session.startIndex);

  // Update totals
  stats.totalWordsRead += wordsRead;
  stats.totalTimeReading += duration;

  // Add session
  const completedSession = {
    bookId: session.bookId,
    date: new Date().toISOString(),
    duration,
    wordsRead
  };
  stats.sessions.push(completedSession);

  // Update daily stats
  const today = new Date().toISOString().split('T')[0];
  if (!stats.dailyStats[today]) {
    stats.dailyStats[today] = { wordsRead: 0, timeReading: 0 };
  }
  stats.dailyStats[today].wordsRead += wordsRead;
  stats.dailyStats[today].timeReading += duration;

  // Keep only last 100 sessions
  if (stats.sessions.length > 100) {
    stats.sessions = stats.sessions.slice(-100);
  }

  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  return stats;
}

// Get stats for today
export function getTodayStats() {
  const stats = getStats();
  const today = new Date().toISOString().split('T')[0];
  return stats.dailyStats[today] || { wordsRead: 0, timeReading: 0 };
}

// Get stats for last N days
export function getRecentStats(days = 7) {
  const stats = getStats();
  const result = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    result.push({
      date: dateStr,
      ...( stats.dailyStats[dateStr] || { wordsRead: 0, timeReading: 0 })
    });
  }

  return result;
}
