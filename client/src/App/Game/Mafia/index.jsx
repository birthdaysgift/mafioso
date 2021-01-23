import React, { Component } from 'react';

import { ROLE as USER_ROLE } from '../../common/user';
import NightCover from '../common/NightCover';

export default class Mafia extends Component {
    render() {
        if (this.props.user.role === USER_ROLE.MAFIA) {
            return <h1>Mafia Turn</h1>
        } else {
            return <NightCover/>;
        }
    }
}