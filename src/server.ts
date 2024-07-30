import fs from 'fs';
import https from 'https';
import WebSocket, {WebSocketServer} from 'ws';

// Paths to your SSL certificate and key
const keyPath = '/etc/letsencrypt/live/telemetry.elvee.app/privkey.pem';
const certPath = '/etc/letsencrypt/live/telemetry.elvee.app/fullchain.pem';

// Read SSL certificate and key with error handling
let privateKey: string;
let certificate: string;
console.log(fs.readFileSync(keyPath, 'utf8'));
console.log(fs.readFileSync(certPath, 'utf8'));
try {
    privateKey = fs.readFileSync(keyPath, 'utf8');
    certificate = fs.readFileSync(certPath, 'utf8');
} catch (err) {
    console.error('Error reading SSL certificate or key:', err);
    process.exit(1);
}

const credentials = {key: privateKey, cert: certificate};

// Create an HTTPS server
const server = https.createServer(credentials, (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('WebSocket server is running over HTTPS\n');
});

// Create a WebSocket server
const wss = new WebSocketServer({server});

// Handle WebSocket connections
wss.on('connection', (ws: WebSocket) => {
    console.log('A new client connected!');

    ws.on('message', (message: WebSocket.RawData) => {
        const messageStr = message.toString();
        console.log(`Received message => ${messageStr}`);
        ws.send(`Server received: ${messageStr}`);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.on('error', (err) => {
        console.error('WebSocket error:', err);
    });
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
