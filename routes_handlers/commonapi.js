const db = require('../db/index')
const fs = require('fs')
const config = require('../config')

exports.getimg = (req, res) => {
    const sql = `select base64 from img_info where id=?`
    db.query(sql, req.query.id, (err, results) => {
        if (err) {
          return res.cc(err)
        }
        if (results.length !== 1) return res.cc('获取用户信息失败！')
        res.send(results[0].base64)
      })
  }

  exports.feedback = (req, res) => {
    const {feedback} = req.body
    if(feedback == "") return res.cc("不能为空!")
    const sql = 'insert into feedback set ?'
        db.query(sql, { 
          text: feedback,
        }, function (err, noresults) {
            if (err){
              return res.cc(err)
            } 
            res.send({
                status: true,
                message: '提交成功',
                })
        })
  }