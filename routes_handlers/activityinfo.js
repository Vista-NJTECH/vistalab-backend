const db = require('../db/index')
const fs = require('fs')
const config = require('../config')

const {activityinfo_schema} = require("../schema/activityinfo")
const image_utils = require("../utils/image_utils")

exports.getActivity = (req, res) => {
var sql
if(req.query.count){
    sql = `select activity_info.id, title, date, detail, path, width, height from img_info, activity_info where (img_info.id = activity_info.img_id)order by date DESC LIMIT ?`
}else{
    sql = `select activity_info.id, title, date, detail, path, width, height from img_info, activity_info where (img_info.id = activity_info.img_id)order by date DESC`
}
const count = parseInt(req.query.count)
db.query(sql, count, (err, results) => {
    if (err) {
        return res.cc(err)
    }
    if (results.length == 0) return res.cc('获取用户信息失败！')
    //console.log(results)
    var data = []
    for (let i in results){
        var activateIns = {}
        var imgIns = {}
        activateIns.id = results[i].id
        activateIns.title = results[i].title
        activateIns.date = results[i].date
        activateIns.detail = results[i].detail
        imgIns.width = results[i].width
        imgIns.height = results[i].height
        imgIns.path = results[i].path
        //imgIns.base64 = results[i].base64
        activateIns.img = imgIns
        data.push(activateIns)
    }
    res.send({
        status: true,
        data: data,
        prefix: config.url_prefix,
    })
    })
}

exports.addActivity = async (req, res) => {
    var img_path;
    //------------表单验证-----------
    try {
      const validation = await activityinfo_schema.validate(req.body)
      if(validation.error){
        if(req.file.path){
          fs.unlink(req.file.path,function(error){
            if(error){
              return res.cc(error)
            }
          })
        }
        return res.cc(validation.error)
      }
    } catch (err) {
      return res.cc(err)
    }
    if(!req.file){
      img_path = "public/src/default.png";
      const sql = 'insert into activity_info set ?'
        db.query(sql, { 
            title: req.body.title, 
            date: req.body.date, 
            detail: req.body.detail, 
            img_id: 1,
        }, function (err, results) {
            if (err){
              return res.cc(err)
            } 
            if (results.affectedRows !== 1) {
              return res.cc("插入数据库activity_info失败!")
            }
            return res.cc('上传成功!', true)
        })
  
    }else{
      img_path = req.file.path
      const imgInfo = await image_utils.saveImg(req)
      const sql = 'insert into img_info set ?'
      db.query(sql, { 
        path: img_path, 
        size: imgInfo.info.size,
        blur: imgInfo.blurl,
        base64: imgInfo.base64url,
        width: imgInfo.info.width, 
        height: imgInfo.info.height,
      }, function (err, results) {
          if (err){
            return res.cc(err)
          } 
          if (results.affectedRows !== 1) {
            return res.cc("插入数据库img_info失败!")
          }
          if (err) return res.cc(err)
          const sql = 'insert into activity_info set ?'
          db.query(sql, { 
            title: req.body.title, 
            date: req.body.date, 
            detail: req.body.detail,
            img_id: results.insertId,
          }, function (err, results) {
              if (err){
                return res.cc(err)
              } 
              if (results.affectedRows !== 1) {
                return res.cc("插入数据库activity_info失败!")
              }
              return res.cc('上传成功!', true)
          })
        })
      }
  }

exports.delete = async (req, res) => {
const sqly = `select * from img_info, activity_info where (img_info.id = activity_info.img_id and activity_info.id = ?)`
await db.query(sqly, req.body.id, function(err, results) {
    //console.log(results[0])
    if (err) return res.cc(err)
    if(!results[0]) return res.cc("没有可删除记录")
    if(results[0].img_id == 1){
    const sql = `delete from activity_info WHERE id=?`
        db.query(sql, [req.body.id],function(err, results2) {
        if (err) return res.cc(err)
        return res.cc('删除成功!', true)
        })
    }else
    {
    fs.unlink(results[0].path,function(error){
        if(error) res.cc(error)
    })
    const sql = `delete from img_info WHERE id=?`
    db.query(sql, [results[0].img_id],function(err, results1) {
        if (err) return res.cc(err)
        const sql = `delete from activity_info WHERE id=?`
        db.query(sql, [req.body.id],function(err, results2) {
        if (err) return res.cc(err)
        return res.cc('删除成功!', true)
        })
    })
    }
})
}

exports.update = async (req, res) => {
    // 不更新图片的情况
    if(!req.file){
      const sql = `UPDATE activity_info SET ? WHERE id = ?`
      db.query(sql, [{ 
        title: req.body.title, 
        date: req.body.date, 
        detail: req.body.detail
    }, req.body.id], function (err, results) {
      if (err){
        return res.cc(err)
      } 
      if (results.affectedRows !== 1) {
        return res.cc("插入数据库activity_info失败!")
      }
      return res.cc('更新成功!', true)
      })
    }else{
    // 更新图片的情况
      try {
        const validation = await activityinfo_schema.validate(req.body)
        if(validation.error){
          fs.unlink(req.file.path,function(err){
            if(err){
              return res.cc(err)
            }
          })
          return res.cc(validation.error)
        }
      } catch (err) {
        return res.cc(err)
      }
    
      const sqly = `select * from img_info, activity_info where (img_info.id = activity_info.img_id and activity_info.id = ?)`
      await db.query(sqly, req.body.id, function(err, results) {
        //console.log(results[0])
        if (err) return res.cc(err)
        if(!results[0]) {
          fs.unlink(req.file.path,function(err){
            if(err){
              return res.cc(err)
            }
          })
          return res.cc("没有可删除记录")
        }
  
        if(results[0].img_id == 1){
          results[0].img_id = 0
        }
        else {
          fs.unlink(results[0].path,function(error){
            if(error){
              return res.cc(error)
            }
          })
        }
        const sql = `delete from img_info WHERE id=?`
        
        db.query(sql, [results[0].img_id],async function(err, results1) {
          if (err) return res.cc(err)
          
  
          try {
            const validation = await activityinfo_schema.validate(req.body)
            if(validation.error){
              fs.unlink(req.file.path,function(error){
                if(error){
                  return res.cc(error)
                }
              })
              return res.cc(validation.error)
            }
          } catch (err) {
            return res.cc(err)
          }
  
          const imgInfo = await image_utils.saveImg(req)
  
          const sql = 'insert into img_info set ?'
          db.query(sql, { 
            path: req.file.path, 
            size: imgInfo.info.size,
            blur: imgInfo.blurl,
            base64: imgInfo.base64url,
            width: imgInfo.info.width, 
            height: imgInfo.info.height}, function (err, results) {
              if (err){
                return res.cc(err)
              } 
              if (results.affectedRows !== 1) {
                return res.cc("插入数据库img_info失败!更新失败!")
              }
              if (err) return res.cc(err)
              const sql = `UPDATE activity_info SET ? WHERE id = ?`
              db.query(sql, [{ 
                title: req.body.title, 
                date: req.body.date, 
                detail: req.body.detail,
                img_id: results.insertId,
              }, req.body.id], function (err, results) {
                  if (err){
                    return res.cc(err)
                  } 
                  if (results.affectedRows !== 1) {
                    return res.cc("更新数据库activity_info失败!")
                  }
                  return res.cc('更新成功!', true)
              })
          })
  
        })
      })  
    }
    
  }