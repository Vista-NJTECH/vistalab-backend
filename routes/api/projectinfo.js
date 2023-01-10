const express = require('express')
const router = express.Router()
const config = require('../../config')

const projectinfoHandler = require('../../routes_handlers/projectinfo')

/**
 * 
 * @api {get} /project/getall 项目信息获取
 * @apiName  项目信息获取
 * @apiGroup Project
 * @apiDescription  获取项目信息
 * @apiVersion  1.0.0
 * 
 * @apiHeader {String} [Authorization] token
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
 * {
 *  "status": true,
 *  "data": [
 *      {
 *          "id": 1,
 *          "title": "网站建设工作进程",
 *          "details": "test",
 *          "view_group": "common, doiry",
 *          "created_time": "2023-01-09T20:03:00.000Z"
 *      }
 *  ]
 * }
 * 
 */
router.get('/getall', projectinfoHandler.getall)
/**
 * 
 * @api {get} /project/getcategory 项目详细信息获取
 * @apiName  详细项目信息获取
 * @apiGroup Project
 * @apiDescription  获取详细项目信息
 * @apiVersion  1.0.0
 * 
 * @apiHeader {String} [Authorization] token
 * 
 * @apiParam {String} id 项目id
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
 * {
 *  "status": true,
 *  "data": [
 *      {
 *          "id": 1,
 *          "project_id": 1,
 *          "member_id": 1,
 *          "current_work": "本周工作",
 *          "future_plan": "下周工作",
 *          "remark": "testtesttesttesttesttestt",
 *          "cycle": 1,
 *          "create_time": "2023-01-09T20:10:36.000Z",
 *          "view_group": "cael",
 *          "title": "网站建设工作进程",
 *          "details": "test"
 *      },
 *  ]
}
 * 
 */
router.get('/getproject', projectinfoHandler.getProject)
/**
 * 
 * @api {post} /project/delete 项目删除
 * @apiName  项目删除
 * @apiGroup Project
 * @apiDescription  删除项目信息
 * @apiVersion  1.0.0
 * 
 * @apiHeader {String} [Authorization] token
 * 
 * @apiBody {String}    id  项目id
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
 * {
 *  "status": true,
 *  "message": "success"
 * }
 * 
 */
router.post('/delete', projectinfoHandler.delete)
/**
 * 
 * @api {post} /project/add 项目添加
 * @apiName  项目添加
 * @apiGroup Project
 * @apiDescription  添加项目信息
 * @apiVersion  1.0.0
 * 
 * @apiHeader {String} [Authorization] token
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
 *  "message": "添加项目成功!"
 * }
 * 
 */
router.post('/add', projectinfoHandler.add)
/**
 * 
 * @api {post} /project/update 项目更新
 * @apiName  项目更新
 * @apiGroup Project
 * @apiDescription  更新项目信息
 * @apiVersion  1.0.0
 * 
 * @apiBody {String}    id       项目id
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
router.post('/update', projectinfoHandler.update)

module.exports = router