import React, { Component } from 'react';

import Button from '../Button';
import InputForm from '../InputForm';
import Title from '../Title';
import PageContext from '../context';
import game_proxy from '../game';

import './style.less';

export default class CreateGamePage extends Component {
    static contextType = PageContext;

    handleChange = (e) => {
        let game = game_proxy.object;
        game.title = e.input.value;
        game_proxy.object = game;
    }

    handleSubmit = (e) => this.context.setRoute('/gamelobby');

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