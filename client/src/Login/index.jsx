import React, { Component } from 'react';

import Input from '../Input';
import Button from '../Button';
import PageContext from '../context';

import './style.less';

export default class Login extends Component {
    static contextType = PageContext;

    render() {
        return (
            <form id='login'>
                <Input placeholder='Enter your name'/>
                <Button text='Start'/>
                <Button text='About' onClick={() => this.context.setRoute('/about')}/>
            </form>
        )
    }
}