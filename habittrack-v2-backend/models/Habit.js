const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    completedDates: [{
        type: Date
    }]
}, { timestamps: true });

module.exports = mongoose.model('Habit', habitSchema);