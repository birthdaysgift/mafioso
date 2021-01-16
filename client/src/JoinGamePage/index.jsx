import React, { Component } from 'react';

import Button from '../Button';
import Title from '../Title';
import InputForm from '../InputForm';
import PageContext from '../context';
import game_proxy from '../game';

import './style.less';

export default class JoinGamePage extends Component {
    static contextType = PageContext;

    handleChange = (e) => {
        let game = game_proxy.object;
        game.id = e.input.value; 
        game_proxy.object = game;
    }

    handleSubmit = (e) => this.context.setRoute('/gamelobby');

    render() {
        return (
            <div id='join_game_page'>
                <Title/>
                <InputForm
                    text='Join'
                    value={game_proxy.object.id || ''}
                    placeholder='Enter game ID'
                    onChange={this.handleChange}
                    onSubmit={this.handleSubmit}/>
                <Button text='Back' onClick={() => this.context.setRoute('/newgame')}/>
            </div>
        )
    }
}