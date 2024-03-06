const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'tdp/build')));

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'tdp/build', 'index.html'));
});

const port = process.env.PORT || 8446;
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});