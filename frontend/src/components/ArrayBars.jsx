// components/layout/ArrayBars.jsx
import "./ArrayBars.css";

/**
 * Renders the array as vertical bars.
 * Colors change based on state: default / comparing / sorted.
 */
export default function ArrayBars({ array, comparing, sortedIndices }) {
  return (
    <div className="array-bars">
      {array.map((value, index) => {
        const isComparing = comparing && comparing.includes(index);
        const isSorted = sortedIndices.includes(index);

        const barClass = [
          "array-bar",
          isComparing ? "array-bar--comparing" : "",
          isSorted ? "array-bar--sorted" : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div key={index} className="array-bar-wrapper">
            <div
              className={barClass}
              style={{ height: `${value}px` }}
            />
            <span className="array-bar-label">{value}</span>
          </div>
        );
      })}
    </div>
  );
}