import React, { Component } from 'react';

import PageContext from '../context';
import game_proxy from '../game';
import socket from '../sockets';
import user_proxy from '../user';

import './style.less';

export default class GameLobbyPage extends Component {
    static contextType = PageContext;
    constructor(props) {
        super(props);

        this.state = {game: game_proxy.object};

        socket.on('update request', (userID, gameID) => {
            socket.emit('update response', userID, game_proxy.json);
        });
        socket.on('update', (gameJSON) => {
            game_proxy.json = gameJSON;
            this.setState({game: game_proxy.object});
        });
    }

    render () {
        return (
            <div>
                title: {this.state.game.title} <br/>
                host: {this.state.game.host.name} <br/>
                id: {this.state.game.id} <br/>
                members: {JSON.stringify(this.state.game.members, null, 4)}
            </div>
        )
    }
}