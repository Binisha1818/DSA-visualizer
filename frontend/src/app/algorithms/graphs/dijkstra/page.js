"use client";

import { useEffect, useMemo, useState } from "react";
import "./dijkstra.css";

const NODES = [
  { id: "A", x: 110, y: 190 },
  { id: "B", x: 300, y: 90 },
  { id: "C", x: 300, y: 300 },
  { id: "D", x: 510, y: 90 },
  { id: "E", x: 510, y: 300 },
  { id: "F", x: 680, y: 190 },
];

const EDGES = [
  ["A", "B", 4],
  ["A", "C", 2],
  ["B", "C", 1],
  ["B", "D", 5],
  ["C", "E", 8],
  ["C", "D", 10],
  ["D", "E", 2],
  ["D", "F", 6],
  ["E", "F", 3],
];

const ADJACENCY = {
  A: [
    ["B", 4],
    ["C", 2],
  ],
  B: [
    ["A", 4],
    ["C", 1],
    ["D", 5],
  ],
  C: [
    ["A", 2],
    ["B", 1],
    ["D", 10],
    ["E", 8],
  ],
  D: [
    ["B", 5],
    ["C", 10],
    ["E", 2],
    ["F", 6],
  ],
  E: [
    ["C", 8],
    ["D", 2],
    ["F", 3],
  ],
  F: [
    ["D", 6],
    ["E", 3],
  ],
};

const PSEUDOCODE = [
  "distance[start] ← 0",
  "distance[all others] ← ∞",
  "unvisited ← all nodes",
  "while unvisited is not empty:",
  "    current ← node with smallest distance",
  "    remove current from unvisited",
  "    for each neighbor of current:",
  "        newDistance ← distance[current] + weight",
  "        if newDistance < distance[neighbor]:",
  "            distance[neighbor] ← newDistance",
  "            previous[neighbor] ← current",
];

function createSteps() {
  const steps = [];

  const distances = {
    A: 0,
    B: Infinity,
    C: Infinity,
    D: Infinity,
    E: Infinity,
    F: Infinity,
  };

  const previous = {
    A: null,
    B: null,
    C: null,
    D: null,
    E: null,
    F: null,
  };

  const visited = new Set();
  const queue = ["A"];

  const snapshotDistances = () => ({
    A: distances.A,
    B: distances.B,
    C: distances.C,
    D: distances.D,
    E: distances.E,
    F: distances.F,
  });

  const snapshotPrevious = () => ({
    A: previous.A,
    B: previous.B,
    C: previous.C,
    D: previous.D,
    E: previous.E,
    F: previous.F,
  });

  const addStep = ({
    current = null,
    checking = null,
    line = null,
    message,
  }) => {
    steps.push({
      distances: snapshotDistances(),
      previous: snapshotPrevious(),
      visited: [...visited],
      queue: [...queue],
      current,
      checking,
      line,
      message,
    });
  };

  addStep({
    line: 0,
    message:
      "Set the distance of the starting node A to 0.",
  });

  addStep({
    line: 1,
    message:
      "Set the distance of every other node to infinity.",
  });

  addStep({
    line: 2,
    message:
      "Add every node to the unvisited set.",
  });

  while (visited.size < Object.keys(distances).length) {
    let current = null;
    let smallestDistance = Infinity;

    for (const node of Object.keys(distances)) {
      if (
        !visited.has(node) &&
        distances[node] < smallestDistance
      ) {
        smallestDistance = distances[node];
        current = node;
      }
    }

    if (current === null) {
      break;
    }

    queue.splice(queue.indexOf(current), 1);

    addStep({
      current,
      line: 4,
      message: `Node ${current} has the smallest known distance: ${smallestDistance}.`,
    });

    visited.add(current);

    addStep({
      current,
      line: 5,
      message: `Mark ${current} as visited.`,
    });

    for (const [neighbor, weight] of ADJACENCY[current]) {
      if (visited.has(neighbor)) {
        continue;
      }

      addStep({
        current,
        checking: neighbor,
        line: 6,
        message: `Check neighbor ${neighbor} using edge weight ${weight}.`,
      });

      const newDistance =
        distances[current] + weight;

      addStep({
        current,
        checking: neighbor,
        line: 7,
        message: `Calculate ${distances[current]} + ${weight} = ${newDistance}.`,
      });

      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
        previous[neighbor] = current;

        if (!queue.includes(neighbor)) {
          queue.push(neighbor);
        }

        addStep({
          current,
          checking: neighbor,
          line: 8,
          message: `Update ${neighbor}'s shortest distance to ${newDistance}.`,
        });
      } else {
        addStep({
          current,
          checking: neighbor,
          line: 8,
          message: `No update. ${neighbor}'s current distance is already smaller.`,
        });
      }
    }
  }

  addStep({
    line: null,
    message:
      "Dijkstra's algorithm completed. The shortest distances from A are ready.",
  });

  return steps;
}

