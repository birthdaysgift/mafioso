import React, { Component  } from 'react';

import audio from './innocent_win.ogg';
import './style.less';

export default class InnocentWin extends Component {
    constructor(props) {
        super(props);
        if (props.userID === props.hostID) (new Audio(audio)).play();
    }
    render() {
        return (
            <div id='innocent_win'>
                <h1>Innocent Win!</h1>
            </div>
        )
    }
}