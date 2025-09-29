const mysql = require('mysql2/promise');
require('dotenv').config();

// Create database connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'charityevents_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Database connection successful');
        connection.release();
    } catch (error) {
        console.error('Database connection failed:', error.message);
    }
}

// Get all active upcoming events
async function getUpcomingEvents() {
    const query = `
        SELECT 
            e.id, e.name, e.description, e.full_description, e.event_date, 
            e.location, e.ticket_price, e.goal_amount, e.current_amount,
            e.max_attendees, e.current_attendees, e.image_url, e.status,
            c.name as category_name,
            o.name as organization_name
        FROM events e
        LEFT JOIN categories c ON e.category_id = c.id
        LEFT JOIN organisations o ON e.organisation_id = o.id
        WHERE e.status = 'active'
        ORDER BY e.event_date ASC
    `;
    
    console.log('Homepage query:', query);
    
    const [rows] = await pool.execute(query);
    console.log('Homepage results count:', rows.length);
    
    return rows;
}

// Search events with filters
async function searchEvents(filters) {
    let query = `
        SELECT 
            e.id, e.name, e.description, e.full_description, e.event_date, 
            e.location, e.ticket_price, e.goal_amount, e.current_amount,
            e.max_attendees, e.current_attendees, e.image_url, e.status,
            c.name as category_name,
            o.name as organization_name
        FROM events e
        LEFT JOIN categories c ON e.category_id = c.id
        LEFT JOIN organisations o ON e.organisation_id = o.id
        WHERE e.status = 'active'
    `;
    
    const params = [];
    
    if (filters.date) {
        query += ' AND DATE(e.event_date) = ?';
        params.push(filters.date);
    }
    
    if (filters.location) {
        query += ' AND e.location LIKE ?';
        params.push(`%${filters.location}%`);
    }
    
    if (filters.category_id) {
        query += ' AND e.category_id = ?';
        params.push(filters.category_id);
    }
    
    query += ' ORDER BY e.event_date ASC';
    
    console.log('Search query:', query);
    console.log('Search params:', params);
    
    const [rows] = await pool.execute(query, params);
    console.log('Search results count:', rows.length);
    
    return rows;
}

// Get a specific event by ID
async function getEventById(id) {
    const query = `
        SELECT 
            e.*, 
            c.name as category_name,
            o.name as organization_name,
            o.description as organization_description,
            o.contact_email, o.contact_phone, o.website
        FROM events e
        LEFT JOIN categories c ON e.category_id = c.id
        LEFT JOIN organisations o ON e.organisation_id = o.id
        WHERE e.id = ?
    `;
    
    const [rows] = await pool.execute(query, [id]);
    return rows.length > 0 ? rows[0] : null;
}

// Get all event categories
async function getCategories() {
    const query = 'SELECT * FROM categories ORDER BY name';
    const [rows] = await pool.execute(query);
    return rows;
}

// Get all organisations
async function getOrganisations() {
    const query = 'SELECT * FROM organisations ORDER BY name';
    const [rows] = await pool.execute(query);
    return rows;
}

module.exports = {
    testConnection,
    getUpcomingEvents,
    searchEvents,
    getEventById,
    getCategories,
    getOrganisations
};
