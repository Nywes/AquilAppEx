import React, { Component } from 'react';
import './App.css';
import api from './api';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 

    };
    //this.createDB();
  }
  
  async createDB() {
    await api.createUserDB()
    .then(async () => {
      console.log("create User DB works")
    })
    .catch(async (err) => {
      console.log("Caught error while creating user db ", err.response.status);
    })
    await api.createMeetingDB()
    .then(async () => {
      console.log("create Meeting DB works")
    })
    .catch(async (err) => {
      console.log("Caught error while creating meeting db ", err.response.status);
    })
  }

  async createUser(email, date) {
    const payload = {email, date};

    await api.createUser(payload)
    .then(async () => {
      console.log("create User works")
    })
    .catch(async (err) => {
      console.log("Caught error while creating user ", err.response.status);
    })
  }

  async readUsers() {
    await api.readUsers()
    .then(async () => {
      console.log("read User works")
    })
    .catch(async (err) => {
      console.log("Caught error while reading users ", err.response.status);
    })
  }

  render () {
    return (
      <div className="App">
        <h1 className="AquilApp"> South Africa Ticket </h1>
        <p className="App-intro">{this.state.apiResponse}</p>
        <button onClick={() => this.createDB()}>Create DB</button>
        <button onClick={() => this.createUser("eliott@mail.fr", "2022-02-14 10:00:00")}>Ajouter un user</button>
        <button onClick={() => this.readUsers()}>Read users</button>
      </div>
    );
  }
}

export default App;
