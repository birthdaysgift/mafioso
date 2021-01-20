import React, { Component } from 'react';

import Button from '../../common/Button';
import Title from '../Title';
import InputForm from '../../common/InputForm';
import PageContext from '../../common/context';
import game_proxy from '../../common/game';
import user_proxy from '../../common/user';
import socket from '../../common/sockets';

import './style.less';

export default class Join extends Component {
    static contextType = PageContext;
    constructor(props) {
        super(props);

        socket.on('join response', (userID, gameID) => {
            socket.emit('update request', userID, gameID);
        });
        socket.on('update response', (userID, gameJSON) => {
            game_proxy.json = gameJSON;

            let game = game_proxy.object;
            game.members.push(user_proxy.object);
            game_proxy.object = game;
            
            socket.emit('update', game_proxy.json);

            this.context.setRoute('/lobby');
        });
    }

    componentWillUnmount = () => {
        socket.removeAllListeners('join response');
        socket.removeAllListeners('update response');
    }

    handleChange = (e) => {
        let game = game_proxy.object;
        game.id = e.input.value; 
        game_proxy.object = game;
    }

    handleSubmit = (e) => {
        socket.emit('join request', user_proxy.object.id, game_proxy.object.id);
    };

    render() {
        return (
            <div id='join'>
                <Title/>
                <InputForm
                    text='Join'
                    value={game_proxy.object.id || ''}
                    placeholder='Enter game ID'
                    onChange={this.handleChange}
                    onSubmit={this.handleSubmit}/>
                <Button text='Back' onClick={() => this.context.setRoute('/new')}/>
            </div>
        )
    }
}