const db = require('../db/index')
const multer  = require('multer')
const fs = require('fs')
const config = require('../config')

const {studyinfo_schema} = require("../schema/studyinfo")

exports.delete = async (req, res) => {
  const sqly = `select * from img_info, study_info where (img_info.id = study_info.img_id and study_info.id = ?)`
  await db.query(sqly, req.body.id, function(err, results) {
    //console.log(results[0])
    if (err) return res.cc(err)
    if(!results[0]) return res.cc("没有可删除记录")
    if(results[0].img_id == 1){
      const sql = `delete from study_info WHERE id=?`
        db.query(sql, [req.body.id],function(err, results2) {
          if (err) return res.cc(err)
          return res.cc('删除成功！', true)
        })
    }else
    {
      fs.unlink(results[0].path,function(error){
        if(error){
          return res.cc(error)
        }
      })
      fs.unlink(results[0].base64,function(error){
        if(error){
          return res.cc(error)
        }
      })
      //////////////////////////////////////////// 不管同步异步了，我直接嵌套
      const sql = `delete from img_info WHERE id=?`
      db.query(sql, [results[0].img_id],function(err, results1) {
        if (err) return res.cc(err)
        const sql = `delete from study_info WHERE id=?`
        db.query(sql, [req.body.id],function(err, results2) {
          if (err) return res.cc(err)
          return res.cc('删除成功！', true)
        })
      })
      ////////////////////////////////////////////
    }
  })
}

