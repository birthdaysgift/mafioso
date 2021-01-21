import React, { Component } from 'react';
import game_proxy from '../common/game';
import socket from '../common/sockets';

import Lobby from './Lobby';

export default class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {game: game_proxy.object};

        socket.on('update', (gameJSON) => {
            console.log('updated');
            console.log(gameJSON);
            game_proxy.json = gameJSON;
            this.setState({game: game_proxy.object});
        });
    }

    render() {
        switch(this.state.game.state) {
            case STATE.LOBBY: return <Lobby game={this.state.game}/>;
        }
    }
}

const STATE = {
    LOBBY: 'lobby',
}

export { STATE };