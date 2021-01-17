import React, { Component } from 'react';

import Button from '../Button';
import InputForm from '../InputForm';
import Title from '../Title';
import PageContext from '../context';
import game_proxy from '../game';
import user_proxy from '../user';
import socket from '../sockets';

import './style.less';

export default class CreateGamePage extends Component {
    static contextType = PageContext;

    handleChange = (e) => {
        let game = game_proxy.object;
        game.title = e.input.value;
        game_proxy.object = game;
    }

    handleSubmit = (e) => {
        socket.emit('create request', user_proxy.object.id);
        socket.once('create response', (userID, gameID) => {
            let user = user_proxy.object;
            let game = game_proxy.object;
            game.id = gameID;
            game.host = user;
            game.members = [user];
            game_proxy.object = game;

            this.context.setRoute('/gamelobby');
        });
    }

    render() {
        return (
            <div id='create_game_page'>
                <Title/>
                <InputForm
                    text='Create'
                    value={game_proxy.object.title || ''}
                    placeholder='Enter game title'
                    onChange={this.handleChange}
                    onSubmit={this.handleSubmit}/>
                <Button text='Back' onClick={() => this.context.setRoute('/newgame')}/>
            </div>
        )
    }
}