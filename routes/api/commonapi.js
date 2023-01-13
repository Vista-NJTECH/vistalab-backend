const express = require('express')
const router = express.Router()

// 导入用户路由处理函数模块
const commonapiHandler = require('../../routes_handlers/commonapi')

router.use('/', require('./testapi'));

router.use('/', require('./homepageinfo'));

router.use('/', require('./user'));

router.use('/', require('../machine-learning/face'));

/**
 * 
 * @api {get} /api/getimg 通用获取图片
 * @apiName  通用获取图片base64
 * @apiGroup Commom
 * @apiDescription  获取图片base64
 * @apiVersion  1.0.0
 * 
 * @apiBody {String} id
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
 * {
 *  "status": true,
 *  "base64": "data:image/png;base64,hrshb6terhwvbyejke665hbdf="
 * }
 * 
 */
router.get('/getimg', commonapiHandler.getimg)
/**
 * 
 * @api {get} /api/feedback 反馈信息
 * @apiName  通用获取反馈信息
 * @apiGroup Commom
 * @apiDescription  获取反馈信息
 * @apiVersion  1.0.0
 * 
 * @apiBody {String} feedback
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
 * {
 *  "status": true,
 *  "message": "success"
 * }
 * 
 */
router.post('/feedback', commonapiHandler.feedback)
module.exports = router