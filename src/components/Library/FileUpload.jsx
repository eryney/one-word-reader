import { useState, useRef } from 'react';

export default function FileUpload({ onFileSelect, loading, darkMode }) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file) => {
    // Check if file is EPUB or PDF
    if (!file.name.endsWith('.epub') && !file.name.endsWith('.pdf')) {
      alert('Please upload an EPUB or PDF file.');
      return;
    }
    onFileSelect(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-3 border-dashed rounded-2xl p-12 text-center transition-all ${
          dragActive
            ? 'border-red-500 bg-gradient-to-br from-red-50 to-gray-50 dark:from-gray-800 dark:to-gray-700 scale-105'
            : 'border-gray-300 dark:border-gray-600 hover:border-red-400 hover:bg-red-50/50 dark:hover:bg-gray-800/50'
        } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer shadow-lg hover:shadow-xl'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!loading ? handleButtonClick : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".epub,.pdf"
          onChange={handleChange}
          className="hidden"
          disabled={loading}
        />

        <div className="space-y-4">
          <div className="flex justify-center">
            {loading ? (
              <div className="w-16 h-16 border-4 border-red-200 dark:border-red-800 border-t-red-500 rounded-full animate-spin"></div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                +
              </div>
            )}
          </div>

          <div>
            <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {loading ? 'Processing...' : 'Drop file or click'}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              {loading ? 'Extracting text...' : 'EPUB & PDF'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
