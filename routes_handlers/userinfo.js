const db = require('../db/index')
const fs = require('fs')
const config = require('../config')


exports.getUserInfo = (req, res) => {
  const sql = `select id, username, avatar, name, email, level, created_time, p_group from user_info where id=?`
  db.query(sql, req.auth.id, (err, results) => {
      if (err) {
        return res.cc(err)
      }
      if (results.length !== 1) return res.cc('获取用户信息失败！')
      const user = { ...results[0], avatar: config.url_prefix + results[0].avatar}
      res.send({
        status: true,
        message: '获取用户基本信息成功！',
        userinfo: user,
      })
    })
}

exports.updateavatar = async (req, res) => {
  const sql1 = `select avatar from user_info where id=?`
  db.query(sql1, req.auth.id, async (err, results) => {
      if (err) {
        return res.cc(err)
      }
      if (results.length !== 1) return res.cc('获取用户信息失败！')
        if(results[0].avatar) deleteImg(results[0].avatar)
        await saveImg(req)
        const sql = `UPDATE user_info SET ? WHERE id = ?`
        db.query(sql, [{
          avatar: req.file.path,
        }, req.auth.id], function (err, results) {
            if (err){
              deleteImg(req.file.path)
              return res.cc(err)
            } 
            if (results.affectedRows !== 1) {
              deleteImg(req.file.path)
              return res.cc("更新头像失败!")
            }
            //deleteImg(req.file.path)
            return res.cc('更新成功!', true)
        })
    })

  
}

function deleteImg(path){
  fs.unlink(path,function(error){
    if(error) res.cc(error)
  })
}
async function saveImg(req){
  let {size,mimetype,path}=req.file;
  let types=['jpeg','jpg','png','gif'];
  let tmpType=mimetype.split('/')[1];
  //-------------------------------
  if(size > config.studyinfo.maxSize){
    deleteImg(req.file.path)
    return res.cc('上传的内容不能超过' + config.studyinfo.maxSize)
  }else if(types.indexOf(tmpType)==-1){
    fs.unlink(req.file.path,function(error){
      if(error){
        return res.cc(error)
      }
    })
      return res.cc('上传的类型错误')
  }
  
  const sharp = require('sharp')
  sharp.cache(false);

  async function resizeImage(path) {
    let buffer = await sharp(path)
      .resize(120, 120, {
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .toBuffer();
    return sharp(buffer).toFile(path);
  }
  await resizeImage(req.file.path);

  /*
  const image = await sharp(req.file.path, {
    raw:{
      channels: 4,
      width: 120, 
      height: 120
    }
  }).png({
    overshootDeringing: true,
    quality: 40,
  }).resize(120, 120, {
    fit: sharp.fit.inside,
    withoutEnlargement: true,
  }).toBuffer()

  var avatarbase64 = `data:image/png;base64,${image.toString('base64')}`
  
  return {
    avatarbase64: avatarbase64,
  }*/
}