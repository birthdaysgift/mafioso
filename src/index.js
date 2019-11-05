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

var games = new Map(); 
var gameSockets = new Map();

class User {
    constructor(name) {
        this.name = name;
        this.id = User.nextId++;
    }

    toString() {
        return `${this.id} ${this.name}`
    }
}
User.nextId = 0;


class Game {
    constructor(title, host) {
        this.title = title;
        this.host = host;
        this.id = Game.nextId++;
        this.members = [host];

        let socket = io.of(
            `/${this.id}-${this.title}`.replace(' ', '-')
        );
        socket.on('connection', (sock) => {
            console.log('Somebody connected');
            sock.on('user ready', (userJSON) => {
                socket.emit('user ready', userJSON);
            });
        });
        gameSockets.set(this.id, socket);
    }

    addMember(user) {
        this.members.push(user);
        gameSockets.get(this.id).emit(
            'new member', JSON.stringify(user)
        );
    }

    toString () {
        return `${this.id} ${this.title}`
    }
}
Game.nextId = 0;

app.route('/')
    .get((req, res) => res.render('index'))
    .post((req, res) => {
        req.session.user = new User(req.body.name);
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
    let g = new Game(req.body.title, req.session.user);
    games.set(g.id, g);
    req.session.game = g;
    res.redirect('/game/');
});
app.post('/join_game/', (req, res) => {
    let g = games.get(parseInt(req.body.id));
    g.addMember(req.session.user);
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
        user: req.session.user,
        game: req.session.game
    });
})

server.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});
