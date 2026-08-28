"use client";

import { useState, useRef, useEffect } from "react";
import "./twopointer.css";

/* ---------- problems ---------- */

const PROBLEMS = [
  { id: "pair-sum", label: "Pair Sum" },
  { id: "reverse", label: "Reverse Array" },
  { id: "palindrome", label: "Palindrome Check" },
];

const DEFAULTS = {
  "pair-sum": { array: [2, 3, 5, 8, 11, 15], target: 13 },
  reverse: { array: [4, 8, 15, 16, 23, 42], target: null },
  palindrome: { array: [1, 2, 3, 2, 1], target: null },
};

const COMPLEXITY = {
  "pair-sum": {
    time: "O(n)",
    note: "One pass, pointers converge — beats the O(n²) nested-loop approach.",
  },
  reverse: {
    time: "O(n)",
    note: "Each swap fixes two positions at once, so it's n/2 swaps total.",
  },
  palindrome: {
    time: "O(n)",
    note: "Stops as soon as a mismatch is found — no need to check twice.",
  },
};

/* ---------- step generators ----------
   Each frame:
   {
     array, left, right, note,
     matchedPair: [i,j] | null   → green, found the answer
     mismatch: [i,j] | null      → red, values don't work
     swapped: [i,j] | null       → amber, just swapped
   }
------------------------------------------ */

function genPairSum(arr, target) {
  const frames = [];
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) {
      frames.push({
        array: arr,
        left,
        right,
        matchedPair: [left, right],
        mismatch: null,
        swapped: null,
        note: `${arr[left]} + ${arr[right]} = ${target}. Found the pair at indices ${left} and ${right}.`,
      });
      break;
    }
    frames.push({
      array: arr,
      left,
      right,
      matchedPair: null,
      mismatch: null,
      swapped: null,
      note:
        sum < target
          ? `${arr[left]} + ${arr[right]} = ${sum}, too small. Move left pointer right to increase the sum.`
          : `${arr[left]} + ${arr[right]} = ${sum}, too big. Move right pointer left to decrease the sum.`,
    });
    if (sum < target) left++;
    else right--;
  }
  if (left >= right && !frames[frames.length - 1]?.matchedPair) {
    frames.push({
      array: arr,
      left,
      right,
      matchedPair: null,
      mismatch: null,
      swapped: null,
      note: `Pointers crossed. No pair in this array sums to ${target}.`,
    });
  }
  return frames;
}

function genReverse(arr) {
  const frames = [];
  const working = [...arr];
  let left = 0;
  let right = working.length - 1;
  frames.push({
    array: [...working],
    left,
    right,
    matchedPair: null,
    mismatch: null,
    swapped: null,
    note: `Start with left at index ${left} and right at index ${right}.`,
  });
  while (left < right) {
    [working[left], working[right]] = [working[right], working[left]];
    frames.push({
      array: [...working],
      left,
      right,
      matchedPair: null,
      mismatch: null,
      swapped: [left, right],
      note: `Swap indices ${left} and ${right}.`,
    });
    left++;
    right--;
    if (left < right) {
      frames.push({
        array: [...working],
        left,
        right,
        matchedPair: null,
        mismatch: null,
        swapped: null,
        note: `Move both pointers inward — left to ${left}, right to ${right}.`,
      });
    }
  }
  frames.push({
    array: [...working],
    left,
    right,
    matchedPair: working.map((_, i) => i),
    mismatch: null,
    swapped: null,
    note: `Pointers met or crossed. Array is fully reversed.`,
  });
  return frames;
}

function genPalindrome(arr) {
  const frames = [];
  let left = 0;
  let right = arr.length - 1;
  let isPalindrome = true;
  while (left < right) {
    if (arr[left] !== arr[right]) {
      frames.push({
        array: arr,
        left,
        right,
        matchedPair: null,
        mismatch: [left, right],
        swapped: null,
        note: `${arr[left]} ≠ ${arr[right]} at indices ${left} and ${right}. Not a palindrome — stop early.`,
      });
      isPalindrome = false;
      break;
    }
    frames.push({
      array: arr,
      left,
      right,
      matchedPair: [left, right],
      mismatch: null,
      swapped: null,
      note: `${arr[left]} = ${arr[right]} at indices ${left} and ${right}. Move both pointers inward.`,
    });
    left++;
    right--;
  }
  if (isPalindrome) {
    frames.push({
      array: arr,
      left,
      right,
      matchedPair: arr.map((_, i) => i),
      mismatch: null,
      swapped: null,
      note: `Pointers met in the middle without a mismatch. It's a palindrome.`,
    });
  }
  return frames;
}

