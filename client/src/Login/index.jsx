import React, { Component } from 'react';

import Input from '../Input';
import Button from '../Button';
import PageContext from '../context';

import './style.less';

export default class Login extends Component {
    static contextType = PageContext;

    constructor(props) {
        super(props);
        this.state = { value: sessionStorage.getItem('name') ?? '' };
    }

    handleLogin = (e) => {
        // Here is input validation: if there is no input - just do nothing
        if (!this.state.value) return;

        sessionStorage.setItem('name', this.state.value);
        this.context.setRoute('/newgame');
    };
    render() {
        return (
            <form id='login'>
                <Input 
                    value={this.state.value}
                    placeholder='Enter your name'
                    onChange={(e) => this.setState({value: e.target.value})}/>
                <Button text='Start' onClick={this.handleLogin}/>
            </form>
        )
    }
}