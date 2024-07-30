import WebSocket, { WebSocketServer } from 'ws';
import https from 'https';
import fs from 'fs';

// SSL certificate and key files
const options = {
    cert: fs.readFileSync('certs/0000_cert.pem'),
    key: fs.readFileSync('certs/privkey.pem'),
    ca: fs.readFileSync('certs/0001_chain.pem')
};

// Create an HTTPS server
const server = https.createServer(options, (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('WebSocket server is running with SSL\n');
});

// Create a WebSocket server
const wss = new WebSocketServer({ server });

// Handle WebSocket connections
wss.on('connection', (ws: WebSocket) => {
    console.log('A new client connected!');

    ws.on('message', (message: WebSocket.MessageEvent) => {
        console.log(`Received message => ${message}`);
        ws.send(`Server received: ${message}`);
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
