import http from 'http'
import express from 'express'
import socketio from 'socket.io'

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile('index.html'));

io.on('connection', (socket) => {
    console.log('Somebody connected');

    socket.on('disconnect', () => {
        console.log('Somebody disconnected');
    })
})

server.listen(port, () => {
    console.log('Server is listening on 3000');
});