import React, { Component } from 'react';

import NightCover from '../common/NightCover';
import { STATE as GAME_STATE } from '../../common/game';
import game_proxy from '../../common/game';
import socket from '../../common/socket';

import audio from './city_asleep.ogg';

export default class Night extends Component {
    constructor(props) {
        super(props);

        if (this.props.user.id === this.props.game.host.id) {
            (new Audio(audio)).play();

            this.timeoutID = setTimeout(() => {
                let game = game_proxy.object;
                game.state = GAME_STATE.MAFIA;
                game_proxy.object = game;
                socket.emit('update', game_proxy.json);
            }, 7000);
        }
    }

    componentWillUnmount = () => clearTimeout(this.timeoutID);

    render() {
        return <NightCover counter={5} />;
    }
}