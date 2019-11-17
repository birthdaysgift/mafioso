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

var gameStatesGenerator = function* () {
    yield Game.STATES.LOBBY;
    yield Game.STATES.MEETING;
    while (true) {
        yield Game.STATES.NIGHT;
        yield Game.STATES.DAY;
    }
};

function socketBindings(serverSocket, clientSocket) {
    let u, g;
    clientSocket.on('new member', (userId, gameId) => {
        u = users.get(userId);
        g = games.get(gameId);
        g.members.push(u);
        userSockets.set(u.id, clientSocket);
        serverSocket.emit(
            'new member',
            JSON.stringify(u),
            JSON.stringify(g)
        );
    });
    clientSocket.on('disconnect', () => {
        g.removeMember(u);
        users.delete(u.id);
        userSockets.delete(u.id);
        clientSocket.broadcast.emit(
            'user disconnected',
            JSON.stringify(u),
            JSON.stringify(g)
        );
        if (g.everyUserStateIs(User.STATES.READY)) {
            let hostSocket = userSockets.get(g.host.id);
            hostSocket.emit('everybody ready');
        }
    });
    clientSocket.on('user ready', () => {
        u.state = User.STATES.READY;
        serverSocket.emit(
            'user ready',
            JSON.stringify(u),
            JSON.stringify(g)
        );
        if (g.everyUserStateIs(User.STATES.READY)) {
            let hostSocket = userSockets.get(g.host.id);
            hostSocket.emit('everybody ready');
        }
    });
    clientSocket.on('user not ready', () => {
        u.state = User.STATES.NOT_READY;
        serverSocket.emit(
            'user not ready', 
            JSON.stringify(u),
            JSON.stringify(g)
        );
    });
    clientSocket.on('mafia votes', (innocentId) => {
        let inno = users.get(parseInt(innocentId));
        inno.votes.push(u);
        g.members.forEach(m => {
            let s = userSockets.get(m.id);
            s.emit(
                'mafia votes', 
                JSON.stringify(u), 
                JSON.stringify(inno),
                JSON.stringify(g)
            );
        });
        let mafs = g.members.filter(
            m => m.role === User.ROLES.MAFIA
        );
        if (inno.votes.length === mafs.length) {
            inno.state = User.STATES.DEAD;
            serverSocket.emit(
                'mafia kills',
                JSON.stringify(inno), 
                JSON.stringify(g)
            );
        }
    });
    clientSocket.on('mafia unvotes', (innocentId) => {
        let inno = users.get(parseInt(innocentId));
        let i = inno.votes.indexOf(u);
        inno.votes.splice(i, 1);
        g.members.forEach(m => {
            let s = userSockets.get(m.id);
            s.emit(
                'mafia unvotes', 
                JSON.stringify(u), 
                JSON.stringify(inno),
                JSON.stringify(g)
            );
        });
    });
    clientSocket.on('innocent votes', (suspectId) => {
        u.voted = true;
        let sus = users.get(parseInt(suspectId));
        sus.votes.push({
            id: u.id,
            name: u.name
        });
        g.members.forEach(m => {
            let s = userSockets.get(m.id);
            s.emit(
                'innocent votes',
                JSON.stringify(u),
                JSON.stringify(sus),
                JSON.stringify(g)
            )
        });
        let notDead = g.members.filter(m =>
            m.state !== User.STATES.DEAD);
        if(notDead.every(m => m.voted)) {
            console.log('everybody voted');
            let maxVoted = g.members.sort((m1, m2) => {
                if (m1.votes.length < m2.votes.length)
                    return 1;
                if (m1.votes.length === m2.votes.length)
                    return 0;
                return -1;
            })[0];
            maxVoted.state = User.STATES.DEAD;
            serverSocket.emit(
                'innocent kills',
                JSON.stringify(maxVoted), 
                JSON.stringify(g)
            );
        }
    });
    clientSocket.on('innocent unvotes', (suspectId) => {
        u.voted = true;
        let sus = users.get(parseInt(suspectId));
        let i = sus.votes.indexOf({
            id: u.id,
            name: u.name
        });
        sus.votes.splice(i, 1);
        g.members.forEach(m => {
            let s = userSockets.get(m.id);
            s.emit(
                'innocent unvotes',
                JSON.stringify(u),
                JSON.stringify(sus),
                JSON.stringify(g)
            )
        });
    });
    clientSocket.on('next game state', () => {
        g.setNextState();
        switch (g.state) {
            case Game.STATES.MEETING: {
                let max = g.members.length - 1;
                let n = Math.floor(Math.random() * Math.floor(max));
                g.members[n].role = User.ROLES.MAFIA;
                g.members.forEach((m) => {
                    m.state = User.STATES.NOT_READY;
                    let s = userSockets.get(m.id);
                    s.emit(
                        'next game state',
                        JSON.stringify(m),
                        JSON.stringify(g)
                    );
                });
                break;
            }
            case Game.STATES.NIGHT: {
                g.members.forEach(m => {
                    let s = userSockets.get(m.id);
                    s.emit(
                        'next game state',
                        JSON.stringify(m),
                        JSON.stringify(g)
                    );
                });
                break;
            }
            case Game.STATES.DAY: {
                g.members.forEach(m => {
                    m.votes = [];
                    if (m.state !== User.STATES.DEAD) {
                        m.state = User.STATES.NOT_READY;
                    }
                    let s = userSockets.get(m.id);
                    s.emit(
                        'next game state',
                        JSON.stringify(m),
                        JSON.stringify(g)
                    );
                });
                break;
            }
        }
    });
}

class User {
    constructor(name) {
        this.name = name;
        this.id = User.nextId++;
        this.state = User.STATES.NOT_READY;
        this.role = User.ROLES.INNOCENT;
        this.votes = [];
        this.voted = false;
    }

    toString() {
        return `${this.id} ${this.name}`
    }
}
User.nextId = 0;
User.STATES = {
    NOT_READY: 'not ready',
    READY: 'ready',
    DEAD: 'dead'
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
        this._statesGenerator = gameStatesGenerator();
        this.state = this._statesGenerator.next().value;

        let socket = io.of(`/${this.id}-game`);
        socket.on('connection', (sock) => socketBindings(socket, sock));
        gameSockets.set(this.id, socket);
    }

    setNextState() {
        this.state = this._statesGenerator.next().value;
    }

    everyUserStateIs(state) {
        if (this.members.length) {
            return this.members.every(
                (m) => (m.state === state)
            );
        }
        return false;
    }

    removeMember(user) {
        let i = this.members.indexOf(user);
        this.members.splice(i, 1);
    }

    toString () {
        return `${this.id} ${this.title}`
    }
}
Game.nextId = 0;
Game.STATES = {
    LOBBY: 'lobby',
    MEETING: 'meeting',
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
        },
        ROLES: User.ROLES
    });
})

server.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});
