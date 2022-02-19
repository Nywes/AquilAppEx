var express = require('express');
const UserCtrl = require('../db/index')

var router = express.Router();

router.post('/api/user_api/create_user_db', UserCtrl.createUserDB)
router.post('/api/user_api/create_meeting_db', UserCtrl.createMeetingDB)

router.post('/api/user_api/create_user', UserCtrl.createUser)
router.post('/api/user_api/create_meeting', UserCtrl.assignUserToMeeting)

router.get('/api/user_api/users', UserCtrl.readUsers)
router.get('/api/user_api/meetings', UserCtrl.readMeetings)

module.exports = router