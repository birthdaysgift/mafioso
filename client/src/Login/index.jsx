import React, { Component } from 'react';

import Input from '../Input';
import Button from '../Button';
import PageContext from '../context';

import './style.less';

export default class Login extends Component {
    static contextType = PageContext;

    constructor(props) {
        super(props);
        let name = sessionStorage.getItem('name');
        this.state = { value: name !== undefined ? name : '' };
    }

    handleLogin = (e) => {
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