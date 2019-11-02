var d = document;
var socket = io();
var player;

var btn = d.querySelector('.StartButton');
btn.addEventListener('click', (e) => {
    let name = d.querySelector('.NameInputField').value;
    socket.emit('create player', name);
    socket.on('created player', (playerJSON) => {
        player = JSON.parse(playerJSON);
        
        d.querySelectorAll(
            '.NameInputFieldText, form, .StartButton, .RulesButton'
        ).forEach((elem) => elem.remove());
        d.querySelector('.Background').insertAdjacentHTML(
            'afterbegin', `<h1 style="color:#fff;">Hello, ${player.name}!</h1>`
        );
    });

});