import React, { Component } from 'react';

import PageContext from '../context';
import game_proxy from '../game';
import user_proxy from '../user';

import './style.less';

export default class GameLobbyPage extends Component {
    static contextType = PageContext;

    render () {
        return (
            <div>
                title: {game_proxy.object.title} <br/>
                host: {game_proxy.object.host.name} <br/>
                id: {game_proxy.object.id} <br/>
                members: {JSON.stringify(game_proxy.object.members, null, 4)}
            </div>
        )
    }
}