export default function DijkstraPage() {
  const steps = useMemo(() => createSteps(), []);

  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(700);

  const current = steps[step];

  const progress =
    steps.length > 1
      ? Math.round(
          (step / (steps.length - 1)) * 100
        )
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

    setStep((prev) =>
      Math.max(0, prev - 1)
    );
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
      return "dijkstra-node current";
    }

    if (current.checking === nodeId) {
      return "dijkstra-node checking";
    }

    if (current.visited.includes(nodeId)) {
      return "dijkstra-node visited";
    }

    return "dijkstra-node";
  };

  const getEdgeClass = (from, to) => {
    if (
      current.current === from &&
      current.checking === to
    ) {
      return "dijkstra-edge checking";
    }

    if (
      current.current === to &&
      current.checking === from
    ) {
      return "dijkstra-edge checking";
    }

    return "dijkstra-edge";
  };

  const getPathEdgeClass = (from, to) => {
    for (const node of Object.keys(current.previous)) {
      const parent = current.previous[node];

      if (
        (parent === from && node === to) ||
        (parent === to && node === from)
      ) {
        return "dijkstra-edge shortest";
      }
    }

    return "";
  };

  return (
    <main className="dijkstra-page">

      {/* HEADER */}

      <header className="dijkstra-header">
        <div>
          <p className="dijkstra-eyebrow">
            SHORTEST PATH
          </p>

          <h1>Dijkstra&apos;s Algorithm</h1>

          <p className="dijkstra-description">
            Find the shortest path from a starting node
            to every other node in a weighted graph.
          </p>
        </div>
      </header>


      {/* CONTROLS */}

      <section className="dijkstra-controls">

        <div className="dijkstra-buttons">

          <button
            className="dijkstra-button"
            onClick={previousStep}
            disabled={step === 0}
          >
            ← Step
          </button>

          <button
            className="dijkstra-button dijkstra-primary"
            onClick={togglePlay}
          >
            {playing ? "Pause" : "Play"}
          </button>

          <button
            className="dijkstra-button"
            onClick={nextStep}
            disabled={
              step >= steps.length - 1
            }
          >
            Step →
          </button>

          <button
            className="dijkstra-button dijkstra-danger"
            onClick={reset}
          >
            Reset
          </button>

        </div>


        <div className="dijkstra-speed">

          <span>Speed</span>

          <input
            type="range"
            min="200"
            max="1500"
            step="100"
            value={speed}
            onChange={(event) =>
              setSpeed(
                Number(event.target.value)
              )
            }
          />

          <span>{speed}ms</span>

        </div>

      </section>


      {/* STATS */}

      <section className="dijkstra-stats">

        <div className="dijkstra-stat">
          <span>Visited</span>

          <strong>
            {current.visited.length}
          </strong>
        </div>


        <div className="dijkstra-stat">
          <span>Current</span>

          <strong>
            {current.current || "—"}
          </strong>
        </div>


        <div className="dijkstra-stat">
          <span>Step</span>

          <strong>
            {step + 1}/{steps.length}
          </strong>
        </div>


        <div className="dijkstra-progress-wrapper">

          <span>Progress</span>

          <div className="dijkstra-progress">

            <div
              className="dijkstra-progress-fill"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

          <strong>{progress}%</strong>

        </div>

      </section>


      {/* MESSAGE */}

      <section className="dijkstra-step-panel">

        <div className="dijkstra-step-number">
          STEP {step + 1} OF {steps.length}
        </div>

        <div className="dijkstra-step-message">
          {current.message}
        </div>

      </section>


      {/* MAIN GRID */}

      <section className="dijkstra-content-grid">


        {/* GRAPH */}

        <div className="dijkstra-card dijkstra-graph-card">

          <div className="dijkstra-card-header">

            <div>
              <h2>Weighted Graph</h2>

              <span>
                Starting node: A
              </span>
            </div>

          </div>


          <div className="dijkstra-graph">

            <svg
              className="dijkstra-edges"
              viewBox="0 0 780 390"
              preserveAspectRatio="none"
            >

              {EDGES.map(
                ([from, to, weight]) => {

                  const fromNode =
                    NODES.find(
                      (node) =>
                        node.id === from
                    );

                  const toNode =
                    NODES.find(
                      (node) =>
                        node.id === to
                    );

                  const pathClass =
                    getPathEdgeClass(
                      from,
                      to
                    );

                  return (
                    <g
                      key={`${from}-${to}`}
                    >

                      <line
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        className={`${getEdgeClass(
                          from,
                          to
                        )} ${pathClass}`}
                      />

                      <text
                        x={
                          (fromNode.x +
                            toNode.x) /
                          2
                        }
                        y={
                          (fromNode.y +
                            toNode.y) /
                            2 -
                          8
                        }
                        className="dijkstra-edge-weight"
                      >
                        {weight}
                      </text>

                    </g>
                  );
                }
              )}

            </svg>


            {NODES.map((node) => (

              <div
                key={node.id}
                className={getNodeClass(
                  node.id
                )}
                style={{
                  left: `${
                    (node.x / 780) *
                    100
                  }%`,
                  top: `${
                    (node.y / 390) *
                    100
                  }%`,
                }}
              >

                <span>{node.id}</span>

                <small>
                  {current.distances[
                    node.id
                  ] === Infinity
                    ? "∞"
                    : current.distances[
                        node.id
                      ]}
                </small>

              </div>

            ))}

          </div>


          {/* LEGEND */}

          <div className="dijkstra-legend">

            <Legend
              className="normal"
              text="Unvisited"
            />

            <Legend
              className="current"
              text="Current"
            />

            <Legend
              className="checking"
              text="Checking"
            />

            <Legend
              className="visited"
              text="Visited"
            />

            <Legend
              className="shortest"
              text="Shortest Path"
            />

          </div>

        </div>


        {/* RIGHT SIDE */}

        <div className="dijkstra-side-column">


          {/* PRIORITY QUEUE */}

          <div className="dijkstra-card">

            <div className="dijkstra-card-header">

              <div>
                <h2>Priority Queue</h2>

                <span>
                  Lowest distance first
                </span>
              </div>

            </div>


            <div className="dijkstra-queue">

              {current.queue.length === 0 ? (

                <span className="dijkstra-empty">
                  Queue is empty
                </span>

              ) : (

                [...current.queue]
                  .sort(
                    (a, b) =>
                      current.distances[a] -
                      current.distances[b]
                  )
                  .map((node, index) => (

                    <div
                      className="dijkstra-queue-item"
                      key={`${node}-${index}`}
                    >

                      <span>
                        {node}
                      </span>

                      <strong>
                        {current.distances[
                          node
                        ] === Infinity
                          ? "∞"
                          : current.distances[
                              node
                            ]}
                      </strong>

                    </div>

                  ))

              )}

            </div>

          </div>


          {/* DISTANCES */}

          <div className="dijkstra-card">

            <div className="dijkstra-card-header">

              <div>
                <h2>Shortest Distances</h2>

                <span>
                  Distance from A
                </span>
              </div>

            </div>


            <div className="dijkstra-distances">

              {NODES.map((node) => (

                <div
                  className="dijkstra-distance-row"
                  key={node.id}
                >

                  <strong>
                    {node.id}
                  </strong>

                  <span>
                    {current.distances[
                      node.id
                    ] === Infinity
                      ? "∞"
                      : current.distances[
                          node.id
                        ]}
                  </span>

                  <small>
                    {current.previous[
                      node.id
                    ]
                      ? `via ${current.previous[
                          node.id
                        ]}`
                      : node.id === "A"
                      ? "Start"
                      : "—"}
                  </small>

                </div>

              ))}

            </div>

          </div>


          {/* ADJACENCY LIST */}

          <div className="dijkstra-card">

            <div className="dijkstra-card-header">

              <div>
                <h2>Adjacency List</h2>

                <span>
                  Weighted graph representation
                </span>
              </div>

            </div>


            <div className="dijkstra-adjacency">

              {Object.entries(
                ADJACENCY
              ).map(
                ([node, neighbors]) => (

                  <div
                    className="dijkstra-adjacency-row"
                    key={node}
                  >

                    <strong>
                      {node}
                    </strong>

                    <div>

                      {neighbors.map(
                        ([neighbor, weight]) => (

                          <span
                            className="dijkstra-neighbor"
                            key={neighbor}
                          >
                            {neighbor}
                            <small>
                              {weight}
                            </small>
                          </span>

                        )
                      )}

                    </div>

                  </div>

                )
              )}

            </div>

          </div>

        </div>

      </section>


      {/* PSEUDOCODE */}

      <section className="dijkstra-card dijkstra-pseudocode-card">

        <div className="dijkstra-card-header">

          <div>
            <h2>Pseudocode</h2>

            <span>
              Follow Dijkstra as it executes
            </span>
          </div>

        </div>


        <div className="dijkstra-code">

          {PSEUDOCODE.map(
            (line, index) => {

              const active =
                current.line === index;

              return (

                <div
                  key={index}
                  className={`dijkstra-code-line ${
                    active
                      ? "active"
                      : ""
                  }`}
                >

                  <span className="dijkstra-line-number">
                    {index + 1}
                  </span>

                  <code>{line}</code>

                </div>

              );
            }
          )}

        </div>

      </section>


      {/* COMPLEXITY */}

      <section className="dijkstra-complexity">

        <div className="dijkstra-complexity-card">

          <span>
            Time Complexity
          </span>

          <strong>
            O((V + E) log V)
          </strong>

        </div>


        <div className="dijkstra-complexity-card">

          <span>
            Space Complexity
          </span>

          <strong>
            O(V)
          </strong>

        </div>


        <div className="dijkstra-complexity-card">

          <span>
            Data Structure
          </span>

          <strong>
            Priority Queue
          </strong>

        </div>

      </section>

    </main>
  );
}


function Legend({ className, text }) {
  return (
    <div className="dijkstra-legend-item">

      <span
        className={`dijkstra-legend-dot ${className}`}
      />

      <span>{text}</span>

    </div>
  );
}