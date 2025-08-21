const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const portfolioRoutes = require('./routes/portfolio');
const stocksRoutes = require('./routes/stocks');
const userDataRoutes = require('./routes/userData');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Your React app URL (Vite default)
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/stocks', stocksRoutes);
app.use('/api/user-data', userDataRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Stocks Tracker API is running',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Stocks Tracker API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            portfolio: '/api/portfolio',
            stocks: '/api/stocks',
            userData: '/api/user-data'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: `Route ${req.method} ${req.originalUrl} not found`
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Stocks Tracker API server running on http://localhost:${PORT}`);
    console.log(`📊 Portfolio API: http://localhost:${PORT}/api/portfolio`);
    console.log(`📈 Stocks API: http://localhost:${PORT}/api/stocks`);
    console.log(`👤 User Data API: http://localhost:${PORT}/api/user-data`);
    console.log(`❤️  Health Check: http://localhost:${PORT}/api/health`);
});

module.exports = app;