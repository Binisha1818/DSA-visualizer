"use client";

import { useState, useRef, useEffect } from "react";
import "./lin.css";

const DEFAULT_ARRAY = [14, 3, 27, 9, 41, 8, 19, 33, 6, 22];

const COMPLEXITY = {
  time: "O(n)",
  space: "O(1)",
  note: "No assumption about order — every element might need to be checked, so worst case is the full array.",
};

/* ---------- step generator ----------
   frame: {
     current: number | null
     checked: number[]       indices already ruled out
     found: boolean
     note: string
   }
--------------------------------------- */

function genLinearSearch(arr, target) {
  const frames = [];
  const checked = [];

  frames.push({
    current: null,
    checked: [],
    found: false,
    note: `Searching for ${target}. The array isn't assumed to be sorted, so we start at index 0 and check every element in order.`,
  });

  for (let i = 0; i < arr.length; i++) {
    frames.push({
      current: i,
      checked: [...checked],
      found: false,
      note: `Check index ${i}: is arr[${i}] (${arr[i]}) equal to ${target}?`,
    });

    if (arr[i] === target) {
      frames.push({
        current: i,
        checked: [...checked],
        found: true,
        note: `arr[${i}] = ${target}. Found it at index ${i} — stop scanning.`,
      });
      return frames;
    }

    checked.push(i);
    frames.push({
      current: null,
      checked: [...checked],
      found: false,
      note: `${arr[i]} ≠ ${target}. No shortcut here — move to the next index.`,
    });
  }

  frames.push({
    current: null,
    checked: [...checked],
    found: false,
    note: `Reached the end of the array. ${target} is not present — every element had to be checked.`,
  });
  return frames;
}

/* ---------- box ---------- */

function SearchBox({ index, value, isCurrent, isChecked, isFound }) {
  let state = "default";
  if (isFound) state = "found";
  else if (isCurrent) state = "current";
  else if (isChecked) state = "checked";

  return (
    <div className="ls-col">
      <div className="ls-pointer-row">{isCurrent && <span className="ls-tag">i</span>}</div>
      <div className={`ls-box ls-${state}`}>{value}</div>
      <span className="ls-index">{index}</span>
    </div>
  );
}

/* ---------- main ---------- */

export default function LinearSearchPage() {
  const [array] = useState(DEFAULT_ARRAY);
  const [target, setTarget] = useState(19);
  const [frames, setFrames] = useState(() => genLinearSearch(DEFAULT_ARRAY, 19));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const timerRef = useRef(null);

  const frame = frames[step] ?? frames[frames.length - 1];

  function run() {
    setPlaying(false);
    const next = genLinearSearch(array, Number(target));
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

  return (
    <div className="ls-page">
      <h1 className="ls-title">Linear Search</h1>
      <p className="ls-subtitle">
        Check every element from left to right until a match is found or the array runs out.
        Works on unsorted data — but that&apos;s also why it can&apos;t skip anything.
      </p>

      <div className="ls-controls">
        <label>
          Search for
          <input type="number" value={target} onChange={(e) => setTarget(e.target.value)} />
        </label>
        <button className="ls-run" onClick={run}>
          Run
        </button>
      </div>

      <div className="ls-complexity-inline">
        <span className="ls-complexity-badge">{COMPLEXITY.time}</span>
        <span className="ls-complexity-badge ls-badge-space">{COMPLEXITY.space} space</span>
        <span className="ls-complexity-note">{COMPLEXITY.note}</span>
      </div>

      <div className="ls-playback">
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
        <span className="ls-step-count">
          Step {step + 1}/{frames.length}
        </span>
        <div className="ls-speed">
          <span>Speed</span>
          <input
            type="range"
            min={200}
            max={1200}
            step={100}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
          <span>{speed}ms</span>
        </div>
      </div>

      <div className="ls-note">{frame.note}</div>

      <div className="ls-strip">
        {array.map((value, i) => (
          <SearchBox
            key={i}
            index={i}
            value={value}
            isCurrent={i === frame.current}
            isChecked={frame.checked.includes(i)}
            isFound={frame.found && i === frame.current}
          />
        ))}
      </div>

      <div className="ls-legend">
        <span><i className="ls-dot ls-default" />Not yet checked</span>
        <span><i className="ls-dot ls-current" />Checking now</span>
        <span><i className="ls-dot ls-checked" />Ruled out</span>
        <span><i className="ls-dot ls-found" />Found</span>
      </div>

      <p className="ls-compare-note">
        Compare this against <a href="/algorithms/searching/binary-search">Binary Search</a> —
        same goal, but binary search only works on sorted data and eliminates half the array
        every step instead of checking one element at a time.
      </p>
    </div>
  );
}