const express = require('express')
const router = express.Router()

const multer = require('multer')

const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, 'public/uploads/studyimg/')
      
    },
    filename(req, file, cb){
      cb(null, Date.now() + "-" + file.originalname)
    }
  })
const upload = multer({storage})

const studyinfoHandler = require('../router_handler/studyinfo')

router.get('/getall', studyinfoHandler.getall)

router.get('/getcategory', studyinfoHandler.getcategory)

router.post('/add', upload.single('studyimg'), studyinfoHandler.add)

router.post('/delete', studyinfoHandler.delete)

router.post('/update', upload.single('studyimg'), studyinfoHandler.update)

module.exports = router
