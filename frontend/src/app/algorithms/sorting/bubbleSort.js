// bubbleSort.js

/**
 * Generates a step-by-step trace of bubble sort.
 * Each step describes what the algorithm is doing at that moment,
 * so the UI can animate it and explain it.
 *
 * @param {number[]} inputArray
 * @returns {Array<Step>} steps
 *
 * Step shape:
 * {
 *   array: number[],          // snapshot of array at this step
 *   comparing: [number, number] | null,  // indices being compared
 *   swapped: boolean,         // whether a swap happened this step
 *   sortedIndices: number[],  // indices already in final position
 *   message: string           // human-readable explanation
 * }
 */
export function bubbleSort(inputArray) {
  const array = [...inputArray];
  const steps = [];
  const n = array.length;
  const sortedIndices = [];

  steps.push({
    array: [...array],
    comparing: null,
    swapped: false,
    sortedIndices: [...sortedIndices],
    message: "Starting Bubble Sort.",
  });

  for (let i = 0; i < n - 1; i++) {
    let swappedInPass = false;

    for (let j = 0; j < n - i - 1; j++) {
      // Comparison step
      steps.push({
        array: [...array],
        comparing: [j, j + 1],
        swapped: false,
        sortedIndices: [...sortedIndices],
        message: `Comparing ${array[j]} and ${array[j + 1]}.`,
      });

      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        swappedInPass = true;

        // Swap step
        steps.push({
          array: [...array],
          comparing: [j, j + 1],
          swapped: true,
          sortedIndices: [...sortedIndices],
          message: `Swapped ${array[j + 1]} and ${array[j]}.`,
        });
      }
    }

    sortedIndices.unshift(n - i - 1);

    if (!swappedInPass) break; // already sorted, stop early
  }

  // Mark remaining as sorted
  const finalSorted = Array.from({ length: n }, (_, idx) => idx);
  steps.push({
    array: [...array],
    comparing: null,
    swapped: false,
    sortedIndices: finalSorted,
    message: "Array is sorted.",
  });

  return steps;
}