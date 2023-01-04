// 导入 mysql 模块
const mysql = require('mysql')
const config = require('../config')
// 创建数据库连接对象
const db = mysql.createPool({
  host: config.deploy.host,
  user: 'root',
  password: '196511',
  database: 'lab',
})

module.exports = db
 