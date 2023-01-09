const express = require('express')
const router = express.Router()
const multer = require('multer')
var { expressjwt: jwt } = require("express-jwt");
const config = require('../../config')

const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, 'public/uploads/studyimg/')
      
    },
    filename(req, file, cb){
      cb(null, Date.now() + "-" + file.originalname)
    }
  })
const upload = multer({storage})

const studyinfoHandler = require('../../routes_handlers/studyinfo')
/**
 * 
 * @api {get} /study/getall 课程信息获取
 * @apiName  课程信息获取
 * @apiGroup Study
 * @apiDescription  获取课程信息
 * @apiVersion  1.0.0
 * 
 * @apiParam {String} [page] 页数
 * @apiParam {String} [class] 一级分类
 * @apiParam {String} [subclass] 二级分类
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
 * {
 *  "status": true,
 *  "data": [
 *      {
 *          "id": 160,
 *          "path": "your/file/path.png",
 *          "size": "3617280",
 *          "width": "1256",
 *          "height": "720",
 *          "blur": "U2S?DV00t6~pITM{xuxuR*Rjxu%M?bRjRjt7",
 *          "base64": "example",
 *          "time": "2023-01-04T14:58:55.000Z",
 *          "iindex": 0,
 *          "link": "your/link/url",
 *          "classification": "Software",
 *          "coursename": "CMake",
 *          "title": "0.how-a-cpp-file-run",
 *          "img_id": 1,
 *          "state": 1,
 *          "level": 1,
 *          "tags": "bilibili",
 *          "uploader": "JerryGu",
 *      },],
 *      count: 1,
 *      pagecount: 2,
 *  prefix: url_prefix,
 * }
 * 
 */
router.get('/getall', studyinfoHandler.getall)
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
router.get('/getcategory', studyinfoHandler.getcategory)
/**
 * 
 * @api {post} /study/add 课程添加
 * @apiName  课程添加
 * @apiGroup Study
 * @apiDescription  添加课程信息
 * @apiVersion  1.0.0
 * 
 * @apiHeader {String} Authorization token
 * 
 * @apiBody {File}      [studyimg]      课程章节预览图
 * @apiBody {String}    classification  一级分类
 * @apiBody {String}    coursename      课程名
 * @apiBody {String}    title           课程章节标题
 * @apiBody {String}    link            课程章节链接
 * @apiBody {String}    level           等级
 * @apiBody {String}    [group]         权限用户组默认all
 * @apiBody {String}    [tags]          标签
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
*      {
*       "status": true,
*       "message": "上传成功!"
*      }
 * 
 * @apiErrorExample {json} Error-Response:
 *     {
 *      "status": false,
 *      "message": "您没有权限上传!"
 *     }
 * @apiErrorExample {json} Error-Response:
 *     {
 *      "status": false,
 *      "message": "没有您的注册记录!"
 *     }
 * 
 */
router.post('/add', upload.single('studyimg'), jwt({ 
    secret: config.jwtSecretKey, 
    algorithms: ["HS256"] 
  }), studyinfoHandler.add)
/**
 * 
 * @api {post} /study/delete 课程删除
 * @apiName  课程删除
 * @apiGroup Study
 * @apiDescription  删除课程信息
 * @apiVersion  1.0.0
 * 
 * @apiHeader {String} Authorization token
 * 
 * @apiBody {String}    id  课程id
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
 * {
 *  "status": true,
 *  "message": "删除成功!"
 * }
 * 
 */
router.post('/delete', jwt({ 
        secret: config.jwtSecretKey, 
        algorithms: ["HS256"] 
    }), studyinfoHandler.delete)
/**
 * 
 * @api {post} /study/add 课程更新
 * @apiName  课程更新
 * @apiGroup Study
 * @apiDescription  更新课程信息
 * @apiVersion  1.0.0
 * 
 * @apiHeader {String} Authorization token
 * 
 * @apiBody {String}    id              课程章节预览图
 * @apiBody {File}      [studyimg]      课程章节预览图
 * @apiBody {String}    [classification]一级分类
 * @apiBody {String}    [coursename]    课程名
 * @apiBody {String}    [title]         课程章节标题
 * @apiBody {String}    [link]          课程章节链接
 * @apiBody {String}    [level]         等级
 * @apiBody {String}    [group]         权限用户组默认all
 * @apiBody {String}    [tags]          标签
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
 * {
 *  "status": true,
 *  "message": "删除成功!"
 * }
 * 
 */
router.post('/update', upload.single('studyimg'), jwt({ 
    secret: config.jwtSecretKey, 
    algorithms: ["HS256"] 
  }), studyinfoHandler.update)

module.exports = router
