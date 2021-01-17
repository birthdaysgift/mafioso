import React from 'react';
import ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader';

import App from '../App';

import './style.less'

const HotReloadableApp = hot(module)(App)

ReactDOM.render(<HotReloadableApp/>, document.getElementById('root'));