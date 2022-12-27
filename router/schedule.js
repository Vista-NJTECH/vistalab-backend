const express = require('express')
const router = express.Router()

// 导入用户路由处理函数模块
const scheduleHandler = require('../router_handler/schedule')

router.get('/getall', scheduleHandler.allschedules)

router.post('/add', scheduleHandler.add)

module.exports = router