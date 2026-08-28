// components/ControlPanel.jsx
import "./ControlPanel.css";

/**
 * Playback controls for the sorting visualizer.
 * Pure presentational component — all state lives in useSorting.
 */
export default function ControlPanel({
  isPlaying,
  isFinished,
  play,
  pause,
  reset,
  stepForward,
  stepBackward,
  speed,
  setSpeed,
}) {
  return (
    <div className="control-panel">
      <div className="control-panel__buttons">
        <button onClick={stepBackward} className="control-btn">
          ← Step
        </button>

        <button
          onClick={isPlaying ? pause : play}
          disabled={isFinished && !isPlaying}
          className="control-btn control-btn--primary"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>

        <button onClick={stepForward} className="control-btn">
          Step →
        </button>

        <button onClick={reset} className="control-btn control-btn--reset">
          Reset
        </button>
      </div>

      <div className="control-panel__speed">
        <label htmlFor="speed-slider">Speed</label>
     <input
  id="speed-slider"
  type="range"
  min="100"
  max="1500"
  step="100"
  value={1600 - speed}
  onChange={(e) => setSpeed(1600 - Number(e.target.value))}
/>
        <span className="control-panel__speed-value">{speed}ms</span>
      </div>
    </div>
  );
}