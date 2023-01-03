const express = require('express')
const router = express.Router()

// 导入用户路由处理函数模块
const scheduleHandler = require('../router_handler/scheduleinfo')

router.get('/getall', scheduleHandler.getall)

router.get('/delete', scheduleHandler.delete)

router.post('/add', scheduleHandler.add)

module.exports = router