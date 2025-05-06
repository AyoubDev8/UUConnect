import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
  try {
    const { email, password, username, fullName, role } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      username,
      fullName,
      role: role || 'creator',
    });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(201).json({
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        profilePic: user.profilePic,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    if (role && user.role !== role) {
      return res.status(400).json({ error: 'Invalid credentials or role' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key');
    res.json({
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        profilePic: user.profilePic,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 