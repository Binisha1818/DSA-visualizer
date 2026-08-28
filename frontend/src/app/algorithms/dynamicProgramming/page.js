"use client";

import { useState, useRef, useEffect } from "react";
import "./dynamic.css";

const PROBLEMS = [
  { id: "fibonacci", label: "Fibonacci" },
  { id: "lcs", label: "Longest Common Subsequence" },
];

const COMPLEXITY = {
  fibonacci: {
    time: "O(n)",
    space: "O(n)",
    note: "Each value is computed once and reused — no repeated recursive calls.",
  },
  lcs: {
    time: "O(m × n)",
    space: "O(m × n)",
    note: "One cell per pair of prefixes. Every cell depends only on cells already computed.",
  },
};

/* ---------- Fibonacci step generator ----------
   frame: { table: (number|null)[], current: number|null, deps: number[], note }
------------------------------------------------- */

function genFibonacci(n) {
  const frames = [];
  const table = new Array(n + 1).fill(null);
  table[0] = 0;
  frames.push({
    table: [...table],
    current: 0,
    deps: [],
    note: `Base case: dp[0] = 0.`,
  });
  if (n >= 1) {
    table[1] = 1;
    frames.push({
      table: [...table],
      current: 1,
      deps: [],
      note: `Base case: dp[1] = 1.`,
    });
  }
  for (let i = 2; i <= n; i++) {
    frames.push({
      table: [...table],
      current: i,
      deps: [i - 1, i - 2],
      note: `dp[${i}] depends on dp[${i - 1}] and dp[${i - 2}] — both already computed.`,
    });
    table[i] = table[i - 1] + table[i - 2];
    frames.push({
      table: [...table],
      current: i,
      deps: [i - 1, i - 2],
      note: `dp[${i}] = dp[${i - 1}] (${table[i - 1]}) + dp[${i - 2}] (${table[i - 2]}) = ${table[i]}.`,
    });
  }
  frames.push({
    table: [...table],
    current: null,
    deps: [],
    note: `Done. dp[${n}] = ${table[n]}. Every value was computed exactly once.`,
  });
  return frames;
}

/* ---------- LCS step generator ----------
   frame: {
     grid: number[][]        (rows = s1.length+1, cols = s2.length+1)
     current: [r,c] | null
     deps: [r,c][]            cells the current cell reads from
     phase: "filling" | "backtrace" | "done"
     path: [r,c][]            backtrace path so far
     note
   }
--------------------------------------------------- */

function genLCS(s1, s2) {
  const frames = [];
  const rows = s1.length + 1;
  const cols = s2.length + 1;
  const grid = Array.from({ length: rows }, () => new Array(cols).fill(0));

  frames.push({
    grid: grid.map((r) => [...r]),
    current: null,
    deps: [],
    phase: "filling",
    path: [],
    note: `Row 0 and column 0 are the empty-string base case — always 0.`,
  });

  for (let r = 1; r < rows; r++) {
    for (let c = 1; c < cols; c++) {
      const match = s1[r - 1] === s2[c - 1];
      if (match) {
        frames.push({
          grid: grid.map((row) => [...row]),
          current: [r, c],
          deps: [[r - 1, c - 1]],
          phase: "filling",
          path: [],
          note: `'${s1[r - 1]}' matches '${s2[c - 1]}'. Take the diagonal cell (${r - 1},${c - 1}) and add 1.`,
        });
        grid[r][c] = grid[r - 1][c - 1] + 1;
      } else {
        frames.push({
          grid: grid.map((row) => [...row]),
          current: [r, c],
          deps: [
            [r - 1, c],
            [r, c - 1],
          ],
          phase: "filling",
          path: [],
          note: `'${s1[r - 1]}' ≠ '${s2[c - 1]}'. Take the larger of the cell above (${r - 1},${c}) and the cell to the left (${r},${c - 1}).`,
        });
        grid[r][c] = Math.max(grid[r - 1][c], grid[r][c - 1]);
      }
      frames.push({
        grid: grid.map((row) => [...row]),
        current: [r, c],
        deps: match ? [[r - 1, c - 1]] : [[r - 1, c], [r, c - 1]],
        phase: "filling",
        path: [],
        note: `dp[${r}][${c}] = ${grid[r][c]}.`,
      });
    }
  }

  // backtrace
  let r = rows - 1;
  let c = cols - 1;
  const path = [];
  frames.push({
    grid: grid.map((row) => [...row]),
    current: [r, c],
    deps: [],
    phase: "backtrace",
    path: [],
    note: `Table filled. LCS length is ${grid[r][c]}. Now trace back from the bottom-right corner to read the actual sequence.`,
  });
  while (r > 0 && c > 0) {
    if (s1[r - 1] === s2[c - 1]) {
      path.unshift([r, c]);
      r--;
      c--;
    } else if (grid[r - 1][c] >= grid[r][c - 1]) {
      r--;
    } else {
      c--;
    }
    frames.push({
      grid: grid.map((row) => [...row]),
      current: [r, c],
      deps: [],
      phase: "backtrace",
      path: [...path],
      note:
        path.length > 0 && path[0][0] === r + 1
          ? `Diagonal move — this cell is part of the LCS.`
          : `Move to the cell that produced this value.`,
    });
  }

  const lcsChars = path.map(([rr, cc]) => s1[rr - 1]).join("");
  frames.push({
    grid: grid.map((row) => [...row]),
    current: null,
    deps: [],
    phase: "done",
    path,
    note: `Backtrace complete. Longest common subsequence: "${lcsChars}" (length ${lcsChars.length}).`,
  });

  return frames;
}

