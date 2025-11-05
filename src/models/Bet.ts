import mongoose from 'mongoose';

const BetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: String,
  betType: String,
  numbers: [Number],
  value: mongoose.Schema.Types.Mixed,
  amount: Number,
  payout: { type: Number, default: 0 },
  won: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Bet', BetSchema);
