const express = require('express')
const router = express.Router()
var { expressjwt: jwt } = require("express-jwt");
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
 *          "title": "网站建设工作进程doiry,cael可见",
 *          "details": "test",
 *          "members_id": "1,2",
 *          "ddl": "2022-02-13",
 *          "view_group": "doiry,cael",
 *          "created_time": "2023-01-10T04:03:00.000Z",
 *          "members": "顾俊玮 蔡建文 "
 *      }
 *  ]
 * }
 * 
 */
router.get('/getall', jwt({ 
    secret: config.jwtSecretKey, 
    algorithms: ["HS256"],
    credentialsRequired: false,
  }), projectinfoHandler.getall)
/**
 * 
 * @api {get} /project/getproject 项目详细信息获取
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
 *          "1": [
 *              {
 *                  "id": 1,
 *                  "title": "网站建设工作进程doiry,cael可见",
 *                  "details": "test",
 *                  "members_id": "1,2",
 *                  "view_group": "doiry,cael",
 *                  "created_time": "2023-01-10T04:03:00.000Z",
 *                  "current_work": "完成网站后端设计",
 *                  "future_plan": "完成网站后端设计",
 *                  "remark": "testtesttesttesttesttestt",
 *                  "cycle": 1,
 *                  "upload_time": "2023-01-10T04:10:36.000Z",
 *                  "name": "顾俊玮"
 *              },
 *          ]
 *      },
 *      {
 *          "2": [
 *              {
 *                  "id": 1,
 *                  "title": "网站建设工作进程doiry,cael可见",
 *                  "details": "test",
 *                  "members_id": "1,2",
 *                  "view_group": "doiry,cael",
 *                  "created_time": "2023-01-10T04:03:00.000Z",
 *                  "current_work": "本周工作",
 *                  "future_plan": "2下周工作ww",
 *                  "remark": "2testtesttesttesttesttestt",
 *                  "cycle": 2,
 *                  "upload_time": "2023-01-10T04:10:36.000Z",
 *                  "name": "蔡建文"
 *              },
 *              {
 *                  "id": 1,
 *                  "title": "网站建设工作进程doiry,cael可见",
 *                  "details": "test",
 *                  "members_id": "1,2",
 *                  "view_group": "doiry,cael",
 *                  "created_time": "2023-01-10T04:03:00.000Z",
 *                  "current_work": "本周工作",
 *                  "future_plan": "2下周工作ww",
 *                  "remark": "testtesttesttesttesttestt",
 *                  "cycle": 2,
 *                  "upload_time": "2023-01-10T04:10:36.000Z",
 *                  "name": "顾俊玮"
 *              }
 *          ]
 *      }
 *  ]
 * }
 * 
 */
router.get('/getproject', jwt({ 
    secret: config.jwtSecretKey, 
    algorithms: ["HS256"],
    credentialsRequired: false,
  }), projectinfoHandler.getProject)
/**
 * 
 * @api {post} /project/delete 项目删除
 * @apiName  项目删除
 * @apiGroup Project
 * @apiDescription  删除项目信息
 * @apiVersion  1.0.0
 * 
 * @apiHeader {String} Authorization token
 * 
 * @apiBody {String}    id  项目id
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
 * {
 *  "status": true,
 *  "message": "success"
 * }
 * @apiErrorExample {json} Error-Response:
 * {
 *   "status": false,
 *   "message": "您没有权限删除!"
 * }
 * 
 */
router.post('/delete', jwt({ 
    secret: config.jwtSecretKey, 
    algorithms: ["HS256"] 
  }), projectinfoHandler.delete)
/**
 * 
 * @api {post} /project/add 项目添加
 * @apiName  项目添加
 * @apiGroup Project
 * @apiDescription  添加项目信息
 * @apiVersion  1.0.0
 * 
 * @apiHeader {String} Authorization token
 * 
 * @apiBody {String}    title  标题
 * @apiBody {String}    date     截止日期
 * @apiBody {String}    details   简介
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
 * {
 *  "status": true,
 *  "message": "success"
 * }
 * 
 */
router.post('/add', jwt({ 
    secret: config.jwtSecretKey, 
    algorithms: ["HS256"],
  }), projectinfoHandler.add)
/**
 * 
 * @api {post} /project/submit 项目进度提交
 * @apiName  项目进度提交
 * @apiGroup Project
 * @apiDescription  提交项目进度信息
 * @apiVersion  1.0.0
 * 
 * @apiHeader {String} Authorization token
 * 
 * @apiBody {String}    id  项目id
 * @apiBody {String}    cycle     项目周期
 * @apiBody {String}    work   本周期所作工作
 * @apiBody {String}    plan   下周期计划
 * @apiBody {String}    remark   备注
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
 * {
 *  "status": true,
 *  "message": "项目进度提交成功!"
 * }
 * @apiErrorExample {json} Error-Response:
 * {
 *   "status": false,
 *   "message": "您已经添加过该周期记录!"
 * }
 * @apiErrorExample {json} Error-Response:
 * {
 *   "status": false,
 *   "message": "您没有权限添加!"
 * }
 */
router.post('/submit', jwt({ 
    secret: config.jwtSecretKey, 
    algorithms: ["HS256"],
  }), projectinfoHandler.submit)
/**
 * 
 * @api {post} /project/update 项目更新(暂不支持)
 * @apiName  项目更新
 * @apiGroup Project
 * @apiDescription  更新项目信息
 * @apiVersion  1.0.0
 * 
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
 * {
 *  "status": true,
 *  "message": "success"
 * }
 * 
 */
router.post('/update', jwt({ 
    secret: config.jwtSecretKey, 
    algorithms: ["HS256"],
  }), projectinfoHandler.update)

module.exports = router