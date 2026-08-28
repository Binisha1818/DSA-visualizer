"use client";

export default function StepExplanation({ step }) {
  if (!step) {
    return (
      <div className="step-explanation">
        <p>Press Step or Play to begin.</p>
      </div>
    );
  }

  let message = "Processing...";

  if (step.type === "start") {
    message = `Starting position ${step.currentIndex + 1}. Looking for the smallest element.`;
  }

  if (step.type === "compare") {
    const [first, second] = step.indices;

    message = `Comparing position ${first + 1} with position ${second + 1}.`;
  }

  if (step.type === "new-minimum") {
    message = `New minimum found: ${step.array[step.minIndex]}`;
  }

  if (step.type === "swap") {
    const [first, second] = step.indices;

    message = `Swapping ${step.array[first]} with ${step.array[second]}.`;
  }

  if (step.type === "sorted") {
    message = `${step.array[step.index]} is now in its final position.`;
  }

  if (step.type === "complete") {
    message = "Sorting complete! 🎉";
  }

  return (
    <div className="step-explanation">
      <span>WHAT  HAPPENING</span>
      <p>{message}</p>
    </div>
  );
}