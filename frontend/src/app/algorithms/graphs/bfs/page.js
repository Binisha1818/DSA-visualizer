"use client";

import { useEffect, useMemo, useState } from "react";
import "./bfs.css";

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
  "queue ← [start]",
  "visited ← ∅",
  "while queue is not empty:",
  "    node ← queue.dequeue()",
  "    visited.add(node)",
  "    for each neighbor of node:",
  "        if neighbor is not visited:",
  "            queue.enqueue(neighbor)",
];

function createSteps() {
  const steps = [];

  const visited = new Set();
  const queued = new Set();
  const queue = [];

  const start = "A";

  queue.push(start);
  queued.add(start);

  steps.push({
    queue: [...queue],
    visited: [],
    queued: [start],
    current: null,
    comparing: null,
    traversal: [],
    line: 0,
    message: "Initialize the queue with starting node A.",
  });

  steps.push({
    queue: [...queue],
    visited: [],
    queued: [start],
    current: null,
    comparing: null,
    traversal: [],
    line: 1,
    message: "Create an empty visited set.",
  });

  while (queue.length > 0) {
    const node = queue.shift();

    visited.add(node);

    steps.push({
      queue: [...queue],
      visited: [...visited],
      queued: [...queued].filter((item) => !visited.has(item)),
      current: node,
      comparing: null,
      traversal: [...visited],
      line: 3,
      message: `Dequeue ${node} from the queue.`,
    });

    steps.push({
      queue: [...queue],
      visited: [...visited],
      queued: [...queued].filter((item) => !visited.has(item)),
      current: node,
      comparing: null,
      traversal: [...visited],
      line: 4,
      message: `Mark ${node} as visited.`,
    });

    for (const neighbor of GRAPH[node]) {
      steps.push({
        queue: [...queue],
        visited: [...visited],
        queued: [...queued].filter((item) => !visited.has(item)),
        current: node,
        comparing: neighbor,
        traversal: [...visited],
        line: 5,
        message: `Check neighbor ${neighbor} of ${node}.`,
      });

      if (!visited.has(neighbor) && !queued.has(neighbor)) {
        queue.push(neighbor);
        queued.add(neighbor);

        steps.push({
          queue: [...queue],
          visited: [...visited],
          queued: [...queued].filter((item) => !visited.has(item)),
          current: node,
          comparing: neighbor,
          traversal: [...visited],
          line: 7,
          message: `${neighbor} has not been visited. Add it to the queue.`,
        });
      } else {
        steps.push({
          queue: [...queue],
          visited: [...visited],
          queued: [...queued].filter((item) => !visited.has(item)),
          current: node,
          comparing: neighbor,
          traversal: [...visited],
          line: 6,
          message: `${neighbor} is already visited or already in the queue.`,
        });
      }
    }
  }

  steps.push({
    queue: [],
    visited: [...visited],
    queued: [],
    current: null,
    comparing: null,
    traversal: [...visited],
    line: null,
    message: "BFS traversal completed!",
  });

  return steps;
}

