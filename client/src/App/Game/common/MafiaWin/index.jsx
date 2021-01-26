import React, { Component } from 'react';

import audio from './mafia_win.ogg';
import './style.less';

export default class MafiaWin extends Component {
    constructor(props) {
        super(props);
        if (props.userID === props.hostID) (new Audio(audio)).play();
    }

    render() {
        return (
            <div id='mafia_win'>
                <h1>Mafia Win!</h1>
            </div>
        )
    }
}