/**
 * Check out {@link https://gist.github.com/dimasmiftah/63a899f018c903326ecccdac91b21e56|dimasmiftah} Gist
 * @file Calculate all possible combinations of r elements in a given array of size n
 * @author Dimas Miftahul Huda <dimas.mfth@gmail.com>
 */
const calculateCombination = (arr, r) => {
  const data = [];
  const result = [];
  combinationUtil(arr, data, 0, arr.length - 1, 0, r, result);
  return calculate(result);
};

const combinationUtil = (arr, data, start, end, index, r, result) => {
  if (index == r) {
    for (let j = 0; j < r; j++) {
      result.push(data[j]);
    }
  }

  let i = start;
  while (i <= end && end - i + 1 >= r - index) {
    data[index] = arr[i];
    combinationUtil(arr, data, i + 1, end, index + 1, r, result);
    i += 1;
  }
};

const calculate = (array) => {
  let sumAbs = 0;
  let divider = 0;
  for (let i = 0; i < array.length; i += 2) {
    sumAbs += Math.abs(array[i] - array[i + 1]);
    divider++;
  }
  return sumAbs / divider;
};
