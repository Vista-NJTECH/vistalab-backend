// 导入数据库操作模块
const db = require('../db/index')

exports.getall = (req, res) => {
    const sql = `select * from schedule_info`
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

exports.add = (req, res) => {
    const scheduleIns = req.body

    const sql = 'insert into schedule_info set ?'
    db.query(sql, { 
        title: scheduleIns.title, 
        date: scheduleIns.date,
        host: scheduleIns.host,
        persons: scheduleIns.persons,
        detail: scheduleIns.detail,
        level: scheduleIns.level,
        p_group: scheduleIns.p_group,}, function (err, results) {

    if (err) return res.cc(err)

    if (results.affectedRows !== 1) {
        return res.cc('添加日程失败，请稍后再试！')
    }

    return res.cc('添加日程成功！', true)
    })
}

exports.delete = (req, res) => {
    const sql = `delete from schedule_info WHERE id=?`
    db.query(sql, [req.body.id],function(err, results2) {
      if (err) return res.cc(err)
  
      return res.cc('success', true)
    })
}