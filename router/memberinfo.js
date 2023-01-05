const express = require('express')
const router = express.Router()

// 导入用户路由处理函数模块
const memberinfoHandler = require('../router_handler/memberinfo')
/**
 * 
 * @api {get} /member/getall 成员信息获取
 * @apiName  成员信息获取
 * @apiGroup 成员
 * @apiDescription  获取成员信息
 * @apiVersion  1.0.0
 * 
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
 * {
 *  "status": true,
    "data": [
        {
            "id": 1001,
            "name": "jerryGu",
            "colleage": "计算机科学与技术学院",
            "specialty": "计算机科学与技术",
            "phonenum": "xxxx",
            "research": "SLAM",
            "email": "jerrygu.gjw@gmail.com"
        },
 *  ]
 * }
 * 
 */
router.get('/getall', memberinfoHandler.getall)

module.exports = router
