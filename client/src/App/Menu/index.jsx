import React, { Component } from 'react';

import { Router, Switch, Route } from '../common/Router';
import About from './About';
import Welcome from './Welcome';
import New from './New';
import Create from './Create';
import Join from './Join';

export default class Menu extends Component {
    render() {
        return (
            <div id="menu">

                <Route path='.'>
                    <Welcome/>
                </Route>

                <Route path='about'>
                    <About/>
                </Route>

                <Route path='new'>
                    <New/>
                </Route>

                <Route path='create'>
                    <Create/>
                </Route>

                <Route path='join'>
                    <Join/>
                </Route>

            </div>
        )
    }
}