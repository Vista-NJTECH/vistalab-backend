
//密码加密模块
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')
const db = require('../db/index')

exports.register = (req, res) => {
  const userinfo = req.body
  
  const sql = `select * from user_info where username=?`
  db.query(sql, [userinfo.username], function (err, results) {
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err)
    }
    // 用户名被占用
    if (results.length > 0) {
      return res.cc('用户名被占用，请更换其他用户名')
    }

    // 加密
    userinfo.password = bcrypt.hashSync(userinfo.password, 10)

    const sql = 'insert into user_info set ?'
    db.query(sql, { username: userinfo.username, password: userinfo.password }, function (err, results) {
      // 执行 SQL 语句失败
      if (err) return res.cc(err)
      // SQL 语句执行成功，但影响行数不为 1
      if (results.affectedRows !== 1) {
        return res.cc('注册用户失败，请稍后再试！')
      }

      return res.cc('注册成功！', "true")
    })

  })

  }
  
// 登录的处理函数
exports.login = (req, res) => {
  const userinfo = req.body
  const sql = `select * from user_info where username=?`
  db.query(sql, userinfo.username, function (err, results) {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)
    // 执行 SQL 语句成功，但是查询到数据条数不等于 1
    if (results.length !== 1) return res.cc('登录失败！')
    // 拿着用户输入的密码,和数据库中存储的密码进行对比
    const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
    // 如果对比的结果等于 false, 则证明用户输入的密码错误
    if (!compareResult) {
      return res.cc('登录失败！')
    }

    const user = { ...results[0], password: '', userpic: '', name: "", email: "", level: "",created_time: "" }

    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
      expiresIn: config.expiresIn,
    })

    //res.cookie("token",'vista ' + tokenStr,{maxAge:config.cookieage,httpOnly:true});

    res.send({
      status: 0,
      message: '登录成功！',
      token: 'vista ' + tokenStr,
    })

  })
  
}

exports.allinvoice = (req, res) => {
  const userinfo = req.body
  const sql = `select * from invoice_info`
  db.query(sql, userinfo.username, function (err, results) {

    if (err) return res.cc(err)

    res.send({
      status: 0,
      data: results,
    })

  })
  
}