// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Set up the database
const db = new sqlite3.Database(':memory:');
db.serialize(() => {
    db.run("CREATE TABLE members (id INTEGER PRIMARY KEY, position TEXT, fullName TEXT, printName TEXT, selectedNumber INTEGER UNIQUE)");
});

// Serve static files
app.use(express.static('public'));

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Render the main page
app.get('/', (req, res) => {
    db.all("SELECT * FROM members", (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).send("Database error");
        } else {
            res.render('index', { members: rows });
        }
    });
});

// Handle Socket.io connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // When a new member submits their details and selects a number
    socket.on('selectNumber', (data) => {
        db.run("INSERT INTO members (position, fullName, printName, selectedNumber) VALUES (?, ?, ?, ?)", [data.position, data.fullName, data.printName, data.selectedNumber], function(err) {
            if (err) {
                console.error(err);
                socket.emit('error', 'Number already taken');
            } else {
                // Broadcast the updated list of members to all clients
                db.all("SELECT * FROM members", (err, rows) => {
                    io.emit('updateNumbers', rows);
                });
            }
        });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
