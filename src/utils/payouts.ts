interface Bet {
  type: string;
  value: string | number;
  amount: number;
}

interface SpinResult {
  number: number;
  color: "red" | "black" | "green";
}

export const getColor = (number: number): "red" | "black" | "green" => {
  if (number === 0) return "green";
  const redNumbers = [
    1, 3, 5, 7, 9, 12, 14, 16, 18,
    19, 21, 23, 25, 27, 30, 32, 34, 36
  ];
  return redNumbers.includes(number) ? "red" : "black";
};

export const spinRoulette = (): SpinResult => {
  const number = Math.floor(Math.random() * 37); // 0–36
  return { number, color: getColor(number) };
};

export const calculatePayout = (bet: Bet, result: SpinResult): number => {
  const { number, color } = result;
  let win = false;
  let payout = 0;

  switch (bet.type) {
    case "color":
      if (bet.value === color) win = true;
      payout = win ? bet.amount * 2 : 0;
      break;

    case "odd_even":
      if (number !== 0) {
        const parity = number % 2 === 0 ? "even" : "odd";
        if (bet.value === parity) win = true;
      }
      payout = win ? bet.amount * 2 : 0;
      break;

    case "range":
      if (bet.value === "1-18" && number >= 1 && number <= 18) win = true;
      if (bet.value === "19-36" && number >= 19 && number <= 36) win = true;
      payout = win ? bet.amount * 2 : 0;
      break;

    case "dozen":
      if (bet.value === "1st12" && number >= 1 && number <= 12) win = true;
      if (bet.value === "2nd12" && number >= 13 && number <= 24) win = true;
      if (bet.value === "3rd12" && number >= 25 && number <= 36) win = true;
      payout = win ? bet.amount * 3 : 0;
      break;

    case "number":
      if (bet.value === number) win = true;
      payout = win ? bet.amount * 36 : 0;
      break;

    default:
      payout = 0;
  }

  return payout;
};
