
import React, { Component } from 'react';

import Button from '../../common/Button';
import MembersList from '../common/MembersList';
import { RoutingContext } from '../../common/Router';
import game_proxy from '../../common/game';
import socket from '../../common/socket';
import user_proxy from '../../common/user';

export default class ClientLobby extends Component {
    static contextType = RoutingContext;
    static getDerivedStateFromProps = props => ({game: props.game});

    constructor(props) {
        super(props);
        this.state = {game: this.props.game};
    }

    handleExitClick = () => {
        socket.emit('user disconnected', user_proxy.object.id, game_proxy.object.id);
    }

    render () {
        return (
            <div id='lobby'>
                <div className='title'>{this.state.game.title}</div>
                <div className="id">Game ID: {this.state.game.id}</div>
                <MembersList members={this.state.game.members}/>
                <Button text='Exit' onClick={this.handleExitClick}/>
            </div>
        )
    }
}