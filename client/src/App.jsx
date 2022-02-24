import React/*, { Component }*/ from 'react';
import './App.css';
//import api from './api';
import { useState } from 'react';
import axios from 'axios';
import { DATETIME } from 'mysql/lib/protocol/constants/types';

function App() {
  const [email, setEmail] = useState("");
  const [startdate, setStartDate] = useState();
  const [enddate, setEndDate] = useState();

  const [usersMeetingList, setUsersMeetingList] = useState([{ user: "" }]);
  const [meetingdate, setMeetingDate] = useState();
  const [meetingname, setMeetingName] = useState("");

  let [usersList, setUsersList] = useState([]);
  let [meetingsList, setMeetingsList] = useState([]);

  let [correctEmail, setCorrectEmail] = useState(false);
  let [correctUserDates, setCorrectUserDates] = useState(false);

  const [error_message, setErrorMessage] = useState("");

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

  const addSpecialUser = () => {
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

  const addMeeting = async () => {
    // TODO if empty cancel le move
    await axios.post('http://localhost:3001/create_meeting', {
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
        return false;
      }
    }
    return true;
  }

  const verifyMeetingName = async () => {
    let name = meetingname;
    await axios.get('http://localhost:3001/get_meetings').then((response) => {
      setMeetingsList(response.data.data);
      meetingsList = response.data.data;
    })
    for (var i=0; i < meetingsList.length; i++) {
      if (name === meetingsList[i].meetingname) {
        console.log("isEqual");
        return false;
      }
    }
    return true;
  }

  const giveActalDatetime = () => {
    var today = new Date();
    var year = today.getFullYear()
    var month = (today.getMonth() + 1);
    var date = today.getDate();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    return (`${year}-${month<10?`0${month}`:`${month}`}-${date}T${hours<10?`0${hours}`:`${hours}`}:${minutes<10?`0${minutes}`:`${minutes}`}`);
  }

  const findClosestStart = (closestDate) => {
    var earliestDate = closestDate;
    var incr = -1;
    for (var i=0; i < usersList.length; i++) {
      if (usersList[i].startdate < earliestDate && earliestDate === closestDate) {
        continue;
      }
      if (usersList[i].startdate > closestDate && (usersList[i].startdate < earliestDate || earliestDate === closestDate)) {
        earliestDate = usersList[i].startdate;
        incr = i;
      }
    }
    //rajouter une valeur de retour si il trouve rien
    return (incr);
  }

  const checkIfStartBetween = (closest) => {
    let start = usersList[closest].startdate;
    let end = usersList[closest].enddate;
    var dateBetween = null;
    var incr = closest;

    for (var i=0; i < usersList.length; i++) {
      if (usersList[i].startdate > start && usersList[i].startdate < end && (dateBetween < usersList[i].startdate || dateBetween === null) && usersList[i].enddate > end) {
        incr = i
        dateBetween = usersList[i].startdate;
      }
    }
    return (incr);
  }

  const checkConditions = (closest) => {
    let opening = usersList[closest].enddate
    var opDate = new Date(opening);
    let opTab = {
      year: opDate.getFullYear(),
      month: (opDate.getMonth() + 1),
      date: opDate.getDate(),
      hours: opDate.getHours(),
      minute: opDate.getMinutes(),
    }
    //désolé 29 février mais j'ai la flemme de te gérer
    const months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if ((9 <= opTab.hours && opTab.hours <= 10) || (opTab.hours === 11 && opTab.minute === 0)) {
      return (opTab)
    } else if ((13 <= opTab.hours && opTab.hours <= 15) || (opTab.hours === 16 && opTab.minute === 0)){
      return (opTab)
    } else if (0 <= opTab.hours && opTab.hours <= 8) {
      opTab.hours = 9;
      opTab.minute = 0;
      return (opTab);
    } else {
      opTab.hours = 9;
      opTab.minute = 0;
      opTab.date += 1;
      if (opTab.date > months[opTab.month]) {
        opTab.date = 1;
        opTab.month += 1;
        if (opTab.month > 12) {
          opTab.month = 1;
          opTab.year += 1;
        }
      }
      return (opTab);
    }
  }

  const checkIfConflictWithNextMeeting = (date, closest) => {
    let nextMeeting = findClosestStart(usersList[closest].enddate)
    //c'est degeu
    if (nextMeeting === -1)
      return (closest)
    var nextDate = new Date(usersList[nextMeeting].enddate);
    let nextMeetingTab = {
      year: nextDate.getFullYear(),
      month: (nextDate.getMonth() + 1),
      date: nextDate.getDate(),
      hours: nextDate.getHours(),
      minute: nextDate.getMinutes(),
    }

    console.log(date)
    console.log(nextMeetingTab)
    if (date.year === nextMeetingTab.year && date.month === nextMeetingTab.month && date.date == nextMeetingTab.date) {
      if ((nextMeetingTab.hours - date.hours === 1) && (nextMeetingTab.minute < date.minute)) {
        return (nextMeeting);
      }
    }
    return (closest)
  }

  const addNewUsersIndisponibility = (date) => {
    let startDateVar = (`${date.year}-${date.month<10?`0${date.month}`:`${date.month}`}-${date.date}T${date.hours<10?`0${date.hours}`:`${date.hours}`}:${date.minute<10?`0${date.minute}`:`${date.minute}`}`)
    let endDateVar = (`${date.year}-${date.month<10?`0${date.month}`:`${date.month}`}-${date.date}T${(date.hours + 1)<10?`0${(date.hours + 1)}`:`${(date.hours + 1)}`}:${date.minute<10?`0${date.minute}`:`${date.minute}`}`)
    console.log(startDateVar)
    console.log(endDateVar)
    for (var i=0; i < usersMeetingList.length; i++) {
      setEmail(usersMeetingList[i])
      setStartDate(startDateVar)
      setEndDate(endDateVar)
      addSpecialUser()
    }
  }

  const findMeetingDate = async () => {
    //chiant qu'un mec peut avoir plusieurs indispo ?? pas vraiment jpense
    //penser a quand je rajoute un meeting j'ajoute une indispo pour tout les mecs concernés dans la table user
    //var -> usersList
    // TODO Problem : je prend usersList la alors que je dois utiliser la userList fournie (mettre au bon format)
    await axios.get('http://localhost:3001/get_users').then((response) => {
      setUsersList(response.data.data);
      usersList = response.data.data;
    })
    let closest = findClosestStart(giveActalDatetime())
    console.log(usersList)
    console.log(usersList[closest])
    closest = checkIfStartBetween(closest)
    console.log(usersList)
    console.log(usersList[closest])
    console.log("-------")
    for (var i=0; i < usersList.length; i++) {
      let date = checkConditions(closest)
      let stock = checkIfConflictWithNextMeeting(date, closest)
      if (stock === closest) {
        console.log("result")
        console.log(date)
        addNewUsersIndisponibility(date)
        return (date)
      } else {
        closest = stock
      }
    }
    console.log("ERROR DIDN'T A MEETING SLOT")
  }

  const meetingHandler = async () => {
    let isGood = true;
    // 1 - Check si les users existent
    isGood = await verifyMeetingUsers()
    // 2 - Check si le nom du meeting existe déjà ou pas dans la db
    if (!isGood) {
      // this user doesn't exist
      return;
    }
    isGood = await verifyMeetingName()
    if (!isGood) {
      console.log("The name of this meeting already exist");
      return;
    }
    // 3 - Récupérer les users avec leur indisponibilitées
    // 3 - Faire l'algo de calcul entre toutes les dates
    findMeetingDate()
    // 5 - Verifier que ca correspond aux heures de travail
    // ?
    //last push dans la db
    addMeeting()
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
      {/* SHOW USERS */}
      <div>
        <button className="button" onClick={getUsers}>Show Users</button>
        {usersList.map((val, key) => {
          return <div key={key}>{val.email}</div>
        })}
      </div>
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
        <button className="button" onClick={findMeetingDate}>TEST</button>
        <hr/>
        {/* SHOW MEETINGS*/}
        <div>
          <button className="button" onClick={getMeetings}>Show Meetings</button>
          {meetingsList.map((val, key) => {
            return <div key={key}>{val.users.replaceAll(';', ' ') + " " + val.meetingname}</div>
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
// TODO IDEE DE FOU J'ENVOIE DEUX FOIS UN NEW DATE() POUR CEUX QUI REMPLISSENT RIEN
// penser a mettre une erreur quand meme quand le man en met qu'un des 2

// TODO quand je concat les string -> remove les string vide pck je les laisse passer

// TODO Penser a remove la db quand push