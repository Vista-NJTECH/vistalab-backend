const express = require('express')
const router = express.Router()
const multer = require('multer')

const activityinfoHandler = require('../../routes_handlers/activityinfo')


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
 * @api {get} /activity/getactivity 获取动态信息
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
router.get('/getactivity', activityinfoHandler.getActivity)
/**
 * 
 * @api {post} /activity/add 添加动态信息
 * @apiName  添加动态信息
 * @apiGroup Activity
 * @apiDescription  添加动态信息
 * @apiVersion  1.0.0
 * 
 * @apiBody {File}   img    动态图片
 * @apiBody {String} title  标题
 * @apiBody {String} date   日期 需要匹配yyyy-mm-dd
 * @apiBody {String} detail 详情
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
 * {
 *  "status": true,
 *  "message": "上传成功!"
 * }
 * 
 */
router.post('/add', upload.single("img"), activityinfoHandler.addActivity)
/**
 * 
 * @api {post} /activity/delete 删除动态信息
 * @apiName  删除动态信息
 * @apiGroup Activity
 * @apiDescription  删除动态信息
 * @apiVersion  1.0.0
 * 
 * @apiBody {String}    id  动态信息id
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
 * {
 *  "status": true,
 *  "message": "删除成功!"
 * }
 * 
 */
router.post('/delete', activityinfoHandler.delete)
/**
 * 
 * @api {post} /activity/update 更新动态信息
 * @apiName  更新动态信息
 * @apiGroup Activity
 * @apiDescription  更新动态信息
 * @apiVersion  1.0.0
 * 
 * @apiBody {String} id     动态信息id
 * @apiBody {File}   img    动态图片
 * @apiBody {String} title  标题
 * @apiBody {String} date   日期 需要匹配yyyy-mm-dd
 * @apiBody {String} detail 详情
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
 * {
 *  "status": true,
 *  "message": "更新成功!"
 * }
 * 
 */
router.post('/update', upload.single("img"), activityinfoHandler.update)
module.exports = router