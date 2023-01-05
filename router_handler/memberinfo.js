const db = require('../db/index')

exports.getall = (req, res) => {
    const sql = `select * from member_info`
    db.query(sql, function(err, results) {
  
      if (err) return res.cc(err)
  
      res.send({
        status: true,
        data: results,
      })
  
    })
}