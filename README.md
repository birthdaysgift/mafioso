# ![](https://raw.githubusercontent.com/birthdaysgift/mafioso/master/client/src/App/common/logo/logo50x50.png "Mafioso") Mafioso

[Mafioso](http://195.133.1.11:3000/) is an online helper for your Mafia party games.

Mafioso takes a moderator role, when everybody at the party wants to play a game and nobody wants to be a moderator. App runs on the phone of every player and lets him to see his role, participate in the voting process, ensures game phases changing and looks after overall game state (who is alive and what is the current turn). 

## Getting started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

### Prerequisites

- Linux
- Docker ([https://docs.docker.com/engine/install/](https://docs.docker.com/engine/install/))
- Docker Compose ([https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/))

### Installation

Clone repository
```bash
git clone https://github.com/birthdaysgift/mafioso.git
```
go to project folder
```bash
cd mafioso
```
and run
```bash
./compose.sh dev up
```

## Running the tests

Go to project folder
```bash
cd mafioso
```
and run
```bash
./compose.sh dev test
```