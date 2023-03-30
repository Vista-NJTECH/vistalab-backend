const express = require('express')
const router = express.Router()

const faceHandler = require('../../routes_handlers/machine-learning/face')

const multer = require('multer')

const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, 'public/uploads/temp')
      
    },
    filename(req, file, cb){
      cb(null, Date.now() + "-" + file.originalname)
    }
  })
const upload = multer({storage})
/**
 * 
 * @api {post} /api/facelogin 用户登录
 * @apiName 用户登录
 * @apiGroup MachineLearning
 * @apiDescription 返回用户token
 * @apiVersion  1.0.0
 * 
 * @apiBody {File} image 人脸
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
 * {
 *  "status": true,
 *  "message": "登录成功！",
 *  "userinfo": {
 *      "id": 1,
 *      "password": "",
 *      "username": "doiry",
 *      "avatar": "https://banckend.com/public/uploads/avatar/1673069127915-default_avatar.png",
 *      "name": "jerrygu",
 *      "email": "jerrygu.gjw@gmail.com",
 *      "level": 0,
 *      "created_time": "2022-12-26T15:02:16.000Z"
 *  },
 *  "token": "Bearer token"
 *  }
 * 
 */
router.post('/facelogin', upload.single("image"), faceHandler.facelogin)
/**
 * 
 * @api {post} /api/facelogin 用户人脸训练
 * @apiName 用户人脸训练
 * @apiGroup MachineLearning
 * @apiVersion  1.0.0
 * 
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
 * {
 *  "status": true,
 *  "message": "训练成功！"
 *  }
 */
router.post('/facetrain', faceHandler.facetrain)

module.exports = router