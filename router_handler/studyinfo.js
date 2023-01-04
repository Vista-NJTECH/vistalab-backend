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
    fs.unlink(results[0].path,function(error){
      if(error){
        return res.cc(error)
      }
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
    })
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
  //------------表单验证-----------
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
  if(!req.file) res.cc('No file data!')
  let {size,mimetype,path}=req.file;
  let types=['jpeg','jpg','png','gif'];
  let tmpType=mimetype.split('/')[1];

  //-------------------------------
  if(size > config.imgLimit.maxSize){
    fs.unlink(req.file.path,function(error){
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
  }else{

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
  
  const blurl = encode(new Uint8ClampedArray(data), info.width, info.height, 4, 4)
  const decoded = decode(blurl, info.width, info.height)
  
  const image = await sharp(Buffer.from(decoded), {
    raw:{
      channels: 4,
      width: info.width, 
      height: info.height
    }
  }).jpeg({
    overshootDeringing: true,
    quality: 40,
  }).toBuffer()

  var base64url = `data:image/png;base64,${image.toString('base64')}`
  //console.log(base64url);
  
  const sql = 'insert into img_info set ?'
  db.query(sql, { 
    path: req.file.path, 
    size: info.size,
    blur: blurl,
    base64: base64url,
    width: info.width, 
    height: info.height}, function (err, results) {
      if (err){
        return res.cc(err)
      } 
      if (results.affectedRows !== 1) {
        return res.cc("插入数据库img_info失败！")
      }
      const sql = `select id from img_info where path = ?`
      db.query(sql, [req.file.path], function(err, results) {
          if (err) return res.cc(err)
          const sql = 'insert into study_info set ?'
          db.query(sql, { 
            link: req.body.link, 
            classification: req.body.classification, 
            coursename: req.body.coursename, 
            title: req.body.title, 
            img_id: results[0].id}, function (err, results) {
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
    })
    
  }
}

exports.add = async (req, res) => {
  addlog(req, res);
}

exports.update = async (req, res) => {
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
    fs.unlink(results[0].path,function(error){
      if(error){
        return res.cc(error)
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
        if(!req.file) res.cc('No file data!')
        let {size,mimetype,path}=req.file;
        let types=['jpeg','jpg','png','gif'];
        let tmpType=mimetype.split('/')[1];
      
        //-------------------------------
        if(size > config.imgLimit.maxSize){
          fs.unlink(req.file.path,function(error){
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
        }else{
        // 获取图片信息
        var sizeOf = require('image-size');
        const Jimp = require('jimp');
        async function imgpro() {
          // 读取图片
          const image = await Jimp.read(req.file.path);
          await image.resize(Jimp.AUTO, 720);
          await image.writeAsync(req.file.path);
        }
        await imgpro()
      
        const {encode, decode} = require('blurhash')
        const sharp = require('sharp')
        const {data, info} = await sharp(req.file.path)
        .ensureAlpha()
        .raw()
        .toBuffer({
          resolveWithObject: true
        });
        const blurl = encode(new Uint8ClampedArray(data), info.width, info.height, 4, 4)
        const decoded = decode(blurl, info.width, info.height)
        
        const image = await sharp(Buffer.from(decoded), {
          raw:{
            channels: 4,
            width: info.width, 
            height: info.height
          }
        }).jpeg({
          overshootDeringing: true,
          quality: 40,
        }).toBuffer()
      
        var base64url = `data:image/png;base64,${image.toString('base64')}`
        //console.log(base64url);
        
        
        sizeOf(req.file.path, function (err, dimensions) {
          const sql = 'insert into img_info set ?'
          db.query(sql, { 
            path: req.file.path, 
            size: req.file.size,
            blur: blurl,
            base64: base64url,
            width: dimensions.width, 
            height: dimensions.height}, function (err, results) {
              if (err){
                return res.cc(err)
              } 
              if (results.affectedRows !== 1) {
                return res.cc("插入数据库img_info失败！")
              }
              const sql = `select id from img_info where path = ?`
              db.query(sql, [req.file.path], function(err, results) {
                  if (err) return res.cc(err)
                  const sql = `UPDATE study_info SET ? WHERE id = ?`
                  db.query(sql, [{ 
                    link: req.body.link, 
                    classification: req.body.classification, 
                    coursename: req.body.coursename, 
                    title: req.body.title, 
                    img_id: results[0].id}, req.body.id], function (err, results) {
                      if (err){
                        return res.cc(err)
                      } 
                      if (results.affectedRows !== 1) {
                        return res.cc("插入数据库study_info失败！")
                      }
                      return res.cc('更新成功！', true)
                  })
              
            })
          })
          });
        }
        
        //----------------------------------------------------------

      })
  ////////////////////////////////////////////
    })
  })

}

