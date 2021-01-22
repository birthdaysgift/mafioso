import React, { Component } from 'react';

import img from './close50x50.png';
import './style.less';

export default class MembersList extends Component {
    render() {
        let closeIcon = (this.props.showCloseIcon)
                            ? <img className="img" src={img}/> : null;
        let members_elements = this.props.members.map((m) => {
            let text = <div className="text">{m.name}</div>;
            return (
                <div className="entry" key={m.id} onClick={e => this.props.onMemberClick?.(e,m)}> 
                    {text} {closeIcon} 
                </div>
            )
        });
        return (
            <div className="members">
                {members_elements}
            </div>
        )
    }
}