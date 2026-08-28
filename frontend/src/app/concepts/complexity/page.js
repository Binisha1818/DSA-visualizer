"use client";

import { useState, useMemo } from "react";
import "./tc.css";

const CLASSES = [
  {
    id: "o1",
    label: "O(1)",
    name: "Constant",
    color: "#22c55e",
    fn: () => 1,
    example: "Array access",
  },
  {
    id: "ologn",
    label: "O(log n)",
    name: "Logarithmic",
    color: "#3b82f6",
    fn: (n) => Math.log2(Math.max(n, 1)),
    example: "Binary search",
  },
  {
    id: "on",
    label: "O(n)",
    name: "Linear",
    color: "#eab308",
    fn: (n) => n,
    example: "Linear search",
  },
  {
    id: "onlogn",
    label: "O(n log n)",
    name: "Linearithmic",
    color: "#f97316",
    fn: (n) => n * Math.log2(Math.max(n, 1)),
    example: "Merge sort",
  },
  {
    id: "on2",
    label: "O(n²)",
    name: "Quadratic",
    color: "#ef4444",
    fn: (n) => n * n,
    example: "Bubble sort",
  },
  {
    id: "o2n",
    label: "O(2ⁿ)",
    name: "Exponential",
    color: "#a855f7",
    fn: (n) => Math.pow(2, n),
    example: "Recursive Fibonacci",
  },
];

const CHART_WIDTH = 640;
const CHART_HEIGHT = 320;

const PAD_LEFT = 44;
const PAD_BOTTOM = 32;
const PAD_TOP = 16;
const PAD_RIGHT = 64;

