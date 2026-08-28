"use client";

const codeLines = [
  "for i = 0 to n - 2",
  "    minIndex = i",
  "",
  "    for j = i + 1 to n - 1",
  "        if array[j] < array[minIndex]",
  "            minIndex = j",
  "",
  "    if minIndex != i",
  "        swap(array[i], array[minIndex])",
];

export default function AlgorithmCode({ step }) {
  const getActiveLine = () => {
    if (!step) return null;

    switch (step.type) {
      case "start":
        return 1;

      case "compare":
        return 5;

      case "new-minimum":
        return 6;

      case "swap":
        return 9;

      case "sorted":
        return 1;

      case "complete":
        return null;

      default:
        return null;
    }
  };

  const activeLine = getActiveLine();

  return (
    <div className="algorithm-code">
      <div className="code-header">
        <span>SELECTION SORT</span>
        <span>JAVA-LIKE PSEUDOCODE</span>
      </div>

      <div className="code-body">
        {codeLines.map((line, index) => {
          const lineNumber = index + 1;
          const isActive = lineNumber === activeLine;

          return (
            <div
              key={index}
              className={`code-line ${isActive ? "code-line-active" : ""}`}
            >
              <span className="line-number">
                {lineNumber}
              </span>

              <code>{line || " "}</code>
            </div>
          );
        })}
      </div>
    </div>
  );
}