exports.getall = (req, res) => {
  var sql = `select * from img_info, study_info where (img_info.id = study_info.img_id and study_info.classification = ?) order by iindex asc`
  if(!(req.query.subclass === undefined)){
    sql = `select * from img_info, study_info where (img_info.id = study_info.img_id and study_info.classification = ? and study_info.coursename = ?) order by iindex asc`
  }
  if(JSON.stringify(req.query) == '{}'){
    sql = `select * from img_info, study_info where img_info.id = study_info.img_id order by iindex asc`
  }
  db.query(sql, [req.query.class, req.query.subclass], function(err, results) {
    if (err) return res.cc(err)
    res.send({
      status: true,
      data: results,
      prefix: "http://124.223.196.177:8182/"
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

async function addlog(req, res, update = false){
  var img_path;
  //------------表单验证-----------
  try {
    const validation = await studyinfo_schema.validate(req.body)
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
    const sql = 'insert into study_info set ?'
      db.query(sql, { 
        link: req.body.link, 
        classification: req.body.classification, 
        coursename: req.body.coursename, 
        title: req.body.title, 
        img_id: 1}, function (err, results) {
          if (err){
            return res.cc(err)
          } 
          if (results.affectedRows !== 1) {
            return res.cc("插入数据库study_info失败！")
          }
          if(update == true){
            console.log("update == true")
          }
          return res.cc('上传成功！', true)
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
      height: imgInfo.info.height}, function (err, results) {
        if (err){
          return res.cc(err)
        } 
        if (results.affectedRows !== 1) {
          return res.cc("插入数据库img_info失败！")
        }
        if (err) return res.cc(err)
        const sql = 'insert into study_info set ?'
        db.query(sql, { 
          link: req.body.link, 
          classification: req.body.classification, 
          coursename: req.body.coursename, 
          title: req.body.title, 
          img_id: results.insertId}, function (err, results) {
            if (err){
              return res.cc(err)
            } 
            if (results.affectedRows !== 1) {
              return res.cc("插入数据库study_info失败！")
            }
            if(update == true){
              console.log("update == true")
            }
            return res.cc('上传成功！', true)
        })
      })
    }
}

exports.add = async (req, res) => {
  addlog(req, res);
}

exports.update = async (req, res) => {
  // 不更新图片的情况
  if(!req.file){
    const sql = `UPDATE study_info SET ? WHERE id = ?`
    db.query(sql, [{ 
      link: req.body.link, 
      classification: req.body.classification, 
      coursename: req.body.coursename, 
      title: req.body.title}, req.body.id], function (err, results) {
    if (err){
      return res.cc(err)
    } 
    if (results.affectedRows !== 1) {
      return res.cc("插入数据库study_info失败！")
    }
    return res.cc('更新成功！', true)
    })
  }else{
  // 更新图片的情况
    try {
      const validation = await studyinfo_schema.validate(req.body)
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
  
    const sqly = `select * from img_info, study_info where (img_info.id = study_info.img_id and study_info.id = ?)`
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
        fs.unlink(results[0].base64,function(error){
          if(error){
            return res.cc(error)
          }
        })
      }
      
      //////////////////////////////////////////// 不管同步异步了，我直接嵌套

      const sql = `delete from img_info WHERE id=?`
      
      db.query(sql, [results[0].img_id],async function(err, results1) {
        if (err) return res.cc(err)
        
        //----------------------------------------------------------

        try {
          const validation = await studyinfo_schema.validate(req.body)
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
              return res.cc("插入数据库img_info失败！")
            }
            if (err) return res.cc(err)
            const sql = `UPDATE study_info SET ? WHERE id = ?`
            db.query(sql, [{ 
              link: req.body.link, 
              classification: req.body.classification, 
              coursename: req.body.coursename, 
              title: req.body.title, 
              img_id: results.insertId}, req.body.id], function (err, results) {
                if (err){
                  return res.cc(err)
                } 
                if (results.affectedRows !== 1) {
                  return res.cc("插入数据库study_info失败！")
                }
                return res.cc('更新成功！', true)
            })
        })

        
        
        //----------------------------------------------------------

      })
  ////////////////////////////////////////////
    })  
  }
  
}

async function saveImg(req){
  let {size,mimetype,path}=req.file;
    let types=['jpeg','jpg','png','gif'];
    let tmpType=mimetype.split('/')[1];
    //-------------------------------
    if(size > config.imgLimit.maxSize){
      fs.unlink(filepath,function(error){
        if(error){
          return res.cc(error)
        }
      })
      return res.cc('上传的内容不能超过' + config.imgLimit.maxSize)
    }else if(types.indexOf(tmpType)==-1){
      fs.unlink(req.file.path,function(error){
        if(error){
          return res.cc(error)
        }
      })
        return res.cc('上传的类型错误')
    }
    const {encode, decode} = require('blurhash')
    const sharp = require('sharp')
    var {data, info} = await sharp(req.file.path)
    .ensureAlpha()
    .raw()
    .toBuffer({
      resolveWithObject: true
    });
    
    var tmp_wid = parseInt((info.width*720)/info.height)
    sharp.cache(false);
    async function resizeImage(path) {
      let buffer = await sharp(path)
        .resize(tmp_wid, 720, {
          fit: sharp.fit.inside,
          withoutEnlargement: true,
        })
        .toBuffer();
      return sharp(buffer).toFile(path);
    }
    await resizeImage(req.file.path);
    var {data, info} = await sharp(req.file.path)
    .ensureAlpha()
    .raw()
    .toBuffer({
      resolveWithObject: true
    });
    
    var blurl = encode(new Uint8ClampedArray(data), info.width, info.height, 4, 4)
    const decoded = decode(blurl, info.width, info.height)

    const savename = req.file.path.split("/")[req.file.path.split("/").length-1]
    
    await sharp(Buffer.from(decoded), {
      raw:{
        channels: 4,
        width: info.width, 
        height: info.height
      }
    }).png({
      overshootDeringing: true,
      quality: 40,
    }).toFile(config.imgLimit.base64SavePath + savename)

    //var base64url = `data:image/png;base64,${image.toString('base64')}`
    //console.log(base64url);
    var base64url = config.imgLimit.base64SavePath + savename;

    return {
      blurl: blurl, 
      base64url: base64url,
      info: info
    }
}