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
    completions: [{
      date: {
        type: Date,
        required: true
      },
      imageUrl: {
        type: String
      }
    }]
  }, { timestamps: true });

module.exports = mongoose.model('Habit', habitSchema);