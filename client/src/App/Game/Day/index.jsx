import React, { Component } from 'react';

import Dead from '../Dead';
import { STATE as USER_STATE } from '../../common/user';

export default class Day extends Component {
    render() {
        if (this.props.user.state === USER_STATE.DEAD) return <Dead/>
        else return <h1>Day!</h1>;
    }
}