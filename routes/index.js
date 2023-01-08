const express = require('express')
const router = express.Router()
const config = require('../config')
var { expressjwt: jwt } = require("express-jwt");

router.use('/api', require('./api/commonapi'));

router.use('/competition', require('./api/competition-info'))

router.use('/activity', require('./api/activityinfo'))

router.use('/study', require('./api/studyinfo'))

router.use('/my', jwt({ 
        secret: config.jwtSecretKey, 
        algorithms: ["HS256"] 
    }), require('./api/userinfo'))

router.use('/schedule', require('./api/scheduleinfo'))

router.use('/member', require('./api/memberinfo'))

router.use('/invoice', jwt({ 
        secret: config.jwtSecretKey, 
        algorithms: ["HS256"] 
    }), require('./api/invoice'))

module.exports = router