// 导入 express
const express = require('express')
// 创建路由对象
const router = express.Router()

const userinfoHandler = require('../router_handler/userinfo')

router.get('/userinfo', userinfoHandler.getUserInfo)

module.exports = router
