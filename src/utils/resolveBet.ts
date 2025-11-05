import { isRed, isBlack, isOdd, isEven, isHigh, isLow } from './roulette';
import type { BetType } from '../types/BetTypes';

export interface BetInput {
  betType: BetType;
  value?: number | number[] | null;
  numbers?: number[];
  amount: number;
}

export const spinRoulette = (): number => {
  const number = Math.floor(Math.random() * 37); // 0–36
  return  number;
};

export function getMultiplier(betType: string) {
  switch (betType) {
    case 'straight': return 35;
    case 'split': return 17;
    case 'street': return 11;
    case 'corner': return 8;
    case 'line': return 5;
    case 'column':
    case 'dozen': return 2;
    case 'red':
    case 'black':
    case 'odd':
    case 'even':
    case 'high':
    case 'low': return 1;
    default: return 0;
  }
}

export function resolveBet(bet: BetInput, result: { number: number, color: string, column: number, dozen: number }) {
  const { number, column, dozen } = result;
  let won = false;
  const type = bet.betType;
  const betAmount = bet.amount;

  // Debug logging
  console.log(`Resolving bet: type=${type}, value=${JSON.stringify(bet.value)}, result=${number}, column=${column}, dozen=${dozen}`);

  if (type === 'straight') {
    const v = typeof bet.value === 'number' ? bet.value : (bet.numbers && bet.numbers[0]);
    won = v === number;
  } else if (['split', 'street', 'corner', 'line'].includes(type)) {
    const arr = Array.isArray(bet.value) ? bet.value : bet.numbers;
    won = Array.isArray(arr) && arr.includes(number);
  } else if (type === 'column') {
    const betColumn = typeof bet.value === 'number' ? bet.value : Number(bet.value);
    won = column === betColumn;
    console.log(`Column check: betColumn=${betColumn}, resultColumn=${column}, won=${won}`);
  } else if (type === 'dozen') {
    const betDozen = typeof bet.value === 'number' ? bet.value : Number(bet.value);
    won = dozen === betDozen;
    console.log(`Dozen check: betDozen=${betDozen}, resultDozen=${dozen}, won=${won}`);
  } else if (type === 'red') {
    won = isRed(number);
  } else if (type === 'black') {
    won = isBlack(number);
  } else if (type === 'odd') {
    won = isOdd(number);
  } else if (type === 'even') {
    won = isEven(number);
  } else if (type === 'high') {
    won = isHigh(number);
  } else if (type === 'low') {
    won = isLow(number);
  }

  console.log(`Bet resolution: type=${type}, won=${won}, betAmount=${betAmount}`);

  // Calculate payout based on new rules
  let payout = 0;
  
  if (won) {
    console.log(`Calculating WIN payout for type=${type}`);
    // Win scenarios
    if (['red', 'black', 'odd', 'even', 'high', 'low'].includes(type)) {
      // Rule 1: Win = (1/18) * bet + bet = bet * 19/18
      payout = betAmount * (1 + 1/18);
    } else if (['column', 'dozen'].includes(type)) {
      // Rule 2: Win = (1/12) * bet + bet = bet * 13/12
      payout = betAmount * (1 + 1/12);
    } else if (type === 'split') {
      // Rule 3: Win = 2 * bet
      payout = betAmount * 2;
    } else if (type === 'corner') {
      // Rule 4: Win = (1/4) * bet + bet = bet * 5/4
      payout = betAmount * (1 + 1/4);
    } else if (type === 'line') {
      // Rule 5: Win = (1/6) * bet + bet = bet * 7/6
      payout = betAmount * (1 + 1/6);
    } else if (type === 'straight') {
      // Keep existing straight payout (35x)
      payout = betAmount * 36;
    } else if (type === 'street') {
      // Street (3 numbers) - keep similar to existing or use a reasonable payout
      payout = betAmount * 12; // 11x + stake
    }
  } else {
    console.log(`Calculating LOSE refund for type=${type}`);
    // Lose scenarios - partial refund
    if (['red', 'black', 'odd', 'even', 'high', 'low'].includes(type)) {
      // Rule 1: Lose only 1/5, refund 4/5
      payout = betAmount * (4/5);
    } else if (['column', 'dozen'].includes(type)) {
      // Rule 2: Lose only 1/3, refund 2/3
      payout = betAmount * (2/3);
    } else if (type === 'split') {
      // Rule 3: Lose all money
      payout = 0;
    } else if (type === 'corner') {
      // Rule 4: Lose 1/3, refund 2/3
      payout = betAmount * (2/3);
    } else if (type === 'line') {
      // Rule 5: Lose 1/5, refund 4/5
      payout = betAmount * (4/5);
    } else {
      // For straight and street, lose all if not won
      payout = 0;
    }
  }

  console.log(`Final payout: ${payout}, won: ${won}`);
  return { won, payout, multiplier: 0 }; // multiplier not used in new system
}
