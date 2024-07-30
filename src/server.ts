import WebSocket, {WebSocketServer} from 'ws';
import http from 'http';

// Create an HTTP server
const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({message: 'WebSocket server is running'}));
});

// Create a WebSocket server
const wss = new WebSocketServer({server});

// Function to decode binary data
function decodeBinaryData(buffer: any) {
    let offset = 0;

    // Read a 32-bit integer (4 bytes)
    const int32 = buffer.readInt32BE(offset);
    offset += 4;

    // Read a 64-bit float (8 bytes)
    const float64 = buffer.readDoubleBE(offset);
    offset += 8;

    // Read the remaining bytes as a UTF-8 encoded string
    const string = buffer.toString('utf8', offset);

    return {
        int32,
        float64,
        string
    };
}

// Handle WebSocket connections
wss.on('connection', (ws: WebSocket) => {
    console.log('A new client connected!');

    ws.on('message', (message: WebSocket.Data) => {
        if (typeof message === 'string') {
            // Handle text message
            try {
                const data = JSON.parse(message);
                console.log(`Received message => ${JSON.stringify(data)}`);

                const response = {message: `Server received: ${data}`};
                ws.send(JSON.stringify(response));
            } catch (error) {
                console.error('Error parsing JSON:', error);
                ws.send(JSON.stringify({error: 'Invalid JSON'}));
            }
        } else if (message instanceof Buffer) {
            // Handle binary message
            console.log('Received binary message');
            const decodedData = decodeBinaryData(message);
            console.log(`Decoded data => ${JSON.stringify(decodedData)}`);

            // Send an acknowledgment to the client with the decoded data
            ws.send(JSON.stringify({message: 'Server received binary data', data: decodedData}));
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
