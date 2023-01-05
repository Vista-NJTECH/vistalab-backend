// 导入 express
const express = require('express')
// 创建路由对象
const router = express.Router()

const userinfoHandler = require('../router_handler/userinfo')
/**
 * 
 * @api {get} /api/register 用户登录
 * @apiName 用户登录
 * @apiGroup 用户
 * @apiDescription 返回用户token
 * @apiVersion  1.0.0
 * 
 * @apiBody {String} id
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
 * {
 *  status: 0,
    message: '登录成功！',
    token: 'vista ' + tokenStr,
 *  }
 * }
 * 
 */
router.get('/userinfo', userinfoHandler.getUserInfo)

module.exports = router
