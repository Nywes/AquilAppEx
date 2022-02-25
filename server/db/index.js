const sqlite3 = require('sqlite3').verbose();

// open database in memory
let db = new sqlite3.Database('./db/aquilapp.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
  createUserDB()
  createMeetingDB()
});

//create the User Database
const createUserDB = () => {
    console.log("create user db");
    db.run('CREATE TABLE IF NOT EXISTS users(email text,startdate datetime, enddate datetime)', (err) => {
        if (err) {
            console.log(err);
            throw err;
        }
    });
}
//create the Meetings Database
const createMeetingDB = () => {
    console.log("create meeting db");
    db.run('CREATE TABLE IF NOT EXISTS meetings(users text, date text, meetingname text)', (err) => {
        if (err) {
            console.log(err);
            throw err;
        }
    });
}
//fill user unavailability in user database
const createUser = (req, res) => {
    db.run(`INSERT INTO users(email,startdate,enddate) VALUES(?, ?, ?)`, [req.body.email, req.body.startdate, req.body.enddate], (err) => {
        if (err) {
            console.log(err);
            throw err;
        }
    });
}

const createMeeting = (req, res) => {
    db.run(`INSERT INTO meetings(users,date,meetingname) VALUES(?, ?, ?)`, [req.body.users, req.body.date, req.body.meetingname], (err) => {
        if (err) {
            console.log(err);
            throw err;
        }
    });
}

const getUsers = (req, res) => {
    db.all("SELECT * FROM users", (err, result) => {
        if (err) {
            console.log(err);
            throw err;
        } else {
            return res.status(200).json({ success: true, data: result })
        }
    })
};

const getMeetings = (req, res) => {
    db.all("SELECT * FROM meetings", (err, result) => {
        if (err) {
            console.log(err);
            throw err;
        } else {
            return res.status(200).json({ success: true, data: result })
        }
    })
}

module.exports = {
    createUser,
    createMeeting,
    getUsers,
    getMeetings,
}