import React, { Component } from 'react';

import Button from '../Button';
import Title from '../Title';
import InputForm from '../InputForm';
import PageContext from '../context';

import './style.less';

export default class JoinGamePage extends Component {
    static contextType = PageContext;

    handleChange = (e) => {
        sessionStorage.setItem('game_id', e.input.value);
    }

    handleSubmit = (e) => {
        this.context.setRoute('/gamelobby');
    }
    render() {
        return (
            <div id='join_game_page'>
                <Title/>
                <InputForm
                    text='Join'
                    value={sessionStorage.getItem('game_id') || ''}
                    placeholder='Enter game ID'
                    onChange={this.handleChange}
                    onSubmit={this.handleSubmit}/>
                <Button text='Back' onClick={() => this.context.setRoute('/newgame')}/>
            </div>
        )
    }
}