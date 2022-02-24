import React, { Component } from 'react';
import '../css/App.css';
import axios from 'axios';

class AddUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            startdate: null,
            enddate: null,
            correctEmail: false,
            correctUserDates: false,
            errorMessage: '',
        }
    }

    addUser = () => {
        this.verifiyUsersParameters()
        if (this.state.correctEmail && this.state.correctUserDates) {
          axios.post('http://localhost:3001/create_user', {
            email: this.state.email,
            startdate: this.state.startdate,
            enddate: this.state.enddate,
          })
        }
    }

    verifiyUsersParameters = () => {
        let re = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if ( re.test(this.state.email) ) {
            this.setState({ correctEmail: true })
        }
        else {
            this.setState({ correctEmail: false })
            this.setState({ errorMessage: "Invalid Email" })
        }
        if ((this.state.startdate === undefined && this.state.enddate !== undefined) || (this.state.enddate === undefined && this.state.startdate !== undefined) || this.state.startdate > this.state.enddate) {
            this.setState({ correctUserDates: false })
            this.setState({ errorMessage: "Invalid Date" })
        } else {
            this.setState({ correctUserDates: true })
        }
      }

    render() {
        return (
            <div className="AddingUser">
            {/* Email Input */}
            <div className="InputField">
              <label className="padding">Email:</label>
              <input className="padding" type="email" onKeyUp={(event) => {
                this.setState({ email: event.target.value })
              }} />
            </div>
            {/* StartDate Input */}
            <div className="InputField">
              <label className="padding">Start of unavailability:</label>
              <input className="padding" type="datetime-local" onChange={(event) => {
                this.setState({ startdate: event.target.value })
              }} />
            </div>
            {/* EndDate Input */}
            <div className="InputField">
              <label className="padding">End of unavailability:</label>
              <input className="padding" type="datetime-local" onChange={(event) => {
                this.setState({ enddate: event.target.value })
              }} />
            </div>
            {/* Error Message */}
            { this.state.correctEmail && this.state.correctUserDates ? 
              null
              :
              <p>{this.state.errorMessage}</p>
            }
            {/* Add User Button */}
            <button className="button" onClick={this.addUser}>Add User</button>
            </div>
        );
    }
}

export { AddUser };