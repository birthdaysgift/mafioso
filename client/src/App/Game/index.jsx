import React, { Component } from 'react';
import game_proxy from '../common/game';

import Lobby from './Lobby';

export default function Game(props) {

    switch(game_proxy.object.state) {
        case STATE.LOBBY: return <Lobby/>;
    }
}

const STATE = {
    LOBBY: 'lobby',
}

export { STATE };