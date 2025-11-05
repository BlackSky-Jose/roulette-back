export const numbers = [
  0,32,15,19,4,21,2,25,17,34,6,
  27,13,36,11,30,8,23,10,5,24,
  16,33,1,20,14,31,9,22,18,29,
  7,28,12,35,3,26
];

export const redNumbers = new Set([
  32,19,21,25,34,27,36,30,23,5,
  16,1,14,9,18,7,12,3
]);

export function isRed(n: number) { return redNumbers.has(n); }
export function isBlack(n: number) { return n !== 0 && !isRed(n); }
export function isOdd(n: number) { return n !== 0 && (n % 2 === 1); }
export function isEven(n: number) { return n !== 0 && (n % 2 === 0); }
export function isHigh(n: number) { return n >= 19 && n <= 36; }
export function isLow(n: number) { return n >= 1 && n <= 18; }

export function spinRoulette() {
  const idx = Math.floor(Math.random() * numbers.length);
  const number = numbers[idx];
  const color = number === 0 ? 'green' : isRed(number) ? 'red' : 'black';
  const column = number === 0 ? 0 : ((number - 1) % 3) + 1; // 1|2|3
  // Dozen: 1 (1-12), 2 (13-24), 3 (25-36)
  let dozen = 0;
  if (number > 0) {
    if (number <= 12) dozen = 1;
    else if (number <= 24) dozen = 2;
    else dozen = 3;
  }
  return { number, color, column, dozen };
}
