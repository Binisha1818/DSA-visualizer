"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import "./array.css";

/* ---------- config ---------- */

const ELEMENT_SIZE = 4; // bytes, just for the address-math display
const BASE_ADDRESS = 1000;

const OPS = [
  { id: "access", label: "Access" },
  { id: "search", label: "Search" },
  { id: "insert", label: "Insert" },
  { id: "delete", label: "Delete" },
  { id: "update", label: "Update" },
];

const COMPLEXITY = {
  access: { time: "O(1)", note: "Direct address math — no scanning." },
  search: { time: "O(n)", note: "Worst case checks every element." },
  insert: { time: "O(n)", note: "Everything after the index shifts right." },
  delete: { time: "O(n)", note: "Everything after the index shifts left." },
  update: { time: "O(1)", note: "Same address math as access." },
};

/* ---------- step generators ----------
   Each generator returns an array of "frames". A frame is:
   {
     array: number[]            snapshot of the array at this frame
     highlight: number[]        indices to mark as "active" (blue)
     shifting: number[]         indices to mark as "shifting" (amber)
     modified: number[]         indices to mark as "just written" (green)
     note: string                explanation shown in the step panel
     addressOf: number | null   index whose address math is shown
   }
------------------------------------- */

function genAccess(arr, index) {
  return [
    {
      array: arr,
      highlight: [index],
      shifting: [],
      modified: [],
      addressOf: index,
      note: `Jump straight to index ${index}. address = base + (${index} × ${ELEMENT_SIZE}) = ${
        BASE_ADDRESS + index * ELEMENT_SIZE
      }. No scanning needed.`,
    },
  ];
}

function genSearch(arr, target) {
  const frames = [];
  for (let i = 0; i < arr.length; i++) {
    const found = arr[i] === target;
    frames.push({
      array: arr,
      highlight: [i],
      shifting: [],
      modified: found ? [i] : [],
      addressOf: i,
      note: found
        ? `Found ${target} at index ${i}. Stopped scanning.`
        : `Checking index ${i} (value ${arr[i]}) against ${target} — no match, move on.`,
    });
    if (found) break;
  }
  if (frames.length === arr.length && !frames[frames.length - 1].modified.length) {
    frames.push({
      array: arr,
      highlight: [],
      shifting: [],
      modified: [],
      addressOf: null,
      note: `${target} is not in the array. Every element was checked — worst case O(n).`,
    });
  }
  return frames;
}

function genInsert(arr, index, value) {
  const frames = [];
  const working = [...arr];
  frames.push({
    array: [...working],
    highlight: [index],
    shifting: [],
    modified: [],
    addressOf: index,
    note: `Insert ${value} at index ${index}. Everything from index ${index} onward must shift right first.`,
  });
  for (let i = working.length - 1; i >= index; i--) {
    working[i + 1] = working[i];
    frames.push({
      array: [...working],
      highlight: [],
      shifting: [i + 1],
      modified: [],
      addressOf: i + 1,
      note: `Shift value from index ${i} to index ${i + 1}.`,
    });
  }
  working[index] = value;
  frames.push({
    array: [...working],
    highlight: [],
    shifting: [],
    modified: [index],
    addressOf: index,
    note: `Slot at index ${index} is free — write ${value}. Insert complete.`,
  });
  return frames;
}

function genDelete(arr, index) {
  const frames = [];
  const working = [...arr];
  frames.push({
    array: [...working],
    highlight: [index],
    shifting: [],
    modified: [],
    addressOf: index,
    note: `Remove the value at index ${index}. Everything after it shifts left to close the gap.`,
  });
  for (let i = index; i < working.length - 1; i++) {
    working[i] = working[i + 1];
    frames.push({
      array: [...working],
      highlight: [],
      shifting: [i],
      modified: [],
      addressOf: i,
      note: `Shift value from index ${i + 1} to index ${i}.`,
    });
  }
  working.pop();
  frames.push({
    array: [...working],
    highlight: [],
    shifting: [],
    modified: [],
    addressOf: null,
    note: `Last slot dropped. Delete complete — array length is now ${working.length}.`,
  });
  return frames;
}

