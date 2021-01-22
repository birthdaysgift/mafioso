import React, { Component } from 'react';
import Button from '../../common/Button';
import game_proxy from '../../common/game';
import user_proxy, { STATE as USER_STATE } from '../../common/user';
import socket from '../../common/sockets';

import img from '../common/close50x50.png';
import './style.less';

export default class Meeting extends Component {
    static getDerivedStateFromProps = props => ({
        game: props.game, user: props.user
    });

    constructor(props) {
        super(props);
        
        this.state = {showRole: false};
    }

    disconnectUser = (userID, gameID) => {
        let game = game_proxy.object;
        let index = game.members.findIndex(m => m.id === userID);
        if ( index === -1) return;
        socket.emit('user disconnected', userID, gameID);
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
        let userID = this.state.user.id;
        let hostID = this.state.game.host.id;
        let closeIcon = (userID === hostID) 
                    ? <img className='img' src={img}/> : null;
        let members_elements = this.state.game.members.map(m => {
            let text = <div className='text'>{m.name}</div>
            let entryClass = (m.state === USER_STATE.READY) 
                                ? 'entry ready' : 'entry';
            return (
                <div className={entryClass}
                    key={m.id}
                    onClick={e => {
                        if ( userID !== hostID) return;
                        if ( m.id === userID ) return;
                        this.disconnectUser(m.id, this.state.game.id);
                    }}>
                        {text} {closeIcon}
                </div>
            )
        });

        let readyButtonText = (this.state.user.state === USER_STATE.READY) 
                                ? 'Not Ready' : 'Ready';
        let roleButtonText = this.state.showRole ? 'Hide Role' : 'Show Role';
        return (
            <div id='meeting'>
                <div className='title'>{this.state.game.title}</div>
                <div className="members">{members_elements}</div>
                <Button text={readyButtonText} onClick={this.handleReadyClick}/>
                <Button text={roleButtonText} onClick={this.handleRoleButtonClick}/>
                <div className='role'>
                    {this.state.showRole ? this.state.user.role : ''}
                </div>
            </div>
        )
    }
}