import React, { Component } from 'react';

export default class Night extends Component {
    constructor(props) {
        super(props);

        this.state = {counter: 3};
        this.intervalID = setInterval(this.decrCounter, 1000);
        this.decrCounter = this.decrCounter.bind(this);
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