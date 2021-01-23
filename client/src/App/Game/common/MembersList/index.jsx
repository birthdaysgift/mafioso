import React, { Component } from 'react';

import img from './close50x50.png';
import './style.less';

export default class MembersList extends Component {
    render() {
        let closeIcon = (this.props.showCloseIcon)
                            ? <img className="img" src={img}/> : null;

        let members_elements = [];
        this.props.members.forEach((member, id) => {
            let text = <div className="text">{member.name}</div>;
            let entryClass = this.props.highlightCondition?.(member)
                                ? 'entry active' : 'entry';
            members_elements.push(
                <div className={entryClass} key={id} 
                    onClick={e => this.props.onMemberClick?.(e,member)}> 
                    {text} {closeIcon} 
                </div>
            );
        });

        return (
            <div className="members">
                {members_elements}
            </div>
        )
    }
}