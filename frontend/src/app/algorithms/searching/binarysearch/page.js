"use client";

import { useState, useRef, useEffect } from "react";
import "./bin.css";

const DEFAULT_ARRAY = [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91];

const COMPLEXITY = {
  time: "O(log n)",
  space: "O(1)",
  note: "Each comparison eliminates half the remaining array — that's what makes it logarithmic.",
};

/* ---------- step generator ----------
   frame: {
     low, high, mid: number | null
     found: boolean
     eliminated: [number, number][]   ranges of indices ruled out so far
     note: string
   }
--------------------------------------- */

function genBinarySearch(arr, target) {
  const frames = [];
  let low = 0;
  let high = arr.length - 1;
  const eliminated = [];

  frames.push({
    low,
    high,
    mid: null,
    found: false,
    eliminated: [...eliminated],
    note: `Searching for ${target} in a sorted array of ${arr.length} elements. Start with the full range: low = ${low}, high = ${high}.`,
  });

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    frames.push({
      low,
      high,
      mid,
      found: false,
      eliminated: [...eliminated],
      note: `mid = floor((${low} + ${high}) / 2) = ${mid}. arr[${mid}] = ${arr[mid]}.`,
    });

    if (arr[mid] === target) {
      frames.push({
        low,
        high,
        mid,
        found: true,
        eliminated: [...eliminated],
        note: `arr[${mid}] = ${target}. Found it at index ${mid}.`,
      });
      return frames;
    } else if (arr[mid] < target) {
      eliminated.push([low, mid]);
      frames.push({
        low,
        high,
        mid,
        found: false,
        eliminated: [...eliminated],
        note: `${arr[mid]} < ${target}, so the target must be to the right. Discard indices ${low}–${mid}. New low = ${mid + 1}.`,
      });
      low = mid + 1;
    } else {
      eliminated.push([mid, high]);
      frames.push({
        low,
        high,
        mid,
        found: false,
        eliminated: [...eliminated],
        note: `${arr[mid]} > ${target}, so the target must be to the left. Discard indices ${mid}–${high}. New high = ${mid - 1}.`,
      });
      high = mid - 1;
    }
  }

  frames.push({
    low,
    high,
    mid: null,
    found: false,
    eliminated: [...eliminated],
    note: `low (${low}) has crossed high (${high}) — the search space is empty. ${target} is not in the array.`,
  });
  return frames;
}

/* ---------- box ---------- */

function SearchBox({ index, value, isLow, isHigh, isMid, isEliminated, isFound }) {
  let state = "default";
  if (isFound) state = "found";
  else if (isMid) state = "mid";
  else if (isEliminated) state = "eliminated";
  else if (isLow || isHigh) state = "range";

  return (
    <div className="bs-col">
      <div className="bs-pointer-row">
        {isLow && <span className="bs-tag bs-tag-low">low</span>}
        {isMid && <span className="bs-tag bs-tag-mid">mid</span>}
        {isHigh && <span className="bs-tag bs-tag-high">high</span>}
      </div>
      <div className={`bs-box bs-${state}`}>{value}</div>
      <span className="bs-index">{index}</span>
    </div>
  );
}

/* ---------- main ---------- */

export default function BinarySearchPage() {
  const [array] = useState(DEFAULT_ARRAY);
  const [target, setTarget] = useState(23);
  const [frames, setFrames] = useState(() => genBinarySearch(DEFAULT_ARRAY, 23));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const timerRef = useRef(null);

  const frame = frames[step] ?? frames[frames.length - 1];

  function run() {
    setPlaying(false);
    const next = genBinarySearch(array, Number(target));
    setFrames(next);
    setStep(0);
  }

  useEffect(() => {
    if (!playing) {
      return undefined;
    }

    if (step >= frames.length - 1) {
      const stopTimer = setTimeout(() => setPlaying(false), 0);
      timerRef.current = stopTimer;
      return () => clearTimeout(stopTimer);
    }

    const playTimer = setTimeout(() => setStep((s) => s + 1), speed);
    timerRef.current = playTimer;
    return () => clearTimeout(playTimer);
  }, [playing, step, frames.length, speed]);

  function isIndexEliminated(i) {
    return frame.eliminated.some(([a, b]) => i >= a && i <= b);
  }

  return (
    <div className="bs-page">
      <h1 className="bs-title">Binary Search</h1>
      <p className="bs-subtitle">
        The array must be sorted. Each step checks the middle element and throws away half the
        remaining range — never a linear scan.
      </p>

      <div className="bs-controls">
        <label>
          Search for
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
        </label>
        <button className="bs-run" onClick={run}>
          Run
        </button>
      </div>

      <div className="bs-complexity-inline">
        <span className="bs-complexity-badge">{COMPLEXITY.time}</span>
        <span className="bs-complexity-badge bs-badge-space">{COMPLEXITY.space} space</span>
        <span className="bs-complexity-note">{COMPLEXITY.note}</span>
      </div>

      <div className="bs-playback">
        <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          ← Step
        </button>
        <button onClick={() => setPlaying((p) => !p)} disabled={frames.length <= 1}>
          {playing ? "Pause" : "Play"}
        </button>
        <button
          onClick={() => setStep((s) => Math.min(frames.length - 1, s + 1))}
          disabled={step >= frames.length - 1}
        >
          Step →
        </button>
        <span className="bs-step-count">
          Step {step + 1}/{frames.length}
        </span>
        <div className="bs-speed">
          <span>Speed</span>
          <input
            type="range"
            min={300}
            max={1800}
            step={100}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
          <span>{speed}ms</span>
        </div>
      </div>

      <div className="bs-note">{frame.note}</div>

      <div className="bs-strip">
        {array.map((value, i) => (
          <SearchBox
            key={i}
            index={i}
            value={value}
            isLow={i === frame.low}
            isHigh={i === frame.high}
            isMid={i === frame.mid}
            isEliminated={isIndexEliminated(i)}
            isFound={frame.found && i === frame.mid}
          />
        ))}
      </div>

      <div className="bs-legend">
        <span><i className="bs-dot bs-default" />Untouched</span>
        <span><i className="bs-dot bs-range" />Current range bound</span>
        <span><i className="bs-dot bs-mid" />Mid (comparing)</span>
        <span><i className="bs-dot bs-eliminated" />Eliminated</span>
        <span><i className="bs-dot bs-found" />Found</span>
      </div>
    </div>
  );
}