"use client";

import { useEffect, useState } from "react";
import "./selectionsort.css";

const INITIAL_ARRAY = [50, 120, 80, 200, 150, 60, 180];

function createSteps(initialArray) {
  const arr = [...initialArray];
  const steps = [];

  steps.push({
    array: [...arr],
    comparing: [],
    minIndex: null,
    swapped: [],
    message: "Starting Selection Sort.",
  });

  for (let i = 0; i < arr.length - 1; i++) {
    let minIndex = i;

    steps.push({
      array: [...arr],
      comparing: [i],
      minIndex,
      swapped: [],
      message: `Starting pass ${i + 1}. Assume ${arr[i]} is the minimum.`,
    });

    for (let j = i + 1; j < arr.length; j++) {
      steps.push({
        array: [...arr],
        comparing: [minIndex, j],
        minIndex,
        swapped: [],
        message: `Compare ${arr[j]} with current minimum ${arr[minIndex]}.`,
      });

      if (arr[j] < arr[minIndex]) {
        minIndex = j;

        steps.push({
          array: [...arr],
          comparing: [j],
          minIndex,
          swapped: [],
          message: `${arr[j]} is smaller. New minimum found.`,
        });
      }
    }

    if (minIndex !== i) {
      const oldValue = arr[i];
      const minValue = arr[minIndex];

      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];

      steps.push({
        array: [...arr],
        comparing: [],
        minIndex: null,
        swapped: [i, minIndex],
        message: `Swap ${oldValue} and ${minValue}.`,
      });
    } else {
      steps.push({
        array: [...arr],
        comparing: [],
        minIndex: null,
        swapped: [],
        message: `${arr[i]} is already in the correct position.`,
      });
    }
  }

  steps.push({
    array: [...arr],
    comparing: [],
    minIndex: null,
    swapped: [],
    message: "Selection Sort completed!",
  });

  return steps;
}

export default function SelectionSortPage() {
  const [steps] = useState(() => createSteps(INITIAL_ARRAY));

  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);

  const current = steps[step];

  /* -----------------------------
     Statistics
  ----------------------------- */

  const comparisons = steps
    .slice(0, step + 1)
    .filter((item) => item.comparing.length > 0).length;

  const swaps = steps
    .slice(0, step + 1)
    .filter((item) => item.swapped.length > 0).length;

  const progress =
    steps.length > 1
      ? Math.round((step / (steps.length - 1)) * 100)
      : 0;

  /* -----------------------------
     Controls
  ----------------------------- */

  const nextStep = () => {
    setStep((prev) => {
      if (prev >= steps.length - 1) {
        setPlaying(false);
        return prev;
      }

      return prev + 1;
    });
  };

  const previousStep = () => {
    setPlaying(false);

    setStep((prev) => Math.max(0, prev - 1));
  };

  const reset = () => {
    setPlaying(false);
    setStep(0);
  };

  const togglePlay = () => {
    if (step >= steps.length - 1) {
      setStep(0);
      setPlaying(true);
      return;
    }

    setPlaying((prev) => !prev);
  };

  /* -----------------------------
     Automatic Play
  ----------------------------- */

  useEffect(() => {
    if (!playing) return;

    const timer = setInterval(() => {
      setStep((prev) => {
        if (prev >= steps.length - 1) {
          setPlaying(false);
          return prev;
        }

        return prev + 1;
      });
    }, speed);

    return () => clearInterval(timer);
  }, [playing, speed, steps.length]);

  /* -----------------------------
     Render
  ----------------------------- */

  return (
    <main className="selection-page">

      {/* Header */}

      <header className="selection-header">
        <h1>Selection Sort Visualizer</h1>

        <p>
          Visualize how Selection Sort repeatedly finds the smallest
          element and places it in the correct position.
        </p>
      </header>

      {/* Controls */}

      <section className="control-panel">
        <div className="control-buttons">

          <button
            className="control-button"
            onClick={previousStep}
          >
            ← Step
          </button>

          <button
            className="control-button play-button"
            onClick={togglePlay}
          >
            {playing ? "Pause" : "Play"}
          </button>

          <button
            className="control-button"
            onClick={nextStep}
          >
            Step →
          </button>

          <button
            className="control-button reset-button"
            onClick={reset}
          >
            Reset
          </button>

        </div>

        <div className="speed-control">

          <span>Speed</span>

          <input
            type="range"
            min="100"
            max="1500"
            step="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />

          <span>{speed}ms</span>

        </div>
      </section>

      {/* Stats */}

      <section className="stats-panel">

        <div>
          Comparisons{" "}
          <strong>{comparisons}</strong>
        </div>

        <div>
          Swaps{" "}
          <strong>{swaps}</strong>
        </div>

        <div className="progress-container">

          <span>Progress</span>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <strong>{progress}%</strong>

        </div>

      </section>

      {/* Step Explanation */}

      <section className="step-panel">

        <small>
          STEP {step + 1} OF {steps.length}
        </small>

        <p>{current.message}</p>

      </section>

      {/* Array Visualization */}

      <section className="array-container">

        {current.array.map((value, index) => {

          let className = "array-bar";

          if (current.comparing.includes(index)) {
            className += " comparing";
          }

          if (current.minIndex === index) {
            className += " minimum";
          }

          if (current.swapped.includes(index)) {
            className += " swapped";
          }

          return (
            <div
              className="array-item"
              key={index}
            >

              <div
                className={className}
                style={{
                  height: `${Math.max(value * 2.5, 40)}px`,
                }}
              />

              <span>{value}</span>

            </div>
          );
        })}

      </section>

      {/* Legend */}

      <section className="legend">

        <Legend
          color="#60a5fa"
          text="Normal"
        />

        <Legend
          color="#f59e0b"
          text="Comparing"
        />

        <Legend
          color="#ef4444"
          text="Current Minimum"
        />

        <Legend
          color="#22c55e"
          text="Swapped"
        />

      </section>

      {/* Complexity */}

      <section className="complexity-panel">

        <div className="complexity-card">
          <span>Best Case</span>
          <strong>O(n²)</strong>
        </div>

        <div className="complexity-card">
          <span>Average Case</span>
          <strong>O(n²)</strong>
        </div>

        <div className="complexity-card">
          <span>Worst Case</span>
          <strong>O(n²)</strong>
        </div>

      </section>

    </main>
  );
}


/* --------------------------------
   Legend Component
-------------------------------- */

function Legend({ color, text }) {
  return (
    <div className="legend-item">

      <span
        className="legend-dot"
        style={{
          background: color,
        }}
      />

      <span>{text}</span>

    </div>
  );
}