const db = require('../db/index')
const fs = require('fs')
const config = require('../config')
const image_utils = require("../utils/image_utils")

exports.getAchievement = (req, res) => {
    const sql = `select id, year, title, date from achievement_info`
    db.query(sql, function (err, results) {
      if (err) return res.cc(err)
      res.send({
        status: true,
        data: results,
      })
    })
}

exports.getCertificate = (req, res) => {
    const sql = `select path from img_info, achievement_info where (img_info.id = achievement_info.img_id) order by iindex asc`
    db.query(sql, function (err, results) {
      if (err) return res.cc(err)
      res.send({
        status: true,
        data: results,
        prefix: config.url_prefix,
      })
    })
}

exports.uploadcert = async (req, res) => {
    const imgInfo = await image_utils.saveImg(req)
    const sql = 'insert into img_info set ?'
    db.query(sql, { 
      path: req.file.path, 
      size: imgInfo.info.size,
      blur: imgInfo.blurl,
      base64: imgInfo.base64url,
      width: imgInfo.info.width, 
      height: imgInfo.info.height,
    }, function (err, results) {
        if (err){
          return res.cc(err)
        } 
        if (results.affectedRows !== 1) {
          return res.cc("插入数据库img_info失败!")
        }
        return res.cc("插入成功!", true)
    }
    )
}