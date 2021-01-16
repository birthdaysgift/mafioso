import React, { Component } from 'react';

import './style.less';

export default class Button extends Component {
    handleClick = (e) => {
        e.preventDefault();
        this.props.onClick?.(e);
    }
    render() {
        return <button onClick={this.handleClick}>{this.props.text}</button>;
    }
}