// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = process.env.PORT || 8134;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Test endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Composers API' });
});

// Read all composers
app.get('/api/composers', async (req, res) => {
  try {
    const rows = await db.getAllComposers();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching composers');
  }
});

// Create a new composer
app.post('/api/composers', async (req, res) => {
  try {
    const result = await db.createComposer(req.body);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating composer');
  }
});

// Update a composer
app.put('/api/composers/:id', async (req, res) => {
  try {
    const result = await db.updateComposer(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating composer');
  }
});

// Delete a composer
app.delete('/api/composers/:id', async (req, res) => {
  try {
    const result = await db.deleteComposer(req.params.id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting composer');
  }
});

// Start the server
app.listen(port, () => {
console.log(`Server running on port ${port}`);
});

