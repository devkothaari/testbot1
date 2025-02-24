const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the "public" folder
app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id);

  // Listen for typing events and broadcast them to other users
  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', { message: data });
  });

  // Listen for chat messages
  socket.on('chat message', (msg) => {
    console.log('Message from', socket.id, ':', msg);

    // Replace "whats up" with "wassup" (case-insensitive)
    const transformedMsg = msg.replace(/whats up/gi, 'wassup');

    // Broadcast the transformed message to all users
    io.emit('chat message', { sender: socket.id, message: transformedMsg });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected: ' + socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Chat server listening on port ${PORT}`);
});
