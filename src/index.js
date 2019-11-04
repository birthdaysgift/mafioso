const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);

const PORT = 3000;
const STATIC_DIR = path.join(__dirname, '..', '/public');

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.urlencoded({extended: true}));
app.use(express.static(STATIC_DIR, {index: false}));

app.route('/')
    .get((req, res) => res.render('index'))
    .post((req, res) => {
        console.log(req.body.name);
        res.redirect('/');
    });

server.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});
