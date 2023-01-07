const express = require('express')
const router = express.Router()

// 导入用户路由处理函数模块
const commonapiHandler = require('../router_handler/commonapi')

router.use('/', require('./homepageinfo'));

router.use('/', require('./user'));

module.exports = router