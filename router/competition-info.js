const express = require('express')
const router = express.Router()

// 导入用户路由处理函数模块
const competitioninfoHandler = require('../router_handler/competition-info')

/**
 * 
 * @api {get} /competition/getall 获取比赛信息
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
 *          "name": "全国大学生智能汽车竞赛",
 *          "introduction": "航天智慧物流组",
 *          "link": {
 *              "官网": "xxxx",
 *              "xxx": "xxxx"
 *          }
 *      },
 *  ]
 * 
 */
router.get('/getall', competitioninfoHandler.getCompetition)
module.exports = router