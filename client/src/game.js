const storage = sessionStorage;

const game_proxy = {
    get json() { return storage.getItem('game') ?? '{}'; },
    set json(game) { storage.setItem('game', game); },

    get object() { return JSON.parse(storage.getItem('game') ?? '{}'); },
    set object(game) { storage.setItem('game', JSON.stringify(game)); },
}

export default game_proxy;