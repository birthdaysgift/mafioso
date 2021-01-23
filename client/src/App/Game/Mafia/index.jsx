import React, { Component } from 'react';

import { ROLE as USER_ROLE } from '../../common/user';
import Button from '../../common/Button';
import MembersList from '../common/MembersList';
import NightCover from '../common/NightCover';

import audio from './mafia_awake.ogg';
import './style.less';

export default class Mafia extends Component {
    constructor(props) {
        super(props);

        if ( this.props.user.id === this.props.game.host.id ){
            (new Audio(audio)).play();
        }
    }

    render() {
        if (this.props.user.role === USER_ROLE.MAFIA) {
            return (
                <div id='mafia'>
                    <div className="title">{this.props.game.title}</div>
                    <div className='hint'>Choose a victim!</div>
                    <MembersList 
                        members={this.props.game.members}/>
                    <Button text='Accept' />
                </div>
            )
        } else {
            return <NightCover/>;
        }
    }
}