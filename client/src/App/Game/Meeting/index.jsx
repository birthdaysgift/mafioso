import React, { Component } from 'react';
import Button from '../../common/Button';
import user_proxy from '../../common/user';

import img from '../common/close50x50.png';
import './style.less';

export default class Meeting extends Component {
    static getDerivedStateFromProps = props => ({game: props.game});

    constructor(props) {
        super(props);
        
        this.state = {user: user_proxy.object, showRole: false};
    }

    handleRoleButtonClick = () => {
        this.setState(state => ({showRole: !this.state.showRole}));
    }

    render() {
        let userID = this.state.user.id;
        let hostID = this.state.game.host.id;
        let closeIcon = (userID === hostID) 
                    ? <img className='img' src={img}/> : null;
        let members_elements = this.state.game.members.map(m => {
            let text = <div className='text'>{m.name}</div>
            return (
                <div className='entry'
                    key={m.id}>
                        {text} {closeIcon}
                </div>
            )
        });

        let roleButtonText = this.state.showRole ? 'Hide Role' : 'Show Role';
        return (
            <div id='meeting'>
                <div className='title'>{this.state.game.title}</div>
                <div className="members">{members_elements}</div>
                <Button text='Ready'/>
                <Button text={roleButtonText} onClick={this.handleRoleButtonClick}/>
                <div className='role'>
                    {this.state.showRole ? this.state.user.role : ''}
                </div>
            </div>
        )
    }
}