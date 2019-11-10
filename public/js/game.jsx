var d = document;
var clientData = {userId: undefined, gameId: undefined}
var STATES = {}
var socket;

axios.get('/whatishappening/')
    .then((response) => {
        clientData.userId = response.data.user.id;
        clientData.gameId = response.data.game.id;
        STATES = response.data.STATES;
        
        socket = io(`/${clientData.gameId}-game`);
        socket.emit('new member', clientData);
        ReactDOM.render(
            <Window game={response.data.game}/>, d.querySelector('.game')
        );
    });

class Window extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameStarted: false, 
            game: {}
        };

        socket.on('start game', (gameJSON) => {
            let ga = JSON.parse(gameJSON);
            this.setState({
                gameStarted: true,
                game: ga
            });
        });
    }

    render() {
        if (this.state.gameStarted) {
            return <Game game={this.state.game}/>;
        } else {
            return <Lobby game={this.props.game}/>;
        }
    }
}

class Lobby extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1>{this.props.game.title}</h1>
                <Buttons />
                <div>Host: {this.props.game.host.name}</div>
                <UsersList members={this.props.game.members}/>
            </div>
        );
    }
}

class Buttons extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showStart: false, showReady: true};

        socket.on('new member', (userJSON) => {
            let u = JSON.parse(userJSON);
            this.setState({showStart: false});
            console.log(`${u.name} connected`);
        })
        socket.on('everybody ready', () => {
            this.setState({showStart: true});
            console.log('everybody ready');
        });
        socket.on('user not ready', (userJSON) => {
            this.setState({showStart: false});
        });
    }

    render() {
        return (
            <div>
                <StartButton 
                    showStart={this.state.showStart} />
                <ReadyButton />
            </div>
        );
    }
}

class StartButton extends React.Component {
    constructor(props) {
        super(props);
        
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        socket.emit('start game');
    }

    render() {
        let element = <div onClick={this.handleClick}>START</div>;
        return this.props.showStart ? element : null
    }
}

class ReadyButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showReady: true};

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        if (this.state.showReady) {
            socket.emit('user ready');
        } else {
            socket.emit('user not ready');
        }
        this.setState((state) => ({showReady: !state.showReady}));
    }

    render() {
        return (
            <div onClick={this.handleClick}>
                {this.state.showReady ? "READY" : "NOT READY"}
            </div>
        )
    }
}

class UsersList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {members: props.members}
        socket.on('new member', (userJSON) => {
            this.setState((state) => {
                state.members.push(JSON.parse(userJSON));
                return {members: state.members};
            });
        });
        socket.on('user ready', (userJSON) => {
            let u = JSON.parse(userJSON);
            this.setState((state) => {
                let members = state.members.map((m) => {
                    if (m.id === u.id) {
                        m.state = m.STATES.READY;
                    }
                    return m
                });
                return {members: members};
            });
        });
        socket.on('user not ready', (userJSON) => {
            let u = JSON.parse(userJSON);
            this.setState((state) => {
                let members = state.members.map((m) => {
                    if (m.id === u.id) {
                        m.state = m.STATES.NOT_READY;
                    }
                    return m
                });
                return {members: members};
            });
        });
        socket.on('user disconnected', (userJSON) => {
            let u = JSON.parse(userJSON);
            this.setState((state) => {
                let members = state.members.filter((m) => {
                    return m.id != u.id;
                });
                return {members: members};
            });
        });
    }

    render() {
        let listItems = this.state.members.map((m) => {
            let state;
            if (m.state === m.STATES.READY) {
                state = 'READY';
            } else if (m.state === m.STATES.NOT_READY) {
                state = 'NOT READY';
            }
            return <li key={m.id}>{m.name} {state}</li>;
        });
        return <ul>{listItems}</ul>;
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            game: this.props.game,
            showRole: false
        };

        this.handleRoleClick = this.handleRoleClick.bind(this);
        this.handleReadyClick = this.handleReadyClick.bind(this);

        socket.on('ready for night', (userJSON) => {
            let u = JSON.parse(userJSON);
            console.log(`${u.name} ready for night`);
        });
        socket.on('everybody ready for night', (gameJSON) => {
            this.setState({
                showStart: true,
                game: JSON.parse(gameJSON)
            });
            console.log('everybody ready for night');
        });
    }

    handleRoleClick() {
        this.setState((state) => ({
            showRole: !state.showRole
        }));
    }

    handleReadyClick() {
        socket.emit('ready for night');
    }

    render() {
        let g = this.props.game;
        let u = g.members.filter((m) => {
            return m.id === clientData.userId;
        })[0];
        let role;
        if (u.role === u.ROLES.MAFIA) {
            role = 'MAFIA';
        } else if (u.role === u.ROLES.INNOCENT) {
            role = 'INNOCENT';
        }
        let element;
        if (this.state.game.state === this.state.game.STATES.NIGHT) {
            element = <h1>night</h1>;
        } else {
            element = (
                <div>
                    <h1>{this.state.showRole ? role : null}</h1>
                    {this.state.showStart ? <div>START NIGHT</div> : null}
                    <div onClick={this.handleRoleClick}>
                        {!this.state.showRole ? 'SHOW' : 'HIDE'} ROLE
                    </div>
                    <div onClick={this.handleReadyClick}>READY TO SLEEP</div>
                </div>
            );
        }
        return element;
    }
}
