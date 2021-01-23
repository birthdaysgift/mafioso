import React, { Component } from 'react';

import Dead from '../Dead';
import { STATE as USER_STATE } from '../../common/user';

import audio_mafia from './mafia_asleep.ogg';
import audio_city from './city_awake.ogg';

export default class Day extends Component {
    constructor(props) {
        super(props);
        if (this.props.user.id === this.props.game.host.id) {
            (new Audio(audio_mafia)).play();
            this.timeoutIndex = setTimeout(() => (new Audio(audio_city)).play(), 3000)
        }
    }

    componentWillUnmount = () => {
        clearTimeout(this.timeoutIndex);
    }

    render() {
        if (this.props.user.state === USER_STATE.DEAD) return <Dead/>
        else return <h1>Day!</h1>;
    }
}