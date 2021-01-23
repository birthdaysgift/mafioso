import React, { Component } from 'react';

import audio from './city_asleep.ogg';
export default class Night extends Component {
    constructor(props) {
        super(props);

        this.decrCounter = this.decrCounter.bind(this);

        this.state = {counter: 3};
        this.intervalID = setInterval(this.decrCounter, 1000);

        if (this.props.user.id === this.props.game.host.id) {
            (new Audio(audio)).play();
        }
    }

    componentWillUnmount = () => clearInterval(this.intervalID);

    decrCounter = () => {
        if (this.state.counter === 0) {
            clearInterval(this.intervalID);
        } else {
            this.setState((state,props) => {
                return { counter: --state.counter };
            });
        }
    }
    render() {
        return (
            <h1>{this.state.counter > 0 ? this.state.counter : 'Night'}</h1>
        )
    }
}