import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  useremail: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 10000 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
