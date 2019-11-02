var d = document;
var socket = io();

var btn = d.querySelector('.StartButton');
btn.addEventListener('click', (e) => {
    d.querySelectorAll(
        '.NameInputFieldText, form, .StartButton, .RulesButton'
    ).forEach((elem) => elem.remove());
    d.querySelector('.Background').insertAdjacentHTML(
        'afterbegin', '<h1 style="color:#fff;">Hello, New Player!</h1>'
    );
});