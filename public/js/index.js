var d = document;
var socket = io();
var player;

var btn = d.querySelector('.StartButton');
btn.addEventListener('click', (e) => {
    let name = d.querySelector('.NameInputField').value;
    socket.emit('create player', name);
    socket.on('created player', (playerJSON) => {
        player = JSON.parse(playerJSON);
        axios.get('/new_game/')
            .then((response) => {
                d.querySelector('form').remove();
                d.querySelector('.Background').insertAdjacentHTML(
                    'afterbegin', response.data
                );
                d.querySelector('h1').innerHTML = `Hello, ${player.name}!`;
            })
            .catch((error) => {
                console.log(error);
            })
    });
});