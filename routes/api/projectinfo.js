const express = require('express')
const router = express.Router()
const config = require('../../config')

const projectinfoHandler = require('../../routes_handlers/projectinfo')

/**
 * 
 * @api {get} /project/getall 项目信息获取
 * @apiName  项目信息获取
 * @apiGroup Schedule
 * @apiDescription  获取项目信息
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
router.get('/getall', projectinfoHandler.getall)
/**
 * 
 * @api {get} /study/getcategory 课程分类信息获取
 * @apiName  课程分类信息获取
 * @apiGroup Study
 * @apiDescription  获取一级分类下课程信息信息，无一级分类则输出所有信息
 * @apiVersion  1.0.0
 * 
 * @apiParam {String} [class] 一级分类
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
 * {
 *  "status": true,
 *  "data": [
 *      {
 *          "coursename": "Arduino"
 *      },
 *      {
 *          "coursename": "CMake"
 *      },
 *      {
 *          "coursename": "OpenCV"
 *      }
 *  ]
}
 * 
 */
router.get('/getproject', projectinfoHandler.getProject)
/**
 * 
 * @api {post} /project/delete 项目删除
 * @apiName  项目删除
 * @apiGroup Schedule
 * @apiDescription  删除项目信息
 * @apiVersion  1.0.0
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
 * @apiGroup Schedule
 * @apiDescription  添加项目信息
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
 *  "message": "添加项目成功!"
 * }
 * 
 */
router.post('/add', projectinfoHandler.add)
/**
 * 
 * @api {post} /project/update 项目更新
 * @apiName  项目更新
 * @apiGroup Schedule
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