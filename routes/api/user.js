const express = require('express')
const router = express.Router()
const userHandler = require('../../routes_handlers/user')
const expressJoi = require('@escook/express-joi')
const { reg_login_schema, update_psd_schema } = require('../../schema/user')

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
 * @apiBody {String} email
 * @apiBody {String} code
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
 * @api {post} /api/ecode 用户注册验证码
 * @apiName  用户注册验证码
 * @apiGroup User
 * @apiDescription  用户注册验证码
 * @apiVersion  1.0.0
 * 
 * @apiBody {String} username
 * @apiBody {String} email
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
 * {
 *  "status": true,
 *  "message": "Sent"
 * }
 * 
 */
router.post('/ecode', userHandler.ecode)

/**
 * 
 * @api {post} /api/login 用户登录
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
/**
 * 
 * @api {post} /api/changepwd 用户密码修改
 * @apiName 用户密码修改
 * @apiGroup User
 * @apiDescription 返回修改提示
 * @apiVersion  1.0.0
 * 
 * @apiBody {String} username
 * @apiBody {String} password
 * @apiBody {String} secure_code
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
 * {
 *     "status": true,
 *     "message": "修改成功！"
 * }
 * 
 */
router.post('/changepwd', expressJoi(update_psd_schema), userHandler.changePassword)

module.exports = router