import React, { Component } from 'react';

import img from './close50x50.png';
import './style.less';

export default class MembersList extends Component {
    showCondition = (member) => this.props.showCondition?.(member) ?? true;

    render() {
        let closeIcon = (this.props.showCloseIcon)
                            ? <img className="img" src={img}/> : null;

        let members_elements = [];
        this.props.members.forEach((member, id) => {
            let text = <div className="text">{member.name}</div>;
            let entryClass = this.props.highlightCondition?.(member)
                                ? 'entry active' : 'entry';
            let votes = (this.props.showVotes)
                    ? <div className="votes">{member.receivedVotes.size}</div>
                    : null;
            if (this.showCondition(member)) {
                members_elements.push(
                    <div className={entryClass} key={id} 
                        onClick={e => this.props.onMemberClick?.(e,member)}> 
                        {text} {closeIcon} {votes}
                    </div>
                );
            }
        });

        return (
            <div className="members">
                {members_elements}
            </div>
        )
    }
}