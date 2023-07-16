const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const users = {};
const logs = {};

// Helper function to generate a unique ID
function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/api/users', (req, res) => {
  const { username } = req.body;
  const _id = generateUniqueId();
  const newUser = { username, _id };
  users[_id] = newUser;
  logs[_id] = [];
  res.json(newUser);
});

app.get('/api/users', (req, res) => {
  const userList = Object.values(users);
  res.json(userList);
});

app.post('/api/users/:_id/exercises', (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;
  const exerciseDate = date ? new Date(date) : new Date();
  const dateString = exerciseDate.toDateString();

  const newExercise = {
    description,
    duration: parseInt(duration),
    date: dateString,
  };

  if (!_id || !users[_id]) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  logs[_id].push(newExercise);
  res.json({
    username: users[_id].username,
    _id,
    ...newExercise,
  });
});

app.get('/api/users/:_id/logs', (req, res) => {
  const { _id } = req.params;
  const user = users[_id];
  if (!user) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  const userLogs = logs[_id] || [];
  const count = userLogs.length;

  // Optional query parameters: from, to, limit
  const { from, to, limit } = req.query;
  let filteredLogs = userLogs;

  if (from) {
    const fromDate = new Date(from);
    filteredLogs = filteredLogs.filter((exercise) => new Date(exercise.date) >= fromDate);
  }

  if (to) {
    const toDate = new Date(to);
    filteredLogs = filteredLogs.filter((exercise) => new Date(exercise.date) <= toDate);
  }

  if (limit) {
    const logLimit = parseInt(limit);
    filteredLogs = filteredLogs.slice(0, logLimit);
  }

  res.json({
    username: user.username,
    _id,
    count,
    log: filteredLogs,
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
