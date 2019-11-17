const {connect, Provider} = ReactRedux;
const {createStore, bindActionCreators} = Redux;

var d = document;
var STATES, ROLES;
var socket;


const ACTION_UPDATE_USER = 'ACTION_UPDATE_USER';
const ACTION_UPDATE_GAME = 'ACTION_UPDATE_GAME';

const updateUser = (newUser) => {
    return {
        type: ACTION_UPDATE_USER,
        payload: newUser
    }
};

const updateGame = (newGame) => {
    return {
        type: ACTION_UPDATE_GAME,
        payload: newGame
    }
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTION_UPDATE_USER:
            return { 
                ...state, 
                user: {...state.user, ...action.payload} 
            };
        case ACTION_UPDATE_GAME:
            return {
                ...state, 
                game: {...state.game, ...action.payload }
            };
    }
    return state;
};

const mapStateToProps = (state) => {
    return {
        user: state.user,
        game: state.game
    }
}

const mapActionsToProps = (dispatch) => {
    return {
        updateUser: bindActionCreators(updateUser, dispatch),
        updateGame: bindActionCreators(updateGame, dispatch)
    }
}

axios.get('/whatishappening/')
    .then((response) => {
        STATES = response.data.STATES;
        ROLES = response.data.ROLES;
        
        const store = createStore(rootReducer, {
            user: {
                ...response.data.user
            },
            game: {
                ...response.data.game,
                everybodyReady: false
            }
        });

        socket = io(`/${response.data.game.id}-game`);
        socketLogging(socket);
        socket.emit(
            'new member',
            response.data.user.id,
            response.data.game.id
        );

        const WrappedWindow = connect(mapStateToProps, mapActionsToProps)(Window);
        ReactDOM.render(
            <Provider store={store}>
                <WrappedWindow/>
            </Provider>,
            d.querySelector('.game')
        );
    });

class Window extends React.Component {
    constructor(props) {
        super(props);

        socket.on('new member', (userJSON, gameJSON) => {
            this.props.updateGame(JSON.parse(gameJSON));
            this.props.updateGame({everybodyReady: false});
        });
        socket.on('user disconnected', (userJSON, gameJSON) => {
            this.props.updateGame(JSON.parse(gameJSON));
        });
        socket.on('user ready', (userJSON, gameJSON) => {
            this.props.updateGame(JSON.parse(gameJSON));
            let u = JSON.parse(userJSON);
            if (this.props.user.id === u.id) {
                this.props.updateUser(u);
            }
        });
        socket.on('user not ready', (userJSON, gameJSON) => {
            this.props.updateGame(JSON.parse(gameJSON));
            this.props.updateGame({everybodyReady: false});
            let u = JSON.parse(userJSON);
            if (this.props.user.id === u.id) {
                this.props.updateUser(u);
            }
        });
        socket.on('everybody ready', (userJSON, gameJSON) => {
            this.props.updateGame({everybodyReady: true});
        });
        socket.on('mafia votes', (mafJSON, innoJSON, gameJSON) => {
            let m = JSON.parse(mafJSON);
            let i = JSON.parse(innoJSON);
            let g = JSON.parse(gameJSON);
            if (i.id === this.props.user.id) {
                this.props.updateUser(i);
            }
            this.props.updateGame(g);
            console.log(`maf ${m.name} votes for ${i.name}`);
        });
        socket.on('mafia unvotes', (mafJSON, innoJSON, gameJSON) => {
            let m = JSON.parse(mafJSON);
            let i = JSON.parse(innoJSON);
            let g = JSON.parse(gameJSON);
            if (i.id === this.props.user.id) {
                this.props.updateUser(i);
            }
            this.props.updateGame(g);
            console.log(`maf ${m.name} unvotes for ${i.name}`);
        });
        socket.on('mafia kills', (innoJSON, gameJSON) => {
            let i = JSON.parse(innoJSON);
            if (i.id === this.props.user.id) {
                this.props.updateUser(i);
            }
            this.props.updateGame(JSON.parse(gameJSON));
            if (this.props.user.id === this.props.game.host.id) {
                socket.emit('next game state');
            }
        });
        socket.on('innocent votes', (innoJSON, susJSON, gameJSON) => {
            let i = JSON.parse(innoJSON);
            let s = JSON.parse(susJSON);
            let g = JSON.parse(gameJSON);
            if (s.id === this.props.user.id) {
                this.props.updateUser(s);
            }
            this.props.updateGame(g);
            console.log(`inno ${i.name} votes for ${s.name}`);
        });
        socket.on('innocent unvotes', (innoJSON, susJSON, gameJSON) => {
            let i = JSON.parse(innoJSON);
            let s = JSON.parse(susJSON);
            let g = JSON.parse(gameJSON);
            if (s.id === this.props.user.id) {
                this.props.updateUser(s);
            }
            this.props.updateGame(g);
            console.log(`inno ${i.name} unvotes for ${s.name}`);
        })
        socket.on('innocent kills', (susJSON, gameJSON) => {
            let s = JSON.parse(susJSON);
            if (s.id === this.props.user.id) {
                this.props.updateUser(s);
            }
            this.props.updateGame(JSON.parse(gameJSON));
            if (this.props.user.id === this.props.game.host.id) {
                socket.emit('next game state');
            }
        });

        socket.on('next game state', (userJSON, gameJSON) => {
            this.props.updateUser(JSON.parse(userJSON));
            this.props.updateGame(JSON.parse(gameJSON));
            this.props.updateGame({everybodyReady: false});
        });
    }

