const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);

const PORT = 3000;
const STATIC_DIR = path.join(__dirname, '..', '/public');

app.use(express.static(STATIC_DIR, {index: false}));

app.get('/', (req, res) => {
    res.sendFile('index.html', {root: STATIC_DIR});
});

server.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});
