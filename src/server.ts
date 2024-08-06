import WebSocket, {WebSocketServer} from 'ws';
import http from 'http';
import * as zlib from 'zlib';

const server = http.createServer((req, res) => {
    console.log(req);
    // res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({message: 'WebSocket server is running'}));
});

const wss = new WebSocketServer({server});

wss.on('connection', (ws: WebSocket) => {
    console.log('A new client connected!');

    ws.on('message', (data: WebSocket.RawData, isBinary: boolean) => {
        console.log("rowData", data)

        if (data instanceof ArrayBuffer) console.log("Array Buffer")
        if (data instanceof Buffer) {

            const buff = Buffer.from(Buffer.from(data).toJSON().data);

            const jsonString = buff.toString();

            const originalData = JSON.parse(jsonString);
            console.log(originalData)

            // const utf16Decoder = new TextDecoder('UTF8')
            // console.log(utf16Decoder.decode(data))
            // console.log("Buffer")
            // const blob = new Blob([data], {type: 'text/plain; charset=utf-8'});
            //
            // blob.text().then(text => console.log(text));
        }
        if (Array.isArray(data)) {
            data.forEach(value => {
                const utf16Decoder = new TextDecoder('UTF8')
                console.log(utf16Decoder.decode(value))
            })
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