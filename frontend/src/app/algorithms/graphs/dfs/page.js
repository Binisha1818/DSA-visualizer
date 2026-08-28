"use client";

import { useEffect, useMemo, useState } from "react";
import "./Dfs.css";

const GRAPH = {
  A: ["B", "C"],
  B: ["A", "D", "E"],
  C: ["A", "F"],
  D: ["B"],
  E: ["B", "F"],
  F: ["C", "E"],
};

const NODES = [
  { id: "A", x: 120, y: 180 },
  { id: "B", x: 330, y: 100 },
  { id: "C", x: 330, y: 260 },
  { id: "D", x: 550, y: 60 },
  { id: "E", x: 550, y: 180 },
  { id: "F", x: 550, y: 320 },
];

const EDGES = [
  ["A", "B"],
  ["A", "C"],
  ["B", "D"],
  ["B", "E"],
  ["C", "F"],
  ["E", "F"],
];

const PSEUDOCODE = [
  "stack ← [start]",
  "visited ← ∅",
  "while stack is not empty:",
  "    node ← stack.pop()",
  "    if node is not visited:",
  "        visited.add(node)",
  "        visit node",
  "        for each neighbor of node:",
  "            if neighbor is not visited:",
  "                stack.push(neighbor)",
];

function createSteps() {
  const steps = [];

  const visited = new Set();
  const stack = ["A"];

  steps.push({
    stack: [...stack],
    visited: [],
    current: null,
    comparing: null,
    traversal: [],
    line: 0,
    message: "Initialize the stack with starting node A.",
  });

  steps.push({
    stack: [...stack],
    visited: [],
    current: null,
    comparing: null,
    traversal: [],
    line: 1,
    message: "Create an empty visited set.",
  });

  while (stack.length > 0) {
    const node = stack.pop();

    steps.push({
      stack: [...stack],
      visited: [...visited],
      current: node,
      comparing: null,
      traversal: [...visited],
      line: 3,
      message: `Pop ${node} from the top of the stack.`,
    });

    if (visited.has(node)) {
      steps.push({
        stack: [...stack],
        visited: [...visited],
        current: node,
        comparing: null,
        traversal: [...visited],
        line: 4,
        message: `${node} has already been visited. Skip it.`,
      });

      continue;
    }

    visited.add(node);

    steps.push({
      stack: [...stack],
      visited: [...visited],
      current: node,
      comparing: null,
      traversal: [...visited],
      line: 5,
      message: `Mark ${node} as visited.`,
    });

    steps.push({
      stack: [...stack],
      visited: [...visited],
      current: node,
      comparing: null,
      traversal: [...visited],
      line: 6,
      message: `Visit ${node}. Add it to the traversal order.`,
    });

    /*
      Reverse the neighbors before pushing them so that
      the left-to-right graph order remains intuitive.
    */
    const neighbors = [...GRAPH[node]].reverse();

    for (const neighbor of neighbors) {
      steps.push({
        stack: [...stack],
        visited: [...visited],
        current: node,
        comparing: neighbor,
        traversal: [...visited],
        line: 7,
        message: `Check neighbor ${neighbor} of ${node}.`,
      });

      if (!visited.has(neighbor)) {
        stack.push(neighbor);

        steps.push({
          stack: [...stack],
          visited: [...visited],
          current: node,
          comparing: neighbor,
          traversal: [...visited],
          line: 8,
          message: `${neighbor} has not been visited. Push it onto the stack.`,
        });
      } else {
        steps.push({
          stack: [...stack],
          visited: [...visited],
          current: node,
          comparing: neighbor,
          traversal: [...visited],
          line: 8,
          message: `${neighbor} is already visited. Do not push it.`,
        });
      }
    }
  }

  steps.push({
    stack: [],
    visited: [...visited],
    current: null,
    comparing: null,
    traversal: [...visited],
    line: null,
    message: "DFS traversal completed!",
  });

  return steps;
}

