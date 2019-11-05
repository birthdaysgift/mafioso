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
    });