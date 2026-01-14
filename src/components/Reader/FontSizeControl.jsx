export default function FontSizeControl({ fontSize, onChange }) {
  const sizes = [
    { label: 'S', value: 'small' },
    { label: 'M', value: 'medium' },
    { label: 'L', value: 'large' },
    { label: 'XL', value: 'xlarge' }
  ];

  return (
    <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
      {sizes.map(size => (
        <button
          key={size.value}
          onClick={() => onChange(size.value)}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            fontSize === size.value
              ? 'bg-red-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {size.label}
        </button>
      ))}
    </div>
  );
}
