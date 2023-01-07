const express = require('express')
const router = express.Router()
const multer = require('multer')

const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, 'public/uploads/certificate/')
      
    },
    filename(req, file, cb){
      cb(null, Date.now() + "-" + file.originalname)
    }
  })
const upload = multer({storage})

const homepageinfoHandler = require('../router_handler/homepageinfo')

/**
 * 
 * @api {get} /api/achievement 首页信息
 * @apiName  首页奖项信息
 * @apiGroup Home
 * @apiDescription  首页奖项信息
 * @apiVersion  1.0.0
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
 * "status": true,
 *  "data": [
 *      {
 *          "id": 1,
 *          "year": 2021,
 *          "title": "2021年第十六届xxxx",
 *          "date": "2021-07"
 *      },
 *  ]
 * }
 * 
 */
router.get('/achievement', homepageinfoHandler.getAchievement)
/**
 * 
 * @api {get} /api/getcert 首页信息
 * @apiName  首页证书图片
 * @apiGroup Home
 * @apiDescription  获取首页证书图片
 * @apiVersion  1.0.0
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
 * "status": true,
 *  "data": [
 *      {
 *          "path": "public/uploads/certificate/1673010046587-znqc16.jpg"
 *      },
 *  ]
 * }
 * 
 */
router.get('/getcert', homepageinfoHandler.getCertificate)
/**
 * 
 * @api {post} /api/uploadcert 上传首页证书
 * @apiName  首页证书上传
 * @apiGroup Home
 * @apiDescription  上传首页证书
 * @apiVersion  1.0.0
 * 
 * @apiBody {File} pdfile       你的图片
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
 * {
 *  "status": true,
 *  "message": "插入成功!"
 * }
 * 
 */
router.post('/uploadcert', upload.single("img"), homepageinfoHandler.uploadcert)
module.exports = router