export default function BFSPage() {
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

  const nodeState = (nodeId) => {
    if (current.current === nodeId) {
      return "bfs-node current";
    }

    if (current.comparing === nodeId) {
      return "bfs-node comparing";
    }

    if (current.visited.includes(nodeId)) {
      return "bfs-node visited";
    }

    if (current.queued.includes(nodeId)) {
      return "bfs-node queued";
    }

    return "bfs-node";
  };

  return (
    <main className="bfs-page">
      {/* HEADER */}

      <header className="bfs-header">
        <div>
          <p className="bfs-eyebrow">GRAPH TRAVERSAL</p>

          <h1>Breadth-First Search</h1>

          <p className="bfs-description">
            Explore a graph level by level and understand how BFS uses a queue.
          </p>
        </div>
      </header>

      {/* CONTROLS */}

      <section className="bfs-controls">
        <div className="bfs-buttons">
          <button
            className="bfs-button"
            onClick={previousStep}
            disabled={step === 0}
          >
            ← Step
          </button>

          <button
            className="bfs-button bfs-primary"
            onClick={togglePlay}
          >
            {playing ? "Pause" : "Play"}
          </button>

          <button
            className="bfs-button"
            onClick={nextStep}
            disabled={step >= steps.length - 1}
          >
            Step →
          </button>

          <button
            className="bfs-button bfs-danger"
            onClick={reset}
          >
            Reset
          </button>
        </div>

        <div className="bfs-speed">
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

      <section className="bfs-stats">
        <div className="bfs-stat">
          <span>Visited</span>
          <strong>{current.visited.length}</strong>
        </div>

        <div className="bfs-stat">
          <span>Queue</span>
          <strong>{current.queue.length}</strong>
        </div>

        <div className="bfs-stat">
          <span>Step</span>
          <strong>
            {step + 1}/{steps.length}
          </strong>
        </div>

        <div className="bfs-progress-wrapper">
          <span>Progress</span>

          <div className="bfs-progress">
            <div
              className="bfs-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <strong>{progress}%</strong>
        </div>
      </section>

      {/* STEP EXPLANATION */}

      <section className="bfs-step-panel">
        <div className="bfs-step-number">
          STEP {step + 1} OF {steps.length}
        </div>

        <div className="bfs-step-message">
          {current.message}
        </div>
      </section>

      {/* MAIN GRID */}

      <section className="bfs-content-grid">
        {/* GRAPH */}

        <div className="bfs-card bfs-graph-card">
          <div className="bfs-card-header">
            <div>
              <h2>Graph</h2>
              <span>Starting node: A</span>
            </div>
          </div>

          <div className="bfs-graph">
            <svg
              className="bfs-edges"
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
                    className="bfs-edge"
                  />
                );
              })}
            </svg>

            {NODES.map((node) => (
              <div
                key={node.id}
                className={nodeState(node.id)}
                style={{
                  left: `${(node.x / 680) * 100}%`,
                  top: `${(node.y / 390) * 100}%`,
                }}
              >
                {node.id}
              </div>
            ))}
          </div>

          <div className="bfs-legend">
            <Legend
              className="normal"
              text="Unvisited"
            />

            <Legend
              className="queued"
              text="In Queue"
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

        <div className="bfs-side-column">
          {/* QUEUE */}

          <div className="bfs-card">
            <div className="bfs-card-header">
              <div>
                <h2>Queue</h2>
                <span>FIFO — First In, First Out</span>
              </div>
            </div>

            <div className="bfs-queue">
              {current.queue.length === 0 ? (
                <span className="bfs-empty">
                  Queue is empty
                </span>
              ) : (
                current.queue.map((node, index) => (
                  <div
                    className="bfs-queue-item"
                    key={`${node}-${index}`}
                  >
                    {node}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* TRAVERSAL */}

          <div className="bfs-card">
            <div className="bfs-card-header">
              <div>
                <h2>Traversal Order</h2>
                <span>Nodes processed by BFS</span>
              </div>
            </div>

            <div className="bfs-traversal">
              {current.traversal.length === 0 ? (
                <span className="bfs-empty">
                  No nodes visited yet
                </span>
              ) : (
                current.traversal.map((node, index) => (
                  <div
                    className="bfs-traversal-item"
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

          <div className="bfs-card">
            <div className="bfs-card-header">
              <div>
                <h2>Adjacency List</h2>
                <span>Graph representation</span>
              </div>
            </div>

            <div className="bfs-adjacency">
              {Object.entries(GRAPH).map(
                ([node, neighbors]) => (
                  <div
                    className="bfs-adjacency-row"
                    key={node}
                  >
                    <strong>{node}</strong>

                    <div>
                      {neighbors.map((neighbor) => (
                        <span
                          className="bfs-neighbor"
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

      <section className="bfs-card bfs-pseudocode-card">
        <div className="bfs-card-header">
          <div>
            <h2>Pseudocode</h2>
            <span>Follow the algorithm as it executes</span>
          </div>
        </div>

        <div className="bfs-code">
          {PSEUDOCODE.map((line, index) => {
            const active = current.line === index;

            return (
              <div
                key={index}
                className={`bfs-code-line ${
                  active ? "active" : ""
                }`}
              >
                <span className="bfs-line-number">
                  {index + 1}
                </span>

                <code>{line}</code>
              </div>
            );
          })}
        </div>
      </section>

      {/* COMPLEXITY */}

      <section className="bfs-complexity">
        <div className="bfs-complexity-card">
          <span>Time Complexity</span>
          <strong>O(V + E)</strong>
        </div>

        <div className="bfs-complexity-card">
          <span>Space Complexity</span>
          <strong>O(V)</strong>
        </div>

        <div className="bfs-complexity-card">
          <span>Data Structure</span>
          <strong>Queue</strong>
        </div>
      </section>
    </main>
  );
}

function Legend({ className, text }) {
  return (
    <div className="bfs-legend-item">
      <span
        className={`bfs-legend-dot ${className}`}
      />

      <span>{text}</span>
    </div>
  );
}