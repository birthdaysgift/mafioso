import React, { Component } from 'react';

import './style.less';

export default class Input extends Component {
    constructor(props) {
        super(props);
        this.state = {showPlaceholder: true};
    }
    handleChange = (e) => {
        e.preventDefault();
        if (typeof this.props.onChange !== 'undefined') this.props.onChange(e);
    }
    handleFocus = (e) => {
        e.preventDefault();
        this.setState({showPlaceholder: false});
        if (typeof this.props.onFocus !== 'undefined') this.props.onFocus(e);
    }
    handleBlur = (e) => {
        e.preventDefault();
        this.setState({showPlaceholder: true});
        if (typeof this.props.onBlur !== 'undefined') this.props.onBlur(e);
    }
    render () {
        return <input 
                    type='input' 
                    value={this.props.value}
                    placeholder={this.state.showPlaceholder ? this.props.placeholder : ''}
                    onChange={this.handleChange}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}/>
    }
}