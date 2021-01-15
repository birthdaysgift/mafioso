import React from 'react';

import Input from '../Input';
import Button from '../Button';

import './style.less';

export default function Login(props) {
    return (
        <form id='login'>
            <Input placeholder='Enter your name'/>
            <Button text='Start'/>
            <Button text='About'/>
        </form>
    )
}