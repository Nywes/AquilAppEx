import React from 'react';
import './css/App.css';
import { AddUser } from "./components/addUser";
import { AddMeeting } from "./components/addMeeting";
import { useState } from 'react';
import axios from 'axios';

function App() {

  let [usersList, setUsersList] = useState([]);
  let [meetingsList, setMeetingsList] = useState([]);

  const getUsers = () => {
    axios.get('http://localhost:3001/get_users').then((response) => {
        setUsersList(response.data.data)
        usersList = response.data.data
    })
  }

  const getMeetings = () => {
    axios.get('http://localhost:3001/get_meetings').then((response) => {
      setMeetingsList(response.data.data)
      meetingsList = response.data.data
    })
  }

  return (
    <div className="App">
      <h1 className="AquilApp">Agenda</h1>
      {/* ADD A USER */}
      <AddUser />
      <hr/>
      {/* SHOW USERS */}
      <div>
        <button className="button" onClick={getUsers}>Show Users</button>
        {usersList.map((val, key) => {
          return <div key={key}>
            <strong>{val.email}</strong>
            { val.startdate === null && val.enddate === null ? 
              null
              :
              ` is unavailable from ${val.startdate} to ${val.enddate}`
            }
          </div>
        })}
      </div>
      <hr/>
      {/* ADD A MEETING */}
      <AddMeeting />
      <hr/>
      {/* SHOW MEETINGS*/}
      <div>
        <button className="button" onClick={getMeetings}>Show Meetings</button>
        {meetingsList.map((val, key) => {
          return <div key={key}>
            La réunion : <strong>{val.meetingname}</strong>, aura lieu {val.date} avec: {val.users.replaceAll(';', ', ')}
          </div>
        })}
      </div>
    </div>
  )
}

export default App;