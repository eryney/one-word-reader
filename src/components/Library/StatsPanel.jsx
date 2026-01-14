import { useState } from 'react';
import { getStats, getTodayStats, getRecentStats } from '../../services/storage/statsStorage';

export default function StatsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const stats = getStats();
  const todayStats = getTodayStats();
  const weekStats = getRecentStats(7);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const totalWeekWords = weekStats.reduce((sum, day) => sum + day.wordsRead, 0);
  const totalWeekTime = weekStats.reduce((sum, day) => sum + day.timeReading, 0);

  return (
    <>
      {/* Stats button in header area */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-20 right-4 z-30 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg"
      >
        Stats
      </button>

      {/* Stats modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-white">Reading Statistics</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Today */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">Today</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-3xl font-bold text-red-500">
                      {todayStats.wordsRead.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">words read</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-red-500">
                      {formatTime(todayStats.timeReading)}
                    </div>
                    <div className="text-sm text-gray-400">reading time</div>
                  </div>
                </div>
              </div>

              {/* This Week */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">This Week</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {totalWeekWords.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">words read</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {formatTime(totalWeekTime)}
                    </div>
                    <div className="text-sm text-gray-400">reading time</div>
                  </div>
                </div>

                {/* Week chart */}
                <div className="space-y-2">
                  {weekStats.map((day, index) => {
                    const maxWords = Math.max(...weekStats.map(d => d.wordsRead), 1);
                    const percentage = (day.wordsRead / maxWords) * 100;
                    const date = new Date(day.date);
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

                    return (
                      <div key={day.date} className="flex items-center gap-3">
                        <div className="text-xs text-gray-400 w-8">{dayName}</div>
                        <div className="flex-1 bg-gray-700 rounded-full h-6 overflow-hidden">
                          <div
                            className="bg-red-600 h-full flex items-center px-2 transition-all"
                            style={{ width: `${percentage}%` }}
                          >
                            {day.wordsRead > 0 && (
                              <span className="text-xs text-white font-medium">
                                {day.wordsRead.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* All Time */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">All Time</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {stats.totalWordsRead.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">total words</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {formatTime(stats.totalTimeReading)}
                    </div>
                    <div className="text-sm text-gray-400">total time</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
