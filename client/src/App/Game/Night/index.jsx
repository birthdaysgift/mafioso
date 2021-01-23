import React, { Component } from 'react';

import NightCover from '../common/NightCover';

import audio from './city_asleep.ogg';

export default class Night extends Component {
    constructor(props) {
        super(props);

        if (this.props.user.id === this.props.game.host.id) {
            (new Audio(audio)).play();
        }
    }

    render() {
        return <NightCover counter={5} />;
    }
}