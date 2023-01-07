const db = require('../db/index')
const fs = require('fs')
const config = require('../config')

exports.getActivity = (req, res) => {
    var sql
    if(req.query.count){
        sql = `select activity_info.id, title, date, detail, path, width, height, base64 from img_info, activity_info where (img_info.id = activity_info.img_id)order by time DESC LIMIT ?`
    }else{
        sql = `select activity_info.id, title, date, detail, path, width, height, base64 from img_info, activity_info where (img_info.id = activity_info.img_id)order by time DESC`
    }
    const count = parseInt(req.query.count)
    db.query(sql, count, (err, results) => {
        if (err) {
          return res.cc(err)
        }
        if (results.length == 0) return res.cc('获取用户信息失败！')
        //console.log(results)
        var data = []
        for (let i in results){
            var activateIns = {}
            var imgIns = {}
            activateIns.id = results[i].id
            activateIns.title = results[i].title
            activateIns.date = results[i].date
            activateIns.detail = results[i].detail
            imgIns.width = results[i].width
            imgIns.height = results[i].height
            imgIns.path = results[i].path
            imgIns.base64 = results[i].base64
            activateIns.img = imgIns
            data.push(activateIns)
        }
        res.send({
            status: true,
            data: data,
            prefix: config.url_prefix,
        })
      })
  }