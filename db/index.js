// 导入 mysql 模块
const mysql = require('mysql')

// 创建数据库连接对象
const db = mysql.createPool({
  host: 'db',
  user: 'root',
  password: 'vistalab',
  database: 'lab',
})

module.exports = db
 