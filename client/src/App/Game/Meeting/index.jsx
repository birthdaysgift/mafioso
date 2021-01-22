import React, { Component } from 'react';
import user_proxy from '../../common/user';

export default class Meeting extends Component {
    render() {
        let user = this.props.game.members.find(
            m => m.id === user_proxy.object.id
        );
        return <h1>{user.role}</h1>
    }
}