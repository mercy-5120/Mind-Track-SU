const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets (images, logos, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the old pages directory (for images like Logo.png)
app.use(express.static(path.join(__dirname)));

// API routes can be added here
// Example: app.use('/api', require('./routes/api'));

// React app - serve from build directory
app.use(express.static(path.join(__dirname, 'build')));

// For development, serve from src/pages
// In production, this will be replaced by the build directory
app.use(express.static(path.join(__dirname, 'src')));

// SPA fallback - serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('React staff portal is now available!');
});
