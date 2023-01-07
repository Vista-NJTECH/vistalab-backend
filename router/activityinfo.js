const express = require('express')
const router = express.Router()

// 导入用户路由处理函数模块
const activityinfoHandler = require('../router_handler/activityinfo')

const multer = require('multer')

const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, 'public/uploads/activatyinfoimg/')
      
    },
    filename(req, file, cb){
      cb(null, Date.now() + "-" + file.originalname)
    }
  })
const upload = multer({storage})

/**
 * 
 * @api {post} /api/getactivity 获取动态信息
 * @apiName  获取动态信息
 * @apiGroup Home
 * @apiDescription  获取首页动态信息
 * @apiVersion  1.0.0
 * 
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
 * {
 *  "status": true,
 *  "message": "插入成功!"
 * }
 * 
 */
router.post('/getactivity', upload.single("img"), activityinfoHandler.getActivity)

module.exports = router