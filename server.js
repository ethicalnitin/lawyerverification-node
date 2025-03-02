require('dotenv').config();
const express = require('express');
const verificationRoute = require('./routes/verification');

const app = express();

// Middleware for parsing JSON
app.use(express.json());


// Use the verification route
app.use('/api/verify', verificationRoute);

// Serve static files (our simple frontend)
app.use(express.static('public'));

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
