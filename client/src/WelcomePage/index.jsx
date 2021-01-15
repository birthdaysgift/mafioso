import React, { Component } from 'react';

import Button from '../Button';
import PageContext from '../context';
import Login from '../Login';
import Title from '../Title';

import './style.less';

export default class WelcomePage extends Component {
    static contextType = PageContext;
    render () {
        return (
            <div id='welcome_page'>
                <Title/>
                <Login/>
                <Button text='About' onClick={() => this.context.setRoute('/about')}/>
            </div>
        )
    }
} 
