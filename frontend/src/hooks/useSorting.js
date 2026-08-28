// hooks/useSorting.js
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { bubbleSort } from "../app/algorithms/sorting/bubbleSort";

/**
 * Central hook driving the sorting visualizer.
 * Generates all steps up front, then plays through them on an interval.
 */
export function useSorting(initialArray) {
  const [originalArray] = useState(initialArray);
  const [steps, setSteps] = useState(() => bubbleSort(initialArray));
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500); // ms per step

  const intervalRef = useRef(null);

  const currentStep = steps[currentStepIndex];

  // Derived stats
  const comparisons = steps
    .slice(0, currentStepIndex + 1)
    .filter((s) => s.comparing !== null).length;

  const swaps = steps
    .slice(0, currentStepIndex + 1)
    .filter((s) => s.swapped).length;

  const isFinished = currentStepIndex >= steps.length - 1;

  const play = useCallback(() => {
    if (isFinished) return;
    setIsPlaying(true);
  }, [isFinished]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  }, []);

  const stepForward = useCallback(() => {
    setCurrentStepIndex((idx) => Math.min(idx + 1, steps.length - 1));
  }, [steps.length]);

  const stepBackward = useCallback(() => {
    setCurrentStepIndex((idx) => Math.max(idx - 1, 0));
  }, []);

  const setNewArray = useCallback((newArray) => {
    setIsPlaying(false);
    setSteps(bubbleSort(newArray));
    setCurrentStepIndex(0);
  }, []);

  // Auto-play loop
  useEffect(() => {
    if (!isPlaying) return;

    intervalRef.current = setInterval(() => {
      setCurrentStepIndex((idx) => {
        if (idx >= steps.length - 1) {
          setIsPlaying(false);
          return idx;
        }
        return idx + 1;
      });
    }, speed);

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, speed, steps.length]);

  return {
    array: currentStep.array,
    comparing: currentStep.comparing,
    sortedIndices: currentStep.sortedIndices,
    message: currentStep.message,
    comparisons,
    swaps,
    currentStepIndex,
    totalSteps: steps.length,
    isPlaying,
    isFinished,
    speed,
    setSpeed,
    play,
    pause,
    reset,
    stepForward,
    stepBackward,
    setNewArray,
  };
}