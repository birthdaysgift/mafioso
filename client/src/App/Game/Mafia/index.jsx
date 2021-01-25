import React, { Component } from 'react';

import { ROLE as USER_ROLE } from '../../common/user';
import Button from '../../common/Button';
import Dead from '../common/Dead';
import MafiaWin from '../common/MafiaWin';
import MembersList from '../common/MembersList';
import InnocentWin from '../common/InnocentWin';
import NightCover from '../common/NightCover';
import game_proxy, { STATE as GAME_STATE } from '../../common/game';
import { STATE as USER_STATE } from '../../common/user';
import socket from '../../common/socket';

import audio from './mafia_awake.ogg';
import './style.less';

export default class Mafia extends Component {
    static getDerivedStateFromProps = props => ({
        game: props.game, user: props.user
    });

    constructor(props) {
        super(props);

        this.state = {game: this.props.game, user: this.props.user};

        if ( this.props.user.id === this.props.game.hostID ){
            (new Audio(audio)).play();
        }
    }

    componentDidUpdate = () => {
        let user = this.state.user;
        let game = this.state.game;
        if (user.state === USER_STATE.READY && user.vote) {
            game.members.get(user.vote).state = USER_STATE.DEAD;
            game.members.get(user.vote).receivedVotes = new Set();
            game.members.get(user.id).vote = undefined;
            game.state = GAME_STATE.DAWN;
            if (game.members.get(user.vote).role === USER_ROLE.MAFIA) {
                game.mafiaAlive--;
            } else {
                game.innocentAlive--;
            }
            game.members.forEach(member => {
                if (member.state !== USER_STATE.DEAD) {
                    member.state = USER_STATE.NOT_READY;
                }
            });
            game_proxy.object = game;
            socket.emit('update', game_proxy.json);
        }
    }

    showCondition = (member) =>  member.state !== USER_STATE.DEAD;

    highlightCondition = (member) => member.receivedVotes.has(this.state.user.id);

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
        if (this.props.user.role !== USER_ROLE.MAFIA) return <NightCover/>
        
        return (
            <div id='mafia'>
                <div className="title">{this.props.game.title}</div>
                <div className='hint'>Choose a victim!</div>
                <MembersList 
                    members={this.props.game.members}
                    showCondition={this.showCondition}
                    onMemberClick={this.handleMemberClick}
                    highlightCondition={this.highlightCondition}/>
                <Button 
                    text={this.state.user.state === USER_STATE.NOT_READY 
                            ? 'Confirm' : 'Cancel'}
                    onClick={this.handleConfirmClick}/>
            </div>
        )
    }
}