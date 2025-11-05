const express = require('express');
const studentsRouter = require('./routes/students');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to SMP Technical Test API' });
});

app.use('/students', studentsRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;
