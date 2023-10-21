const db = require('../db/index')
const fs = require('fs')
const config = require('../config')

exports.submit = async (req, res) => {
  const sqly = `select * from img_info, activity_info where (img_info.id = activity_info.img_id and activity_info.id = ?)`
  await db.query(sqly, req.body.id, function(err, results) {
    //console.log(results[0])
    if (err) return res.cc(err)
    if(!results[0]) return res.cc("没有可删除记录")
    if(results[0].img_id == 1){
    const sql = `delete from activity_info WHERE id=?`
        db.query(sql, [req.body.id],function(err, results2) {
        if (err) return res.cc(err)
        return res.cc('删除成功!', true)
        })
    }else
    {
    fs.unlink(results[0].path,function(error){
        if(error) res.cc(error)
    })
    const sql = `delete from img_info WHERE id=?`
    db.query(sql, [results[0].img_id],function(err, results1) {
        if (err) return res.cc(err)
        const sql = `delete from activity_info WHERE id=?`
        db.query(sql, [req.body.id],function(err, results2) {
        if (err) return res.cc(err)
        return res.cc('删除成功!', true)
        })
    })
    }
})
}

exports.getSubmit = async (req, res) => {
  const sql = `select * from signup_info where outdate = 0`
    db.query(sql, function(err, results) {
      if (err) return res.cc(err)
      res.send({
        status: true,
        data: results,
      })
    })
}