const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register route
// Register
router.post('/register', async (req, res) => {
    try {
      console.log('Register request body:', req.body);
      
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password required' });
      }
      
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
  
      const user = new User({ username, password });
      await user.save();
      console.log('User saved:', user.username);
  
      const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
      
      res.status(201).json({ token, username: user.username });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

// Login Route
router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: 'Invalid username' });
      }
  
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
      
      res.json({ token, username: user.username });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  module.exports = router;