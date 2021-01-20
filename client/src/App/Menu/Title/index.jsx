import React, { Component } from 'react';

import PageContext from '../../common/context';

import logo from '../../common/logo/logo.png';
import './style.less';

export default class Title extends Component {
    static contextType = PageContext;
    render() {
        return (
            <div id='title'>
                <img src={logo} alt="" onClick={() => this.context.setRoute('/welcome')}/>
                <div>Mafioso</div>
            </div>
        )
    }
}
