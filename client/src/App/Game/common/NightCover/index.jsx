import React, { Component } from 'react';

import './style.less';

export default class NightCover extends Component {
    constructor(props) {
        super(props);

        this.decrCounter = this.decrCounter.bind(this);

        this.state = {counter: this.props.counter || 0};
        this.intervalID = setInterval(this.decrCounter, 1000);
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
            <div id='night_cover'>
                <h1>{this.state.counter > 0 ? this.state.counter : 'Night'}</h1>
                <h3>Close Your Eyes!</h3>
            </div>
        )
    }
}