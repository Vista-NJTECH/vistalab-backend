module.exports = {
  // token 密钥
  jwtSecretKey: '!vistalab^666!',
  // token 有效期
  expiresIn: '240h',
  cookieage: 15*24*60*60*1000,
  invitation_code: 'vistalab666',
  url_prefix: 'http://124.223.196.177:8181/',
}

module.exports.db = {
  root_pwd: '196511',
  database: 'lab',
}

module.exports.studyinfo = {
  base64SavePath: "public/uploads/base64Url/",
  maxSize: 5000000,
  pagesizenum : 9,
  basic_view_permission: "common",
}

module.exports.userinfo = {
  default_avatar: "public/src/default_avatar_resized.png",
  basic_permission: "common",
}

module.exports.deploy = {
  port: 8180,
  host: 'localhost'
}
