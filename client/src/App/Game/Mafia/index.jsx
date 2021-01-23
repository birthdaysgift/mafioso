import React, { Component } from 'react';

import { ROLE as USER_ROLE } from '../../common/user';
import Button from '../../common/Button';
import MembersList from '../common/MembersList';
import NightCover from '../common/NightCover';
import game_proxy from '../../common/game';
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

        if ( this.props.user.id === this.props.game.host.id ){
            (new Audio(audio)).play();
        }
    }

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

    render() {
        if (this.props.user.role === USER_ROLE.MAFIA) {
            return (
                <div id='mafia'>
                    <div className="title">{this.props.game.title}</div>
                    <div className='hint'>Choose a victim!</div>
                    <MembersList 
                        members={this.props.game.members}
                        onMemberClick={this.handleMemberClick}
                        highlightCondition={this.highlightCondition}/>
                    <Button text='Accept' />
                </div>
            )
        } else {
            return <NightCover/>;
        }
    }
}