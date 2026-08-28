"use client";

import { useEffect, useMemo, useState } from "react";
import "./hashmap.css";

const INITIAL_CAPACITY = 8;
const LOAD_FACTOR_LIMIT = 0.75;

const INITIAL_ENTRIES = [
  { key: "apple", value: "42" },
  { key: "mango", value: "18" },
  { key: "banana", value: "27" },
];

function hashKey(key) {
  let hash = 0;

  for (let i = 0; i < key.length; i++) {
    hash =
      (hash * 31 + key.charCodeAt(i)) >>> 0;
  }

  return hash;
}

function getIndex(key, capacity) {
  return hashKey(key) % capacity;
}

function createInitialTable() {
  return Array.from(
    { length: INITIAL_CAPACITY },
    () => []
  );
}

function createInitialState() {
  const table = createInitialTable();

  INITIAL_ENTRIES.forEach(({ key, value }) => {
    const index = getIndex(
      key,
      INITIAL_CAPACITY
    );

    table[index].push({
      key,
      value,
    });
  });

  return table;
}

function cloneTable(table) {
  return table.map((bucket) =>
    bucket.map((entry) => ({
      ...entry,
    }))
  );
}

function createSteps(initialTable) {
  const steps = [];

  const addStep = ({
    table,
    operation,
    key = "",
    value = "",
    hash = null,
    index = null,
    activeBucket = null,
    activeEntry = null,
    status = "",
    message = "",
    collisions = 0,
  }) => {
    steps.push({
      table: cloneTable(table),
      operation,
      key,
      value,
      hash,
      index,
      activeBucket,
      activeEntry,
      status,
      message,
      collisions,
    });
  };

  let table = cloneTable(initialTable);

  addStep({
    table,
    operation: "Ready",
    status: "idle",
    message:
      "The HashMap is ready. Choose an operation to begin.",
  });

  return steps;
}

function buildOperationSteps(
  baseTable,
  operation,
  key,
  value
) {
  const steps = [];
  let table = cloneTable(baseTable);

  const hash = hashKey(key);
  const index = getIndex(
    key,
    table.length
  );

  const addStep = ({
    activeBucket = null,
    activeEntry = null,
    status = "",
    message = "",
    collisions = 0,
    operationName = operation,
    currentHash = hash,
    currentIndex = index,
  }) => {
    steps.push({
      table: cloneTable(table),
      operation: operationName,
      key,
      value,
      hash: currentHash,
      index: currentIndex,
      activeBucket,
      activeEntry,
      status,
      message,
      collisions,
    });
  };

  addStep({
    status: "hashing",
    message: `Calculate hash("${key}").`,
  });

  addStep({
    activeBucket: index,
    status: "index",
    message: `${hash} % ${table.length} = ${index}. Bucket ${index} will be used.`,
  });

  if (operation === "Insert") {
    const bucket = table[index];

    const existingIndex = bucket.findIndex(
      (entry) => entry.key === key
    );

    if (existingIndex !== -1) {
      addStep({
        activeBucket: index,
        activeEntry: existingIndex,
        status: "found",
        message: `Key "${key}" already exists. Its value will be updated.`,
      });

      table[index][existingIndex].value =
        value;

      addStep({
        activeBucket: index,
        activeEntry: existingIndex,
        status: "updated",
        message: `Updated "${key}" to value "${value}".`,
      });

      return steps;
    }

    if (bucket.length > 0) {
      addStep({
        activeBucket: index,
        status: "collision",
        collisions: 1,
        message: `Collision! Bucket ${index} already contains an entry. Use chaining.`,
      });
    }

    table[index].push({
      key,
      value,
    });

    addStep({
      activeBucket: index,
      activeEntry:
        table[index].length - 1,
      status: "inserted",
      message: `Insert "${key}" → "${value}" into bucket ${index}.`,
    });

    return steps;
  }

  if (operation === "Search") {
    const bucket = table[index];

    if (bucket.length === 0) {
      addStep({
        activeBucket: index,
        status: "not-found",
        message: `Bucket ${index} is empty. "${key}" was not found.`,
      });

      return steps;
    }

    for (
      let i = 0;
      i < bucket.length;
      i++
    ) {
      addStep({
        activeBucket: index,
        activeEntry: i,
        status: "checking",
        message: `Check entry ${i + 1} in bucket ${index}: "${bucket[i].key}".`,
      });

      if (bucket[i].key === key) {
        addStep({
          activeBucket: index,
          activeEntry: i,
          status: "found",
          message: `Found "${key}" with value "${bucket[i].value}".`,
        });

        return steps;
      }
    }

    addStep({
      activeBucket: index,
      status: "not-found",
      message: `"${key}" is not present in the chain.`,
    });

    return steps;
  }

  if (operation === "Delete") {
    const bucket = table[index];

    if (bucket.length === 0) {
      addStep({
        activeBucket: index,
        status: "not-found",
        message: `Bucket ${index} is empty. Nothing to delete.`,
      });

      return steps;
    }

    for (
      let i = 0;
      i < bucket.length;
      i++
    ) {
      addStep({
        activeBucket: index,
        activeEntry: i,
        status: "checking",
        message: `Check entry ${i + 1}: "${bucket[i].key}".`,
      });

      if (bucket[i].key === key) {
        table[index].splice(i, 1);

        addStep({
          activeBucket: index,
          status: "deleted",
          message: `Deleted "${key}" from bucket ${index}.`,
        });

        return steps;
      }
    }

    addStep({
      activeBucket: index,
      status: "not-found",
      message: `"${key}" was not found, so nothing was deleted.`,
    });

    return steps;
  }

  return steps;
}

