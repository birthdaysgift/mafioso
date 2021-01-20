import React, { Component } from 'react';

import Button from '../Button';
import InputForm from '../InputForm';
import Title from '../Title';
import PageContext from '../context';
import game_proxy from '../game';
import user_proxy from '../user';
import socket from '../sockets';

import './style.less';

export default class Create extends Component {
    static contextType = PageContext;

    constructor(props) {
        super(props);

        socket.on('create response', (userID, gameID) => {
            let user = user_proxy.object;
            let game = game_proxy.object;
            game.id = gameID;
            game.host = user;
            game.members = [user];
            game_proxy.object = game;

            this.context.setRoute('/lobby');
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
                <Button text='Back' onClick={() => this.context.setRoute('/new')}/>
            </div>
        )
    }
}