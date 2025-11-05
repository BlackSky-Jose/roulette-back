import { numbers } from './roulette';

export type BetType =
  | 'straight' | 'split' | 'street' | 'corner' | 'line'
  | 'column' | 'dozen' | 'red' | 'black' | 'odd' | 'even' | 'high' | 'low';

const allNumbers = new Set(numbers);
const MIN_BET = 1;
const MAX_BET = 10000;

export interface BetInput {
  betType: BetType;
  value?: number | number[] | null;
  numbers?: number[];
  amount: number;
}

export function validateBet(bet: BetInput) {
  if (!bet || !bet.betType) return { valid: false, error: 'Missing betType' };
  if (typeof bet.amount !== 'number' || bet.amount < MIN_BET || bet.amount > MAX_BET) return { valid: false, error: `Bet must be between ${MIN_BET} and ${MAX_BET}` };

  if (bet.betType === 'straight') {
    const v = typeof bet.value === 'number' ? bet.value : (bet.numbers && bet.numbers[0]);
    if (typeof v !== 'number' || !allNumbers.has(v)) return { valid: false, error: 'Invalid straight number' };
  }

  if (['split','street','corner','line'].includes(bet.betType)) {
    const arr = Array.isArray(bet.value) ? bet.value : bet.numbers;
    if (!Array.isArray(arr)) return { valid: false, error: 'This bet requires an array of numbers' };
    const lenMap: any = { split: 2, street:3, corner:4, line:6 };
    if (arr.length !== lenMap[bet.betType]) return { valid: false, error: `Invalid number count for ${bet.betType}` };
    if (!arr.every(n=>allNumbers.has(n))) return { valid:false, error: 'Invalid numbers in array' };
  }

  if (bet.betType === 'column') {
    const v = Number(bet.value);
    if (![1,2,3].includes(v)) return { valid:false, error: 'Column must be 1,2,3' };
  }

  if (bet.betType === 'dozen') {
    const v = Number(bet.value);
    if (![1,2,3].includes(v)) return { valid:false, error: 'Dozen must be 1,2,3' };
  }
console.log("---------------");
  if (['red','black','odd','even','high','low'].includes(bet.betType)) {
    if (bet.value !== undefined && bet.value !== null) {
      return { valid:false, error: 'This bet type does not require a value' };
    }
  }

  return { valid: true };
}
