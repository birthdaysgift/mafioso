var d = document;
var clientData = {userId: undefined, gameId: undefined}
var socket;

axios.get('/whatishappening/')
    .then((response) => {
        clientData.userId = response.data.userId;
        clientData.gameId = response.data.gameId;
        let members = response.data.members;

        socket = io(`/${clientData.gameId}-game`);
        socket.emit('register socket', clientData);
        ReactDOM.render(
            <UsersList members={members}/>, d.querySelector('.usersList')
        );
        ReactDOM.render(
            <Buttons />, d.querySelector('.buttons')
        );
    });

class StartButton extends React.Component {
    constructor(props) {
        super(props);
        
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        console.log('start clicked');
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

        socket.on('register socket', (userJSON) => {
            let u = JSON.parse(userJSON);
            console.log(`${u.name} connected`);
        })
        socket.on('everybody ready', () => {
            this.setState({showStart: true});
            console.log('everybody ready');
        });
        socket.on('user not ready', (userJSON) => {
            let u = JSON.parse(userJSON);
            this.setState({showStart: false});
            console.log(`${u.name} NOT READY`);
        });
    }

    render() {
        return (
            <div>
                <StartButton showStart={this.state.showStart} />
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
            return <li key={m.id}>{m.name} {m.state.toUpperCase()}</li>;
        });
        return <ul>{listItems}</ul>;
    }
}