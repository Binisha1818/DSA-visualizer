"use client";

import { useEffect, useState } from "react";
import { selectionSort } from "../../algorithms/sorting/selectionSort";
import ArrayVisualizer from "./ArrayVisualizer";
import Visualizercontrols from "./Visualizercontrols";
import stepExplanation from "./stepExplanation";
import AlgorithmCode from "./AlgorithmCode";
import AlgorithmSelector from "./AlgorithmSelector";
const DEFAULT_ARRAY = [64, 25, 12, 22, 11, 90, 34];


function generateArray() {
  return Array.from(
    { length: 7 },
    () => Math.floor(Math.random() * 90) + 10
  );
}

export default function SortingVisualizer() {
  const [algorithm, setAlgorithm] = useState("bubble");
  const [array, setArray] = useState(DEFAULT_ARRAY);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);

  function generateSteps(newArray) {
    const generatedSteps = selectionSort(newArray);

    setSteps(generatedSteps);
    setCurrentStep(0);
    setArray([...newArray]);
    setIsPlaying(false);
  }

  useEffect(() => {
    generateSteps(DEFAULT_ARRAY);
  }, []);

  useEffect(() => {
    if (!isPlaying || currentStep >= steps.length) {
      if (currentStep >= steps.length) {
        setIsPlaying(false);
      }

      return;
    }

    const timer = setTimeout(() => {
      const step = steps[currentStep];

      setArray(step.array);
      setCurrentStep((prev) => prev + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps, speed]);

  function handlePlay() {
    if (currentStep < steps.length) {
      setIsPlaying(true);
    }
  }

  function handlePause() {
    setIsPlaying(false);
  }

  function handleStep() {
    if (currentStep >= steps.length) return;

    const step = steps[currentStep];

    setArray(step.array);
    setCurrentStep((prev) => prev + 1);
  }

  function handleReset() {
    generateSteps(array);
  }

  function handleShuffle() {
    generateSteps(generateArray());
  }

  const currentStepData = steps[currentStep - 1];

  const activeIndices = currentStepData?.indices || [];

  const minimumIndex =
    currentStepData?.minIndex ?? null;

  const sortedIndices = steps
    .slice(0, currentStep)
    .filter((step) => step.type === "sorted")
    .map((step) => step.index);

  return (
    <section className="sorting-visualizer">
      <div className="visualizer-header">
        <div>
          <p className="eyebrow">SORTING ALGORITHM</p>
          <h2>Selection Sort</h2>
        </div>

        <div className="step-counter">
          Step {Math.min(currentStep, steps.length)} / {steps.length}
        </div>
      </div>

      <div className="visualizer-stage">
        <ArrayVisualizer
          array={array}
          activeIndices={activeIndices}
          minimumIndex={minimumIndex}
          sortedIndices={sortedIndices}
        />
      </div>

    <Visualizercontrols
  onPlay={handlePlay}
  onPause={handlePause}
  onStep={handleStep}
  onReset={handleReset}
  onShuffle={handleShuffle}
  speed={speed}
  onSpeedChange={setSpeed}
/>
<AlgorithmSelector
  algorithm={algorithm}
  onChange={setAlgorithm}
/>
<stepExplanation step={currentStepData} />
<AlgorithmCode step={currentStepData} />
    </section>
  );
}