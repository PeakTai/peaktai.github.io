export function splitArrayToTwoDimensional<T>(arr: T[], size: number): T[][] {
  const finalSize = Math.floor(size);
  if (isNaN(finalSize) || finalSize <= 0) {
    throw new Error('size 必须是大于等于1的整数');
  }
  const twoDimensionalArr: T[][] = [];
  let i = 0;
  while (true) {
    let end = i + finalSize;
    if (end > arr.length) {
      end = arr.length;
    }
    const element: T[] = arr.slice(i, end);
    twoDimensionalArr.push(element);
    i = end;
    if (i >= arr.length) {
      break;
    }
  }
  return twoDimensionalArr;
}
