// Speed reading constants
export const MIN_WPM = 150;
export const MAX_WPM = 1000;
export const DEFAULT_WPM = 300;
export const WPM_STEP = 50;

// Skip word count
export const SKIP_COUNT = 10;

// Progress save interval (milliseconds)
export const PROGRESS_SAVE_INTERVAL = 5000;

// Supported file formats
export const SUPPORTED_FORMATS = {
  EPUB: 'epub',
  PDF: 'pdf',
  MOBI: 'mobi'
};

// LocalStorage keys
export const STORAGE_KEYS = {
  BOOKS: 'speed_reader_books',
  FILES: 'speed_reader_files',
  PROGRESS: 'speed_reader_progress',
  PREFERENCES: 'speed_reader_preferences'
};
