let createBtn = document.querySelector('.CreateButton');
createBtn.addEventListener('click', (e) => {
    document.querySelector('.CreateForm').submit();
});

let joinBtn = document.querySelector('.JoinButton');
joinBtn.addEventListener('click', (e) => {
    document.querySelector('.JoinForm').submit();
});