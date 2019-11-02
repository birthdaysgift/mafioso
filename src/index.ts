import http from 'http'
import express from 'express'
import socketio from 'socket.io'
import { Socket } from 'net';

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = 3000;

var players: Player[] = [];

class Player {
    static nextId: number = 0;

    id: number;
    name: string;

    constructor(name: string) {
        this.id = Player.nextId++;
        this.name = name;
    }

    toString() {
        return `${this.id} ${this.name}`;
    }
}

app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile('index.html'));

io.on('connection', (socket) => {
    socket.on('create player', (playerName) => {
        let p = new Player(playerName);
        players.push(p);
        console.log(`${p} connected`);
        console.log(`Players: ${players}`);
        socket.emit('created player', JSON.stringify(p));

        socket.on('disconnect', () => {
            players.splice(players.indexOf(p), 1);
            console.log(`${p} disconnected`);
            console.log(`Players: ${players}`);
        })
    })
})

server.listen(port, () => {
    console.log('Server is listening on 3000');
});