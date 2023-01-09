const db = require('../db/index')
const fs = require('fs')
const config = require('../config')

const {studyinfo_schema} = require("../schema/studyinfo")

const {deleteImg, saveImg} = require("../utils/image_utils")

const {checkPermission} = require("../utils/user_utils")

exports.delete = async (req, res) => {
  const myQuery = `select s_group from study_info where id= ?`
  let results = await new Promise((resolve, reject) => db.query(myQuery, req.body.id, async (err, results) => {
    if (err) {
      deleteImg(req.file.path)
      reject(err)
      return res.cc(err)
    } else {
      resolve(results);
    }
  }));
  if((!await checkPermission(req.auth.id, results[0].s_group)) && 
  (!await checkPermission(req.auth.id, "admin"))){
    return res.cc("您没有权限删除!")
  }

  const sqly = `select * from img_info, study_info where (img_info.id = study_info.img_id and study_info.id = ?)`
  await db.query(sqly, req.body.id, function(err, results) {
    //console.log(results[0])
    if (err) return res.cc(err)
    if(!results[0]) return res.cc("没有可删除记录")
    if(results[0].img_id == 1){
      const sql = `delete from study_info WHERE id=?`
        db.query(sql, [req.body.id],function(err, results2) {
          if (err) return res.cc(err)
          return res.cc('删除成功!', true)
        })
    }else
    {
      fs.unlink(results[0].path,function(error){
        if(error) res.cc(error)
      })
      //////////////////////////////////////////// 不管同步异步了，我直接嵌套
      const sql = `delete from img_info WHERE id=?`
      db.query(sql, [results[0].img_id],function(err, results1) {
        if (err) return res.cc(err)
        const sql = `delete from study_info WHERE id=?`
        db.query(sql, [req.body.id],function(err, results2) {
          if (err) return res.cc(err)
          return res.cc('删除成功!', true)
        })
      })
      ////////////////////////////////////////////
    }
  })
}

exports.getall = (req, res) => {
  var sql = `select * from study_ins where classification = ? order by iindex asc`
  if(!(req.query.subclass === undefined)){
    sql = `select * from study_ins where classification = ? and coursename = ? order by iindex asc`
  }
  if(JSON.stringify(req.query) == '{}'){
    sql = `select * from study_ins order by iindex asc`
  }
  db.query(sql, [req.query.class, req.query.subclass], function(err, results) {
    if (err) return res.cc(err)
    res.send({
      status: true,
      data: results,
      prefix: config.url_prefix,
    })

  })
}

exports.getcategory = (req, res) => {
  var sql = `select distinct coursename	from study_info where classification = ? `
  if(JSON.stringify(req.query) == '{}'){
    sql = `select distinct coursename	from study_info`
  }
  db.query(sql, [req.query.class], function(err, results) {
    if (err) return res.cc(err)
    res.send({
      status: true,
      data: results,
    })

  })
}

exports.add = async (req, res) => {
  var img_path;
  //------------表单验证-----------
  try {
    const validation = await studyinfo_schema.validate(req.body)
    if(validation.error){
      deleteImg(req.file.path)
      return res.cc(validation.error)
    }
  } catch (err) {
    return res.cc(err)
  }
  const myQuery = `select username from user_info where id= ?`
  let results = await new Promise((resolve, reject) => db.query(myQuery, req.auth.id, async (err, results) => {
    if (err) {
      deleteImg(req.file.path)
      reject(err)
      return res.cc(err)
    } else {
      resolve(results);
    }
  }));
  
  if((!await checkPermission(req.auth.id, "studya")) && 
  (!await checkPermission(req.auth.id, "admin"))){
    deleteImg(req.file.path)
    return res.cc("您没有权限上传!")
  }
  const uploader_id = req.auth.id
  const uploader_group = results[0].username
  if(!req.file){
    img_path = "public/src/default.png";
    const sql = 'insert into study_info set ?'
      db.query(sql, { 
        link: req.body.link, 
        classification: req.body.classification, 
        coursename: req.body.coursename, 
        title: req.body.title,
        img_id: 1,
        uploader_id: uploader_id,
        s_group : uploader_group,
        tags: req.body.tags,
      }, function (err, results) {
          if (err){
            return res.cc(err)
          } 
          if (results.affectedRows !== 1) {
            return res.cc("插入数据库study_info失败!")
          }
          return res.cc('上传成功!', true)
      })

  }else{
    img_path = req.file.path
    const imgInfo = await saveImg(req)
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
        const sql = 'insert into study_info set ?'
        db.query(sql, { 
          link: req.body.link, 
          classification: req.body.classification, 
          coursename: req.body.coursename, 
          title: req.body.title, 
          img_id: results.insertId,
          uploader_id: uploader_id,
          s_group : uploader_group,
          tags: req.body.tags,
        }, function (err, results) {
            if (err){
              return res.cc(err)
            } 
            if (results.affectedRows !== 1) {
              return res.cc("插入数据库study_info失败!")
            }
            return res.cc('上传成功!', true)
        })
      })
    }
}


