import React, { Component } from 'react';

import Button from '../Button';
import PageContext from '../context';
import InputForm from '../InputForm';
import socket from '../sockets';
import Title from '../Title';
import user_proxy from '../user';

import './style.less';

export default class Welcome extends Component {
    static contextType = PageContext;
    constructor(props) {
        super(props);

        socket.on('userID', (userID) => {
            let user = user_proxy.object;
            user.id = userID;
            user_proxy.object = user;
        });
    }

    componentWillUnmount = () => {
        socket.removeAllListeners('userID');
    }

    handleSubmit = () => this.context.setRoute('/new');

    handleChange = (e) => {
        let user = user_proxy.object;
        user.name = e.input.value;
        user_proxy.object = user;
    };

    render () {
        return (
            <div id='welcome'>
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
