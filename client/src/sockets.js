import { io } from 'socket.io-client';

function initSockets() {
    const url = `http://${SOCKET_HOST}:${SOCKET_PORT}`
    const socket = io(url);

    socket.on('connect', () => console.log(`Socket connected to ${url}`));
    socket.on('disconnect', () => console.log(`Socket disconnected from ${url}`));
};

export default {init: initSockets};