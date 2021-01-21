import React, { Component } from 'react';

const RoutingContext = React.createContext();

class Router extends Component {
    constructor(props) {
        super(props);

        let route = this.props.index;
        route.push('.');

        this.state = {
            route: route,
            setRoute: (route) => {
                route.push('.');
                this.setState({route: route});
            }
        }
    }

    render() {
        return (
            <RoutingContext.Provider value={this.state}>
                {this.props.children}
            </RoutingContext.Provider>
        )
    }
}

class Route extends Component {
    static contextType = RoutingContext;
    render() {
        let route = [...this.context.route];
        if ( this.props.path === route.shift() ) {
            return (
                <RoutingContext.Provider value={{
                    route: route, 
                    setRoute: this.context.setRoute
                }}>
                        {this.props.children}
                </RoutingContext.Provider>
            )
        } else {
            return null;
        }
    }
}

export { Router, Route, RoutingContext };