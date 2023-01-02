const express = require('express')
const router = express.Router()

// 导入解析 formdata 格式表单数据的包
const multer = require('multer')

//管理员头像上传路由处理函数
const storage = multer.diskStorage({
    //存储的位置 uploads在根目录下
    destination(req, file, cb){
        cb(null, 'public/uploads/studyimg/')
      
    },
    //图片名字的确定 multer默认帮我们取一个没有扩展名的图片名，因此需要我们自己定义给图片命名
    filename(req, file, cb){
      // console.log(file)  
      cb(null, Date.now() + "-" + file.originalname)
    }
  })
  //管理员头像上传路由
  const upload = multer({storage})

// 导入用户路由处理函数模块
const studyinfoHandler = require('../router_handler/studyinfo')

router.get('/getall', studyinfoHandler.getall)

router.post('/add', upload.single('studyimg'), studyinfoHandler.add)

module.exports = router
