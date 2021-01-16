import React, { Component } from 'react';

import Button from '../Button';
import InputForm from '../InputForm';
import Title from '../Title';
import PageContext from '../context';

import './style.less';

export default class CreateGamePage extends Component {
    static contextType = PageContext;

    handleChange = (e) => {
        sessionStorage.setItem('game_title', e.input.value);
    };

    handleSubmit = (e) => {
        this.context.setRoute('/gamelobby');
    }

    render() {
        return (
            <div id='create_game_page'>
                <Title/>
                <InputForm
                    text='Create'
                    value={sessionStorage.getItem('game_title') || ''}
                    placeholder='Enter game title'
                    onChange={this.handleChange}
                    onSubmit={this.handleSubmit}/>
                <Button text='Back' onClick={() => this.context.setRoute('/newgame')}/>
            </div>
        )
    }
}