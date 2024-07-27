const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/healthDashboard');

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  steps: Number,
  waterIntake: Number,
  sleep: Number,
  goals: {
    steps: Number,
    waterIntake: Number,
    sleep: Number,
  },
});

const User = mongoose.model('User', userSchema);

app.post('/register', (req, res) => {
  const newUser = new User(req.body);
  newUser.save().then(user => res.json(user)).catch(err => res.status(400).json('Error: ' + err));
});

app.post('/login', (req, res) => {
  User.findOne({ email: req.body.email, password: req.body.password })
    .then(user => user ? res.json(user) : res.status(400).json('Error: User not found'))
    .catch(err => res.status(400).json('Error: ' + err));
});

app.post('/users/:id/goals', (req, res) => {
  User.findByIdAndUpdate(req.params.id, { goals: req.body }, { new: true })
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
});

const PORT = process.env.PORT || 5001;

const server = app.listen(0, () => {
    const port = server.address().port;
    console.log(`Server running on port ${port}`);
  });