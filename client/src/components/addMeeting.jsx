import React, { Component } from 'react';
import '../css/App.css';
import axios from 'axios';

function giveActalDatetime() {
    var today = new Date();
    var year = today.getFullYear()
    var month = (today.getMonth() + 1);
    var date = today.getDate();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    return (`${year}-${month<10?`0${month}`:`${month}`}-${date}T${hours<10?`0${hours}`:`${hours}`}:${minutes<10?`0${minutes}`:`${minutes}`}`)
}

function transformDateToString(date) {
    var dateStr = '';
    dateStr = dateStr.concat('le ', date.date);
    dateStr = dateStr.concat('-', date.month);
    dateStr = dateStr.concat('-', date.year);
    dateStr = dateStr.concat(' à ', date.hours);
    dateStr = dateStr.concat('h', `${date.minute<10?`0${date.minute}`:`${date.minute}`}`);
    return (dateStr)
}

class AddMeeting extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usersMeetingList: [{user: ""}],
            meetingdate: "",
            meetingname: "",
            usersList: [],
            meetingsList: [],
            isError: false,
            errorMessage: '',
        }
    }

    addSpecialUser = () => {
        axios.post('http://localhost:3001/create_user', {
            email: this.state.email,
            startdate: this.state.startdate,
            enddate: this.state.enddate,
          })
    }

    handleUserMeetingAdd = () => {
        this.setState({ usersMeetingList: [...this.state.usersMeetingList, { user: "" }] })
    }

    handleUserMeetingRemove = (index) => {
      const list = [...this.state.usersMeetingList]

      list.splice(index, 1)
      this.setState({ usersMeetingList: list })
    }

    handleUserMeetingChange = (e, index) => {
      const {name, value} = e.target
      const list = [...this.state.usersMeetingList]
      list[index][name] = value;
      this.setState({ usersMeetingList: list })
    }

    /* ALGORITHM FUNCTIONS */

    verifyMeetingUsers = async () => {
        let users = this.state.usersMeetingList;
        var findUser = false;
        let re = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        await axios.get('http://localhost:3001/get_users').then((response) => {
            this.setState({ usersList: response.data.data })
        })
        for (var i=0; i < users.length; i++) {
            findUser = false;
            if (!re.test(users[i].user)) {
                this.setState({ errorMessage: `The user "${users[i].user}" is invalid` })
                this.setState({ isError: true })
            return false;
          }
          for (var j=0; j < this.state.usersList.length; j++) {
            if (users[i].user === this.state.usersList[j].email) {
                this.setState({ isError: false })
                findUser = true;
            }
          }
          if (findUser === false) {
            this.setState({ errorMessage: `This user : "${users[i].user}", doesn't exist` })
            this.setState({ isError: true })
            return false;
          }
        }
        return true;
    }
    
    verifyMeetingName = async () => {
        let name = this.state.meetingname;
        await axios.get('http://localhost:3001/get_meetings').then((response) => {
            this.setState({ meetingsList: response.data.data })
        })
        for (var i=0; i < this.state.meetingsList.length; i++) {
          if (name === this.state.meetingsList[i].meetingname) {
            return false;
          }
        }
        return true;
    }

    checkIsIndisponibilityInProgress = async (actualDate) => {
        await axios.get('http://localhost:3001/get_users').then((response) => {
            this.setState({ usersList: response.data.data })
        })
        var users = this.state.usersMeetingList;
        let longestDate = actualDate;
        var result = -1;

        for (var j=0; j < users.length; j++) {
          for (var i=0; i < this.state.usersList.length; i++) {
            if (users[j].user === this.state.usersList[i].email) {
              if (this.state.usersList[i].startdate <= longestDate && this.state.usersList[i].enddate > longestDate) {
                longestDate = this.state.usersList[i].enddate;
                result = i;
              }
            }
          }
        }
        return (result);
    }

    findClosestStart = (closestDate) => {
        var earliestDate = closestDate;
        var incr = -1;
        let users = this.state.usersMeetingList
        for (var j=0; j < users.length; j++) {
          for (var i=0; i < this.state.usersList.length; i++) {
            if (users[j].user === this.state.usersList[i].email) {
              if (this.state.usersList[i].startdate < earliestDate) {
                continue;
              }
              if (this.state.usersList[i].startdate > closestDate && (this.state.usersList[i].startdate <= earliestDate || earliestDate === closestDate)) {
                earliestDate = this.state.usersList[i].enddate;
                //incr = findClosestStart(earliestDate) ?
                //récursive nécessaire ?? je crois mais je suis pas certains
                incr = i;
              }
            }
          }
        }
        return (incr);
    }

    checkIfStartBetween = async (closest) => {
        if (closest === -1) {
          return (closest)
        }
        await axios.get('http://localhost:3001/get_users').then((response) => {
            this.setState({ usersList: response.data.data })
        })
        let start = this.state.usersList[closest].startdate;
        let end = this.state.usersList[closest].enddate;
        var dateBetween = null;
        var incr = closest;
        var users = this.state.usersMeetingList;
    
        for (var j=0; j < users.length; j++) {
          for (var i=0; i < this.state.usersList.length; i++) {
            if (users[j].user === this.state.usersList[i].email) {
              if (this.state.usersList[i].startdate > start && this.state.usersList[i].startdate < end && (dateBetween < this.state.usersList[i].startdate || dateBetween === null) && this.state.usersList[i].enddate > end) {
                incr = i
                dateBetween = this.state.usersList[i].startdate;
              }
            }
          }
        }
        return (incr);
    }

    checkConditions = async (closest) => {
        await axios.get('http://localhost:3001/get_users').then((response) => {
            this.setState({ usersList: response.data.data })
        })
        var opDate = null;
        if (closest === -1) {
          opDate = new Date();
        } else {
          let opening = this.state.usersList[closest].enddate
          opDate = new Date(opening);
        }
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
    
    checkIfConflictWithNextMeeting = async (date, closest) => {
        if (closest === -1) {
          return (closest)
        }
        await axios.get('http://localhost:3001/get_users').then((response) => {
            this.setState({ usersList: response.data.data })
        })
        let nextMeeting = this.findClosestStart(this.state.usersList[closest].enddate)
        //c'est degeu
        if (nextMeeting === -1)
          return (closest)
        var nextDate = new Date(this.state.usersList[nextMeeting].enddate);
        let nextMeetingTab = {
          year: nextDate.getFullYear(),
          month: (nextDate.getMonth() + 1),
          date: nextDate.getDate(),
          hours: nextDate.getHours(),
          minute: nextDate.getMinutes(),
        }
    
        if (date.year === nextMeetingTab.year && date.month === nextMeetingTab.month && date.date === nextMeetingTab.date) {
          if ((nextMeetingTab.hours - date.hours === 1) && (nextMeetingTab.minute < date.minute)) {
            return (nextMeeting);
          }
        }
        return (closest)
    }

    findMeetingDate = async () => {
        await axios.get('http://localhost:3001/get_users').then((response) => {
            this.setState({ usersList: response.data.data })
        })
        let closestStartDateIndex = await this.checkIsIndisponibilityInProgress(giveActalDatetime())
        let closest = null;
        if (closestStartDateIndex === -1) {
          closest = this.findClosestStart(giveActalDatetime())
        } else {
          closest = this.findClosestStart(this.state.usersList[closestStartDateIndex].enddate)
        }
        if (closest === -1) {
          closest = closestStartDateIndex
        }
        closest = await this.checkIfStartBetween(closest)
        var users = this.state.usersMeetingList;
    
        for (var j=0; j < users.length; j++) {
          for (var i=0; i < this.state.usersList.length; i++) {
            if (users[j].user === this.state.usersList[i].email) {
              let date = await this.checkConditions(closest)
              let stock = await this.checkIfConflictWithNextMeeting(date, closest)
              if (stock === closest) {
                return (date)
              } else {
                closest = stock
              }
            }
          }
        }
        console.log("ERROR DIDN'T A MEETING SLOT")
    }

    joinUserMeetingList = () => {
        var len = this.state.usersMeetingList.length;
        var incr = 0;
        var list = '';
        while (incr < len) {
          if (incr === 0) {
            list = list.concat('', this.state.usersMeetingList[incr].user);
          } else {
            if (this.state.usersMeetingList[incr].user !== "") {
              list = list.concat(';', this.state.usersMeetingList[incr].user);
            }
          }
          incr += 1;
        }
        return (list);
    }

    addNewUsersIndisponibility = (date) => {
        let startDateVar = (`${date.year}-${date.month<10?`0${date.month}`:`${date.month}`}-${date.date}T${date.hours<10?`0${date.hours}`:`${date.hours}`}:${date.minute<10?`0${date.minute}`:`${date.minute}`}`)
        let endDateVar = (`${date.year}-${date.month<10?`0${date.month}`:`${date.month}`}-${date.date}T${(date.hours + 1)<10?`0${(date.hours + 1)}`:`${(date.hours + 1)}`}:${date.minute<10?`0${date.minute}`:`${date.minute}`}`)

        for (var i=0; i < this.state.usersMeetingList.length; i++) {
            this.setState({ email: this.state.usersMeetingList[i].user })
            this.setState({ startdate: startDateVar })
            this.setState({ enddate: endDateVar })
            this.addSpecialUser()
        }
    }

    addMeeting = async () => {
        axios.post('http://localhost:3001/create_meeting', {
          users: this.joinUserMeetingList(),
          date: this.state.meetingdate,
          meetingname: this.state.meetingname,
        })
        //window.location.reload(false);
    }

    meetingHandler = async () => {
        let isGood = true;
        let date = null;

        isGood = await this.verifyMeetingUsers()
        if (!isGood) {
          return;
        }
        isGood = await this.verifyMeetingName()
        if (!isGood) {
            this.state({ errorMessage: "The name of this meeting already exist" })
            this.state({ isError: true })
            return;
        }
        this.setState({ isError: false })
        date = await this.findMeetingDate()
        this.setState({ meetingdate: transformDateToString(date) })
        this.addNewUsersIndisponibility(date)
        await this.addMeeting()
      }

    render() {
        return (
            <div>
                <form className="App" autoComplete="off">
                  <div className="form-field">
                    <label htmlFor="user" type="text" id="user" required />
                    {this.state.usersMeetingList.map((singleUser, index) => (
                      <div key={index} className="users">
                        <div className="first-division">
                          <div className="RemoveInputField padding">
                            <input className="margin-right" name="user" type="text" id="user" required 
                              value={singleUser.user}
                              onChange={(e) => this.handleUserMeetingChange(e, index)}
                            />
                            <div className="second-division">
                              {this.state.usersMeetingList.length > 1 && 
                                <button
                                  type="button"
                                  className="button"
                                  onClick={() => this.handleUserMeetingRemove(index)}
                                >
                                  <span>Remove</span>
                                </button>
                              }
                            </div>
                          </div>
                          {this.state.usersMeetingList.length - 1 === index &&
                          (
                            <button
                              type="button"
                              className="button margin-bot"
                              onClick={this.handleUserMeetingAdd}
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
                      this.setState({ meetingname: event.target.value })
                  }} />
                </div>
                {/* Add Meeting Button */}
                { this.state.isError ? 
                    <p>{this.state.errorMessage}</p>
                    :
                    null
                }
                <button className="button" onClick={this.meetingHandler}>Add Meeting</button>
            </div>
        );
    }
}

export { AddMeeting };