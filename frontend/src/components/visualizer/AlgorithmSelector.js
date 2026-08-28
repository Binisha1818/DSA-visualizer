"use client";

const algorithms = [
  {
    value: "bubble",
    label: "Bubble Sort",
  },
  {
    value: "selection",
    label: "Selection Sort",
  },
  {
    value: "insertion",
    label: "Insertion Sort",
  },
  {
    value: "merge",
    label: "Merge Sort",
  },
  {
    value: "quick",
    label: "Quick Sort",
  },
];

export default function AlgorithmSelector({
  algorithm,
  onChange,
}) {
  return (
    <div className="algorithm-selector">
      <label htmlFor="algorithm">
        ALGORITHM
      </label>

      <select
        id="algorithm"
        value={algorithm}
        onChange={(e) => onChange(e.target.value)}
      >
        {algorithms.map((item) => (
          <option
            key={item.value}
            value={item.value}
          >
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}