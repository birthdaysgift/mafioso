
import React, { Component } from 'react';

import Button from '../../common/Button';
import MembersList from '../common/MembersList';
import { RoutingContext } from '../../common/Router';
import { ROLE } from '../../common/user';
import { STATE as GAME_STATE } from '../../common/game';
import game_proxy from '../../common/game';
import socket from '../../common/socket';
import user_proxy, { STATE as USER_STATE } from '../../common/user';

import audio from './waltz.mp3';
import './style.less';

export default class HostLobby extends Component {
    static contextType = RoutingContext;
    static getDerivedStateFromProps = props => ({game: props.game});

    constructor(props) {
        super(props);

        this.audio = new Audio(audio);
        this.audio.addEventListener('ended', this.handleAudioEnded);

        this.state = {audioPlaying: false};

        socket.on('game request', (userID, gameID) => {
            socket.emit('game response', userID, game_proxy.json);
        });
    }

    componentWillUnmount = () => {
        this.audio.removeEventListener('ended', this.handleAudioEnded);
        socket.removeAllListeners('game request');
    }

    disconnectUser = (userID, gameID) => {
        let game = game_proxy.object;
        let index = game.members.findIndex(m => m.id === userID);
        if ( index === -1) return;
        socket.emit('user disconnected', userID, gameID);
    }

    handleStartClick = () => {
        let mafiaIndex = Math.floor(Math.random()*this.state.game.members.length);
        let game = game_proxy.object;
        game.members = game.members.map((m, i) => {
            if ( i === mafiaIndex) {
                m.role = ROLE.MAFIA;
            } else {
                m.role = ROLE.INNOCENT;
            }
            m.state = USER_STATE.NOT_READY;
            return m;
        });
        game.state = GAME_STATE.MEETING;
        game_proxy.object = game;
        socket.emit('update', game_proxy.json);
    };
    
    handleAudioClick = () => {
        if ( this.state.audioPlaying ) {
            this.audio.pause();
            this.setState({audioPlaying: false})
        } else {
            this.audio.play();
            this.setState({audioPlaying: true});
        }
    }

    handleMemberClick = (e, member) => {
        let user = user_proxy.object;
        let game = game_proxy.object;
        if ( user.id !== game.host.id ) return;
        if ( member.id === game.host.id ) return;
        this.disconnectUser(member.id, game.id);
    }

    handleAudioEnded = () => {this.setState({audioPlaying: false})};

    render () {
        let userID = user_proxy.object.id;
        let hostID = this.state.game.host.id;

        let audio = (
            <div className="audio" onClick={this.handleAudioClick}>
                {this.state.audioPlaying ? 'Stop sound' : 'Sound test'}
            </div>
        )

        return (
            <div id='lobby'>
                <div className='title'>{this.state.game.title}</div>
                <div className="id">Game ID: {this.state.game.id}</div>
                <MembersList 
                    members={this.state.game.members}
                    showCloseIcon={true}
                    onMemberClick={this.handleMemberClick}/>
                <Button text='Start' onClick={this.handleStartClick}/>
                {audio}
            </div>
        )
    }
}