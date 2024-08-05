import * as https from 'http';
import WebSocket from 'ws';

// Define your configuration object
const config = {
    port: 8080
};

const server = https.createServer();

const wss = new WebSocket.Server({
    server, verifyClient: (info, cb) => {
        const origin = info.origin;
        // Validate origin here
        cb(true);
    }
});

wss.on('connection', (ws: WebSocket) => {
    console.log('New WebSocket connection');

    // Handle incoming messages
    ws.on('message', (message: string) => {
        console.log(`Received message: ${message}`);
        // Echo message back to the client
        ws.send(`Received: ${message}`);
    });

    // Handle connection close
    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });
});

server.listen(config.port, () => {
    console.log(`Server is listening on https://localhost:${config.port}`);
});
