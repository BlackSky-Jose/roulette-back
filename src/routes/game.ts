import express from "express";
import auth from "../middleware/auth";
import User from "../models/User";
import BetModel from '../models/Bet';
import GameRound from '../models/GameRound';
// import { validateBet } from '../utils/validateBet';
// import { spinRoulette, calculatePayout } from "../utils/payouts";
import { spinRoulette } from '../utils/roulette';
import { resolveBet } from "../utils/resolveBet";

const router = express.Router();

router.get("/balance", auth, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ balance: user.balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/spin", auth, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { bets } = req.body; // array of bets [{type, value, amount}]

    if (!Array.isArray(bets) || bets.length === 0) return res.status(400).json({ error: 'No bets' });

    // validate
    // for (const b of bets) {
    //   const v = validateBet(b);
    //   if (!v.valid) return res.status(400).json({ error: v.error });
    // }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const totalBet = bets.reduce((sum: number, b: any) => sum + b.amount, 0);
    if (user.balance < totalBet)
      return res.status(400).json({ message: "Insufficient balance" });

    // deduct
    user.balance -= totalBet;
    await user.save();

    // Spin the wheel
    const result = spinRoulette();

    // resolve bets - map 'type' to 'betType' for resolveBet function
    console.log('Spinning with bets:', JSON.stringify(bets));
    console.log('Spin result:', JSON.stringify(result));
    
    const resolved = bets.map(b => {
      const betForResolution = {
        betType: b.type, // map 'type' to 'betType'
        value: b.value,
        amount: b.amount
      };
      const resolution = resolveBet(betForResolution, result);
      console.log(`Bet resolved:`, { original: b, resolution });
      return { ...b, ...resolution };
    });
    const totalPayout = resolved.reduce((s, r) => s + r.payout, 0);
    
    console.log(`Total bet: ${totalBet}, Total payout: ${totalPayout}`);
    console.log(`Balance before: ${user.balance}`);

    // add winnings (totalPayout includes stake if won, or partial refund if lost)
    user.balance += totalPayout;
    await user.save();
    
    console.log(`Balance after: ${user.balance}`);

    await BetModel.insertMany(resolved.map(r => ({ ...r, userId })));
    const round = new GameRound({
      roundId: Date.now().toString(),
      winningNumber: result.number,
      color: result.color,
      column: result.column,
      dozen: result.dozen,
      totalBet,
      totalPayout,
      bets: resolved.map(r => ({ userId, ...r }))
    });
    await round.save();

    return res.json({
      success: true,
      result,
      resolved,
      totalBet,
      totalPayout,
      newBalance: user.balance,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