exports.update = async (req, res) => {
  const myQuery = `select s_group from study_info where id= ?`
  let results = await new Promise((resolve, reject) => db.query(myQuery, req.body.id, async (err, results) => {
    if (err) {
      deleteImg(req.file.path)
      reject(err)
      return res.cc(err)
    } else {
      resolve(results);
    }
  }));
  
  if((!await checkPermission(req.auth.id, results[0].s_group)) && 
  (!await checkPermission(req.auth.id, "admin"))) return res.cc("您没有权限更新!")
 
  // 不更新图片的情况
  if(!req.file){
    const sql = `UPDATE study_info SET ? WHERE id = ?`
    db.query(sql, [{ 
      link: req.body.link, 
      classification: req.body.classification, 
      coursename: req.body.coursename, 
      title: req.body.title
    }, req.body.id], function (err, results) {
    if (err){
      return res.cc(err)
    } 
    if (results.affectedRows !== 1) {
      return res.cc("插入数据库study_info失败!")
    }
    return res.cc('更新成功!', true)
    })
  }else{
  // 更新图片的情况
    try {
      const validation = await studyinfo_schema.validate(req.body)
      if(validation.error){
        deleteImg(req.file.path)
        return res.cc(validation.error)
      }
    } catch (err) {
      return res.cc(err)
    }
  
    const sqly = `select * from img_info, study_info where (img_info.id = study_info.img_id and study_info.id = ?)`
    db.query(sqly, req.body.id, function(err, results) {
      //console.log(results[0])
      if (err) return res.cc(err)
      if(!results[0]) {
        deleteImg(req.file.path)
        return res.cc("没有可删除记录")
      }

      if(results[0].img_id == 1){
        results[0].img_id = 0
      }
      else {
        deleteImg(req.file.path)
      }
      
      //////////////////////////////////////////// 不管同步异步了，我直接嵌套

      const sql = `delete from img_info WHERE id=?`
      
      db.query(sql, [results[0].img_id],async function(err, results1) {
        if (err) return res.cc(err)
        
        //----------------------------------------------------------

        try {
          const validation = await studyinfo_schema.validate(req.body)
          if(validation.error){
            deleteImg(req.file.path)
            return res.cc(validation.error)
          }
        } catch (err) {
          return res.cc(err)
        }

        const imgInfo = await saveImg(req)

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
            const sql = `UPDATE study_info SET ? WHERE id = ?`
            db.query(sql, [{ 
              link: req.body.link, 
              classification: req.body.classification, 
              coursename: req.body.coursename, 
              title: req.body.title,
              tags: req.body.tags,
              img_id: results.insertId
            }, req.body.id], function (err, results) {
                if (err){
                  return res.cc(err)
                } 
                if (results.affectedRows !== 1) {
                  return res.cc("更新数据库study_info失败!")
                }
                return res.cc('更新成功!', true)
            })
        })
      })
    })  
  }
}