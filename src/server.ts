import WebSocket, {WebSocketServer} from 'ws';
import http from 'http';

// Create an HTTP server
const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({message: 'WebSocket server is running'}));
});

// Create a WebSocket server
const wss = new WebSocketServer({server});

// Handle WebSocket connections
wss.on('connection', (ws: WebSocket) => {
    console.log('A new client connected!');

    ws.on('message', (message: WebSocket.Data) => {
        if (typeof message === 'string') {
            console.log(`Received message => ${message}`);

            ws.send(message);

        } else if (message instanceof Buffer) {
            var base64data = Buffer.from(message).toString('base64');
            console.log(base64data);
            var originaldata = Buffer.from(base64data, 'base64');
            console.log(originaldata);
            console.log(originaldata.toString());
            ws.send(message);
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