    render() {
        if (this.props.user.state === STATES.USER.DEAD) {
            return <Dead/>
        }
        switch (this.props.game.state) {
            case STATES.GAME.LOBBY:
                return <Lobby
                            user={this.props.user}
                            game={this.props.game}/>;

            case STATES.GAME.MEETING:
                return <Meeting
                            user={this.props.user}
                            game={this.props.game}/>;
            case STATES.GAME.NIGHT:
                return <Night
                            user={this.props.user}
                            game={this.props.game}/>;
            case STATES.GAME.DAY:
                return <Day
                            user={this.props.user}
                            game={this.props.game}/>;
            case STATES.GAME.INNOCENT_WIN:
                return <InnocentWin/>;
            case STATES.GAME.MAFIA_WIN:
                return <MafiaWin/>;
        }
    }
}

function Lobby(props) {
    return (
        <div>
            <h1>{props.game.title}</h1>
            <StartButton
                show={props.game.everybodyReady}/>
            <ReadyButton showReady={!(props.user.state === STATES.USER.READY)}/>
            <div>Host: {props.game.host.name}</div>
            <UsersList members={props.game.members}/>
        </div>
    );
}

class StartButton extends React.Component {
    constructor(props) {
        super(props);
        
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        socket.emit('next game state');
    }

    render() {
        let element = <div onClick={this.handleClick}>START</div>;
        return this.props.show ? element : null
    }
}

class ReadyButton extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        if (this.props.showReady) {
            socket.emit('user ready');
        } else {
            socket.emit('user not ready');
        }
    }

    render() {
        return (
            <div onClick={this.handleClick}>
                {this.props.showReady ? "READY" : "NOT READY"}
            </div>
        )
    }
}

function UsersList(props) {
    let listItems = props.members.map((m) => {
        let state;
        if (m.state === STATES.USER.READY) {
            state = 'READY';
        } else if (m.state === STATES.USER.NOT_READY) {
            state = 'NOT READY';
        }
        return <li key={m.id}>{m.name} {state}</li>;
    });
    return <ul>{listItems}</ul>;
}

class Meeting extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let element;
        if (this.props.game.state === STATES.GAME.NIGHT) {
            element = <h1>night</h1>;
        } else {
            element = (
                <div>
                    <Role role={this.props.user.role}/>
                    <StartButton show={this.props.game.everybodyReady}/>
                    <ReadyButton showReady={!(this.props.user.state === STATES.USER.READY)}/>
                </div>
            );
        }
        return element;
    }
}

