import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';

// Create an HTTP server
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'WebSocket server is running' }));
});

// Create a WebSocket server
const wss = new WebSocketServer({ server });

// Handle WebSocket connections
wss.on('connection', (ws: WebSocket) => {
    console.log('A new client connected!');

    ws.on('message', (message: string) => {
        try {
            const data = JSON.parse(message);
            console.log(`Received message => ${JSON.stringify(data)}`);

            const response = { message: `Server received: ${data}` };
            ws.send(JSON.stringify(response));
        } catch (error) {
            console.error('Error parsing JSON:', error);
            ws.send(JSON.stringify({ error: 'Invalid JSON' }));
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Start the server
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
