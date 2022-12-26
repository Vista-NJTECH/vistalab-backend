const express = require('express')
const router = express.Router()

// 导入用户路由处理函数模块
const userHandler = require('../router_handler/user')

// 表单验证模块
const expressJoi = require('@escook/express-joi')
const { reg_login_schema } = require('../schema/user')

// 注册
router.post('/register', expressJoi(reg_login_schema), userHandler.register)
// 登录
router.post('/login', expressJoi(reg_login_schema), userHandler.login)

router.post('/member', userHandler.allmembers)

module.exports = router
