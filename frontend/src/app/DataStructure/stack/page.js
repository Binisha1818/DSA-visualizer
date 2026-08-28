"use client";

import { useState } from "react";
import "./stack.css";

export default function StackPage() {
  const [stack, setStack] = useState([10, 20, 30]);
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("Stack is ready.");
  const [complexity, setComplexity] = useState("O(1)");

  const push = () => {
    if (value === "") return;

    const newValue = Number(value);

    setStack((prev) => [...prev, newValue]);
    setMessage(`${newValue} pushed onto the stack.`);
    setComplexity("O(1)");
    setValue("");
  };

  const pop = () => {
    if (stack.length === 0) {
      setMessage("Stack is empty. Nothing to pop.");
      return;
    }

    const removed = stack[stack.length - 1];

    setStack((prev) => prev.slice(0, -1));
    setMessage(`${removed} popped from the stack.`);
    setComplexity("O(1)");
  };

  const peek = () => {
    if (stack.length === 0) {
      setMessage("Stack is empty.");
      return;
    }

    const top = stack[stack.length - 1];

    setMessage(`Top element is ${top}.`);
    setComplexity("O(1)");
  };

  const isEmpty = () => {
    if (stack.length === 0) {
      setMessage("Stack is empty.");
    } else {
      setMessage("Stack is not empty.");
    }

    setComplexity("O(1)");
  };

  const resetStack = () => {
    setStack([10, 20, 30]);
    setValue("");
    setMessage("Stack has been reset.");
    setComplexity("O(1)");
  };

  return (
    <main className="stack-page">

      {/* Header */}
      <header className="stack-header">
        <p className="page-label">DATA STRUCTURES</p>

        <h1>Stack Visualizer</h1>

        <p className="page-description">
          Visualize how elements are added and removed using the LIFO principle.
        </p>
      </header>

      {/* Visualizer */}
      <section className="visualizer-card">

        <div className="visualizer-title">
          <h2>Stack</h2>

          <span className="complexity">
            Time: {complexity}
          </span>
        </div>

        <div className="stack-area">

          <div className="top-label">
            TOP
            <span>↓</span>
          </div>

          <div className="stack-container">

            {stack.length === 0 ? (
              <div className="empty-stack">
                Stack is empty
              </div>
            ) : (
              [...stack].reverse().map((item, index) => {

                const isTop = index === 0;

                return (
                  <div
                    key={`${item}-${index}`}
                    className={`stack-node ${
                      isTop ? "top-node" : ""
                    }`}
                  >
                    <span>{item}</span>

                    {isTop && (
                      <small>TOP</small>
                    )}
                  </div>
                );
              })
            )}

          </div>

          <div className="stack-base"></div>

        </div>

      </section>

      {/* Controls */}
      <section className="controls-card">

        <div className="control-section">

          <h3>Stack Operations</h3>

          <div className="input-row">

            <input
              type="number"
              placeholder="Enter value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />

            <button onClick={push}>
              Push
            </button>

            <button onClick={pop}>
              Pop
            </button>

            <button onClick={peek}>
              Peek
            </button>

            <button onClick={isEmpty}>
              Is Empty?
            </button>

            <button
              className="reset-button"
              onClick={resetStack}
            >
              Reset
            </button>

          </div>

        </div>

      </section>

      {/* Status */}
      <section className="status-card">

        <div>
          <span className="status-label">
            STATUS
          </span>

          <p>{message}</p>
        </div>

        <div className="complexity-box">
          <span>TIME COMPLEXITY</span>
          <strong>{complexity}</strong>
        </div>

      </section>

      {/* Explanation */}
      <section className="explanation-card">

        <h2>How Stack Works</h2>

        <p>
          A stack follows the <strong>LIFO</strong> principle:
          Last In, First Out.
        </p>

        <div className="stack-example">

          <div className="example-title">
            Example
          </div>

          <div className="example-stack">

            <div className="example-node">
              30
            </div>

            <div className="example-node">
              20
            </div>

            <div className="example-node">
              10
            </div>

          </div>

          <p>
            30 is the top element, so it will be removed first.
          </p>

        </div>

        <div className="operations-info">

          <div>
            <strong>Push</strong>
            <span>Add element → O(1)</span>
          </div>

          <div>
            <strong>Pop</strong>
            <span>Remove top → O(1)</span>
          </div>

          <div>
            <strong>Peek</strong>
            <span>View top → O(1)</span>
          </div>

          <div>
            <strong>Search</strong>
            <span>Find element → O(n)</span>
          </div>

        </div>

      </section>

    </main>
  );
}