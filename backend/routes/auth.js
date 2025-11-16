import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { users } from '../store/index.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      username,
      passwordHash
    };

    users.push(newUser);

    const token = jwt.sign(
      { userId: newUser.id, username: newUser.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({ token, userId: newUser.id, username: newUser.username });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({ token, userId: user.id, username: user.username });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;

