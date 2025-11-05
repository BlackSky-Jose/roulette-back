import mongoose from 'mongoose';

const GameRoundSchema = new mongoose.Schema({
  roundId: { type: String, required: true, unique: true },
  winningNumber: Number,
  color: String,
  column: Number,
  dozen: Number,
  totalBet: Number,
  totalPayout: Number,
  bets: [Object],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('GameRound', GameRoundSchema);
