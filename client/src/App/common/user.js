const storage = sessionStorage;

function stringifyUser(user) {
    let __user = {...user};
    if (user.receivedVotes !== undefined) {
        let votes_array = Array.from(user.receivedVotes);
        __user.receivedVotes = JSON.stringify(votes_array);
    }
    return JSON.stringify(__user);
}

function parseUser(user_string) {
    let user = JSON.parse(user_string);
    if (user.receivedVotes !== undefined) {
        let votes_array = JSON.parse(user.receivedVotes);
        user.receivedVotes = new Set(votes_array);
    }
    return user;
}

const user_proxy = {
    get json() { return storage.getItem('user') ?? '{}' },
    set json(user) { storage.setItem('user', user) },

    get object() {
        let user = parseUser(storage.getItem('user') ?? '{}');
        return user;
    },
    set object(user) {
        storage.setItem('user', stringifyUser(user)) 
    },
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
export { ROLE, STATE, stringifyUser, parseUser}