import * as WebSocket from 'ws';
import * as https from 'https';
import * as fs from 'node:fs';
import * as path from 'node:path';

// Load the CA certificate
const ca = fs.readFileSync('/home/ubuntu/telemetry/certs/0001_chain.pem');

// Create an HTTPS agent with the CA certificate
const agent = new https.Agent({
    ca: ca,
});

// WebSocket URL
const wsUrl = 'wss://telemetry.elvee.app';

// Create WebSocket client with custom agent
const ws = new WebSocket(wsUrl, {
    agent: agent,
});

// Event listener for connection open
ws.on('open', () => {
    console.log('Connected to WebSocket server');
    // Send a message to the server
    ws.send('Hello from client');
});

// Event listener for receiving messages
ws.on('message', (data) => {
    console.log('Received message:', data.toString());
});

// Event listener for errors
ws.on('error', (error) => {
    console.error('WebSocket error:', error);
});

// Event listener for connection close
ws.on('close', () => {
    console.log('Connection closed');
});