function generate(problem, array, target) {
  if (problem === "pair-sum") return genPairSum(array, target);
  if (problem === "reverse") return genReverse(array);
  if (problem === "palindrome") return genPalindrome(array);
  return [];
}

/* ---------- box ---------- */

function PointerBox({ index, value, state, isLeft, isRight }) {
  return (
    <div className="tp-col">
      <div className="tp-pointer-row">
        {isLeft && <span className="tp-tag tp-tag-left">L</span>}
        {isRight && <span className="tp-tag tp-tag-right">R</span>}
      </div>
      <div className={`tp-box tp-${state}`}>{value}</div>
      <span className="tp-index">{index}</span>
    </div>
  );
}

/* ---------- main ---------- */

export default function TwoPointerPage() {
  const [problem, setProblem] = useState("pair-sum");
  const [array] = useState(DEFAULTS["pair-sum"].array);
  const [target, setTarget] = useState(DEFAULTS["pair-sum"].target);
  const [frames, setFrames] = useState(() =>
    genPairSum(DEFAULTS["pair-sum"].array, DEFAULTS["pair-sum"].target)
  );
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const timerRef = useRef(null);

  const frame = frames[step] ?? frames[frames.length - 1];

  function switchProblem(id) {
    setProblem(id);
    setPlaying(false);
    const cfg = DEFAULTS[id];
    setTarget(cfg.target);
    const next = generate(id, cfg.array, cfg.target);
    setFrames(next);
    setStep(0);
  }

  function rerun() {
    setPlaying(false);
    const cfg = DEFAULTS[problem];
    const next = generate(problem, cfg.array, target ?? cfg.target);
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

  const complexity = COMPLEXITY[problem];

  return (
    <div className="tp-page">
      <h1 className="tp-title">Two Pointer</h1>
      <p className="tp-subtitle">
        Two markers walk through the array instead of one — often turning an O(n²) nested loop
        into a single O(n) pass.
      </p>

      <div className="tp-op-group">
        {PROBLEMS.map((p) => (
          <button
            key={p.id}
            className={problem === p.id ? "tp-op-active" : ""}
            onClick={() => switchProblem(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="tp-controls">
        {problem === "pair-sum" && (
          <label>
            Target sum
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
            />
          </label>
        )}
        <button className="tp-run" onClick={rerun}>
          Run
        </button>
      </div>

      <div className="tp-complexity-inline">
        <span className="tp-complexity-badge">{complexity.time}</span>
        <span className="tp-complexity-note">{complexity.note}</span>
      </div>

      <div className="tp-playback">
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
        <span className="tp-step-count">
          Step {step + 1}/{frames.length}
        </span>
        <div className="tp-speed">
          <span>Speed</span>
          <input
            type="range"
            min={200}
            max={1500}
            step={100}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
          <span>{speed}ms</span>
        </div>
      </div>

      <div className="tp-note">{frame?.note}</div>

      <div className="tp-strip">
        {frame.array.map((value, i) => {
          let state = "default";
          if (frame.matchedPair?.includes(i)) state = "matched";
          else if (frame.mismatch?.includes(i)) state = "mismatch";
          else if (frame.swapped?.includes(i)) state = "swapped";
          return (
            <PointerBox
              key={i}
              index={i}
              value={value}
              state={state}
              isLeft={i === frame.left}
              isRight={i === frame.right}
            />
          );
        })}
      </div>

      <div className="tp-legend">
        <span><i className="tp-dot tp-default" />Default</span>
        <span><i className="tp-dot tp-matched" />Match / done</span>
        <span><i className="tp-dot tp-mismatch" />Mismatch</span>
        <span><i className="tp-dot tp-swapped" />Just swapped</span>
        <span><i className="tp-tag tp-tag-left" />Left pointer</span>
        <span><i className="tp-tag tp-tag-right" />Right pointer</span>
      </div>
    </div>
  );
}