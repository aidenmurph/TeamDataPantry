// Import dependencies
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { getAllComposers, createComposer, updateComposer, deleteComposer } from './controllers/composers-controller.mjs';
import 'dotenv/config';

// Configure Middleware
const app = express();
const port = process.env.PORT || 8134;

app.use(cors());
app.use(bodyParser.json());

// Test endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Composers API' });
});

// ROUTE HANDLING **********************************************
// Composers
app.get('/api/composers', getAllComposers);
app.post('/api/composers', createComposer);
app.put('/api/composers/:id', updateComposer);
app.delete('/api/composers/:id', deleteComposer);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});