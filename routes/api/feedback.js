const express = require('express')
const router = express.Router()
const feedbackHandler = require('../../routes_handlers/feedback')

/**
 * 
 * @api {post} /feedback/delete 反馈信息删除
 * @apiName  反馈信息删除
 * @apiGroup Feedback
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
router.post('/delete', feedbackHandler.delete)
/**
 * 
 * @api {post} /feedback/submit 反馈信息提交
 * @apiName  反馈信息提交
 * @apiGroup Feedback
 * @apiDescription  提交反馈信息
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
router.post('/submit', feedbackHandler.feedback)
/**
 * 
 * @api {get} /feedback/get 反馈信息获取
 * @apiName  反馈信息获取
 * @apiGroup Feedback
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
router.get('/get', feedbackHandler.get)

module.exports = router