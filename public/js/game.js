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
            let u = JSON.parse(userJSON);
            d.querySelector('ul').insertAdjacentHTML(
                'beforeend', `<li>${u.name}</li>`
            );
        });
        socket.on('user ready', (userJSON) => {
            let u = JSON.parse(userJSON);
            d.querySelector('ul').insertAdjacentHTML(
                'afterend', `<div>${u.name} READY`
            );
        });
        socket.on('everybody ready', () => {
            d.querySelector('h1').insertAdjacentHTML(
                'afterend', '<div>START</div>'
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