const db = require('../db/index')
const fs = require('fs')
const config = require('../config')

exports.getActivity = (req, res) => {
    const sql = `select title, date, detail, path, width, height, base64 from img_info, activity_info where (img_info.id = activity_info.img_id)`
    db.query(sql, (err, results) => {
        if (err) {
          return res.cc(err)
        }
        if (results.length == 0) return res.cc('获取用户信息失败！')
        var activateIns = {}
        var imgIns = {}
        for (let i in results){
            activateIns.title = results[i].title
            activateIns.date = results[i].date
            activateIns.detail = results[i].detail
            imgIns.width = results[i].width
            imgIns.height = results[i].height
            imgIns.path = results[i].path
            imgIns.base64 = results[i].base64
        }
        activateIns.img = imgIns
        res.send({
            status: true,
            data: activateIns,
        })
      })
  }