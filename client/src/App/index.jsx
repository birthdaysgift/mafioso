import React, {Component} from 'react';

import PageContext from '../context';
import AboutPage from '../AboutPage';
import WelcomePage from '../WelcomePage';

import './style.less';

class App extends Component { 
    constructor(props) {
        super(props);
        this.state = {route: '/welcome'};
    }
    setRoute = (route) => this.setState({route: route});
    getPage = (route) => {
        switch(route) {
            case '/welcome': return <WelcomePage/>;
            case '/about': return <AboutPage/>; 
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
