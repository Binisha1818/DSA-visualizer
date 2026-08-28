"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import "./intervalMerging.css";

const DEFAULT_INTERVALS = [
  [1, 3],
  [8, 10],
  [2, 6],
  [15, 18],
  [9, 12],
];

const COMPLEXITY = {
  time: "O(n log n)",
  note: "Sorting dominates the cost — the merge pass itself is a single O(n) walk.",
};

/* ---------- step generator ----------
   Each frame:
   {
     phase: "sorting" | "merging" | "done"
     intervals: [start,end][]        the working list at this point (sorted for merge phases)
     result: [start,end][]           merged intervals so far
     currentIndex: number | null     index in `intervals` being considered
     overlapsWith: number | null     index in `result` it's overlapping/merging into
     note: string
   }
---------------------------------------- */

function generateSteps(raw) {
  const frames = [];

  frames.push({
    phase: "sorting",
    intervals: [...raw],
    result: [],
    currentIndex: null,
    overlapsWith: null,
    note: `Start with ${raw.length} unsorted intervals. Sorting by start value first is what makes a single pass enough.`,
  });

  const sorted = [...raw].sort((a, b) => a[0] - b[0]);
  frames.push({
    phase: "sorting",
    intervals: sorted,
    result: [],
    currentIndex: null,
    overlapsWith: null,
    note: `Sorted by start value: ${sorted.map((iv) => `[${iv[0]},${iv[1]}]`).join(", ")}.`,
  });

  const result = [];
  for (let i = 0; i < sorted.length; i++) {
    const [start, end] = sorted[i];
    if (result.length === 0) {
      result.push([start, end]);
      frames.push({
        phase: "merging",
        intervals: sorted,
        result: [...result],
        currentIndex: i,
        overlapsWith: result.length - 1,
        note: `First interval [${start},${end}] — nothing to compare yet, add it to the result.`,
      });
      continue;
    }
    const last = result[result.length - 1];
    if (start <= last[1]) {
      const newEnd = Math.max(last[1], end);
      frames.push({
        phase: "merging",
        intervals: sorted,
        result: [...result],
        currentIndex: i,
        overlapsWith: result.length - 1,
        note: `[${start},${end}] starts at ${start}, which is ≤ ${last[1]} (end of last merged interval) — they overlap. Extend end to max(${last[1]}, ${end}) = ${newEnd}.`,
      });
      last[1] = newEnd;
      frames.push({
        phase: "merging",
        intervals: sorted,
        result: [...result],
        currentIndex: i,
        overlapsWith: result.length - 1,
        note: `Merged into [${last[0]},${last[1]}].`,
      });
    } else {
      frames.push({
        phase: "merging",
        intervals: sorted,
        result: [...result],
        currentIndex: i,
        overlapsWith: null,
        note: `[${start},${end}] starts at ${start}, which is after ${last[1]} (end of last merged interval) — no overlap. Start a new interval.`,
      });
      result.push([start, end]);
      frames.push({
        phase: "merging",
        intervals: sorted,
        result: [...result],
        currentIndex: i,
        overlapsWith: result.length - 1,
        note: `Added [${start},${end}] as a new separate interval.`,
      });
    }
  }

  frames.push({
    phase: "done",
    intervals: sorted,
    result: [...result],
    currentIndex: null,
    overlapsWith: null,
    note: `Done. ${sorted.length} intervals merged down to ${result.length}: ${result
      .map((iv) => `[${iv[0]},${iv[1]}]`)
      .join(", ")}.`,
  });

  return frames;
}

/* ---------- number line bars ---------- */

function IntervalTrack({ title, intervals, min, max, activeIndex, dimIndex, colorClass }) {
  const span = max - min || 1;
  return (
    <div className="im-track-block">
      <span className="im-track-title">{title}</span>
      <div className="im-track">
        <div className="im-track-line" />
        {intervals.map(([s, e], i) => {
          const left = ((s - min) / span) * 100;
          const width = ((e - s) / span) * 100;
          const isActive = i === activeIndex;
          const isDim = dimIndex != null && i !== dimIndex && dimIndex !== "all" ? false : false;
          return (
            <div
              key={i}
              className={`im-bar ${colorClass} ${isActive ? "im-bar-active" : ""}`}
              style={{ left: `${left}%`, width: `${Math.max(width, 3)}%` }}
            >
              <span className="im-bar-label">
                {s},{e}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- main ---------- */

export default function IntervalMergePage() {
  const [raw] = useState(DEFAULT_INTERVALS);
  const [frames, setFrames] = useState(() => generateSteps(DEFAULT_INTERVALS));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const timerRef = useRef(null);

  const frame = frames[step] ?? frames[frames.length - 1];

  const { min, max } = useMemo(() => {
    const allVals = raw.flatMap((iv) => iv);
    return { min: Math.min(...allVals), max: Math.max(...allVals) };
  }, [raw]);

  function reset() {
    setPlaying(false);
    setFrames(generateSteps(raw));
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

  return (
    <div className="im-page">
      <h1 className="im-title">Interval Merging</h1>
      <p className="im-subtitle">
        Sort by start value, then walk through once — overlapping intervals fold into one.
      </p>

      <div className="im-complexity-inline">
        <span className="im-complexity-badge">{COMPLEXITY.time}</span>
        <span className="im-complexity-note">{COMPLEXITY.note}</span>
      </div>

      <div className="im-playback">
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
        <button onClick={reset} className="im-reset">
          Reset
        </button>
        <span className="im-step-count">
          Step {step + 1}/{frames.length}
        </span>
        <div className="im-speed">
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

      <div className="im-note">{frame.note}</div>

      <IntervalTrack
        title={frame.phase === "sorting" ? "Intervals" : "Sorted intervals"}
        intervals={frame.intervals}
        min={min}
        max={max}
        activeIndex={frame.currentIndex}
        colorClass="im-bar-source"
      />

      <IntervalTrack
        title="Merged result"
        intervals={frame.result}
        min={min}
        max={max}
        activeIndex={frame.overlapsWith}
        colorClass="im-bar-result"
      />

      <div className="im-legend">
        <span><i className="im-dot im-dot-source" />Source interval</span>
        <span><i className="im-dot im-dot-source-active" />Current interval</span>
        <span><i className="im-dot im-dot-result" />Merged result</span>
        <span><i className="im-dot im-dot-result-active" />Actively merging</span>
      </div>
    </div>
  );
}