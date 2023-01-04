const db = require('../db/index')
const multer  = require('multer')
const fs = require('fs')



const storage = multer.diskStorage({
  destination(req, file, cb){
      cb(null, 'uploads/')
    
  },
  filename(req, file, cb){
    cb(null, 'img' + file.originalname)
      
  }
})

const upload = multer({storage})
  
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
  var sql = `select * from img_info, study_info where (img_info.id = study_info.img_id and study_info.classification = ?)`
  if(!(req.query.subclass === undefined)){
    sql = `select * from img_info, study_info where (img_info.id = study_info.img_id and study_info.classification = ? and study_info.coursename = ?)`
  }
  if(JSON.stringify(req.query) == '{}'){
    sql = `select * from img_info, study_info where img_info.id = study_info.img_id`
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
  var sql = `select distinct coursename	from study_info where classification = ?`
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
    res.setHeader("Access-Control-Allow-Origin", "*")
    let {size,mimetype,path}=req.file;
    let types=['jpeg','jpg','png','gif'];//允许上传的类型
    let tmpType=mimetype.split('/')[1];
    if(size>5000000){
        return res.cc('上传的内容不能超过5000000')
    }else if(types.indexOf(tmpType)==-1){
      fs.unlink(req.file.path,function(error){
        if(error){
          return res.cc(error)
        }
      })
        return res.cc('上传的类型错误')
    }else{
    var appendName=req.file.originalname

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
                  return res.cc('上传成功！', true)
             })
          
        })
          return 1
    })

    });

    fs.rename(req.file.path, `/uploads/${req.file.filename}.${appendName}`, function(err) {
      if(err) return err
    })
  }
}