import React, { Component } from 'react';

import Button from '../Button';
import PageContext from '../context';
import InputForm from '../InputForm';
import Title from '../Title';

import './style.less';

export default class WelcomePage extends Component {
    static contextType = PageContext;
    handleSubmit = () => {
        this.context.setRoute('/newgame');
    }
    handleChange = (e) => {
        sessionStorage.setItem('name', e.input.value);
    }
    render () {
        return (
            <div id='welcome_page'>
                <Title/>

                <InputForm 
                    text='Start'
                    value={sessionStorage.getItem('name') ?? ''}
                    placeholder='Enter your name'
                    onSubmit={this.handleSubmit}
                    onChange={this.handleChange}/>
                
                <Button text='About' onClick={() => this.context.setRoute('/about')}/>
            </div>
        )
    }
} 