export default function ComplexityConceptPage() {
  const [n, setN] = useState(10);

  const [visible, setVisible] = useState(() =>
    Object.fromEntries(
      CLASSES.map((item) => [item.id, true])
    )
  );

  const maxN = 20;

  const plotW =
    CHART_WIDTH - PAD_LEFT - PAD_RIGHT;

  const plotH =
    CHART_HEIGHT - PAD_TOP - PAD_BOTTOM;

  const maxY = useMemo(() => {
    let max = 1;

    CLASSES.forEach((item) => {
      if (!visible[item.id]) return;

      const value = item.fn(maxN);

      if (isFinite(value) && value > max) {
        max = value;
      }
    });

    return max;
  }, [visible]);

  function xFor(value) {
    return (
      PAD_LEFT +
      (value / maxN) * plotW
    );
  }

  function yFor(value) {
    const safeValue = Math.min(value, maxY);

    return (
      PAD_TOP +
      plotH -
      (safeValue / maxY) * plotH
    );
  }

  function createPath(fn) {
    let path = "";

    for (let i = 1; i <= maxN; i++) {
      const x = xFor(i);
      const y = yFor(fn(i));

      path +=
        i === 1
          ? `M ${x} ${y}`
          : ` L ${x} ${y}`;
    }

    return path;
  }

  function toggleComplexity(id) {
    setVisible((current) => ({
      ...current,
      [id]: !current[id],
    }));
  }

  return (
    <main className="cx-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <header className="cx-header">
        <h1>Time & Space Complexity</h1>

        <p>
          Learn how algorithms behave when
          the input gets bigger.
        </p>
      </header>


      {/* =====================================
          WHAT IS TIME COMPLEXITY
      ====================================== */}

      <section className="cx-info-card">

        <h2>What is Time Complexity?</h2>

        <p>
          Algorithms and data structures like HashMap, sorting, and graphs have different time complexities. 
          Some are faster, some slower.Time complexity helps us choose an efficient way to solve a 
          problem, especially when the input can become very large. To understand what input is 
          Imagine you are building a website with 10 users.
Almost any approach will feel fast.

But now imagine:

10 users → 10,000 → 1 million → 100 million users
A software engineer uses Time complexity or DSA knowledge to ask:

“Will this code still perform well when our data and users become huge?”
        </p>

        <p>
          It helps us compare algorithms and choose
          one that works better for large amounts of data.
        </p>

      </section>


      {/* =====================================
          FASTEST TO SLOWEST
      ====================================== */}

      <section className="cx-info-card">

        <h2>Fastest → Slowest</h2>

        <div className="cx-complexity-order">

          {CLASSES.map((item, index) => (
            <div
              key={item.id}
              className="cx-order-item"
            >

              <span
                className="cx-order-dot"
                style={{
                  background: item.color,
                }}
              />

              <strong>
                {item.label}
              </strong>

              {index < CLASSES.length - 1 && (
                <span className="cx-order-arrow">
                  →
                </span>
              )}

            </div>
          ))}

        </div>

        <p className="cx-small-text">
          Generally, the further right we go,
          the harder it becomes to handle large inputs.
        </p>

      </section>


      {/* =====================================
          GRAPH
      ====================================== */}

      <section className="cx-chart-card">

        <div className="cx-chart-header">

          <div>

            <span className="cx-chart-title">
              How complexity grows
            </span>

            <p className="cx-chart-subtitle">
              Move the slider and see what happens
              as n grows.
            </p>

          </div>

          <div className="cx-n-control">

            <span>
              n = {n}
            </span>

            <input
              type="range"
              min="1"
              max={maxN}
              value={n}
              onChange={(e) =>
                setN(Number(e.target.value))
              }
            />

          </div>

        </div>


        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          className="cx-svg"
        >

          {/* Y AXIS */}

          <line
            x1={PAD_LEFT}
            y1={PAD_TOP}
            x2={PAD_LEFT}
            y2={PAD_TOP + plotH}
            stroke="#262b38"
          />


          {/* X AXIS */}

          <line
            x1={PAD_LEFT}
            y1={PAD_TOP + plotH}
            x2={PAD_LEFT + plotW}
            y2={PAD_TOP + plotH}
            stroke="#262b38"
          />


          {/* CURVES */}

          {CLASSES.map((item) => {

            if (!visible[item.id]) {
              return null;
            }

            const endY = yFor(
              item.fn(maxN)
            );

            return (
              <g key={item.id}>

                <path
                  d={createPath(item.fn)}
                  fill="none"
                  stroke={item.color}
                  strokeWidth="2.5"
                />

                <text
                  x={PAD_LEFT + plotW + 5}
                  y={Math.max(
                    PAD_TOP + 8,
                    Math.min(
                      PAD_TOP + plotH,
                      endY
                    )
                  )}
                  className="cx-curve-label"
                  style={{
                    fill: item.color,
                  }}
                >
                  {item.label}
                </text>

              </g>
            );
          })}


          {/* CURRENT N */}

          <line
            x1={xFor(n)}
            y1={PAD_TOP}
            x2={xFor(n)}
            y2={PAD_TOP + plotH}
            stroke="#4b5563"
            strokeDasharray="4 4"
          />

        </svg>


        <p className="cx-chart-takeaway">
          As n gets bigger, slower complexities
          grow much faster than faster ones.
        </p>


        {/* LEGEND */}

        <div className="cx-legend">

          {CLASSES.map((item) => (

            <button
              key={item.id}
              className={`cx-legend-item ${
                visible[item.id]
                  ? ""
                  : "cx-legend-off"
              }`}
              onClick={() =>
                toggleComplexity(item.id)
              }
            >

              <i
                className="cx-legend-dot"
                style={{
                  background: item.color,
                }}
              />

              {item.label}

            </button>

          ))}

        </div>

      </section>


      {/* =====================================
          SIMPLE TABLE
      ====================================== */}

      <section className="cx-table-wrap">

        <table className="cx-table">

          <thead>

            <tr>
              <th>Complexity</th>
              <th>Simple meaning</th>
              <th>Example</th>
            </tr>

          </thead>

          <tbody>

            {CLASSES.map((item) => (

              <tr
                key={item.id}
                className={
                  visible[item.id]
                    ? ""
                    : "cx-row-off"
                }
              >

                <td>

                  <span
                    className="cx-row-dot"
                    style={{
                      background: item.color,
                    }}
                  />

                  {item.label}

                </td>

                <td>
                  {getSimpleMeaning(item.id)}
                </td>

                <td>
                  {item.example}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </section>


      {/* =====================================
          WHEN DO WE USE EACH ONE?
      ====================================== */}

      <section className="cx-info-card">

        <h2>
          When do we use each complexity?
        </h2>

        <div className="cx-use-grid">

          <ComplexityUse
            color="#22c55e"
            title="O(1)"
            text="When we already know where the data is."
            example="Array access, HashMap lookup"
          />

          <ComplexityUse
            color="#3b82f6"
            title="O(log n)"
            text="When we can keep reducing the search area."
            example="Binary search"
          />

          <ComplexityUse
            color="#eab308"
            title="O(n)"
            text="When we need to check each item."
            example="Searching, counting, traversal"
          />

          <ComplexityUse
            color="#f97316"
            title="O(n log n)"
            text="When we need efficient sorting."
            example="Merge sort"
          />

          <ComplexityUse
            color="#ef4444"
            title="O(n²)"
            text="When many items need to be compared."
            example="Bubble sort, Selection sort"
          />

          <ComplexityUse
            color="#a855f7"
            title="O(2ⁿ)"
            text="When we try many possible combinations."
            example="Some recursive problems"
          />

        </div>

      </section>


      {/* =====================================
          WHO USES IT?
      ====================================== */}

      <section className="cx-info-card">

        <h2>Who uses Time Complexity?</h2>

        <div className="cx-people-grid">

          <div className="cx-person-card">
            <strong>Developers</strong>

            <span>
              To choose efficient solutions.
            </span>
          </div>

          <div className="cx-person-card">
            <strong>Software Engineers</strong>

            <span>
              To build systems that handle
              large amounts of data.
            </span>
          </div>

          <div className="cx-person-card">
            <strong>Competitive Programmers</strong>

            <span>
              To make sure solutions finish
              within the time limit.
            </span>
          </div>

          <div className="cx-person-card">
            <strong>Students</strong>

            <span>
              To learn and compare algorithms.
            </span>
          </div>

        </div>

      </section>


      {/* =====================================
          REAL WORLD EXAMPLE
      ====================================== */}

      <section className="cx-info-card">

        <h2>
          Real-world example: Searching for a name
        </h2>

        <p>
          Imagine you have millions of names and
          you need to find one person.
        </p>

        <div className="cx-search-example">

          <div className="cx-search-method">

            <div className="cx-search-title">
              Checking one by one
            </div>

            <strong>O(n)</strong>

            <span>
              More names = more checking
            </span>

          </div>


          <div className="cx-search-method">

            <div className="cx-search-title">
              Binary Search
            </div>

            <strong>O(log n)</strong>

            <span>
              Keeps cutting the search area
            </span>

          </div>


          <div className="cx-search-method">

            <div className="cx-search-title">
              HashMap
            </div>

            <strong>O(1)</strong>

            <span>
              Very fast average lookup
            </span>

          </div>

        </div>

        <div className="cx-bottom-note">

          <strong>
            The bigger the data, the more
            important complexity becomes.
          </strong>

        </div>

      </section>


      {/* =====================================
          WHY IT MATTERS
      ====================================== */}

      <section className="cx-info-card">

        <h2>Why does it matter?</h2>

        <p>
          An algorithm can work perfectly with a
          small input but become very slow with a
          large input.
        </p>

        <p>
          Time complexity helps us understand this
          before we build or use the algorithm.
        </p>

      </section>


      {/* =====================================
          SPACE COMPLEXITY
      ====================================== */}

      <section className="cx-info-card">

        <h2>What is Space Complexity?</h2>

        <p>
          Space complexity tells us how much
          extra memory an algorithm needs.
        </p>

        <div className="cx-space-simple">

          <div>

            <strong>O(1)</strong>

            <span>
              Uses almost the same extra memory.
            </span>

          </div>

          <div>

            <strong>O(n)</strong>

            <span>
              Extra memory grows with the input.
            </span>

          </div>

        </div>

      </section>

    </main>
  );
}


/* =========================================
   SIMPLE MEANINGS
========================================= */

function getSimpleMeaning(id) {

  switch (id) {

    case "o1":
      return "Same amount of work";

    case "ologn":
      return "Grows very slowly";

    case "on":
      return "Grows with the input";

    case "onlogn":
      return "Grows fairly quickly";

    case "on2":
      return "Gets slow quickly";

    case "o2n":
      return "Gets extremely slow";

    default:
      return "";
  }
}


/* =========================================
   COMPLEXITY USE CARD
========================================= */

function ComplexityUse({
  color,
  title,
  text,
  example,
}) {

  return (
    <div className="cx-use-card">

      <div className="cx-use-top">

        <span
          className="cx-use-dot"
          style={{
            background: color,
          }}
        />

        <strong>{title}</strong>

      </div>

      <p>
        {text}
      </p>

      <small>
        Example: {example}
      </small>

    </div>
  );
}