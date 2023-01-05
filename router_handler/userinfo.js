// 导入数据库操作模块
const db = require('../db/index')

const sql = `select id, username, name, email, userpic, level, created_time from user_info where id=?`


exports.getUserInfo = (req, res) => {
    db.query(sql, req.user.id, (err, results) => {
        if (err) return res.cc(err)
      
        if (results.length !== 1) return res.cc('获取用户信息失败！')
      
        res.send({
          status: true,
          message: '获取用户基本信息成功！',
          data: results[0],
        })
      })
}

  