import React, { Component } from 'react';

import NightCover from '../common/NightCover';
import game_proxy, { STATE as GAME_STATE } from '../../common/game';
import { ROLE as USER_ROLE } from '../../common/user';
import socket from '../../common/socket';

import audio from './mafia_asleep.ogg';

export default class Day extends Component {
    constructor(props) {
        super(props);

        this.state = {game: this.props.game, user: this.props.user};

        if (this.props.user.id === this.props.game.hostID) {
            (new Audio(audio)).play();

            this.timeoutID = setTimeout(() => {
                let game = game_proxy.object;
                game.state = GAME_STATE.INNOCENT;
                game_proxy.object = game;
                socket.emit('update', game_proxy.json);
            }, 7000);
        }
    }

    componentWillUnmount = () => clearTimeout(this.timeoutID);

    render() {
        if (this.state.user.role === USER_ROLE.MAFIA) {
            return <NightCover counter={5} />;
        } else {
            return <NightCover />;
        }
    }
}