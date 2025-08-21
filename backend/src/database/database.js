const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Database file path
const DB_PATH = path.join(__dirname, '../../stocks.db');

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database at:', DB_PATH);
        initializeDatabase();
    }
});

// Initialize database with schema
function initializeDatabase() {
    const schemaPath = path.join(__dirname, 'init.sql');
    
    try {
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        // Execute schema
        db.exec(schema, (err) => {
            if (err) {
                console.error('Error initializing database:', err.message);
            } else {
                console.log('Database initialized successfully');
            }
        });
    } catch (err) {
        console.error('Error reading schema file:', err.message);
    }
}

// Helper function to run queries with promises
function runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ id: this.lastID, changes: this.changes });
            }
        });
    });
}

// Helper function to get single row
function getOne(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

// Helper function to get multiple rows
function getAll(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
});

module.exports = {
    db,
    runQuery,
    getOne,
    getAll
};