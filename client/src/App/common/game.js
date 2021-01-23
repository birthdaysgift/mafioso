const storage = sessionStorage;

const game_proxy = {
    get json() { return storage.getItem('game') ?? '{}'; },
    set json(game) { storage.setItem('game', game); },

    get object() { 
        let game = JSON.parse(storage.getItem('game') ?? '{}'); 
        if (game.members !== undefined) {
            game.members = new Map(JSON.parse(game.members));
        };
        return game;
    },
    set object(game) { 
        let __game = {...game};
        if (game.members !== undefined) {
            __game.members = JSON.stringify(Array.from(game.members.entries()));
        }
        storage.setItem('game', JSON.stringify(__game)); 
    },
}

const STATE = {
    LOBBY: 'lobby',
    MEETING: 'meeting',
    NIGHT: 'night',
    MAFIA: 'mafia'
}

export default game_proxy;
export { STATE };