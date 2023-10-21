const express = require('express')
const router = express.Router()

// 导入用户路由处理函数模块
const testapiHandler = require('../../routes_handlers/testapi')

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
router.get('/getpreview', testapiHandler.getPreview)

module.exports = router