import http from 'http';
import {Server} from 'socket.io';
import WebSocket from 'ws';

// Create an HTTP server
const httpServer = http.createServer();

// Create a Socket.IO server
const io = new Server(httpServer, {
    cors: {
        origin: "*", // You might want to restrict this in a production environment
    }
});

// Handle connection event
io.on('connection', (socket) => {
    console.log('A client connected');

    // Handle custom events
    socket.on('customEvent', (data) => {
        console.log('Received custom event with data:', data);
    });

    // Handle disconnection event
    socket.on('disconnect', () => {
        console.log('A client disconnected');
    });

    // Handle errors
    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });
});

// Start listening on port 8080
httpServer.listen(8080, () => {
    console.log('Server is listening on port 8080');
});
