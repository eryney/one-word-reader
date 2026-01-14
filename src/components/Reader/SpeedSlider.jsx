import { MIN_WPM, MAX_WPM, WPM_STEP } from '../../utils/constants';

export default function SpeedSlider({ wpm, onChange }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-white text-sm">
        <span className="text-gray-400">Speed</span>
        <span className="font-bold">{wpm} WPM</span>
      </div>
      <input
        type="range"
        min={MIN_WPM}
        max={MAX_WPM}
        step={WPM_STEP}
        value={wpm}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white"
      />
      <div className="flex justify-between text-gray-500 text-xs">
        <span>{MIN_WPM}</span>
        <span>{MAX_WPM}</span>
      </div>
    </div>
  );
}
