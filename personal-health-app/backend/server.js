const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const cron = require('node-cron');


const app = express();
app.use(bodyParser.json());
app.use(cors());



mongoose.connect('mongodb://localhost:27017/healthDashboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const goalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  typeOfGoal: { type: String, required: true },
  dueDate: { type: Date, required: true },
  completed: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  steps: { type: Number, default: 0 },
  waterIntake: { type: Number, default: 0 },
  sleep: { type: Number, default: 0 },
  calories: { type: Number, default: 0 },
  goals: { type: [goalSchema], default: [] },
  lastReset: { type: Date, default: new Date() },
});

const User = mongoose.model('User', userSchema);
module.exports = { User };
require('./cronjob');

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

app.post('/add-goal', async (req, res) => {
  const { email, title, description, typeOfGoal, dueDate, completed } = req.body;

  // Input validation (optional but recommended)
  if (!email || !title || !description || !typeOfGoal || !dueDate) {
    console.log('Missing fields in request body');
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`User with email ${email} not found`);
      return res.status(404).json({ error: 'User not found' });
    }

    // Create new goal
    const newGoal = {
      title,
      description,
      typeOfGoal,
      dueDate,
      completed: completed || false,
    };

    // Add the new goal to the user's goals array
    user.goals.push(newGoal);

    // Save the updated user document
    await user.save();

    // Send success response
    res.status(200).json({ message: 'Goal added successfully', goals: user.goals });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/goals/update-goal', async (req, res) => {
  const { email, _id, title, description, typeOfGoal, dueDate, completed } = req.body;

  if (!email || !_id || !title || !description || !typeOfGoal || !dueDate) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const goal = user.goals.id(_id);

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    goal.title = title;
    goal.description = description;
    goal.typeOfGoal = typeOfGoal;
    goal.dueDate = dueDate;
    goal.completed = completed;

    await user.save();

    res.status(200).json({ message: 'Goal updated successfully', goals: user.goals });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 4 endpoints for water intake, sleep, steps, and calories
app.post('/water', async (req, res) => {
  const { email, waterIntake } = req.body;

  // Validate input
  if (!email || !waterIntake) {
    return res.status(400).json({ message: 'Email and water intake are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const today = new Date().toISOString().split('T')[0];
    if (user.lastReset.toISOString().split('T')[0] !== today) {
      user.steps = 0;
      user.waterIntake = 0;
      user.sleep = 0;
      user.calories = 0;
      user.lastReset = new Date();
    }

    user.waterIntake = waterIntake;

    await user.save();

    res.status(200).json({ message: 'Water intake updated successfully', waterIntake: user.waterIntake });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/steps', async (req, res) => {
  const { email, steps } = req.body;

  // Validate input
  if (!email || !steps) {
    return res.status(400).json({ message: 'Email and steps are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const today = new Date().toISOString().split('T')[0];
    if (user.lastReset.toISOString().split('T')[0] !== today) {
      user.steps = 0;
      user.waterIntake = 0;
      user.sleep = 0;
      user.calories = 0;
      user.lastReset = new Date();
    }

    user.steps = steps;

    await user.save();

    res.status(200).json({ message: 'Steps updated successfully', steps: user.steps });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/sleep', async (req, res) => {
  const { email, sleep } = req.body;

  // Validate input
  if (!email || !sleep) {
    return res.status(400).json({ message: 'Email and sleep are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const today = new Date().toISOString().split('T')[0];
    if (user.lastReset.toISOString().split('T')[0] !== today) {
      user.steps = 0;
      user.waterIntake = 0;
      user.sleep = 0;
      user.calories = 0;
      user.lastReset = new Date();
    }

    user.sleep = sleep;

    await user.save();

    res.status(200).json({ message: 'Sleep updated successfully', sleep: user.sleep });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/calories', async (req, res) => {
  const { email, calories } = req.body;

  // Validate input
  if (!email || !calories) {
    return res.status(400).json({ message: 'Email and calories are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const today = new Date().toISOString().split('T')[0];
    if (user.lastReset.toISOString().split('T')[0] !== today) {
      user.steps = 0;
      user.waterIntake = 0;
      user.sleep = 0;
      user.calories = 0;
      user.lastReset = new Date();
    }

    user.calories = calories;

    await user.save();

    res.status(200).json({ message: 'Calories updated successfully', calories: user.calories });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});



const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
