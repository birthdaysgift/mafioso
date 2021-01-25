import React, { Component } from 'react';

import Button from '../../common/Button';
import Dead from '../common/Dead';
import InnocentWin from '../common/InnocentWin';
import MafiaWin from '../common/MafiaWin';
import MembersList from '../common/MembersList';
import { STATE as USER_STATE, ROLE as USER_ROLE } from '../../common/user';
import game_proxy, { STATE as GAME_STATE } from '../../common/game';
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

    componentDidUpdate = () => {
        let user = this.state.user;
        let game = this.state.game;

        if (user.id !== game.hostID) return;

        for (const member of game.members.values()) {
            if (member.state === USER_STATE.NOT_READY) return;
        }

        // runs only if all members are ready
        let maxVotes = undefined;
        game.members.forEach(member => {
            if (maxVotes === undefined) {
                maxVotes = member.id;
                return;
            }
            if (member.state !== USER_STATE.DEAD) {
                if (game.members.get(member.id).receivedVotes.size 
                            > game.members.get(maxVotes).receivedVotes.size) {
                    maxVotes = member.id;
                }
            }
        });
        if (maxVotes !== undefined) {
            game.members.get(maxVotes).state = USER_STATE.DEAD;
            if (game.members.get(maxVotes).role === USER_ROLE.MAFIA) {
                game.mafiaAlive--;
            } else {
                game.innocentAlive--;
            }
        }
        game.state = GAME_STATE.SUNSET;
        game.members.forEach(member => {
            if (member.state !== USER_STATE.DEAD) {
                member.state = USER_STATE.NOT_READY;
            }
        });
        game_proxy.object = game;
        socket.emit('update', game_proxy.json);
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

    handleConfirmClick = () => {
        let user = this.state.user;
        let game = this.state.game;
        if (game.members.get(user.id).state === USER_STATE.NOT_READY) {
            game.members.get(user.id).state = USER_STATE.READY;
        } else {
            game.members.get(user.id).state = USER_STATE.NOT_READY;
        }
        game_proxy.object = game;
        socket.emit('update', game_proxy.json);
    };

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
                <Button
                    text={(this.state.user.state === USER_STATE.NOT_READY) 
                            ? 'Confirm' : 'Cancel'}
                    onClick={this.handleConfirmClick}/>
            </div>
        )
    }
}