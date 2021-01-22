import React, { Component } from 'react';
import Button from '../../common/Button';
import game_proxy from '../../common/game';
import user_proxy, { STATE as USER_STATE } from '../../common/user';
import socket from '../../common/sockets';

import './style.less';
import MembersList from '../common/MembersList';

export default class Meeting extends Component {
    static getDerivedStateFromProps = props => ({
        game: props.game, user: props.user
    });

    constructor(props) {
        super(props);
        
        this.state = {showRole: false};
    }

    handleReadyClick = () => {
        let game = game_proxy.object;
        let user = user_proxy.object;
        if ( user.state === USER_STATE.READY ) {
            user.state = USER_STATE.NOT_READY;
        } else if ( user.state === USER_STATE.NOT_READY) {
            user.state = USER_STATE.READY;
        }
        let userIndex =  game.members.findIndex(m => m.id === user.id);
        game.members[userIndex] = user;
        game_proxy.object = game;
        socket.emit('update', game_proxy.json);
    }

    handleRoleButtonClick = () => {
        this.setState(state => ({showRole: !this.state.showRole}));
    }

    render() {
        let user = this.state.user;
        let game = this.state.game;
        let readyButtonText = (this.state.user.state === USER_STATE.READY) 
                                ? 'Not Ready' : 'Ready';
        let roleButtonText = this.state.showRole ? 'Hide Role' : 'Show Role';
        return (
            <div id='meeting'>
                <div className='title'>{this.state.game.title}</div>
                <MembersList members={this.state.game.members}/>
                <Button text={readyButtonText} onClick={this.handleReadyClick}/>
                <Button text={roleButtonText} onClick={this.handleRoleButtonClick}/>
                <div className='role'>
                    {this.state.showRole ? this.state.user.role : ''}
                </div>
            </div>
        )
    }
}