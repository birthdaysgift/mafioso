d = document;
var userId;
var gameId;
var socket;

axios.get('/whatishappening/')
    .then((response) => {
        userId = response.data.userId;
        gameId = response.data.gameId;
        socket = io(`/${gameId}-game`);
        socket.on('new member', (userJSON) => {
            console.log('new member');
            let u = JSON.parse(userJSON);
            d.querySelector('ul').insertAdjacentHTML(
                'beforeend', `<li>${u.name}</li>`
            );
        });
        socket.on('user ready', (data) => {
            d.querySelector('ul').insertAdjacentHTML(
                'afterend', `<div>${data.userId} READY`
            );
        });
    });

let btn = d.querySelector('h1')
btn.addEventListener('click', () => {
    socket.emit('user ready', {
        userId: userId,
        gameId: gameId
    });
})