function genUpdate(arr, index, value) {
  const working = [...arr];
  const before = working[index];
  working[index] = value;
  return [
    {
      array: [...arr],
      highlight: [index],
      shifting: [],
      modified: [],
      addressOf: index,
      note: `Jump to index ${index} directly — no scan needed.`,
    },
    {
      array: working,
      highlight: [],
      shifting: [],
      modified: [index],
      addressOf: index,
      note: `Overwrite ${before} with ${value}. Update complete.`,
    },
  ];
}

/* ---------- resize (dynamic array) demo ---------- */

function genResize(arr) {
  const newCapacity = arr.length * 2;
  const frames = [];
  frames.push({
    array: arr,
    highlight: [],
    shifting: [],
    modified: [],
    addressOf: null,
    note: `Array is full (length ${arr.length} = capacity ${arr.length}). The next push must resize.`,
    resizePhase: "full",
    oldCapacity: arr.length,
    newCapacity,
  });
  frames.push({
    array: arr,
    highlight: [],
    shifting: [],
    modified: [],
    addressOf: null,
    note: `Allocate a new block, capacity ${newCapacity}, at a new base address. Old block stays put for now.`,
    resizePhase: "allocated",
    oldCapacity: arr.length,
    newCapacity,
  });
  for (let i = 0; i < arr.length; i++) {
    frames.push({
      array: arr,
      highlight: [],
      shifting: [i],
      modified: [],
      addressOf: null,
      note: `Copy index ${i} (value ${arr[i]}) into the new block.`,
      resizePhase: "copying",
      copiedCount: i + 1,
      oldCapacity: arr.length,
      newCapacity,
    });
  }
  frames.push({
    array: arr,
    highlight: [],
    shifting: [],
    modified: arr.map((_, i) => i),
    addressOf: null,
    note: `Copy done. Old block is freed. This resize cost O(n) once — but amortized over all the appends since the last resize, append is still O(1) on average.`,
    resizePhase: "done",
    copiedCount: arr.length,
    oldCapacity: arr.length,
    newCapacity,
  });
  return frames;
}

/* ---------- box component ---------- */

function ArrayBox({ index, value, state, address }) {
  return (
    <div className="ab-col">
      <span className="ab-index">{index}</span>
      <div className={`ab-box ab-${state}`}>{value}</div>
      <span className="ab-address">{address}</span>
    </div>
  );
}

/* ---------- main component ---------- */

