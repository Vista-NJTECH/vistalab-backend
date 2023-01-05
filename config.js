module.exports = {
    // token 密钥
    jwtSecretKey: '!vistalab^666!',
    // token 有效期
    expiresIn: '240h',
    cookieage: 15*24*60*60*1000,
    invitation_code: 'vistalab666',
}
  
module.exports.imgLimit = {
  base64SavePath: "public/uploads/base64Url/",
  maxSize: 5000000,
  uesBlur: true,
}

module.exports.deploy = {
  port: 8180,
  host: 'localhost'
}

