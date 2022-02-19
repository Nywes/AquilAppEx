const sqlite3 = require('sqlite3').verbose();

// open database in memory
let db = new sqlite3.Database('./api/db/aquilapp.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});
//create the User Database
const createUserDB = () => {
    console.log("create user db");
    db.run('CREATE TABLE IF NOT EXISTS users(email text,date datetime)', (err) => {
        if (err) {
            console.log(err);
            throw err;
        }
    });
}
//create the Meetings Database
const createMeetingDB = () => {
    console.log("create meeting db");
    db.run('CREATE TABLE IF NOT EXISTS meetings(email text,date datetime,id int)', (err) => {
        if (err) {
            console.log(err);
            throw err;
        }
    });
}
//fill user unavailability in user database
const createUser = (email, date) => {
    console.log("create User")
    db.run(`INSERT INTO users(email,date) VALUES(?, ?)`, [email, date], (err) => {
        if (err) {
            console.log(err);
            throw err;
        }
    });
}

//assigns users to the meetings they are assigned to
const assignUserToMeeting = (email, date, id) => {
    console.log("create User")
    db.run(`INSERT INTO users(email,date,id) VALUES(?, ?, ?)`, [email, date, id], (err) => {
        if (err) {
            console.log(err);
            throw err;
        }
    });
}

//read Users Database
const readUsers = () => {
    console.log("Read users");
    db.each(`SELECT email, date FROM users`, (err, row) => {
        if (err) {
            console.log(err);
            throw err;
        }
        console.log(row.email, row.date);
    }, () => {
        console.log('query completed')
    });
}

//read Meetings Database
const readMeetings = () => {
    console.log("Read meetings");
    db.each(`SELECT email, date, id FROM meetings`, (err, row) => {
        if (err) {
            console.log(err);
            throw err;
        }
        console.log(row.email, row.date, row.id);
    }, () => {
        console.log('query completed')
    });
}

module.exports = {
    createUserDB,
    createMeetingDB,
    createUser,
    assignUserToMeeting,
    readUsers,
    readMeetings,
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