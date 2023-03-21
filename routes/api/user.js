const express = require('express')
const router = express.Router()
const userHandler = require('../../routes_handlers/user')
const expressJoi = require('@escook/express-joi')
const { reg_login_schema } = require('../../schema/user')

/**
 * 
 * @api {post} /api/register 用户注册
 * @apiName  用户注册
 * @apiGroup User
 * @apiDescription  用户注册
 * @apiVersion  1.0.0
 * 
 * @apiBody {String} username
 * @apiBody {String} password
 * @apiBody {String} Invitation_code
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
 * {
 *  "status": true,
 *  "message": "注册成功！"
 * }
 * 
 */
router.post('/register', expressJoi(reg_login_schema), userHandler.register)
/**
 * 
 * @api {post} /api/register 用户登录
 * @apiName 用户登录
 * @apiGroup User
 * @apiDescription 返回用户token
 * @apiVersion  1.0.0
 * 
 * @apiBody {String} username
 * @apiBody {String} password
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
 * {
 *  "status": true,
 *  "message": "登录成功！",
 *  "userinfo": {
 *      "id": 1,
 *      "password": "",
 *      "username": "doiry",
 *      "avatar": "panth/to/your.png",
 *      "name": "jerrygu",
 *      "email": "jerrygu.gjw@gmail.com",
 *      "level": 0,
 *      "created_time": "2022-12-26T15:02:16.000Z",
 *      "p_group": "doiry,common"
 *  },
 *  "token": "Bearer token"
 *  }
 * 
 */
router.post('/login', expressJoi(reg_login_schema), userHandler.login)

router.get('/getall', userHandler.getAllUser)

router.get('/edit', userHandler.edit)

module.exports = router