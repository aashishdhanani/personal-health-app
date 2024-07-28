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
  goals: { type: [goalSchema], default: [] },
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

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
