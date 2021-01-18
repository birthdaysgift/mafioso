import React, { Component } from 'react';

import Button from '../Button';
import PageContext from '../context';
import game_proxy from '../game';
import socket from '../sockets';
import user_proxy from '../user';

import img from './close50x50.png';
import audio from './waltz.mp3';
import './style.less';

export default class GameLobbyPage extends Component {
    static contextType = PageContext;
    constructor(props) {
        super(props);

        this.audio = new Audio(audio);
        this.audio.addEventListener('ended', this.handleAudioEnded);

        this.state = {game: game_proxy.object, audioPlaying: false};

        socket.on('update request', (userID, gameID) => {
            socket.emit('update response', userID, game_proxy.json);
        });
        socket.on('update', (gameJSON) => {
            game_proxy.json = gameJSON;
            this.setState({game: game_proxy.object});
        });

        socket.on('user disconnected', (userID, gameID) => {
            if( userID === game_proxy.object.host.id ) {
                game_proxy.object = {};
                user_proxy.object = {};
                location.reload();
            } else {
                let game = game_proxy.object;
                let index = game.members.findIndex((m) => m.id === userID);
                game.members.splice(index, 1)
                game_proxy.object = game;
                this.setState({game: game});
            }
        });
    }

    componentWillUnmount = () => {
        this.audio.removeEventListener('ended', this.handleAudioEnded);
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

        let closeIcon = (userID === hostID) 
                    ? <img className="img" src={img}/> : null
        let button = (userID === hostID)
                    ? <Button text='Start'/> : <Button text='Exit'/>

        let members_elements = this.state.game.members.map((m) => {
            let text = <div className="text">{m.name}</div>;
            return <div className="entry" key={m.id}> {text} {closeIcon} </div>;
        });

        return (
            <div id='lobby'>
                <div className='title'>{this.state.game.title}</div>
                <div className="id">Game ID: {this.state.game.id}</div>
                <div className="members">{members_elements}</div>
                {button}
                <div className="audio" onClick={this.handleAudioClick}>
                    {this.state.audioPlaying ? 'Stop sound' : 'Sound test'}
                </div>
            </div>
        )
    }
}