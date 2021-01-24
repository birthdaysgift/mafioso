import React, { Component } from 'react';

import Button from '../../common/Button';
import Dead from '../common/Dead';
import InnocentWin from '../common/InnocentWin';
import MafiaWin from '../common/MafiaWin';
import MembersList from '../common/MembersList';
import { STATE as USER_STATE } from '../../common/user';
import game_proxy from '../../common/game';
import socket from '../../common/socket';

import audio from './city_awake.ogg';
import './style.less';

export default class Innocent extends Component {
    static getDerivedStateFromProps = (props) => ({
        game: props.game, user: props.user
    });

    constructor(props) {
        super(props);

        this.state = {game: this.props.game, user: this.props.user};

        if (this.props.user.id === this.props.game.hostID) {
            (new Audio(audio)).play();
        }
    }

    highlightCondition = (member) => member.receivedVotes.has(this.state.user.id);

    showCondition = (member) => member.state !== USER_STATE.DEAD

    handleMemberClick = (event, member) => {
        let game = this.state.game;
        let user = this.state.user;
        let prevVote = user.vote;
        let currVote = member.id;
        if (prevVote === undefined) {
            game.members.get(currVote).receivedVotes.add(user.id);
            game.members.get(user.id).vote = currVote;
        } else if (prevVote === currVote) {
            game.members.get(currVote).receivedVotes.delete(user.id);
            game.members.get(user.id).vote = undefined;
        } else {
            game.members.get(prevVote).receivedVotes.delete(user.id);
            game.members.get(currVote).receivedVotes.add(user.id);
            game.members.get(user.id).vote = currVote;
        }

        game_proxy.object = game;
        socket.emit('update', game_proxy.json);
    }

    render() {
        if (this.props.game.innocentAlive === 0) return <MafiaWin/>
        if (this.props.game.mafiaAlive === 0) return <InnocentWin/>
        if (this.props.user.state === USER_STATE.DEAD) return <Dead/>

        else return (
            <div id="day">
                <div className="title">{this.state.game.title}</div>
                <div className="hint">Choose a suspect!</div>
                <MembersList 
                    members={this.state.game.members} 
                    showVotes={true}
                    showCondition={this.showCondition}
                    highlightCondition={this.highlightCondition}
                    onMemberClick={this.handleMemberClick}/>
                <Button text='Confirm' />
            </div>
        )
    }
}