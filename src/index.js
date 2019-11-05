const express = require('express');
const http = require('http');
const path = require('path');
const session = require('express-session');

const app = express();
const server = http.createServer(app);

const PORT = 3000;
const STATIC_DIR = path.join(__dirname, '..', '/public');

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.urlencoded({extended: true}));
app.use(express.static(STATIC_DIR, {index: false}));
app.use(session({secret: 'keyboard cat'}));

var games = new Map(); 
var nextGameId = 0;

app.route('/')
    .get((req, res) => res.render('index'))
    .post((req, res) => {
        req.session.user = {
            name: req.body.name
        }
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
    let game = {
        "id": nextGameId++,
        "title": req.body.title,
        "host": req.session.user,
        "members": [req.session.user]
    }
    games.set(game.id, game);
    req.session.game = game;
    res.redirect('/game/');
});
app.post('/join_game/', (req, res) => {
    let game = games.get(parseInt(req.body.id));
    game.members.push(req.session.user);
    req.session.game = game;
    res.redirect('/game/');
})
app.get('/game/', (req, res) => {
    console.log(JSON.stringify(req.session.user));
    console.log(JSON.stringify(req.session.game));
    res.send('GAME');
});

server.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});
