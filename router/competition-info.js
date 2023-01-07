const express = require('express')
const router = express.Router()

// 导入用户路由处理函数模块
const competitioninfoHandler = require('../router_handler/competition-info')

/**
 * 
 * @api {get} /api/getcompetition 获取比赛信息
 * @apiName  获取比赛信息
 * @apiGroup Compitition
 * @apiDescription  获取比赛信息
 * @apiVersion  1.0.0
 * 
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
 * {
 *  "status": true,
 *  "message": "success",
 *  "data": [
 *      {
 *          "id": 1,
 *          "name": "xxxx",
 *          "introduction": "xxxx",
 *          "link": "{\"k1\": \"value\", \"k2\": [10, 20]}"
 *      }
 *  ]
 * 
 */
router.get('/getcompetition', competitioninfoHandler.getCompetition)
module.exports = router