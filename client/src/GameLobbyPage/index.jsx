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
                name: {user_proxy.object.name} <br/>
                title: {game_proxy.object.title ?? ''} <br/>
                id: {game_proxy.object.id ?? ''} <br/>
            </div>
        )
    }
}