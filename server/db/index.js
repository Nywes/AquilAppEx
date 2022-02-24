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
    console.log("create User")
    console.log(req.body.email)
    console.log(req.body.startdate)
    console.log(req.body.enddate)
    db.run(`INSERT INTO users(email,startdate,enddate) VALUES(?, ?, ?)`, [req.body.email, req.body.startdate, req.body.enddate], (err) => {
        if (err) {
            console.log(err);
            throw err;
        }
    });
}

const createMeeting = (req, res) => {
    console.log("create Meeting")
    console.log(req.body.users)
    console.log(req.body.date)
    console.log(req.body.meetingname)
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
            if (!result || result.length === 0) {
                return res
                    .status(404)
                    .json({ success: false, error: `BaseUser not found` })
            }
            return res.status(200).json({ success: true, data: result })
            /*console.log("show result:")
            console.log(result);
            //le crash est ici
            res.send(result);*/
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

/*
    db.run(`INSERT INTO users(email,date)
    VALUES(?, ?)`, [name, date]
        ('petranb2@gmail.com','2022-02-15 09:00:00')`, (err) => {
        if (err) {
            console.log(err);
            throw err;
        }
    });

//close the database connection
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Close the database connection.');
});
*/

// db.serialize let us run sqlite operations in serial order
/*db.serialize(() => {
    // 1rst operation (run create table statement)
    db.run('CREATE TABLE IF NOT EXISTS users(email text,date datetime)', (err) => {
        if (err) {
            console.log(err);
            throw err;
        }
    });
    // 2nd operation (insert into users table statement)
    db.run(`INSERT INTO users(email,date)
              VALUES('petran@pkoulianos.com','2022-02-16 09:00:00'),
                    ('petranb2@gmail.com','2022-02-15 09:00:00')`, (err) => {
        if (err) {
            console.log(err);
            throw err;
        }
    });
    // 3rd operation (retrieve data from users table)
    db.each(`SELECT email FROM users`, (err, row) => {
        if (err) {
            console.log(err);
            throw err;
        }
        console.log(row.email);
    }, () => {
        console.log('query completed')
    });

});*/