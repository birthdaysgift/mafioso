import React, { Component } from 'react';

import Button from '../../common/Button';
import { RoutingContext } from '../../common/Router';
import { ROLE } from '../../common/user';
import { STATE as GAME_STATE } from '../.';
import game_proxy from '../../common/game';
import socket from '../../common/sockets';
import user_proxy, { STATE as USER_STATE } from '../../common/user';

import img from '../common/close50x50.png';
import audio from './waltz.mp3';
import './style.less';

export default class Lobby extends Component {
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
    
    handleExitClick = () => {
        this.disconnectUser(user_proxy.object.id, game_proxy.object.id);
        game_proxy.object = {};
        this.context.setRoute(['menu', 'new']);
    }

    handleAudioClick = () => {
        if ( this.state.audioPlaying ) {
            this.audio.pause();
            this.setState({audioPlaying: false})
        } else {
            this.audio.play();
            this.setState({audioPlaying: true});
        }
    }

    handleAudioEnded = () => {this.setState({audioPlaying: false})};

    render () {
        let userID = user_proxy.object.id;
        let hostID = this.state.game.host.id;
        let gameID = this.state.game.id;

        let closeIcon = (userID === hostID)
                    ? <img className="img" src={img}/> : null;
        let button = (userID === hostID)
                    ? <Button text='Start' onClick={this.handleStartClick}/> 
                    : <Button text='Exit' onClick={this.handleExitClick}/>

        let members_elements = this.state.game.members.map((m) => {
            let text = <div className="text">{m.name}</div>;
            return (
                <div className="entry" 
                    key={m.id} 
                    onClick={e => {
                        if ( userID !== hostID) return;
                        if ( m.id === userID ) return;
                        this.disconnectUser(m.id, gameID);
                    }}> 
                    {text} {closeIcon} 
                </div>
            )
        });

        let audio = (userID === hostID) 
                ? (<div className="audio" onClick={this.handleAudioClick}>
                    {this.state.audioPlaying ? 'Stop sound' : 'Sound test'}
                   </div>)
                : null

        return (
            <div id='lobby'>
                <div className='title'>{this.state.game.title}</div>
                <div className="id">Game ID: {this.state.game.id}</div>
                <div className="members">{members_elements}</div>
                {button}
                {audio}
            </div>
        )
    }
}