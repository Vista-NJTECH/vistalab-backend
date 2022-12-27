const express = require('express')
const router = express.Router()

// 导入用户路由处理函数模块
const memberinfoHandler = require('../router_handler/memberinfo')

router.get('/getall', memberinfoHandler.getall)

module.exports = router
