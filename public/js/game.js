var user;
var game;

axios.get('/whatishappening/')
    .then((response) => {
        user = response.data.user;
        game = response.data.game;
        console.log(JSON.stringify(user, null, 4));
        console.log(JSON.stringify(game, null, 4));
    });
