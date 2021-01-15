import React, { Component } from 'react';

import './style.less';

export default class Input extends Component {
    constructor(props) {
        super(props);
        this.state = {value: '', showPlaceholder: true}
    }
    render () {
        let s = this.state;
        let p = this.props;
        return <input 
                    type='input' 
                    value={s.value}
                    placeholder={s.showPlaceholder ? p.placeholder : ''}
                    onChange={(e) => this.setState({value: e.target.value})}
                    onFocus={() => this.setState({showPlaceholder: false})}
                    onBlur={() => this.setState({showPlaceholder: true})}/>
    }
}