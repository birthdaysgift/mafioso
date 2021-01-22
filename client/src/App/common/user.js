const storage = sessionStorage;

const user_proxy = {
    get json() { return storage.getItem('user') ?? '{}' },
    set json(user) { storage.setItem('user', user) },

    get object() { return JSON.parse(storage.getItem('user') ?? '{}') },
    set object(user) { storage.setItem('user', JSON.stringify(user)) },
}

const ROLE = {
    MAFIA: 'mafia',
    INNOCENT: 'innocent'
}

const STATE = {
    READY: 'ready',
    NOT_READY: 'not ready'
}

export default user_proxy;
export { ROLE, STATE }