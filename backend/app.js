const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const signuproutes = require('./routes/signuproutes');
const questionRoutes = require('./routes/questionRoutes');
const http = require('http');
const { Server } = require('socket.io'); 

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", 
    },
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend/public')));

mongoose.connect('mongodb://localhost:27017/quiz')
    .then(() => {
        console.log("Database connected");
        server.listen(3000, () => {
            console.log("Server is running on http://localhost:3000");
        });
    })
    .catch(err => {
        console.error("Database connection error:", err);
    });

app.use('/signinon', signuproutes);
app.use('/api/questions', questionRoutes); 
app.get('/login_page', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/login_page.html'));
});
