"use client";

export default function ArrayVisualizer({
  array,
  activeIndices = [],
  minimumIndex = null,
  sortedIndices = [],
}) {
  return (
    <div className="array-visualizer">
      {array.map((value, index) => {
        const isActive = activeIndices.includes(index);
        const isMinimum = minimumIndex === index;
        const isSorted = sortedIndices.includes(index);

        let className = "array-bar";

        if (isSorted) {
          className += " sorted";
        } else if (isMinimum) {
          className += " minimum";
        } else if (isActive) {
          className += " active";
        }

        return (
          <div
            key={index}
            className={className}
            style={{
              height: `${value * 4}px`,
            }}
          >
            <span>{value}</span>
          </div>
        );
      })}
    </div>
  );
}