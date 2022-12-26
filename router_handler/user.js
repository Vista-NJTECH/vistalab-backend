
// 注册用户的处理函数，供 /router/user.js 模块进行调用
exports.register = (req, res) => {
    res.send('reguser OK')
  }
  
  // 登录的处理函数
  exports.login = (req, res) => {
    res.send('login OK')
  }