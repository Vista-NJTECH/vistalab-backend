const db = require('../db/index')
const fs = require('fs')
const config = require('../config')

exports.getActivity = (req, res) => {
    const sql = `select base64 from img_info where id=?`
    db.query(sql, req.query.id, (err, results) => {
        if (err) {
          return res.cc(err)
        }
        if (results.length !== 1) return res.cc('获取用户信息失败！')
        res.send(results[0].base64)
      })
  }