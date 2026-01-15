import { useState } from 'react';

export default function SectionPanel({ sections, onJumpTo, currentIndex }) {
  const [isOpen, setIsOpen] = useState(false);

  // Don't render if no sections
  if (!sections || sections.length === 0) {
    return null;
  }

  // Determine current section based on currentIndex
  const currentSection = sections.findIndex(
    s => currentIndex >= s.startIndex && currentIndex <= s.endIndex
  );

  return (
    <div className="fixed top-20 right-4 z-40">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
        title="Sections"
        aria-label="Toggle sections panel"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
        </svg>
        {sections.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
            {sections.length}
          </span>
        )}
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="absolute top-16 right-0 w-80 bg-gray-900 rounded-lg shadow-2xl border border-gray-700 max-h-96 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <h3 className="text-white font-bold text-lg">Sections</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close sections panel"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Sections list */}
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-gray-700">
              {sections.map((section, idx) => {
                const isCurrentSection = idx === currentSection;
                const progress = Math.round((section.startIndex / section.endIndex) * 100) || 0;

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      onJumpTo(section.startIndex);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-4 hover:bg-gray-800 transition-colors ${
                      isCurrentSection ? 'bg-gray-800 border-l-4 border-blue-500' : ''
                    }`}
                    style={{ paddingLeft: `${(section.level - 1) * 16 + 16}px` }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium truncate">
                          {section.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Words {section.startIndex} - {section.endIndex}
                        </div>
                      </div>
                      {isCurrentSection && (
                        <div className="flex-shrink-0">
                          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
