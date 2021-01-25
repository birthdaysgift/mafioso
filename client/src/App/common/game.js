import { stringifyUser, parseUser } from './user';

const storage = sessionStorage;

const game_proxy = {
    get json() { return storage.getItem('game') ?? '{}'; },
    set json(game) { storage.setItem('game', game); },

    get object() { 
        let game = JSON.parse(storage.getItem('game') ?? '{}'); 
        if (game.members !== undefined) {
            let members_array = JSON.parse(game.members);
            game.members = new Map(members_array);
            game.members.forEach((member, key) => {
                game.members.set(key, parseUser(member));
            });
        };
        return game;
    },
    set object(game) { 
        let __game = {...game};
        if (game.members !== undefined) {
            __game.members = new Map();
            game.members.forEach(member => {
                __game.members.set(member.id, stringifyUser(member));
            });
            let members_array = Array.from(__game.members.entries());
            __game.members = JSON.stringify(members_array);
        }
        storage.setItem('game', JSON.stringify(__game)); 
    },
}

const STATE = {
    LOBBY: 'lobby',
    MEETING: 'meeting',
    SUNSET: 'sunset',
    MAFIA: 'mafia',
    DAWN: 'dawn',
    INNOCENT: 'innocent'
}

export default game_proxy;
export { STATE };