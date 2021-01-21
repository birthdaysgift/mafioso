import React, { Component } from 'react';

import Button from '../../common/Button';
import { RoutingContext } from '../../common/Router';
import Title from '../Title';
import user_proxy from '../../common/user';

import './style.less';

export default class New extends Component {
    static contextType = RoutingContext;
    render() {
        return (
            <div id='new'>
                <Title />
                <div className='greeting'>Welcome, {user_proxy.object.name}!</div>
                <div className='text'>You can create a new game</div>
                <Button text='Create' onClick={() => this.context.setRoute(['menu', 'create'])}/>
                <div className='text'>or join to an existing one</div>
                <Button text='Join' onClick={() => this.context.setRoute(['menu', 'join'])}/>
            </div>
        )
    }
}