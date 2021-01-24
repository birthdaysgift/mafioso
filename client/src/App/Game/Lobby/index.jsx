import React, { Component } from 'react';

import HostLobby from './HostLobby';
import ClientLobby from './ClientLobby';

import './style.less';

export default class Lobby extends Component {
    static getDerivedStateFromProps = (props) => ({
        game: props.game, user: props.user
    });

    constructor(props) {
        super(props);

        this.state = {game: this.props.game, user: this.props.user};
    }
    render() {
        if (this.state.user.id === this.state.game.hostID) {
            return <HostLobby game={this.state.game}/>;
        } else {
            return <ClientLobby game={this.state.game}/>
        }
    }
}
