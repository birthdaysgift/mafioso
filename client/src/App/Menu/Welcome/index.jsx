import React, { Component } from 'react';

import Button from '../../common/Button';
import InputForm from '../../common/InputForm';
import socket from '../../common/sockets';
import Title from '../Title';
import user_proxy from '../../common/user';

import './style.less';
import { RoutingContext } from '../../common/Router';

export default class Welcome extends Component {
    static contextType = RoutingContext;

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

    handleSubmit = () => this.context.setRoute(['menu', 'new']);

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
                
                <Button text='About' onClick={() => this.context.setRoute(['menu', 'about'])}/>
            </div>
        )
    }
} 
