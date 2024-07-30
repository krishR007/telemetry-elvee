import fs from 'fs';
import https from 'https';
import WebSocket, { WebSocketServer } from 'ws';

// Paths to your SSL certificate and key
const keyPath = '/etc/letsencrypt/live/telemetry.elvee.app/privkey.pem';
const certPath = '/etc/letsencrypt/live/telemetry.elvee.app/fullchain.pem';

// Read SSL certificate and key
const privateKey = fs.readFileSync(keyPath, 'utf8');
const certificate = fs.readFileSync(certPath, 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Create an HTTPS server
const server = https.createServer(credentials, (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('WebSocket server is running over HTTPS\n');
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

// Start the server on port 443
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