export default function ArrayVisualizerPage() {
  const [baseArray, setBaseArray] = useState([5, 2, 9, 1, 7]);
  const [op, setOp] = useState("access");
  const [indexInput, setIndexInput] = useState(2);
  const [valueInput, setValueInput] = useState(9);
  const [frames, setFrames] = useState(() => genAccess([5, 2, 9, 1, 7], 2));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);
  const [dynamicMode, setDynamicMode] = useState(false);
  const timerRef = useRef(null);

  const frame = frames[step] ?? frames[frames.length - 1];

  function runOp() {
    setPlaying(false);
    let next;
    const idx = Math.max(0, Math.min(baseArray.length - 1, Number(indexInput)));
    switch (op) {
      case "access":
        next = genAccess(baseArray, idx);
        break;
      case "search":
        next = genSearch(baseArray, Number(valueInput));
        break;
      case "insert":
        next = genInsert(baseArray, Math.max(0, Math.min(baseArray.length, Number(indexInput))), Number(valueInput));
        break;
      case "delete":
        next = genDelete(baseArray, idx);
        break;
      case "update":
        next = genUpdate(baseArray, idx, Number(valueInput));
        break;
      default:
        next = [];
    }
    setFrames(next);
    setStep(0);
    // commit the final array state as the new base array so operations chain
    const finalArray = next[next.length - 1]?.array ?? baseArray;
    setBaseArray(finalArray);
  }

  function runResize() {
    setPlaying(false);
    const next = genResize(baseArray);
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

  const complexity = COMPLEXITY[op];

  return (
    <div className="av-page">
      <h1 className="av-title">Array</h1>
      <p className="av-subtitle">
        See what an array actually is — a contiguous block of memory — and why each operation
        costs what it costs.
      </p>

      <div className="av-mode-toggle">
        <button
          className={!dynamicMode ? "av-mode-active" : ""}
          onClick={() => setDynamicMode(false)}
        >
          Static array
        </button>
        <button
          className={dynamicMode ? "av-mode-active" : ""}
          onClick={() => setDynamicMode(true)}
        >
          Dynamic array (resize)
        </button>
      </div>

      {!dynamicMode ? (
        <>
          <div className="av-controls">
            <div className="av-op-group">
              {OPS.map((o) => (
                <button
                  key={o.id}
                  className={op === o.id ? "av-op-active" : ""}
                  onClick={() => setOp(o.id)}
                >
                  {o.label}
                </button>
              ))}
            </div>

            <div className="av-inputs">
              {op !== "search" && (
                <label>
                  Index
                  <input
                    type="number"
                    min={0}
                    max={op === "insert" ? baseArray.length : baseArray.length - 1}
                    value={indexInput}
                    onChange={(e) => setIndexInput(e.target.value)}
                  />
                </label>
              )}
              {op !== "access" && op !== "delete" && (
                <label>
                  Value
                  <input
                    type="number"
                    value={valueInput}
                    onChange={(e) => setValueInput(e.target.value)}
                  />
                </label>
              )}
              <button className="av-run" onClick={runOp}>
                Run {OPS.find((o) => o.id === op).label}
              </button>
            </div>
          </div>

          <div className="av-complexity-inline">
            <span className="av-complexity-badge">{complexity.time}</span>
            <span className="av-complexity-note">{complexity.note}</span>
          </div>
        </>
      ) : (
        <div className="av-controls">
          <p className="av-resize-copy">
            Length {baseArray.length} / capacity {baseArray.length}. Trigger a resize to see what
            happens when a dynamic array (JS array, Python list, Java ArrayList) runs out of room.
          </p>
          <button className="av-run" onClick={runResize}>
            Push one more element (trigger resize)
          </button>
        </div>
      )}

      <div className="av-playback">
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
        <span className="av-step-count">
          Step {step + 1}/{frames.length}
        </span>
        <div className="av-speed">
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

      <div className="av-note">{frame?.note}</div>

      <div className="av-strip">
        {frame.array.map((value, i) => {
          let state = "default";
          if (frame.modified?.includes(i)) state = "modified";
          else if (frame.shifting?.includes(i)) state = "shifting";
          else if (frame.highlight?.includes(i)) state = "active";
          return (
            <ArrayBox
              key={i}
              index={i}
              value={value}
              state={state}
              address={BASE_ADDRESS + i * ELEMENT_SIZE}
            />
          );
        })}
      </div>

      {frame.addressOf !== null && frame.addressOf !== undefined && (
        <div className="av-address-math">
          address = base ({BASE_ADDRESS}) + index ({frame.addressOf}) × size ({ELEMENT_SIZE}) ={" "}
          <strong>{BASE_ADDRESS + frame.addressOf * ELEMENT_SIZE}</strong>
        </div>
      )}

      {dynamicMode && frame.resizePhase && (
        <div className="av-resize-status">
          <span>Old capacity: {frame.oldCapacity}</span>
          <span>New capacity: {frame.newCapacity}</span>
          {frame.resizePhase === "copying" && (
            <span>Copied: {frame.copiedCount}/{frame.oldCapacity}</span>
          )}
        </div>
      )}

      <div className="av-legend">
        <span><i className="ab-dot ab-default" />Default</span>
        <span><i className="ab-dot ab-active" />Accessing</span>
        <span><i className="ab-dot ab-shifting" />Shifting</span>
        <span><i className="ab-dot ab-modified" />Just written</span>
      </div>

      <div className="av-stats-grid">
        {Object.entries(COMPLEXITY).map(([key, val]) => (
          <div className="av-stat-card" key={key}>
            <span className="av-stat-label">{key}</span>
            <span className="av-stat-value">{val.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}