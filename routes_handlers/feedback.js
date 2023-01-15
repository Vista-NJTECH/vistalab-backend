const db = require('../db/index')

exports.submit = (req, res) => {
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
  
  exports.get = (req, res) => {
    const sql = 'SELECT * from feedback'
    db.query(sql, function (err, results) {
        if (err){
          return res.cc(err)
        } 
        res.send({
            status: true,
            data: results,
            })
    })
  }
  
  exports.delete = (req, res) => {
    const sql = 'DELETE from feedback WHERE id =?'
    db.query(sql, [req.body.id], function (err, results) {
        if (err){
          return res.cc(err)
        } 
        res.cc("success", true)
    })
  }