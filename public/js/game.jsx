var d = document;
var clientData = {userId: undefined, gameId: undefined}
var socket;

axios.get('/whatishappening/')
    .then((response) => {
        clientData.userId = response.data.userId;
        clientData.gameId = response.data.gameId;

        socket = io(`/${clientData.gameId}-game`);
        socket.emit('new member', clientData);
        ReactDOM.render(
            <Window game={response.data.game}/>, d.querySelector('.game')
        );
    });

function Game(props) {
    return <h1>CONGRATULATIONS</h1>;
}

class Window extends React.Component {
    constructor(props) {
        super(props);
        this.state = {gameStarted: false}

        this.handleStartClick = this.handleStartClick.bind(this);
    }

    handleStartClick() {
        this.setState((state) => ({
            gameStarted: true
        }));
    }

    render() {
        if (this.state.gameStarted) {
            return <Game/>;
        } else {
            return <Lobby game={this.props.game} onStartClicked={this.handleStartClick}/>;
        }
    }
}

class Lobby extends React.Component {
    constructor(props) {
        super(props);
        this.handleStartClick = this.handleStartClick.bind(this);
    }

    handleStartClick() {
        this.props.onStartClicked();
    }

    render() {
        return (
            <div>
                <h1>{this.props.game.title}</h1>
                <Buttons onStartClicked={this.handleStartClick}/>
                <div>Host: {this.props.game.host.name}</div>
                <UsersList members={this.props.game.members}/>
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
        console.log('start clicked');
        this.props.onStartClicked();
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
            socket.emit('user ready', clientData);
        } else {
            socket.emit('user not ready', clientData);
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

class Buttons extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showStart: false, showReady: true};

        this.handleStartClick = this.handleStartClick.bind(this);

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

    handleStartClick() {
        this.props.onStartClicked();
    }

    render() {
        return (
            <div>
                <StartButton 
                    showStart={this.state.showStart} 
                    onStartClicked={this.handleStartClick}/>
                <ReadyButton />
            </div>
        );
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