import React from 'react';

import logo from '../logo/logo.png';
import './style.less';

export default function Title(props) {
    return (
        <div id='title'>
            <img src={logo} alt=""/>
            <div>Mafioso</div>
        </div>
    )
}
