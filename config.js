module.exports = {
    // token 密钥
    jwtSecretKey: '!vistalab^666!',
    // token 有效期
    expiresIn: '240h',
    cookieage: 15*24*60*60*1000,
    invitation_code: 'vistalab666',
    url_prefix: 'https://backend.vistalab.top/',
}

module.exports.db = {
  root_pwd: '196511',
  database: 'lab',
}

module.exports.studyinfo = {
  base64SavePath: "public/uploads/base64Url/",
  maxSize: 5000000
}

module.exports.userinfo = {
  default_avatar: "public/src/default_avatar_resized.png",}

module.exports.deploy = {
  port: 8180,
  host: 'localhost'
}

