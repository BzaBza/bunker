import React from 'react';
import {db} from "../../firebase";
import * as firebase from "firebase";

class Users extends React.Component {

    componentDidMount() {
        this.getMarkers()
    }

    constructor(props) {
        super(props);
        this.state = {
            thisPlayerName: '',
            selectedPlayer: '',
            playersList: [],
            dbPlayer: null

        };

        this.handleChange = this.handleChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    async getMarkers() {
        db.collection("sessions")
            .onSnapshot((snapshot) => {
                //console.log(snapshot.docs.map(doc => doc.data()))

                this.setState(() => this.state.sessionList = snapshot.docs.map(doc => doc.data()))
            });

        db.collection("players")
            .onSnapshot((snapshot) => {
                //console.log(snapshot.docs.map(doc => doc.data()))

                this.setState(() => this.state.playersList = snapshot.docs.map(doc => doc.data()))
            });
    }

    handleChange(event) {
        this.setState({selectedSession: event.target.value});
    }

    handleNameChange(event) {
        this.setState({selectedPlayer: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
    }


    setActivePlayer(name) {
        let tempRef = this.state;
        this.state.dbPlayer = db.collection('players').doc(name);
        this.state.dbPlayer.get().then(function (doc) {
            //console.log('then')
            tempRef.dbActiveSession = doc.data().inSession;
           // console.log(doc.data.inSession)
           // console.log("Name" ,doc.data().name)
        });

        if (this.state.dbActiveSession != null) {
           // console.log("not null", this.state.dbActiveSession)
            tempRef.dbActiveSession.get().then(function (doc) {
                tempRef.activeSessionName = doc.data().name;
            })
        }
        this.state.thisPlayerName = name;

       // console.log(this.state.thisPlayerName)
       // console.log('Active ses', this.state.dbActiveSession)
        // console.log(this.state.thisPlayerName)
    }

    createPlayer(name) {
        db.collection('players').doc(name).set({
            name: name,
            id: this.state.playersList.length,
            inSession: null,
            state: "Active",
        })
        //this.setActivePlayer(name);
        console.log(this.state.dbPlayer);
        console.log(this.state.playersList.length);
        console.log("New player ", name);
    }

    deletePlayer(name) {
        db.collection('players').doc(name).delete();
        console.log("Player", name, "deleted");
    }

    deleteAllPlayers() {
        for (const item of this.state.playersList) {
            this.deletePlayer(item.name);
            console.log("All players deleted", item)
        }

    }


    render() {
        return (
            <div>
                <h1>Users</h1>

                <label>Player Name:</label>
                <input type="text" value={this.state.value} onChange={this.handleNameChange}/>
                <div>
                    <button onClick={() => this.createPlayer(this.state.selectedPlayer)}>Create player</button>
                </div>
                <div>
                    <button onClick={() => this.setActivePlayer(this.state.selectedPlayer)}>Set active player</button>
                </div>
                <div>
                    <button onClick={() => this.deletePlayer(this.state.selectedPlayer)}>Delete Player</button>
                </div>
                <div>
                    <button onClick={() => this.deleteAllPlayers()}>Clear Players</button>
                </div>


                <label>Players:</label>
                <ul className="list-group">
                    {this.state.playersList.map(listitem => (
                        <li className="list-group-item list-group-item-primary">
                            {listitem['name']}
                        </li>
                    ))}
                </ul>

            </div>
        );
    }
}

export default Users;
