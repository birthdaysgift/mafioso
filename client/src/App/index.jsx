import React, {Component} from 'react';

import { Router, Route } from './common/Router';
import Game from './Game';
import Menu from './Menu';

import './style.less';

class App extends Component { 
    render() { 
        return (
            <Router index={['menu']}>

                <div id='app'>

                    <Route path='menu'>
                        <Menu/>
                    </Route>

                    <Route path='game'>
                        <Game/>
                    </Route>
                </div>

            </Router>
        )
    } 
}

export default App;
