// components/StatsPanel.jsx
import "./StatsPanel.css";

/**
 * Displays live stats about the sort in progress.
 */
export default function StatsPanel({ comparisons, swaps, currentStepIndex, totalSteps }) {
  const progress = totalSteps > 1
    ? Math.round((currentStepIndex / (totalSteps - 1)) * 100)
    : 0;

  return (
    <div className="stats-panel">
      <div className="stats-panel__item">
        <span className="stats-panel__label">Comparisons</span>
        <span className="stats-panel__value">{comparisons}</span>
      </div>

      <div className="stats-panel__item">
        <span className="stats-panel__label">Swaps</span>
        <span className="stats-panel__value">{swaps}</span>
      </div>

      <div className="stats-panel__item stats-panel__item--progress">
        <span className="stats-panel__label">Progress</span>
        <div className="stats-panel__bar">
          <div
            className="stats-panel__bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="stats-panel__value">{progress}%</span>
      </div>
    </div>
  );
}