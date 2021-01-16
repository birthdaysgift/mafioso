import React, { Component } from 'react';

import PageContext from '../context';

import './style.less';

export default class GameLobbyPage extends Component {
    static contextType = PageContext;

    render () {
        return (
            <div>
                name: {sessionStorage.getItem('name')} <br/>
                game_title: {sessionStorage.getItem('game_title')} <br/>
                game_id: {sessionStorage.getItem('game_id')} <br/>
            </div>
        )
    }
}