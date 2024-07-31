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

    ws.on('message', (data: WebSocket.RawData, isBinary: boolean) => {
        if (isBinary) {
            const buffer = data as Buffer;

            // Example: Read data from the buffer
            // Assuming we have some knowledge about the data structure

            try {
                // Read 32-bit unsigned integer at offset 0
                const intVal = buffer.readUInt32LE(0);
                console.log(`32-bit unsigned integer: ${intVal}`);

                // Read 16-bit unsigned integer at offset 4
                const shortVal = buffer.readUInt16LE(4);
                console.log(`16-bit unsigned integer: ${shortVal}`);

                // Read 32-bit float at offset 6
                const floatVal = buffer.readFloatLE(6);
                console.log(`32-bit float: ${floatVal}`);

                // Read 64-bit double at offset 10
                const doubleVal = buffer.readDoubleLE(10);
                console.log(`64-bit double: ${doubleVal}`);

                // Example of parsing a string if it's included
                // Reading up to 10 bytes as a string (assuming null-terminated)
                const strVal = buffer.toString('utf8', 18, 28).trim(); // Adjust offsets as needed
                console.log(`String: ${strVal}`);

            } catch (error) {
                console.error('Error reading buffer:', error);
            }
        } else {
            console.log('Received text data');
            console.log(`Hello -> ${data.toString()}`);
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
