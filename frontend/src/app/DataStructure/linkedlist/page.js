"use client";

import { useState } from "react";
import "./link.css";

export default function LinkedListPage() {
  const [list, setList] = useState([10, 20, 30]);
  const [value, setValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [highlighted, setHighlighted] = useState(null);
  const [message, setMessage] = useState("Linked List is ready.");
  const [complexity, setComplexity] = useState("O(1)");

  const addAtBeginning = () => {
    if (value === "") return;

    const newValue = Number(value);

    setList((prev) => [newValue, ...prev]);
    setMessage(`${newValue} inserted at the beginning.`);
    setComplexity("O(1)");
    setValue("");
    setHighlighted(null);
  };

  const addAtEnd = () => {
    if (value === "") return;

    const newValue = Number(value);

    setList((prev) => [...prev, newValue]);
    setMessage(`${newValue} inserted at the end.`);
    setComplexity("O(n)");
    setValue("");
    setHighlighted(null);
  };

  const deleteNode = () => {
    if (value === "") return;

    const deleteValue = Number(value);

    if (!list.includes(deleteValue)) {
      setMessage(`${deleteValue} was not found.`);
      setComplexity("O(n)");
      return;
    }

    setList((prev) => prev.filter((item) => item !== deleteValue));
    setMessage(`${deleteValue} deleted from the list.`);
    setComplexity("O(n)");
    setValue("");
    setHighlighted(null);
  };

  const searchNode = () => {
    if (searchValue === "") return;

    const target = Number(searchValue);
    const index = list.indexOf(target);

    if (index === -1) {
      setMessage(`${target} was not found.`);
      setHighlighted(null);
    } else {
      setHighlighted(index);
      setMessage(`${target} found at position ${index + 1}.`);
    }

    setComplexity("O(n)");
  };

  const resetList = () => {
    setList([10, 20, 30]);
    setValue("");
    setSearchValue("");
    setHighlighted(null);
    setMessage("Linked List has been reset.");
    setComplexity("O(1)");
  };

  return (
    <main className="linked-list-page">

      <div className="linked-list-header">
        <div>
          <p className="page-label">DATA STRUCTURES</p>
          <h1>Linked List Visualizer</h1>
          <p className="page-description">
            Visualize how nodes are connected using pointers.
          </p>
        </div>
      </div>

      {/* Visualization */}
      <section className="visualizer-card">

        <div className="visualizer-title">
          <h2>Singly Linked List</h2>
          <span className="complexity">
            Time: {complexity}
          </span>
        </div>

        <div className="linked-list-container">

          <div className="head-label">
            HEAD
            <span>↓</span>
          </div>

          <div className="nodes-wrapper">

            {list.map((item, index) => (
              <div className="node-group" key={`${item}-${index}`}>

                <div
                  className={`node ${
                    highlighted === index ? "highlighted" : ""
                  }`}
                >
                  <div className="node-data">
                    {item}
                  </div>

                  <div className="node-pointer">
                    {index === list.length - 1 ? "null" : "next"}
                  </div>
                </div>

                {index !== list.length - 1 && (
                  <div className="arrow">
                    →
                  </div>
                )}

              </div>
            ))}

            {list.length === 0 && (
              <div className="empty-list">
                Linked List is empty
              </div>
            )}

          </div>

        </div>

      </section>

      {/* Controls */}
      <section className="controls-card">

        <div className="control-section">
          <h3>Insert / Delete</h3>

          <div className="input-row">

            <input
              type="number"
              placeholder="Enter value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />

            <button onClick={addAtBeginning}>
              Insert Beginning
            </button>

            <button onClick={addAtEnd}>
              Insert End
            </button>

            <button
              className="delete-button"
              onClick={deleteNode}
            >
              Delete
            </button>

          </div>
        </div>

        <div className="control-section">

          <h3>Search</h3>

          <div className="input-row">

            <input
              type="number"
              placeholder="Search value"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />

            <button onClick={searchNode}>
              Search
            </button>

            <button
              className="reset-button"
              onClick={resetList}
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

        <h2>How Linked List Works</h2>

        <p>
          A linked list consists of nodes. Each node stores a value
          and a pointer to the next node.
        </p>

        <div className="code-structure">
          <div>
            <strong>Node</strong>
          </div>

          <div>
            Data → Value stored in the node
          </div>

          <div>
            Next → Reference to the next node
          </div>
        </div>

        <div className="example">
          <strong>Example:</strong>

          <p>
            Head → 10 → 20 → 30 → null
          </p>
        </div>

      </section>

    </main>
  );
}