/* ---------- components ---------- */

function FibTable({ frame, n }) {
  return (
    <div className="dp-fib-row">
      {frame.table.map((v, i) => {
        let state = "default";
        if (frame.current === i) state = "current";
        else if (frame.deps.includes(i)) state = "dep";
        else if (v !== null) state = "filled";
        return (
          <div className="dp-fib-col" key={i}>
            <span className="dp-fib-index">dp[{i}]</span>
            <div className={`dp-fib-box dp-${state}`}>{v === null ? "" : v}</div>
          </div>
        );
      })}
    </div>
  );
}

function LcsGrid({ frame, s1, s2 }) {
  const rows = s1.length + 1;
  const cols = s2.length + 1;
  const isDep = (r, c) => frame.deps.some(([dr, dc]) => dr === r && dc === c);
  const isCurrent = (r, c) => frame.current && frame.current[0] === r && frame.current[1] === c;
  const isPath = (r, c) => frame.path.some(([pr, pc]) => pr === r && pc === c);

  return (
    <div className="dp-lcs-wrap">
      <table className="dp-lcs-table">
        <thead>
          <tr>
            <th></th>
            <th></th>
            {s2.split("").map((ch, i) => (
              <th key={i}>{ch}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              <th>{r === 0 ? "" : s1[r - 1]}</th>
              {Array.from({ length: cols }).map((__, c) => {
                let cls = "dp-cell";
                if (isPath(r, c)) cls += " dp-cell-path";
                else if (isCurrent(r, c)) cls += " dp-cell-current";
                else if (isDep(r, c)) cls += " dp-cell-dep";
                return (
                  <td key={c} className={cls}>
                    {frame.grid[r][c]}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- main ---------- */

export default function DynamicProgrammingPage() {
  const [problem, setProblem] = useState("fibonacci");
  const [n] = useState(8);
  const [s1] = useState("ABCBDAB");
  const [s2] = useState("BDCAB");

  const [frames, setFrames] = useState(() => genFibonacci(8));
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(600);
  const timerRef = useRef(null);

  const frame = frames[step] ?? frames[frames.length - 1];

  function switchProblem(id) {
    setProblem(id);
    setPlaying(false);
    setFrames(id === "fibonacci" ? genFibonacci(n) : genLCS(s1, s2));
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
    <div className="dp-page">
      <h1 className="dp-title">Dynamic Programming</h1>
      <p className="dp-subtitle">
        Break a problem into overlapping subproblems, solve each one once, and reuse the answer
        instead of recomputing it.
      </p>

      <div className="dp-op-group">
        {PROBLEMS.map((p) => (
          <button
            key={p.id}
            className={problem === p.id ? "dp-op-active" : ""}
            onClick={() => switchProblem(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {problem === "fibonacci" && (
        <p className="dp-context">Computing fib({n}) bottom-up.</p>
      )}
      {problem === "lcs" && (
        <p className="dp-context">
          Comparing <code>{s1}</code> and <code>{s2}</code>.
        </p>
      )}

      <div className="dp-complexity-inline">
        <span className="dp-complexity-badge">{complexity.time}</span>
        <span className="dp-complexity-badge dp-badge-space">{complexity.space} space</span>
        <span className="dp-complexity-note">{complexity.note}</span>
      </div>

      <div className="dp-playback">
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
        <span className="dp-step-count">
          Step {step + 1}/{frames.length}
        </span>
        <div className="dp-speed">
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

      <div className="dp-note">{frame.note}</div>

      {problem === "fibonacci" ? (
        <FibTable frame={frame} n={n} />
      ) : (
        <LcsGrid frame={frame} s1={s1} s2={s2} />
      )}

      <div className="dp-legend">
        {problem === "fibonacci" ? (
          <>
            <span><i className="dp-dot dp-default" />Not yet computed</span>
            <span><i className="dp-dot dp-dep" />Dependency</span>
            <span><i className="dp-dot dp-current" />Current</span>
            <span><i className="dp-dot dp-filled" />Filled</span>
          </>
        ) : (
          <>
            <span><i className="dp-dot dp-dep" />Dependency</span>
            <span><i className="dp-dot dp-current" />Current</span>
            <span><i className="dp-dot dp-path" />LCS backtrace path</span>
          </>
        )}
      </div>
    </div>
  );
}