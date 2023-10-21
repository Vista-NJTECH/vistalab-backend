const express = require('express')
const router = express.Router()
const config = require('../../config')

const scheduleHandler = require('../../routes_handlers/scheduleinfo')

/**
 * 
 * @api {get} /schedule/getall 日程信息获取
 * @apiName  日程信息获取
 * @apiGroup Schedule
 * @apiDescription  获取日程信息
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
 *          "title": "xxxx",
 *          "date": "2023-1-29",
 *          "host": "doiry",
 *          "persons": "Cael",
 *          "detail": "xxxx",
 *          "level": "A",
 *          "group": "all",
 *          "create_time": "2023-01-03T03:29:17.000Z"
 *      },
 *  ]
 * }
 * 
 */
router.get('/getall', scheduleHandler.getall)
/**
 * 
 * @api {post} /schedule/delete 日程删除
 * @apiName  日程删除
 * @apiGroup Schedule
 * @apiDescription  删除日程信息
 * @apiVersion  1.0.0
 * 
 * @apiBody {String}    id  日程id
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
 * {
 *  "status": true,
 *  "message": "success"
 * }
 * 
 */
router.post('/delete', scheduleHandler.delete)
/**
 * 
 * @api {post} /schedule/add 日程添加
 * @apiName  日程添加
 * @apiGroup Schedule
 * @apiDescription  添加日程信息
 * @apiVersion  1.0.0
 * 
 * @apiBody {String}    title  标题
 * @apiBody {String}    date     截止日期
 * @apiBody {String}    host   主持人
 * @apiBody {String}    persons   参与人员
 * @apiBody {String}    details   详情
 * @apiBody {String}    [level]   等级
 * @apiBody {String}    [group]   权限用户组默认all
 * @apiBody {String}    [state]   状态
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
 * {
 *  "status": true,
 *  "message": "添加日程成功!"
 * }
 * 
 */
router.post('/add', scheduleHandler.add)
/**
 * 
 * @api {post} /schedule/update 日程更新
 * @apiName  日程更新
 * @apiGroup Schedule
 * @apiDescription  更新日程信息
 * @apiVersion  1.0.0
 * 
 * @apiBody {String}    id       日程id
 * @apiBody {String}    title  标题
 * @apiBody {String}    date     截止日期
 * @apiBody {String}    host   主持人
 * @apiBody {String}    persons   参与人员
 * @apiBody {String}    details   详情
 * @apiBody {String}    [level]   等级
 * @apiBody {String}    [group]   权限用户组默认all
 * @apiBody {String}    [state]   状态
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
 * {
 *  "status": true,
 *  "message": "更新成功!"
 * }
 * 
 */
router.post('/update', scheduleHandler.update)

module.exports = router