import React, { Component } from 'react';

import Button from '../Button';
import Input from '../Input';
import Title from '../Title';
import PageContext from '../context';

import './style.less';

export default class CreateGamePage extends Component {
    static contextType = PageContext;
    render() {
        return (
            <div id='create_game_page'>
                <Title/>
                <Input placeholder='Enter game title'/>
                <Button text='Create'/>
                <Button text='Back' onClick={() => this.context.setRoute('/newgame')}/>
            </div>
        )
    }
}