import React, {Component} from 'react';

import PageContext from '../context';
import About from '../About';
import New from '../New';
import Welcome from '../Welcome';
import Create from '../Create';
import Join from '../Join';
import Lobby from '../Lobby';

import './style.less';

class App extends Component { 
    constructor(props) {
        super(props);
        this.state = {route: '/welcome'};
    }
    setRoute = (route) => this.setState({route: route});
    getPage = (route) => {
        switch(route) {
            case '/welcome': return <Welcome/>;
            case '/new': return <New/>;
            case '/about': return <About/>; 
            case '/create': return <Create/>
            case '/join': return <Join/>
            case '/lobby': return <Lobby/>;
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
