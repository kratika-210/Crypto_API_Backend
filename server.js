const express = require('express');
const app = express();
const mongoose = require('mongoose');
const fetchData = require('./tasks/fetchData'); // Import the data fetching function
const cleanupData = require('./tasks/cleanupData'); // Import the cleanup function

require('dotenv').config();
const dbURI = process.env.dbURI; 

// Database connection URI from environment variables
mongoose.connect(dbURI)
    .then(() => console.log("Database connected"))
    .catch(err => console.log("Error connecting to the database:", err));

// Set up middleware
app.use('/api', require('./routes/api')); // Use the API routes
app.use(express.json()); // Enable JSON parsing for requests

// Start the background job for fetching data
fetchData();

// Start the server
const PORT = 5010;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Default route
app.get('/', (req, res) => {
    res.send('Hello to the crypto page');
});
