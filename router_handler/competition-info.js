const db = require('../db/index')
const fs = require('fs')
const config = require('../config')

exports.getCompetition = (req, res) => {
    const sql = `select * from compitition_info`
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        if (results.length == 0) return res.cc('获取信息失败！')
        res.send({
          status: true,
          message: 'success',
          data: results,
        })
      })
    }