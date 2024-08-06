import WebSocket, {WebSocketServer} from 'ws';
import http from 'http';

const server = http.createServer((req, res) => {
    console.log(req);
    // res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({message: 'WebSocket server is running'}));
});

const wss = new WebSocketServer({server});

function decodeBinaryMessage(buffer: Buffer): void {
    // Example structure: 4 bytes (uint32), 2 bytes (uint16), 1 byte (uint8)
    const firstField = buffer.readUInt32LE(0); // Read 4 bytes from offset 0
    const secondField = buffer.readUInt16LE(4); // Read 2 bytes from offset 4
    const thirdField = buffer.readUInt8(6); // Read 1 byte from offset 6

    // Assuming more fields if necessary, adjust the offsets accordingly

    // Print the decoded values
    console.log('First Field:', firstField);
    console.log('Second Field:', secondField);
    console.log('Third Field:', thirdField);

    // Add more decoding logic based on your data structure
}

wss.on('connection', (ws: WebSocket) => {
    console.log('A new client connected!');

    ws.on('message', (data: WebSocket.RawData, isBinary: boolean) => {
        if (data instanceof ArrayBuffer) {
            console.log("ArrayBuffer Type")
            const view = new DataView(data);
            console.log(view.getInt32(0));
        } else {
            // text frame
            console.log(data);
        }
        // if (isBinary) {
        //     const enc = new TextDecoder("utf-8");
        //     const arr = new Uint8Array(data);
        //     console.log(data);
        //     console.log(isBinary);
        //     console.log(arr);
        //     console.log(enc.decode(arr));
        // } else {
        //     console.log("Not binary")
        // }
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
