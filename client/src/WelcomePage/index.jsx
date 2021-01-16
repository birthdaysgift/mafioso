import React, { Component } from 'react';

import Button from '../Button';
import PageContext from '../context';
import InputForm from '../InputForm';
import Title from '../Title';
import user_proxy from '../user';

import './style.less';

export default class WelcomePage extends Component {
    static contextType = PageContext;

    handleSubmit = () => this.context.setRoute('/newgame');

    handleChange = (e) => {
        let user = user_proxy.object;
        user.name = e.input.value;
        user_proxy.object = user;
    };

    render () {
        return (
            <div id='welcome_page'>
                <Title/>

                <InputForm 
                    text='Start'
                    value={user_proxy.object ? user_proxy.object.name : ''}
                    placeholder='Enter your name'
                    onSubmit={this.handleSubmit}
                    onChange={this.handleChange}/>
                
                <Button text='About' onClick={() => this.context.setRoute('/about')}/>
            </div>
        )
    }
} 
