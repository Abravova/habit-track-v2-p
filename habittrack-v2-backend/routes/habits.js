const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Habit = require('../models/Habit');

//Middleware to verify token
const auth = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Get all habits for logged-in user
router.get('/', auth, async (req, res) => {
    try {
      console.log('Fetching habits for user:', req.userId);
      const habits = await Habit.find({ userId: req.userId });
      console.log('Found habits:', habits);
      res.json(habits);
    } catch (error) {
      console.error('Error fetching habits:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

//Create a new habit
router.post('/', auth, async(req, res) => {
    try {
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const habit = new Habit({
            userId: req.userId,
            title
        });

        await habit.save();
        res.status(201).json(habit);
    } catch (error) {
        res.status(500).json({ message: 'Server error'});
    }
});

/// Mark habit as complete for today (with optional image)
router.post('/:id/complete', auth, async (req, res) => {
    try {
      const { imageUrl } = req.body; // Image URL comes from frontend after upload
      
      const habit = await Habit.findOne({ _id: req.params.id, userId: req.userId });
      
      if (!habit) {
        return res.status(404).json({ message: 'Habit not found' });
      }
  
      // Get today's date at midnight
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      // Check if already completed today
      const alreadyCompleted = habit.completions?.some(completion => {
        const completedDate = new Date(completion.date);
        completedDate.setHours(0, 0, 0, 0);
        return completedDate.getTime() === today.getTime();
      });
  
      if (alreadyCompleted) {
        return res.status(400).json({ message: 'Already completed today' });
      }
  
      // Add completion with optional image
      if (!habit.completions) {
        habit.completions = [];
      }
      
      habit.completions.push({
        date: today,
        imageUrl: imageUrl || null
      });
  
      await habit.save();
      res.json(habit);
    } catch (error) {
      console.error('Error completing habit:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

// Delete a habit
router.delete('/:id', auth, async (req, res) => {
    try {
        const habit = await Habit.findOne({ _id: req.params.id, userId: req.userId });

        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        await Habit.deleteOne({ _id: req.params.id });
        res.json({ message: 'Habit deleted' });
    } catch (error) {
        res.status(500).json({ message : 'Server error' });
    }
});

module.exports = router;