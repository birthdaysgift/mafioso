var d = document;
var userId;
var gameId;
var socket;

axios.get('/whatishappening/')
    .then((response) => {
        userId = response.data.userId;
        gameId = response.data.gameId;
        socket = io(`/${gameId}-game`);
        socket.on('new member', (userJSON) => {
            let u = JSON.parse(userJSON);
            d.querySelector('ul').insertAdjacentHTML(
                'beforeend', `<li>${u.name}</li>`
            );
        });
        socket.on('user ready', (userJSON) => {
            let u = JSON.parse(userJSON);
            d.querySelector('ul').insertAdjacentHTML(
                'afterend', `<div>${u.name} READY`
            );
        });
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
        let data = {userId: userId, gameId: gameId}
        if (this.state.showReady) {
            socket.emit('user ready', data);
        } else {
            socket.emit('user not ready', data);
        }
        this.setState((state) => ({showReady: !state.showReady}));
        this.props.onReadyClick(e);
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

        this.handleReadyClick = this.handleReadyClick.bind(this);
    }

    handleReadyClick(e) {
        socket.on('everybody ready', () => {
            this.setState({showStart: true});
        });
        socket.on('user not ready', (userJSON) => {
            this.setState({showStart: false});
        });
    }

    render() {
        return (
            <div>
                <StartButton showStart={this.state.showStart} />
                <ReadyButton 
                    onReadyClick={this.handleReadyClick} />
            </div>
        );
    }
}

ReactDOM.render(
    <Buttons />, d.querySelector('.buttons')
);