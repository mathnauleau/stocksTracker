// backend/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 5173;

// Enable CORS and JSON parsing
app.use(cors());
app.use(bodyParser.json());

// Set up SQLite DB
const db = new sqlite3.Database('./data.db');

// Create a table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT
  )
`);

// Route to add an entry
app.post('/entries', (req, res) => {
  const { content } = req.body;
  db.run(`INSERT INTO entries (content) VALUES (?)`, [content], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, content });
  });
});

// Route to get all entries
app.get('/entries', (req, res) => {
  db.all(`SELECT * FROM entries`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});