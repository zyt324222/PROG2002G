const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./event_db');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// === 静态资源目录 ===
app.use(express.static(path.join(__dirname, '../usernameA2-clientside')));

// Test database connection
db.testConnection();

// =================== API Routes ===================

// Get homepage event list - all active upcoming events
app.get('/api/events', async (req, res) => {
    try {
        res.set({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });

        const events = await db.getUpcomingEvents();
        res.json({
            success: true,
            data: events,
            message: 'Successfully fetched event list',
            count: events.length
        });
    } catch (error) {
        console.error('Error fetching event list:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch event list',
            error: error.message
        });
    }
});

// Search events
app.get('/api/events/search', async (req, res) => {
    try {
        res.set({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });

        const { date, location, category_id, category } = req.query;
        const filters = {};

        if (date) filters.date = date;
        if (location) filters.location = location;

        // Support both 'category' and 'category_id'
        const categoryValue = category_id || category;
        if (categoryValue) filters.category_id = parseInt(categoryValue);

        console.log('Search filters:', filters);

        const events = await db.searchEvents(filters);

        console.log(`Found ${events.length} events`);

        res.json({
            success: true,
            data: events,
            message: 'Search completed',
            filters: filters,
            count: events.length
        });
    } catch (error) {
        console.error('Error searching events:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search events',
            error: error.message
        });
    }
});

// Get specific event details
app.get('/api/events/:id', async (req, res) => {
    try {
        const eventId = parseInt(req.params.id);
        if (isNaN(eventId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid event ID'
            });
        }

        const event = await db.getEventById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.json({
            success: true,
            data: event,
            message: 'Successfully fetched event details'
        });
    } catch (error) {
        console.error('Error fetching event details:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch event details',
            error: error.message
        });
    }
});

// Get all event categories
app.get('/api/categories', async (req, res) => {
    try {
        res.set({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });

        const categories = await db.getCategories();
        res.json({
            success: true,
            data: categories,
            message: 'Successfully fetched categories',
            count: categories.length
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories',
            error: error.message
        });
    }
});

// Get all organisations
app.get('/api/organisations', async (req, res) => {
    try {
        const organisations = await db.getOrganisations();
        res.json({
            success: true,
            data: organisations,
            message: 'Successfully fetched organisations'
        });
    } catch (error) {
        console.error('Error fetching organisations:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch organisations',
            error: error.message
        });
    }
});

// =================== 前端页面路由 ===================

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../usernameA2-clientside', 'index.html'));
});

app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, '../usernameA2-clientside', 'search.html'));
});

app.get('/event', (req, res) => {
    res.sendFile(path.join(__dirname, '../usernameA2-clientside', 'event.html'));
});

app.get('/auth', (req, res) => {
    res.sendFile(path.join(__dirname, '../usernameA2-clientside', 'auth.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Requested resource not found'
    });
});

// Error handler middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
    });
});

// =================== 启动服务 ===================
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
    console.log('API endpoints:');
    console.log('- GET /api/events - Get all active upcoming events');
    console.log('- GET /api/events/search - Search events');
    console.log('- GET /api/events/:id - Get specific event details');
    console.log('- GET /api/categories - Get all categories');
    console.log('- GET /api/organisations - Get all organisations');
});
