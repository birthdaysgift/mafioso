import React, { Component } from 'react';

import { RouginContext, RoutingContext } from '../../common/Router';

import logo from '../../common/logo/logo.png';
import './style.less';

export default class Title extends Component {
    static contextType = RoutingContext;
    render() {
        return (
            <div id='title'>
                <img src={logo} alt="" onClick={() => this.context.setRoute(['menu'])}/>
                <div>Mafioso</div>
            </div>
        )
    }
}
