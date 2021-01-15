import React from 'react';

import Login from '../Login';
import Title from '../Title';

import './style.less';

export default function WelcomePage(props) {
    return (
        <div id='welcome_page'>
            <Title/>
            <Login/>
        </div>
    )
} 
