const express = require('express')
const multer  = require('multer')
const router = express.Router()

const storage = multer.diskStorage({
   destination(req, file, cb){
       cb(null, 'public/uploads/avatar/')
     
   },
   filename(req, file, cb){
     cb(null, Date.now() + "-" + file.originalname)
   }
 })
const upload = multer({storage})

const userinfoHandler = require('../../routes_handlers/userinfo')
/**
 * 
 * @api {get} /my/userinfo 用户信息
 * @apiName 用户信息
 * @apiGroup User
 * @apiDescription 返回用户信息
 * @apiVersion  1.0.0
 * 
 * @apiHeader {String} Authorization token
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
 * {
 *   "status": true,
 *  "message": "获取用户基本信息成功！",
 *  "userinfo": {
 *      "id": 1,
 *      "username": "doiry",
 *      "avatar": "https://backend.vistalab.top/public/uploads/avatar/1673069127915-default_avatar.png",
 *      "name": "jerryGu",
 *      "email": "jerrygu.gjw@gmail.com",
 *      "level": 0,
 *      "created_time": "2022-12-26T07:02:16.000Z"
 *  }
 * }
 * 
 */
router.get('/userinfo', userinfoHandler.getUserInfo)
/**
 * 
 * @api {post} /my/updateavatar 用户头像更新
 * @apiName 用户头像更新
 * @apiGroup User
 * @apiDescription 更新用户头像
 * @apiVersion  1.0.0
 * 
 * @apiHeader {String} Authorization token
 * 
 * @apiBody {File} avatar       头像文件
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
 * {
 *  "status": true,
 *  "message": "头像更新成功！",
 *  "url": "avatar/path.jpg"
 * }
 * 
 */
router.post('/updateavatar', upload.single('avatar'), userinfoHandler.updateavatar)

module.exports = router
