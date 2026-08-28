"use client";

export default function VisualizerControls({
  onPlay,
  onPause,
  onStep,
  onReset,
  onShuffle,
  speed,
  onSpeedChange,
}) {
  return (
    <div className="controls-wrapper">
      <div className="visualizer-controls">
        <button onClick={onPlay}>▶ Play</button>
        <button onClick={onPause}>⏸ Pause</button>
        <button onClick={onStep}>→ Step</button>
        <button onClick={onReset}>↻ Reset</button>
        <button onClick={onShuffle}>🔀 Shuffle</button>
      </div>

      <div className="speed-control">
        <span>Speed</span>

        <input
          type="range"
          min="100"
          max="1000"
          step="100"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
        />

        <span>{speed}ms</span>
      </div>
    </div>
  );
}