export default function DFSPage() {
  const steps = useMemo(() => createSteps(), []);

  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);

  const current = steps[step];

  const progress =
    steps.length > 1
      ? Math.round((step / (steps.length - 1)) * 100)
      : 0;

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

  const getNodeClass = (nodeId) => {
    if (current.current === nodeId) {
      return "dfs-node current";
    }

    if (current.comparing === nodeId) {
      return "dfs-node comparing";
    }

    if (current.visited.includes(nodeId)) {
      return "dfs-node visited";
    }

    if (current.stack.includes(nodeId)) {
      return "dfs-node stacked";
    }

    return "dfs-node";
  };

  return (
    <main className="dfs-page">
      {/* HEADER */}

      <header className="dfs-header">
        <div>
          <p className="dfs-eyebrow">GRAPH TRAVERSAL</p>

          <h1>Depth-First Search</h1>

          <p className="dfs-description">
            Explore a graph by going as deep as possible before
            backtracking.
          </p>
        </div>
      </header>

      {/* CONTROLS */}

      <section className="dfs-controls">
        <div className="dfs-buttons">
          <button
            className="dfs-button"
            onClick={previousStep}
            disabled={step === 0}
          >
            ← Step
          </button>

          <button
            className="dfs-button dfs-primary"
            onClick={togglePlay}
          >
            {playing ? "Pause" : "Play"}
          </button>

          <button
            className="dfs-button"
            onClick={nextStep}
            disabled={step >= steps.length - 1}
          >
            Step →
          </button>

          <button
            className="dfs-button dfs-danger"
            onClick={reset}
          >
            Reset
          </button>
        </div>

        <div className="dfs-speed">
          <span>Speed</span>

          <input
            type="range"
            min="200"
            max="1500"
            step="100"
            value={speed}
            onChange={(event) =>
              setSpeed(Number(event.target.value))
            }
          />

          <span>{speed}ms</span>
        </div>
      </section>

      {/* STATS */}

      <section className="dfs-stats">
        <div className="dfs-stat">
          <span>Visited</span>
          <strong>{current.visited.length}</strong>
        </div>

        <div className="dfs-stat">
          <span>Stack</span>
          <strong>{current.stack.length}</strong>
        </div>

        <div className="dfs-stat">
          <span>Step</span>
          <strong>
            {step + 1}/{steps.length}
          </strong>
        </div>

        <div className="dfs-progress-wrapper">
          <span>Progress</span>

          <div className="dfs-progress">
            <div
              className="dfs-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <strong>{progress}%</strong>
        </div>
      </section>

      {/* STEP MESSAGE */}

      <section className="dfs-step-panel">
        <div className="dfs-step-number">
          STEP {step + 1} OF {steps.length}
        </div>

        <div className="dfs-step-message">
          {current.message}
        </div>
      </section>

      {/* MAIN CONTENT */}

      <section className="dfs-content-grid">
        {/* GRAPH */}

        <div className="dfs-card dfs-graph-card">
          <div className="dfs-card-header">
            <div>
              <h2>Graph</h2>

              <span>Starting node: A</span>
            </div>
          </div>

          <div className="dfs-graph">
            <svg
              className="dfs-edges"
              viewBox="0 0 680 390"
              preserveAspectRatio="none"
            >
              {EDGES.map(([from, to]) => {
                const fromNode = NODES.find(
                  (node) => node.id === from
                );

                const toNode = NODES.find(
                  (node) => node.id === to
                );

                return (
                  <line
                    key={`${from}-${to}`}
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    className="dfs-edge"
                  />
                );
              })}
            </svg>

            {NODES.map((node) => (
              <div
                key={node.id}
                className={getNodeClass(node.id)}
                style={{
                  left: `${(node.x / 680) * 100}%`,
                  top: `${(node.y / 390) * 100}%`,
                }}
              >
                {node.id}
              </div>
            ))}
          </div>

          {/* LEGEND */}

          <div className="dfs-legend">
            <Legend
              className="normal"
              text="Unvisited"
            />

            <Legend
              className="stacked"
              text="In Stack"
            />

            <Legend
              className="current"
              text="Current"
            />

            <Legend
              className="comparing"
              text="Checking Neighbor"
            />

            <Legend
              className="visited"
              text="Visited"
            />
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="dfs-side-column">
          {/* STACK */}

          <div className="dfs-card">
            <div className="dfs-card-header">
              <div>
                <h2>Stack</h2>

                <span>
                  LIFO — Last In, First Out
                </span>
              </div>
            </div>

            <div className="dfs-stack">
              {current.stack.length === 0 ? (
                <span className="dfs-empty">
                  Stack is empty
                </span>
              ) : (
                [...current.stack]
                  .reverse()
                  .map((node, index) => (
                    <div
                      className="dfs-stack-item"
                      key={`${node}-${index}`}
                    >
                      {node}
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* TRAVERSAL */}

          <div className="dfs-card">
            <div className="dfs-card-header">
              <div>
                <h2>Traversal Order</h2>

                <span>
                  Nodes processed by DFS
                </span>
              </div>
            </div>

            <div className="dfs-traversal">
              {current.traversal.length === 0 ? (
                <span className="dfs-empty">
                  No nodes visited yet
                </span>
              ) : (
                current.traversal.map((node, index) => (
                  <div
                    className="dfs-traversal-item"
                    key={`${node}-${index}`}
                  >
                    <span>{index + 1}</span>
                    {node}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ADJACENCY LIST */}

          <div className="dfs-card">
            <div className="dfs-card-header">
              <div>
                <h2>Adjacency List</h2>

                <span>
                  Graph representation
                </span>
              </div>
            </div>

            <div className="dfs-adjacency">
              {Object.entries(GRAPH).map(
                ([node, neighbors]) => (
                  <div
                    className="dfs-adjacency-row"
                    key={node}
                  >
                    <strong>{node}</strong>

                    <div>
                      {neighbors.map((neighbor) => (
                        <span
                          className="dfs-neighbor"
                          key={neighbor}
                        >
                          {neighbor}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PSEUDOCODE */}

      <section className="dfs-card dfs-pseudocode-card">
        <div className="dfs-card-header">
          <div>
            <h2>Pseudocode</h2>

            <span>
              Follow DFS as it executes
            </span>
          </div>
        </div>

        <div className="dfs-code">
          {PSEUDOCODE.map((line, index) => {
            const active = current.line === index;

            return (
              <div
                key={index}
                className={`dfs-code-line ${
                  active ? "active" : ""
                }`}
              >
                <span className="dfs-line-number">
                  {index + 1}
                </span>

                <code>{line}</code>
              </div>
            );
          })}
        </div>
      </section>

      {/* COMPLEXITY */}

      <section className="dfs-complexity">
        <div className="dfs-complexity-card">
          <span>Time Complexity</span>
          <strong>O(V + E)</strong>
        </div>

        <div className="dfs-complexity-card">
          <span>Space Complexity</span>
          <strong>O(V)</strong>
        </div>

        <div className="dfs-complexity-card">
          <span>Data Structure</span>
          <strong>Stack</strong>
        </div>
      </section>
    </main>
  );
}

function Legend({ className, text }) {
  return (
    <div className="dfs-legend-item">
      <span
        className={`dfs-legend-dot ${className}`}
      />

      <span>{text}</span>
    </div>
  );
}