import React, { Component } from 'react';

import Button from '../Button';
import Title from '../Title';

import './style.less';

export default class NewGamePage extends Component {
    render() {
        return (
            <div id='newgame_page'>
                <Title />
                <div className='greeting'>Welcome, {sessionStorage.getItem('name')}!</div>
                <div className='text'>You can create a new game</div>
                <Button text='Create'/>
                <div className='text'>or join to an existing one</div>
                <Button text='Join'/>
            </div>
        )
    }
}