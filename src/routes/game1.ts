import express from "express";
import auth from "../middleware/auth";
import User from "../models/User";
import { spinRoulette, calculatePayout } from "../utils/payouts";
import { resolveBet } from "../utils/resolveBet";

const router = express.Router();

router.post("/spin", auth, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { bets } = req.body; // array of bets [{type, value, amount}]

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const totalBet = bets.reduce((sum: number, b: any) => sum + b.amount, 0);
    if (user.balance < totalBet)
      return res.status(400).json({ message: "Insufficient balance" });

    // Spin the wheel
    const result = spinRoulette();

    // Calculate total payout
    let totalWin = 0;
    bets.forEach((bet: any) => {
      totalWin += calculatePayout(bet, result);
    });

    // Update balance
    user.balance = user.balance - totalBet + totalWin;
    await user.save();

    res.json({
      result,
      totalBet,
      totalWin,
      newBalance: user.balance,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
