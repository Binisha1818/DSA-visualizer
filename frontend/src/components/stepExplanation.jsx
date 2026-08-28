// components/stepExplanation.jsx
import "./StepExplanation.css";

/**
 * Explains what's happening at the current step in plain language,
 * plus a step counter so the user has a sense of progress.
 */
export default function StepExplanation({
  message,
  comparing,
  array,
  currentStepIndex,
  totalSteps,
}) {
  const comparingValues =
    comparing && comparing.length === 2
      ? [array[comparing[0]], array[comparing[1]]]
      : null;

  return (
    <div className="step-explanation">
      <div className="step-explanation__header">
        <span className="step-explanation__step-count">
          Step {currentStepIndex + 1} of {totalSteps}
        </span>
      </div>

      <p className="step-explanation__message">{message}</p>

      {comparingValues && (
        <div className="step-explanation__comparison">
          <span className="step-explanation__chip">{comparingValues[0]}</span>
          <span className="step-explanation__vs">vs</span>
          <span className="step-explanation__chip">{comparingValues[1]}</span>
        </div>
      )}
    </div>
  );
}