import React, {Component} from 'react';

import PageContext from '../context';
import AboutPage from '../AboutPage';
import NewGamePage from '../NewGamePage';
import WelcomePage from '../WelcomePage';
import CreateGamePage from '../CreateGamePage';
import JoinGamePage from '../JoinGamePage';

import './style.less';
import GameLobbyPage from '../GameLobbyPage';

class App extends Component { 
    constructor(props) {
        super(props);
        this.state = {route: '/welcome'};
    }
    setRoute = (route) => this.setState({route: route});
    getPage = (route) => {
        switch(route) {
            case '/welcome': return <WelcomePage/>;
            case '/newgame': return <NewGamePage/>;
            case '/about': return <AboutPage/>; 
            case '/creategame': return <CreateGamePage/>
            case '/joingame': return <JoinGamePage/>
            case '/gamelobby': return <GameLobbyPage/>;
        }
    }
    render() { 
        let page = this.getPage(this.state.route);
        return (
            <PageContext.Provider value={ {setRoute: this.setRoute} }>
                <div id='app'> { page } </div>
            </PageContext.Provider>
        )
    } 
}

export default App;
