const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/healthDashboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

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

app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    const user = await newUser.save();
    res.json({ message: 'Registration successful', user });
  } catch (err) {
    res.status(400).json({ message: 'Error', error: err });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', user });
  } catch (err) {
    res.status(400).json({ message: 'Error', error: err });
  }
});

app.post('/users/:id/goals', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { goals: req.body }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
