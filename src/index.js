const express = require('express');
const http = require('http');
const path = require('path');
const session = require('express-session');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = 3000;
const STATIC_DIR = path.join(__dirname, '..', '/public');

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.urlencoded({extended: true}));
app.use(express.static(STATIC_DIR, {index: false}));
app.use(session({secret: 'keyboard cat'}));

var users = new Map();
var games = new Map(); 
var gameSockets = new Map();
var userSockets = new Map();

function socketBindings(serverSocket, clientSocket) {
    let u, g;
    clientSocket.on('new member', (data) => {
        u = users.get(data.userId);
        g = games.get(data.gameId);
        g.addMember(u);
        userSockets.set(u.id, clientSocket);
        serverSocket.emit('new member', JSON.stringify(u));
    });
    clientSocket.on('disconnect', () => {
        clientSocket.broadcast.emit(
            'user disconnected', JSON.stringify(u)
        );
        g.removeMember(u);
        users.delete(u.id);
        userSockets.delete(u.id);
        if (g.everyUserStateIs(User.STATES.READY)) {
            let hostSocket = userSockets.get(g.host.id);
            hostSocket.emit('everybody ready');
        }
    });
    clientSocket.on('user ready', () => {
        u.state = User.STATES.READY;
        serverSocket.emit('user ready', JSON.stringify(u));
        if (g.everyUserStateIs(User.STATES.READY)) {
            let hostSocket = userSockets.get(g.host.id);
            hostSocket.emit('everybody ready');
        }
    });
    clientSocket.on('user not ready', () => {
        u.state = User.STATES.NOT_READY;
        serverSocket.emit('user not ready', JSON.stringify(u));
    });
    clientSocket.on('start game', () => {
        let max = g.members.length - 1;
        let n = Math.floor(Math.random() * Math.floor(max));
        g.members[n].role = User.ROLES.MAFIA;
        g.state = Game.STATES.DAY;
        serverSocket.emit('start game', JSON.stringify(g));
    });
    clientSocket.on('ready for night', () => {
        u.state = User.STATES.WAITS_FOR_NIGHT;
        serverSocket.emit('ready for night', JSON.stringify(u));
        if (g.everyUserStateIs(User.STATES.WAITS_FOR_NIGHT)) {
            let hostSocket = userSockets.get(g.host.id);
            hostSocket.emit('everybody ready for night', JSON.stringify(g));
        };
    });
}

class User {
    constructor(name) {
        this.name = name;
        this.id = User.nextId++;
        this.state = User.STATES.NOT_READY;
        this.role = User.ROLES.INNOCENT;
    }

    isReady() {
        return this.state === User.STATES.READY;
    }

    toString() {
        return `${this.id} ${this.name}`
    }

    toJSON() {
        let newobj = {};
        newobj = Object.assign(newobj, this);
        newobj.STATES = User.STATES;
        newobj.ROLES = User.ROLES;
        return newobj;
    }
}
User.nextId = 0;
User.STATES = {
    NOT_READY: 'not ready',
    READY: 'ready',
    WAITS_FOR_NIGHT: 'waits for night'
}
User.ROLES = {
    INNOCENT: 'innocent',
    MAFIA: 'mafia',
    DETECTIVE: 'detective'
}


class Game {
    constructor(title, host) {
        this.title = title;
        this.host = host;
        this.id = Game.nextId++;
        this.members = [];
        this.state = Game.STATES.NOT_STARTED;

        let socket = io.of(`/${this.id}-game`);
        socket.on('connection', (sock) => socketBindings(socket, sock));
        gameSockets.set(this.id, socket);
    }

    everyUserStateIs(state) {
        if (this.members.length) {
            return this.members.every(
                (m) => (m.state === state)
            );
        }
        return false;
    }

    addMember(user) {
        this.members.push(user);
    }
    
    removeMember(user) {
        let i = this.members.indexOf(user);
        this.members.splice(i, 1);
    }

    getMember(userId) {
        return this.members.filter((m) => m.id === userId)[0];
    }

    toString () {
        return `${this.id} ${this.title}`
    }

    toJSON() {
        let newobj = {};
        newobj = Object.assign(newobj, this);
        newobj.STATES = Game.STATES;
        return newobj;
    }
}
Game.nextId = 0;
Game.STATES = {
    NOT_STARTED: 'not started',
    DAY: 'day',
    NIGHT: 'night'
}

app.route('/')
    .get((req, res) => res.render('index'))
    .post((req, res) => {
        let u = new User(req.body.name);
        users.set(u.id, u);
        req.session.user = u;
        res.redirect('/new_game/');
    });
app.route('/new_game/')
    .get((req, res) => {
        let name = req.session.user
            ? req.session.user.name
            : 'Anonymous'
        res.render('new_game', {name: name});
    });
app.post('/create_game/', (req, res) => {
    let u = users.get(req.session.user.id);
    let g = new Game(req.body.title, u);
    games.set(g.id, g);
    req.session.game = g;
    res.redirect('/game/');
});
app.post('/join_game/', (req, res) => {
    let g = games.get(parseInt(req.body.id));
    req.session.game = g;
    res.redirect('/game/');
})
app.get('/game/', (req, res) => {
    res.render('game', {
        game: req.session.game,
        user: req.session.user
    });
});
app.get('/whatishappening/', (req, res) => {
    res.send({
        user: users.get(req.session.user.id),
        game: games.get(req.session.game.id),
        STATES: {
            USER: User.STATES,
            GAME: Game.STATES
        }
    });
})

server.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});
