const express = require('express')
const router = express.Router()


const invoiceHandler = require('../router_handler/invoice')

const multer = require('multer')

const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, 'public/uploads/invoice_pdf/')
      
    },
    filename(req, file, cb){
      cb(null, Date.now() + "-" + file.originalname)
    }
  })
const upload = multer({storage})
/**
 * 
 * @api {post} /invoice/add 发票添加
 * @apiName  发票添加
 * @apiGroup 发票
 * @apiDescription  添加发票
 * @apiVersion  1.0.0
 * 
 * @apiHeader {String} Authorization token
 * 
 * @apiBody {File} pdfile       你的发票
 * @apiBody {String} remark     备注信息
 * @apiBody {String} category   分类
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
 * {
 *  "status": true,
 *  "message": {
 *      "msg": "success",
 *      "amount": 34.4
 *  }
 * }
 * 
 */
router.post('/add', upload.single('pdfile'), invoiceHandler.add)
/**
 * 
 * @api {get} /invoice/getall 发票信息获取
 * @apiName  发票信息获取
 * @apiGroup 发票
 * @apiDescription  获取发票信息
 * @apiVersion  1.0.0
 * 
 * @apiHeader {String} Authorization token
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
 * {
 *  "status": true,
 *  "data": [
 *      {
 *          "id": 2,
 *          "invoicename": "xxxx",
 *          "applicant": "jerrygu",
 *          "amount": "125",
 *          "path": "path/to/your/file.pdf",
 *          "remark": "xxxx",
 *          "category": "固定设备",
 *          "time": "2022-12-03T00:12:01.000Z",
 *          "status": "0"
 *      },
 *  ]
 * }
 * 
 */
router.get('/getall', invoiceHandler.getall)
/**
 * 
 * @api {post} /invoice/delete 发票删除
 * @apiName  发票删除
 * @apiGroup 发票
 * @apiDescription  删除发票
 * @apiVersion  1.0.0
 * 
 * @apiHeader {String} Authorization token
 * 
 * @apiBody {String}    id  发票id
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
 * {
 *  "status": true,
 *  "message": "success",
 * }
 * @apiErrorExample {json} Error-Response:
 *    {
 *     "status": false,
 *     "message": "You have no access to this page!"
 *    }
 * 
 * @apiErrorExample {json} Error-Response:
 *     {
 *      "status": false,
 *      "message": "您没有权限删除!"
 *     }
 */
router.post('/delete', invoiceHandler.delete)
/**
 * 
 * @api {post} /invoice/unstate 发票状态
 * @apiName  发票状态
 * @apiGroup 发票
 * @apiDescription  更新状态发票
 * @apiVersion  1.0.0
 * 
 * @apiHeader {String} Authorization token
 * 
 * @apiBody {String}    id  发票id
 * 
 * @apiSuccess {Number} code 200
 * @apiSuccessExample {type} Response-Example:
 * {
 *  "status": true,
 *  "message": "发票删除成功!"
 * }
 * @apiErrorExample {json} Error-Response:
 *     {
 *      "status": false,
 *      "message": "您没有权限修改!"
 *     }
 */
router.post('/unstate', invoiceHandler.unstate)
/**
 * 
 * @api {post} /invoice/download 发票下载
 * @apiName  发票下载
 * @apiGroup 发票
 * @apiDescription  下载发票
 * @apiVersion  1.0.0
 * 
 * @apiHeader {String} Authorization token
 * 
 * @apiBody {String}    id  发票id
 * 
 * @apiSuccess {Number} code 200
 * @apiErrorExample {json} Error-Response:
 *     {
 *      "status": false,
 *      "message": "您没有权限修改!"
 *     }
 * @apiErrorExample {json} Error-Response:
 *     {
 *      "status": false,
 *      "message": "id错误!"
 *     }
 */
router.get('/download', invoiceHandler.download)

module.exports = router
