var express = require('express');
const UserCtrl = require('../db/index')

var router = express.Router();

router.post('/create_user', UserCtrl.createUser)
router.post('/create_meeting', UserCtrl.createMeeting)

router.get('/get_users', UserCtrl.getUsers)
router.get('/get_meetings', UserCtrl.getMeetings)

module.exports = router