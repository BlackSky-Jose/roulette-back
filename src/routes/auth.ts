import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, useremail, password } = req.body;
  
  if ( username === "" || useremail === "" || password === "") return res.status(400).json({message: "You must fill the form"})
    
    const existingname = await User.findOne({ username });
    if (existingname) return res.status(400).json({ message: "Username already exists" });
    
    const existingemail = await User.findOne({ useremail });
    if (existingemail) return res.status(400).json({ message: "Useremail already exists" });
    
    if (password.length < 6 || password.length > 30) return res.status(400).json({message: "password must between 6 and 30 characters"})

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, useremail, password: hashed });
    await user.save();
    
    res.json({ message: "User registered successfully" });
  });
  
  router.post("/login", async (req, res) => {
  const { useremail, password } = req.body;
  try {
  const user = await User.findOne({ useremail });
  if (!user) return res.status(400).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Incorrect password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });

  res.json({ token, username: user.username, useremail:user.useremail, balance: user.balance });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
