const socketServer = require('./sockets.js')

const PORT = process.env.SOCKET_PORT;

socketServer.listen(PORT,
    () => console.log(`Socket server is listening on ${PORT}`));