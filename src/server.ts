import * as fs from 'fs';
import * as https from 'https';
import * as WebSocket from 'ws';
import {IncomingMessage} from 'http';
import {TLSSocket} from 'tls'; // Import TLSSocket from 'tls'

// Paths to your certificates
const serverKey = fs.readFileSync('/etc/letsencrypt/live/telemetry.elvee.app/privkey.pem');
const serverCert = fs.readFileSync('/etc/letsencrypt/live/telemetry.elvee.app/cert.pem');
console.log(serverCert)
console.log(serverKey)
// HTTPS server options
const serverOptions = {
    key: serverKey,
    cert: serverCert,
    requestCert: true, // Request client certificates
    rejectUnauthorized: true, // Reject unauthorized clients
};

// Create an HTTPS server
const httpsServer = https.createServer(serverOptions, (req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
});

// Create a WebSocket server that uses the HTTPS server
const wss = new WebSocket.Server({server: httpsServer});

wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
    // Cast the socket to TLSSocket
    const tlsSocket = req.socket as TLSSocket;

    // Check if the client provided a certificate
    const clientCert = tlsSocket.getPeerCertificate();

    if (!clientCert || !clientCert.subject) {
        ws.close();
        console.error('Client certificate is required.');
        return;
    }

    console.log('Client connected');

    ws.on('message', (message: WebSocket.MessageEvent) => {
        console.log(`Received message: ${message}`);
    });

    ws.send('Hello from server');
});

// Start the HTTPS server
httpsServer.listen(8080, () => {
    console.log('WebSocket server is running on wss://localhost:8080');
});
