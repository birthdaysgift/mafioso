d = document;
var user;
var game;
var socket;

axios.get('/whatishappening/')
    .then((response) => {
        user = response.data.user;
        game = response.data.game;
        socket = io(
            `/${game.id}-${game.title}`.replace(' ', '-')
        );
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
    });

let btn = d.querySelector('h1')
btn.addEventListener('click', () => {
    socket.emit('user ready', JSON.stringify(user));
})