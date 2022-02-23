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
  const [meetingname, setMeetingName] = useState("");

  let [usersList, setUsersList] = useState([]);
  const [meetingsList, setMeetingsList] = useState([]);

  let [correctEmail, setCorrectEmail] = useState(false);
  let [correctUserDates, setCorrectUserDates] = useState(false);

  const [error_message, setErrorMessage] = useState("");

  let isGood = true;

  const addUser = () => {
    verifiyUsersParameters()
    if (correctEmail && correctUserDates) {
      axios.post('http://localhost:3001/create_user', {
        email: email,
        startdate: startdate,
        enddate: enddate,
      }).then(() => {
        console.log("sucess");
      });
    }
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
      meetingname: meetingname,
    })
  }

  const getUsers = () => {
    axios.get('http://localhost:3001/get_users').then((response) => {
        setUsersList(response.data.data)
    })
  }

  const getMeetings = () => {
    axios.get('http://localhost:3001/get_meetings').then((response) => {
        setMeetingsList(response.data.data)
    })
  }

  let verifiyUsersParameters = () => {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if ( re.test(email) ) {
      setCorrectEmail(true);
      correctEmail = true;
    }
    else {
      correctEmail = false;
      setCorrectEmail(false);
      setErrorMessage("Invalid Email");
    }
    if (startdate > enddate || startdate === undefined || enddate === undefined) {
      setErrorMessage("Invalid Date");
      correctUserDates = false;
      setCorrectUserDates(false);
    } else {
      correctUserDates = true;
      setCorrectUserDates(true);
    }
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

  const verifyMeetingUsers = async () => {
    let users = usersMeetingList;
    var findUser = false;
    await axios.get('http://localhost:3001/get_users').then((response) => {
        setUsersList(response.data.data);
        usersList = response.data.data;
    })
    for (var i=0; i < users.length; i++) {
      findUser = false;
      for (var j=0; j < usersList.length; j++) {
        if (users[i].user === usersList[j].email) {
          findUser = true;
        }
      }
      if (findUser === false) {
        console.log(`This user : ${users[i].user}, doesn't exist`);
        isGood = false;
      }
    }
  }

  const verifyMeetingName = async () => {
    let name = meetingname;
    await axios.get('http://localhost:3001/get_meetings').then((response) => {
      setMeetingsList(response.data.data);
      meetingsList = response.data.data;
    })
    for (var i=0; i < meetingsList.length; i++) {
      if (name === users[i].name) {
        isGood = false;
        return
      }
    }
  }

  const meetingHandler = () => {
    // 1 - Check si les users existent
    verifyMeetingUsers()
    // 2 - Check si le nom du meeting existe déjà ou pas dans la db
    verifyMeetingName()
    // 3 - Récupérer les users avec leur indisponibilitées
    // 3 - Faire l'algo de calcul entre toutes les dates
    // ?
    // 5 - Verifier que ca correspond aux heures de travail
    // ?
    //last push dans la db
    //addMeeting()
  }

  return (
    <div className="App">
      <h1 className="AquilApp"> South Africa Ticket </h1>
      {/* ADD A USER */}
      <div className="AddingUser">
        {/* Email Input */}
        <div className="InputField">
          <label className="padding">Email:</label>
          <input className="padding" type="email" onKeyUp={(event) => {
            setEmail(event.target.value) 
          }} />
        </div>
        {/* StartDate Input */}
        <div className="InputField">
          <label className="padding">Start of unavailability:</label>
          <input className="padding" type="datetime-local" onChange={(event) => {
            setStartDate(event.target.value)
          }} />
        </div>
        {/* EndDate Input */}
        <div className="InputField">
          <label className="padding">End of unavailability:</label>
          <input className="padding" type="datetime-local" onChange={(event) => {
            setEndDate(event.target.value)
          }} />
        </div>
        {/* Error Message */}
        { correctEmail && correctUserDates ? 
          null
          :
          <p>{error_message}</p>
        }
        {/* Add User Button */}
        <button className="button" onClick={addUser}>Add User</button>
      </div>
      <hr/>
      {/* SHOW USERS
      <div>
        <button className="button" onClick={getUsers}>Show Users</button>
        {usersList.map((val, key) => {
          return <div>{val.email}</div>
        })}
      </div>*/}
      <hr/>
      {/* ADD A MEETING */}
      <div>
        <form className="App" autoComplete="off">
          <div className="form-field">
            <label htmlFor="user" type="text" id="user" required />
            {usersMeetingList.map((singleUser, index) => (
              <div key={index} className="users">
                <div className="first-division">
                  <div className="RemoveInputField padding">
                    <input className="margin-right" name="user" type="text" id="user" required 
                      value={singleUser.user}
                      onChange={(e) => handleUserMeetingChange(e, index)}
                    />
                    <div className="second-division">
                      {usersMeetingList.length > 1 && 
                        <button
                          type="button"
                          className="button"
                          onClick={() => handleUserMeetingRemove(index)}
                        >
                          <span>Remove</span>
                        </button>
                      }
                    </div>
                  </div>
                  {usersMeetingList.length - 1 === index &&
                  (
                    <button
                      type="button"
                      className="button margin-bot"
                      onClick={handleUserMeetingAdd}
                    >
                      <span>Add a User</span>
                    </button> 
                  )}
                </div>
              </div>
            ))}
          </div>
        </form>
        {/* Meeting Name */}
        <div className="AddingUser InputField">
          <label className="padding">Meeting Name:</label>
          <input className="padding" type="text" onKeyUp={(event) => {
            setMeetingName(event.target.value) 
          }} />
        </div>
        {/* Add Meeting Button */}
        <button className="button" onClick={meetingHandler}>Add Meeting</button>
        <hr/>
        {/* SHOW MEETINGS*/}
        <div>
          <button className="button" onClick={getMeetings}>Show Meetings</button>
          {meetingsList.map((val, key) => {
            return <div>{val.users.replaceAll(';', ' ')}</div>
          })}
        </div>
      </div>
    </div>
  )
}

export default App;

// TODO Changer le systeme de verif sur les dates
// pck on peut renseigner un mec qu'avec son email
// donc juste check si 1 des 2 est null
// ok si les deux sont null ou les deux fill
// si 1 mais pas l'autre error

//quand je concat les string -> remove les string vide pck je les laisse passer


// 1 - Check si les users existent
// 2 - Check si le nom existe déjà ou pas dans la db
// 3 - Récupérer les users avec leur indisponibilitées
// 4 - faire l'algo de calcul entre toutes les dates
// 5 - Verifier que ca correspond aux heures de travail
// 6 - 

// LAST - Push les valeurs dans la db