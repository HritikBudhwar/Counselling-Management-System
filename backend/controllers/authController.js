import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../config/db.js'; 

dotenv.config();

export const signup = async (req, res) => {
  try {
    const { username, email, password, role, adminKey } = req.body; // Added adminKey
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (role === "admin") {
      if (adminKey !== process.env.ADMIN_KEY) { // Check against environment variable
        return res.status(400).json({ message: "Invalid Admin Key" });
      }
    }

    const [existingUserRows] = await db.query("SELECT * FROM Users WHERE email = ?", [email]);
    if (existingUserRows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const [result] = await db.query(
      "INSERT INTO Users (username, email, password, role) VALUES (?, ?, ?, ?)",
      [username, email, hashedPassword, role]
    );

    res.status(201).json({ message: "Signup successful", user_id: result.insertId });
  } catch (err) {
    console.error("🔥 SIGNUP SERVER ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const [userRows] = await db.query("SELECT * FROM Users WHERE email = ?", [email]);
    const user = userRows[0];

    if (!user) return res.status(400).json({ message: "Invalid credentials" }); // Use generic for security

    const isMatch = await bcrypt.compare(password.trim(), user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not set in .env");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = jwt.sign(
      { user_id: user.user_id, username: user.username, role: user.role }, 
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.user_id, 
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("🔥 LOGIN SERVER ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};