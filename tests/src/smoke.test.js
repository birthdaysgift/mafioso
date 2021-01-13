const { io } = require('socket.io-client');
const request = require('supertest');

describe('Testing servers', () => {

    it('Tests that static server is up and gives index.html', done => {
        let url = `http://${process.env.STATIC_HOST}:${process.env.STATIC_PORT}`;
        request(url).get('/').then(res => {
            expect(res.status).toBe(200);
            expect(res.text).toContain('<title>Mafioso</title>');
            done();
        });
    });

    it('Tests that socket server is up and can establish a connection', done => {
        let socket = io(`http://${process.env.SOCKET_HOST}:${process.env.SOCKET_PORT}`);
        socket.on('connect', () => {
            socket.disconnect();
            done();
        });
    });
});