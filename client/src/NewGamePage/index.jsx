import React, { Component } from 'react';

import Button from '../Button';
import PageContext from '../context';
import Title from '../Title';
import user_proxy from '../user';

import './style.less';

export default class NewGamePage extends Component {
    static contextType = PageContext;
    render() {
        return (
            <div id='newgame_page'>
                <Title />
                <div className='greeting'>Welcome, {user_proxy.object.name}!</div>
                <div className='text'>You can create a new game</div>
                <Button text='Create' onClick={() => this.context.setRoute('/creategame')}/>
                <div className='text'>or join to an existing one</div>
                <Button text='Join' onClick={() => this.context.setRoute('/joingame')}/>
            </div>
        )
    }
}