class Role extends React.Component {
    constructor(props) {
        super(props);
        this.state = {show: false};

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState((state) => ({show: !state.show}));
    }

    render() {
        let role;
        if (this.props.role === ROLES.MAFIA) {
            role = 'MAFIA';
        } else if (this.props.role === ROLES.INNOCENT) {
            role = 'INNOCENT';
        }
        return (
            <div>
                <h1>{this.state.show ? role : null}</h1>
                <div onClick={this.handleClick}>
                    {this.state.show ? 'HIDE' : 'SHOW'} ROLE
                </div>
            </div>
        )
    }
}

class Night extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.user.role === ROLES.INNOCENT) {
            return <div>Close your eyes!</div>
        }
        if (this.props.user.role === ROLES.MAFIA) {
            return (
                <VotingWidget
                    user={this.props.user}
                    game={this.props.game}
                    voteFunc={votedId =>
                        socket.emit('mafia votes', votedId)}
                    unvoteFunc={votedId =>
                        socket.emit('mafia unvotes', votedId)}/>
            )
        }
    }
}

class VotingWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {votedUserId: undefined};

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        let votedId = e.target.getAttribute('userid');
        if (this.state.votedUserId === votedId) {
            this.props.unvoteFunc(votedId);
            this.setState({votedUserId: undefined});
            return ;
        }
        if (this.state.votedUserId === undefined
                && parseInt(votedId) >= 0) {
            this.props.voteFunc(votedId);
            this.setState({votedUserId: votedId});
            return ;
        }

    };
    
    render() {
        return (
            <ul onClick={this.handleClick}>
                {
                    this.props.game.members.map(m => {
                        if (this.props.game.state === STATES.GAME.NIGHT 
                                && m.role !== ROLES.MAFIA
                                && m.state !== STATES.USER.DEAD) {
                            return (
                                <li key={m.id} userid={m.id}>
                                    {m.name} [{m.votes.map(v => v.name)}]
                                </li>
                            )
                        }
                        if (this.props.game.state === STATES.GAME.DAY
                                && m.state !== STATES.USER.DEAD
                                && m.id !== this.props.user.id) {
                            return (
                                <li key={m.id} userid={m.id}>
                                    {m.name} [{m.votes.map(v => v.name)}]
                                </li>
                            )
                        }
                    })
                }
            </ul>
        )
    }
}

class Day extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div>Vote, please!</div>
                <VotingWidget 
                    user={this.props.user}
                    game={this.props.game}
                    voteFunc={votedId => 
                        socket.emit('innocent votes', votedId)}
                    unvoteFunc={votedId =>
                        socket.emit('innocent votes', votedId)}/>
            </div>
        )
    };
}

function InnocentWin(props) {
    return <h1>Innocent Win!</h1>
}

function MafiaWin(props) {
    return <h1>Mafia Win!</h1>
}

function Dead(props) {
    return <div>You're dead :(</div>
}

function socketLogging(socket) {
    socket.on('new member', (userJSON, gameJSON) => {
        console.log(`${JSON.parse(userJSON).name} connected`);
    });
    socket.on('user disconnected', (userJSON, gameJSON) => {
        console.log(`${JSON.parse(userJSON).name} disconnected`);
    });
    socket.on('user ready', (userJSON, gameJSON) => {
        console.log(`${JSON.parse(userJSON).name} ready`);
    });
    socket.on('user not ready', (userJSON, gameJSON) => {
        console.log(`${JSON.parse(userJSON).name} not ready`);
    });
    socket.on('everybody ready', () => {
        console.log('everybody ready');
    });
    socket.on('start game', (userJSON, gameJSON) => {
        console.log(`${JSON.parse(gameJSON).title} started`);
    });
    socket.on('ready for night', (userJSON, gameJSON) => {
        console.log(`${JSON.parse(userJSON).name} ready for night`);
    });
    socket.on('everybody ready for night', (gameJSON) => {
        console.log('everybody ready for night');
    });
}
