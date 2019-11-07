var d = document;
var clientData = {userId: undefined, gameId: undefined}
var socket;

axios.get('/whatishappening/')
    .then((response) => {
        clientData.userId = response.data.userId;
        clientData.gameId = response.data.gameId;
        socket = io(`/${clientData.gameId}-game`);
        socket.on('new member', (userJSON) => {
            let u = JSON.parse(userJSON);
            d.querySelector('ul').insertAdjacentHTML(
                'beforeend', `<li>${u.name}</li>`
            );
        });
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

        socket.on('user ready', (userJSON) => {
            let u = JSON.parse(userJSON);
            console.log(`${u.name} READY`);
        });
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
