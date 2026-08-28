"use client";

import { useSorting } from "../../../hooks/useSorting";
import ArrayBars from "../../../components/ArrayBars";
import ControlPanel from "../../../components/ControlPanel";
import StatsPanel from "../../../components/StatsPanel";
import StepExplanation from "../../../components/stepExplanation";
export default function SortingPage() {
  const {
    array,
    comparing,
    sortedIndices,
    message,
    comparisons,
    swaps,
    currentStepIndex,
    totalSteps,
    isPlaying,
    isFinished,
    play,
    pause,
    reset,
    stepForward,
    stepBackward,
    speed,
    setSpeed,
  } = useSorting([50, 120, 80, 200, 150, 60, 180]);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Bubble Sort Visualizer</h1>

      <ControlPanel
        isPlaying={isPlaying}
        isFinished={isFinished}
        play={play}
        pause={pause}
        reset={reset}
        stepForward={stepForward}
        stepBackward={stepBackward}
        speed={speed}
        setSpeed={setSpeed}
      />

      <StatsPanel
        comparisons={comparisons}
        swaps={swaps}
        currentStepIndex={currentStepIndex}
        totalSteps={totalSteps}
      />

      <StepExplanation
  message={message}
  comparing={comparing}
  array={array}
  currentStepIndex={currentStepIndex}
  totalSteps={totalSteps}
/>

      <ArrayBars array={array} comparing={comparing} sortedIndices={sortedIndices} />
    </main>
  );
}