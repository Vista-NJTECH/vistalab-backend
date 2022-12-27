// 实例化服务器
const express = require('express')
const app = express()

// cookie
var cookieParser = require('cookie-parser');
app.use(cookieParser());

//解析表单中间件
app.use(express.urlencoded({extended: false}))

// 跨域配置
const cors = require('cors')
app.use(cors())

// 导入配置文件
const config = require('./config')

// 解析 token 的中间件
const expressJWT = require('express-jwt')

// 中间件全局变量，需在路由前定义
app.use(function (req, res, next) {
  // status = 0 为成功； status = 1 为失败； 默认将 status 的值设置为 1，方便处理失败的情况
  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    })
  }
  next()
})

// token中间件过滤
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//],algorithms:['HS256'] }))

////////////////////////////////////////////////////////////////////
// 路由
const user_router = require('./router/user')
app.use('/api', user_router)

const userinfo_router = require('./router/userinfo')
app.use('/my', userinfo_router)

const scheduleinfo_router = require('./router/schedule')
app.use('/api', scheduleinfo_router)

////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////
// 错误中间件
const joi = require('joi')
app.use(function (err, req, res, next) {
  // 数据验证失败
  if (err instanceof joi.ValidationError) return res.cc(err)
  // 捕获身份认证失败的错误
  if (err.name === 'UnauthorizedError') return res.cc('You have no access to this page!')
  // 未知错误
  res.cc(err)
})

////////////////////////////////////////////////////////////////////

app.listen(8181, function () {
  console.log('api server running at http://127.0.0.1:8181')
})
