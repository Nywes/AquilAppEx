import React/*, { Component }*/ from 'react';
import './App.css';
//import api from './api';
import { useState } from 'react';
import axios from 'axios';

function App() {
  const [email, setEmail] = useState("");
  const [startdate, setStartDate] = useState();
  const [enddate, setEndDate] = useState();

  const [usersMeetingList, setUsersMeetingList] = useState([{ user: "" }]);
  const [meetingdate, setMeetingDate] = useState();

  const [usersList, setUsersList] = useState([]);
  const [meetingsList, setMeetingsList] = useState([]);

  const addUser = () => {
    // TODO if startdate after enddate => ERROR
    axios.post('http://localhost:3001/create_user', {
      email: email,
      startdate: startdate,
      enddate: enddate,
    }).then(() => {
      console.log("sucess");
    });
  }

  const JoinUserMeetingList = () => {
    var len = usersMeetingList.length;
    var incr = 0;
    var list = '';
    while (incr < len) {
      if (incr === 0) {
        list = list.concat('', usersMeetingList[incr].user);
      } else {
        list = list.concat(';', usersMeetingList[incr].user);
      }
      incr += 1;
    }
    return (list);
  }

  const addMeeting = () => {
    // TODO if empty cancel le move
    axios.post('http://localhost:3001/create_meeting', {
      users: JoinUserMeetingList(),
      date: meetingdate,
    })
  }

  const getUsers = () => {
    axios.get('http://localhost:3001/get_users').then((response) => {
        console.log(response.data.data)
        setUsersList(response.data.data)
    })
  }

  const getMeetings = () => {
    axios.get('http://localhost:3001/get_meetings').then((response) => {
        console.log(response.data.data)
        setMeetingsList(response.data.data)
    })
  }

  const handleUserMeetingAdd = () => {
    setUsersMeetingList([...usersMeetingList, { user: "" }])
  }

  const handleUserMeetingRemove = (index) => {
    const list = [...usersMeetingList]

    list.splice(index, 1)
    setUsersMeetingList(list)
  }

  const handleUserMeetingChange = (e, index) => {
    const {name, value} = e.target
    const list = [...usersMeetingList]
    list[index][name] = value;
    setUsersMeetingList(list)
  }

  return (
    <div className="App">
      <h1 className="AquilApp"> South Africa Ticket </h1>
      {/* ADD A USER */}
      <div>
        <label>Email:</label>
        <input type="text" onChange={(event) => {
          setEmail(event.target.value)  
        }} />
        <label>Start of unavailability:</label>
        <input type="datetime-local" onChange={(event) => {
          setStartDate(event.target.value)  
        }} />
        <label>End of unavailability:</label>
        <input type="datetime-local" onChange={(event) => {
          setEndDate(event.target.value)  
        }} />
        <button onClick={addUser}>Add User</button>
      </div>
      {/* SHOW USERS*/}
      <div>
        <button onClick={getUsers}>Show Users</button>
        {usersList.map((val, key) => {
          return <div>{val.email}</div>
        })}
      </div>
      {/* ADD A MEETING */}
      <div>
        <form className="App" autoComplete="off">
          <div className="form-field">
            <label htmlFor="user" type="text" id="user" required />
            {usersMeetingList.map((singleUser, index) => (
              <div key={index} className="users">
                <div className="first-division">
                  <input name="user" type="text" id="user" required 
                    value={singleUser.user}
                    onChange={(e) => handleUserMeetingChange(e, index)}
                  />
                  {usersMeetingList.length - 1 === index &&
                  (
                    <button
                      type="button"
                      className="add-btn"
                      onClick={handleUserMeetingAdd}
                    >
                      <span>Add a User</span>
                    </button> 
                  )}
                </div>
                <div className="second-division">
                  {usersMeetingList.length > 1 && 
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => handleUserMeetingRemove(index)}
                    >
                      <span>Remove</span>
                    </button>
                  }
                </div>
              </div>
            ))}
          </div>
        </form>
        <label>Set the meeting datetime:</label>
        <input type="datetime-local" onChange={(event) => {
          setMeetingDate(event.target.value)  
        }} />
        <button onClick={addMeeting}>Add Meeting</button>
        {/* SHOW MEETINGS*/}
        <div>
          <button onClick={getMeetings}>Show Meetings</button>
          {meetingsList.map((val, key) => {
            return <div>{val.users.replaceAll(';', ' ')}</div>
          })}
        </div>
      </div>
    </div>
  )
}

export default App;