export default function HashMapPage() {
  const [table, setTable] = useState(
    () => createInitialState()
  );

  const [key, setKey] = useState("");
  const [value, setValue] = useState("");

  const [operation, setOperation] =
    useState("Insert");

  const [steps, setSteps] = useState(() =>
    createSteps(createInitialState())
  );

  const [step, setStep] = useState(0);

  const [playing, setPlaying] =
    useState(false);

  const [speed, setSpeed] =
    useState(700);

  const current =
    steps[step] || steps[0];

  const displayTable =
    current?.table || table;

  const capacity =
    displayTable.length;

  const size = displayTable.reduce(
    (total, bucket) =>
      total + bucket.length,
    0
  );

  const collisionCount =
    displayTable.reduce(
      (total, bucket) =>
        total +
        Math.max(bucket.length - 1, 0),
      0
    );

  const loadFactor =
    capacity === 0
      ? 0
      : size / capacity;

  const progress =
    steps.length > 1
      ? Math.round(
          (step /
            (steps.length - 1)) *
            100
        )
      : 0;

  const runOperation = () => {
    const cleanKey = key.trim();

    if (!cleanKey) {
      return;
    }

    if (
      operation === "Insert" &&
      !value.trim()
    ) {
      return;
    }

    setPlaying(false);

    const newSteps =
      buildOperationSteps(
        table,
        operation,
        cleanKey,
        value.trim()
      );

    if (newSteps.length === 0) {
      return;
    }

    const finalTable =
      newSteps[newSteps.length - 1]
        ?.table || [];

    setSteps(newSteps);
    setStep(0);
    setTable(cloneTable(finalTable));
  };

  const reset = () => {
    const freshTable =
      createInitialState();

    setPlaying(false);
    setTable(freshTable);
    setSteps(
      createSteps(freshTable)
    );
    setStep(0);
    setKey("");
    setValue("");
  };

  const nextStep = () => {
    setStep((previous) => {
      if (
        previous >=
        steps.length - 1
      ) {
        setPlaying(false);

        return previous;
      }

      const next =
        previous + 1;

      return next;
    });
  };

  const previousStep = () => {
    setPlaying(false);

    setStep((previous) =>
      Math.max(0, previous - 1)
    );
  };

  const togglePlay = () => {
    if (
      step >=
      steps.length - 1
    ) {
      setStep(0);
      setPlaying(true);

      return;
    }

    setPlaying(
      (previous) => !previous
    );
  };

  useEffect(() => {
    if (!playing) {
      return;
    }

    const timer = setInterval(() => {
      setStep((previous) => {
        if (
          previous >=
          steps.length - 1
        ) {
          setPlaying(false);

          return previous;
        }

        return previous + 1;
      });
    }, speed);

    return () =>
      clearInterval(timer);
  }, [
    playing,
    speed,
    steps.length,
  ]);

  const displayedHash =
    current?.hash ??
    (key
      ? hashKey(key)
      : null);

  const displayedIndex =
    current?.index ??
    (key
      ? getIndex(
          key,
          capacity
        )
      : null);

  return (
    <main className="hashmap-page">

      {/* HEADER */}

      <header className="hashmap-header">
        <p className="hashmap-eyebrow">
          DATA STRUCTURE
        </p>

        <h1>HashMap</h1>

        <p className="hashmap-description">
          Understand hashing, buckets,
          collisions and key-value
          storage through visualization.
        </p>
      </header>


      {/* OPERATION PANEL */}

      <section className="hashmap-operation">

        <div className="hashmap-input-group">

          <label>
            Key
          </label>

          <input
            type="text"
            value={key}
            placeholder="e.g. apple"
            onChange={(event) =>
              setKey(
                event.target.value
              )
            }
          />

        </div>


        <div className="hashmap-input-group">

          <label>
            Value
          </label>

          <input
            type="text"
            value={value}
            placeholder="e.g. 42"
            onChange={(event) =>
              setValue(
                event.target.value
              )
            }
          />

        </div>


        <div className="hashmap-input-group">

          <label>
            Operation
          </label>

          <select
            value={operation}
            onChange={(event) =>
              setOperation(
                event.target.value
              )
            }
          >
            <option value="Insert">
              Insert
            </option>

            <option value="Search">
              Search
            </option>

            <option value="Delete">
              Delete
            </option>
          </select>

        </div>


        <button
          className="hashmap-run-button"
          onClick={runOperation}
        >
          {operation}
        </button>

      </section>


      {/* CONTROLS */}

      <section className="hashmap-controls">

        <div className="hashmap-buttons">

          <button
            className="hashmap-button"
            onClick={previousStep}
            disabled={step === 0}
          >
            ← Step
          </button>

          <button
            className="hashmap-button primary"
            onClick={togglePlay}
          >
            {playing
              ? "Pause"
              : "Play"}
          </button>

          <button
            className="hashmap-button"
            onClick={nextStep}
            disabled={
              step >=
              steps.length - 1
            }
          >
            Step →
          </button>

          <button
            className="hashmap-button danger"
            onClick={reset}
          >
            Reset
          </button>

        </div>


        <div className="hashmap-speed">

          <span>
            Speed
          </span>

          <input
            type="range"
            min="200"
            max="1500"
            step="100"
            value={speed}
            onChange={(event) =>
              setSpeed(
                Number(
                  event.target.value
                )
              )
            }
          />

          <span>
            {speed}ms
          </span>

        </div>

      </section>


      {/* HASHING FLOW */}

      <section className="hashmap-card hashmap-flow">

        <div className="hashmap-card-header">

          <div>
            <h2>
              Hashing Process
            </h2>

            <span>
              Key → Hash → Bucket
            </span>
          </div>

        </div>


        <div className="hashmap-flow-content">

          <div className="hashmap-flow-box">

            <small>
              KEY
            </small>

            <strong>
              {current?.key ||
                key ||
                "—"}
            </strong>

          </div>


          <div className="hashmap-flow-arrow">
            →
          </div>


          <div className="hashmap-flow-box">

            <small>
              HASH
            </small>

            <strong>
              {displayedHash ??
                "—"}
            </strong>

          </div>


          <div className="hashmap-flow-arrow">
            →
          </div>


          <div className="hashmap-flow-box">

            <small>
              MODULO
            </small>

            <strong>
              {capacity
                ? `% ${capacity}`
                : "—"}
            </strong>

          </div>


          <div className="hashmap-flow-arrow">
            →
          </div>


          <div className="hashmap-flow-box result">

            <small>
              BUCKET
            </small>

            <strong>
              {displayedIndex ??
                "—"}
            </strong>

          </div>

        </div>

      </section>


      {/* MESSAGE */}

      <section className="hashmap-message">

        <div>

          <span>
            STEP {step + 1} OF{" "}
            {steps.length}
          </span>

          <p>
            {current?.message}
          </p>

        </div>

        <strong
          className={`hashmap-status ${current?.status || ""}`}
        >
          {current?.status ||
            "idle"}
        </strong>

      </section>


      {/* BUCKETS */}

      <section className="hashmap-card hashmap-buckets-card">

        <div className="hashmap-card-header">

          <div>
            <h2>
              Buckets
            </h2>

            <span>
              Separate chaining
            </span>
          </div>

          <span>
            Capacity: {capacity}
          </span>

        </div>


        <div className="hashmap-buckets">

          {displayTable.map(
            (bucket, bucketIndex) => {

              const isActive =
                current?.activeBucket ===
                bucketIndex;

              return (

                <div
                  className={`hashmap-bucket ${
                    isActive
                      ? "active"
                      : ""
                  }`}
                  key={bucketIndex}
                >

                  <div className="hashmap-bucket-index">
                    {bucketIndex}
                  </div>


                  <div className="hashmap-chain">

                    {bucket.length ===
                    0 ? (

                      <div className="hashmap-empty">
                        empty
                      </div>

                    ) : (

                      bucket.map(
                        (
                          entry,
                          entryIndex
                        ) => {

                          const activeEntry =
                            isActive &&
                            current?.activeEntry ===
                              entryIndex;

                          return (

                            <div
                              className={`hashmap-entry ${
                                activeEntry
                                  ? "active"
                                  : ""
                              }`}
                              key={`${entry.key}-${entryIndex}`}
                            >

                              <strong>
                                {entry.key}
                              </strong>

                              <span>
                                →
                              </span>

                              <span>
                                {entry.value}
                              </span>

                            </div>

                          );
                        }
                      )

                    )}

                  </div>

                </div>

              );
            }
          )}

        </div>

      </section>


      {/* STATS */}

      <section className="hashmap-stats">

        <div className="hashmap-stat">

          <span>
            Size
          </span>

          <strong>
            {size}
          </strong>

        </div>


        <div className="hashmap-stat">

          <span>
            Capacity
          </span>

          <strong>
            {capacity}
          </strong>

        </div>


        <div className="hashmap-stat">

          <span>
            Collisions
          </span>

          <strong>
            {collisionCount}
          </strong>

        </div>


        <div className="hashmap-stat hashmap-load-stat">

          <div>

            <span>
              Load Factor
            </span>

            <strong>
              {Math.round(
                loadFactor * 100
              )}
              %
            </strong>

          </div>


          <div className="hashmap-load-bar">

            <div
              className={
                loadFactor >=
                LOAD_FACTOR_LIMIT
                  ? "warning"
                  : ""
              }
              style={{
                width: `${Math.min(
                  loadFactor * 100,
                  100
                )}%`,
              }}
            />

          </div>

        </div>

      </section>


      {/* OPERATION HISTORY */}

      <section className="hashmap-card hashmap-operation-card">

        <div className="hashmap-card-header">

          <div>
            <h2>
              Current Operation
            </h2>

            <span>
              Step-by-step execution
            </span>
          </div>

        </div>


        <div className="hashmap-operation-content">

          <div className="hashmap-operation-item">

            <span>
              Operation
            </span>

            <strong>
              {current?.operation}
            </strong>

          </div>


          <div className="hashmap-operation-item">

            <span>
              Key
            </span>

            <strong>
              {current?.key ||
                "—"}
            </strong>

          </div>


          <div className="hashmap-operation-item">

            <span>
              Value
            </span>

            <strong>
              {current?.value ||
                "—"}
            </strong>

          </div>


          <div className="hashmap-operation-item">

            <span>
              Bucket
            </span>

            <strong>
              {current?.index ??
                "—"}
            </strong>

          </div>

        </div>

      </section>


      {/* COMPLEXITY */}

      <section className="hashmap-complexity">

        <div className="hashmap-complexity-card">

          <span>
            Average Insert
          </span>

          <strong>
            O(1)
          </strong>

        </div>


        <div className="hashmap-complexity-card">

          <span>
            Average Search
          </span>

          <strong>
            O(1)
          </strong>

        </div>


        <div className="hashmap-complexity-card">

          <span>
            Worst Case
          </span>

          <strong>
            O(n)
          </strong>

        </div>


        <div className="hashmap-complexity-card">

          <span>
            Collision Method
          </span>

          <strong>
            Chaining
          </strong>

        </div>

      </section>

    </main>
  );
}