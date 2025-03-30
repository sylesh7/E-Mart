const express = require('express');
const app = express();
const apiRoutes = require('./routes/api');

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" folder
app.use(express.static('public'));

// Route for API endpoints
app.use('/api', apiRoutes);

// Serve the Sign-Up page as a GET request
app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/public/signup.html');
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
