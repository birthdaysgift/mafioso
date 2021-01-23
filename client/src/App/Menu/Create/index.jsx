import React, { Component } from 'react';

import Button from '../../common/Button';
import InputForm from '../../common/InputForm';
import Title from '../Title';
import { STATE as GAME_STATE } from '../../common/game';
import { RoutingContext } from '../../common/Router';
import game_proxy from '../../common/game';
import user_proxy from '../../common/user';
import socket from '../../common/socket';

import './style.less';

export default class Create extends Component {
    static contextType = RoutingContext;

    constructor(props) {
        super(props);

        socket.on('create response', (userID, gameID) => {
            let user = user_proxy.object;
            let game = game_proxy.object;
            game.id = gameID;
            game.host = user;
            game.members = [user];
            game.state = GAME_STATE.LOBBY;
            game_proxy.object = game;

            this.context.setRoute(['game']);
        });
    }

    componentWillUnmount = () => socket.removeAllListeners('create response');

    handleChange = (e) => {
        let game = game_proxy.object;
        game.title = e.input.value;
        game_proxy.object = game;
    }

    handleSubmit = () => socket.emit('create request', user_proxy.object.id);

    render() {
        return (
            <div id='create'>
                <Title/>
                <InputForm
                    text='Create'
                    value={game_proxy.object.title || ''}
                    placeholder='Enter game title'
                    onChange={this.handleChange}
                    onSubmit={this.handleSubmit}/>
                <Button text='Back' onClick={() => this.context.setRoute(['menu', 'new'])}/>
            </div>
        )
    }
}