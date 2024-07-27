const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/healthDashboard');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  steps: { type: Number, default: 0 },
  waterIntake: { type: Number, default: 0 },
  sleep: { type: Number, default: 0 },
  goals: {
    steps: { type: Number, default: 0 },
    waterIntake: { type: Number, default: 0 },
    sleep: { type: Number, default: 0 },
  },
});

const User = mongoose.model('User', userSchema);

app.post('/register', (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const newUser = new User({ email, password });
  newUser.save()
    .then(user => res.json({ message: 'Registration successful', user }))
    .catch(err => res.status(400).json({ message: 'Error', error: err }));
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }

      // Check password
      if (user.password !== password) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      res.json({ message: 'Login successful', user });
    })
    .catch(err => res.status(400).json({ message: 'Error', error: err }));
});

app.post('/users/:id/goals', (req, res) => {
  User.findByIdAndUpdate(req.params.id, { goals: req.body }, { new: true })
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
