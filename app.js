// 实例化服务器
const express = require('express')
const app = express()

//解析表单中间件
app.use(express.urlencoded({extended: false}))

// 跨域配置
const cors = require('cors')
app.use(cors())


// 自定义模块之用户路由
const user_router = require('./router/user')
app.use('/api', user_router)


app.listen(4000, function () {
  console.log('api server running at http://127.0.0.1:4000')
})
