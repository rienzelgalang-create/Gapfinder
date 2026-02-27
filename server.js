require('dotenv').config(); // Load variables from .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// IMPORT ROUTES
// Points to your manager file: routes/routes.js
const apiRoutes = require('./routes/routes'); 

const app = express();
const PORT = 3000;

// MIDDLEWARE
app.use(cors());
app.use(bodyParser.json());

// SERVE STATIC FILES (MVC Setup)
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));

// DATABASE CONNECTION
// We get the link from the .env file now!
const mongoURI = process.env.MONGO_URI; 

mongoose.connect(mongoURI)
    .then(() => console.log('✅ Connected to MongoDB Successfully!'))
    .catch(err => console.error('❌ Database Connection Error:', err));

// USE ROUTES
// All API requests start with /api (e.g., /api/auth/login)
app.use('/api', apiRoutes);

// START SERVER
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});