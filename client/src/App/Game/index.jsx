import React, { Component } from 'react';
import { RoutingContext } from '../common/Router';
import game_proxy from '../common/game';
import user_proxy from '../common/user';
import socket from '../common/socket';

import { HostLobby, Lobby } from './Lobby';
import Meeting from './Meeting';
import Night from './Night';

export default class Game extends Component {
    static contextType = RoutingContext;

    constructor(props) {
        super(props);
        this.state = {game: game_proxy.object, user: user_proxy.object};

        socket.on('update', (gameJSON) => {
            game_proxy.json = gameJSON;
            user_proxy.object = game_proxy.object.members.find(
                m => m.id === user_proxy.object.id
            );
            this.setState({game: game_proxy.object, user: user_proxy.object});
        });

        socket.on('user disconnected', (userID, gameID) => {
            if (userID === user_proxy.object.id 
                    || userID === game_proxy.object.host.id) {
                game_proxy.object = {};
                this.context.setRoute(['menu', 'new']);
            } else {
                let game = game_proxy.object;
                let index = game.members.findIndex((m) => m.id === userID);
                if ( index === -1) return; 
                game.members.splice(index, 1)
                game_proxy.object = game;
                this.setState({game: game});
            }
        });
    }

    componentWillUnmount() {
        socket.removeAllListeners('update');
        socket.removeAllListeners('user disconnected');
    }

    render() {
        switch(this.state.game.state) {
            case STATE.LOBBY: 
                if (this.state.user.id === this.state.game.host.id) {
                    return <HostLobby game={this.state.game}/>;
                } else {
                    return <Lobby game={this.state.game}/>
                }
            case STATE.MEETING: return <Meeting game={this.state.game} user={this.state.user}/>
            case STATE.NIGHT: return <Night/>
        }
    }
}

const STATE = {
    LOBBY: 'lobby',
    MEETING: 'meeting',
    NIGHT: 'night'
}

export { STATE };