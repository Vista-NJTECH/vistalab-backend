// 实例化服务器
const express = require('express')
const app = express()
const path = require('path')

// cookie
var cookieParser = require('cookie-parser');
app.use(cookieParser());

// 跨域配置
const cors = require('cors')
app.use(cors())

// 导入配置文件
const config = require('./config')

// 中间件全局变量，需在路由前定义
app.use(function (req, res, next) {
  res.cc = function (err, status = false) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err,
    })
  }
  next()
})

/**********************************
// token中间件过滤-弃用
***********************************/

const { expressjwt: jwt } = require('express-jwt')
app.use(jwt({ 
  secret: config.jwtSecretKey,
  algorithms: ["HS256"]
}).unless({ path: [/^\/api\//,/^\/study\//,/^\/schedule\//,/^\/member\//,/^\/apidoc\//,/^\/public\//]}))

////////////////////////////////////////////////////////////////////
// 路由

//解析表单中间件
app.use(express.urlencoded({extended: false}))

// 托管静态资源文件
app.use(express.static(path.join(__dirname,'public')));

/////////////
const commonapi_router = require('./router/commonapi')
app.use('/api', commonapi_router)

const studyinfo_router = require('./router/studyinfo')
app.use('/study', studyinfo_router)

const userinfo_router = require('./router/userinfo')
app.use('/my', userinfo_router)

const scheduleinfo_router = require('./router/scheduleinfo')
app.use('/schedule', scheduleinfo_router)

const memberinfo_router = require('./router/memberinfo')
app.use('/member', memberinfo_router)

const invoice_router = require('./router/invoice')
app.use('/invoice', invoice_router)

////////////////////////////////////////////////////////////////////
app.use('/apidoc', express.static('apidoc'));
app.use('/public', express.static('public'));
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

app.listen(config.deploy.port, function () {
  console.log('api server running at http://127.0.0.1:8181')
})