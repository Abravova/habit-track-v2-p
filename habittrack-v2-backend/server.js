const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const habitRoutes = require('./routes/habits');

const app = express();
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});