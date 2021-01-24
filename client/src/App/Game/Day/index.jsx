import React, { Component } from 'react';

import Button from '../../common/Button';
import Dead from '../common/Dead';
import InnocentWin from '../common/InnocentWin';
import MafiaWin from '../common/MafiaWin';
import MembersList from '../common/MembersList';
import { STATE as USER_STATE } from '../../common/user';

import audio_mafia from './mafia_asleep.ogg';
import audio_city from './city_awake.ogg';
import './style.less';

export default class Day extends Component {
    static getDerivedStateFromProps = (props) => ({
        game: props.game, user: props.user
    });

    constructor(props) {
        super(props);

        this.state = {game: this.props.game, user: this.props.user};

        if (this.props.user.id === this.props.game.host.id) {
            (new Audio(audio_mafia)).play();
            this.timeoutIndex = setTimeout(() => (new Audio(audio_city)).play(), 3000)
        }
    }

    componentWillUnmount = () => {
        clearTimeout(this.timeoutIndex);
    }

    render() {
        if (this.props.game.innocentAlive === 0) return <MafiaWin/>
        if (this.props.game.mafiaAlive === 0) return <InnocentWin/>
        if (this.props.user.state === USER_STATE.DEAD) return <Dead/>

        else return (
            <div id="day">
                <div className="title">{this.state.game.title}</div>
                <div className="hint">Choose a suspect!</div>
                <MembersList members={this.state.game.members} />
                <Button text='Confirm' />
            </div>
        )
    }
}