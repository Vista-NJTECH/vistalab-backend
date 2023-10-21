const express = require('express')
const router = express.Router()
const multer = require('multer')

const signupapiHandler = require('../../routes_handlers/signupapi')


const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, 'public/uploads/activityinfo/')
      
    },
    filename(req, file, cb){
      cb(null, Date.now() + "-" + file.originalname)
    }
  })
const upload = multer({storage})

/**
 * 
 * @api {post} /signupapi/submit 提交报名信息
 * @apiName  获取动态信息
 * @apiGroup Activity
 * @apiDescription  获取首页动态信息
 * @apiVersion  1.0.0
 * 
 * @apiParam {Int} [count] 数量
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
 * {
 *  "status": true,
 *  "data": [{
 *      "id": 1
 *      "title": "xxxx",
 *      "date": "2022-12-01",
 *      "detail": "xxxx！",
 *      "img": {
 *          "width": "713",
 *          "height": "535",
 *          "path": "your.jpg",
 *          "base64": "data:image/png;base64,iVBORw0KGgoAAAANSU="
 *      }
 *  }],
 *  "prefix": url_prefix,
 * }
 * 
 */
router.post('/submit', signupapiHandler.submit)

/**
 * 
 * @api {get} /activity/submit 获取报名信息
 * @apiName  获取报名信息
 * @apiGroup Activity
 * @apiDescription  获取报名信息
 * @apiVersion  1.0.0
 * 
 * @apiParam {Int} [count] 数量
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
 * {
 *  "status": true,
 *  "data": [{
 *      "id": 1
 *      "title": "xxxx",
 *      "date": "2022-12-01",
 *      "detail": "xxxx！",
 *      "img": {
 *          "width": "713",
 *          "height": "535",
 *          "path": "your.jpg",
 *          "base64": "data:image/png;base64,iVBORw0KGgoAAAANSU="
 *      }
 *  }],
 *  "prefix": url_prefix,
 * }
 * 
 */
router.get('/submit', signupapiHandler.getSubmit)
module.exports = router