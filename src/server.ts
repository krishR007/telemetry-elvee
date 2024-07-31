import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';

// Create an HTTP server
const server = http.createServer();

// Create a WebSocket server
const wss = new WebSocketServer({server});

// Handle WebSocket connections
wss.on('connection', (ws: WebSocket) => {
    console.log('A new client connected!');

    let dataBuffer: string = '';

    ws.on('message', (data: WebSocket.RawData, isBinary: boolean) => {
        if (Buffer.isBuffer(data)) {
            const dataString = data.toString('utf-8');
            dataBuffer += dataString;

            try {
                const jsonData = JSON.parse(dataBuffer);
                console.log('Received JSON data:', jsonData);

                // Example response
                const response = { status: 'received', data: jsonData };
                ws.send(JSON.stringify(response));

                // Reset buffer after successful parsing
                dataBuffer = '';
            } catch (error) {
                console.error('Invalid JSON or waiting for more data:', error);
                // Continue accumulating data
            }
        }
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
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
