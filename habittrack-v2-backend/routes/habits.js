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

//get all the habits for logged in users
router.get('/', auth, async(req, res) => {
    try {
        const habits = await Habit.find({ userId: req.userId });
        res.json(habits);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
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

// Mark a habit as completed for today
router.post('/:id/complete', auth, async (req, res) => {
    try {
        const habit = await Habit.findOne({ _id: req.params.id, userId: req.userId });

        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const alreadyCompleted = habit.completedDates.some(date => {
            const completedDate = new Date(date);
            completedDate.setHours(0, 0, 0, 0);
            return completedDate.getTime() === today.getTime();
        });

        if (alreadyCompleted) {
            return res.status(400).json({ message: 'Already completed today' });
        }

        //Add todays date
        habit.completedDates.push(today);
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