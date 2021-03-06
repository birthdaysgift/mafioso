import React, { Component } from 'react';
import { RoutingContext } from '../common/Router';
import game_proxy, { STATE } from '../common/game';
import user_proxy from '../common/user';
import socket from '../common/socket';

import Lobby from './Lobby';
import InnocentWin from './common/InnocentWin';
import MafiaWin from './common/MafiaWin';
import Sunset from './Sunset';
import Innocent from './Innocent';
import Meeting from './Meeting';
import Dawn from './Dawn';
import Mafia from './Mafia';

export default class Game extends Component {
    static contextType = RoutingContext;

    constructor(props) {
        super(props);
        this.state = {game: game_proxy.object, user: user_proxy.object};

        socket.on('update', (gameJSON) => {
            game_proxy.json = gameJSON;
            user_proxy.object = game_proxy.object.members.get(user_proxy.object.id)
            this.setState({game: game_proxy.object, user: user_proxy.object});
        });

        socket.on('user disconnected', (userID, gameID) => {
            if (userID === user_proxy.object.id 
                    || userID === game_proxy.object.hostID) {
                game_proxy.object = {};
                this.context.setRoute(['menu', 'new']);
            } else {
                let game = game_proxy.object;
                game.members.delete(userID);
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
        if (this.state.game.mafiaAlive === 0) {
            game_proxy.object = {};
            return <InnocentWin 
                        hostID={this.state.game.hostID} 
                        userID={this.state.user.id}/>;
        }
        if (this.state.game.innocentAlive === 0) {
            game_proxy.object = {};
            return <MafiaWin 
                        hostID={this.state.game.hostID} 
                        userID={this.state.user.id}/>;
        } 

        switch(this.state.game.state) {
            case STATE.LOBBY: return <Lobby game={this.state.game} user={this.state.user}/>
            case STATE.MEETING: return <Meeting game={this.state.game} user={this.state.user}/>
            case STATE.SUNSET: return <Sunset game={this.state.game} user={this.state.user}/>
            case STATE.MAFIA: return <Mafia game={this.state.game} user={this.state.user}/>
            case STATE.DAWN: return <Dawn game={this.state.game} user={this.state.user}/>
            case STATE.INNOCENT: return <Innocent game={this.state.game} user={this.state.user}/>
        }
    }
}