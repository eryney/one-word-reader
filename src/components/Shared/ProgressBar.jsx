export default function ProgressBar({ progress }) {
  return (
    <div className="w-full h-1 bg-gray-800">
      <div
        className="h-full bg-white transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
}
