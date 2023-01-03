const db = require('../db/index')
const multer  = require('multer')
const fs = require('fs')


//管理员头像上传路由处理函数
const storage = multer.diskStorage({
  //存储的位置 uploads在根目录下
  destination(req, file, cb){
      cb(null, 'uploads/')
    
  },
  //图片名字的确定 multer默认帮我们取一个没有扩展名的图片名，因此需要我们自己定义给图片命名
  filename(req, file, cb){
    // console.log(file)  
    cb(null, 'img' + file.originalname)
      
  }
})
//管理员头像上传路由
const upload = multer({storage})
  
exports.delete = (req, res) => {

  const sqly = `select * from img_info where id=?`
  db.query(sqly, req.body.id, function(err, results) {
    if (err) return err
    if(!results[0]) return -1
    fs.unlink(results[0].path,function(error){
      if(error){
          console.log(error);
          return false;
      }
      console.log('删除文件成功');
    })

  })

  const sql = `delete from img_info WHERE id=?`
  db.query(sql, [req.body.id],function(err, results) {

    if (err) return res.cc(err)

    const sql = `delete from study_info WHERE img_id=?`
    db.query(sql, [req.body.id],function(err, results) {
  
      if (err) return res.cc(err)
  
      res.send({
        status: 0,
        msg: results,
      })
  
    })

  })
}

exports.getall = (req, res) => {
  var sql = `select * from img_info, study_info where (img_info.id = study_info.img_id and study_info.classification = ?)`
  console.log("req.query.class : " + req.query.class)
  if(!(req.query.subclass === undefined)){
    console.log('req.query.subclass : ' + req.query.subclass)
    sql = `select * from img_info, study_info where (img_info.id = study_info.img_id and study_info.classification = ? and study_info.coursename = ?)`
  }
  if(JSON.stringify(req.query) == '{}'){
    sql = `select * from img_info, study_info where img_info.id = study_info.img_id`
  }
  db.query(sql, [req.query.class, req.query.subclass], function(err, results) {
    if (err) return res.cc(err)
    res.send({
      status: 0,
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
      status: 0,
      data: results,
    })

  })
}

exports.add = async (req, res) => {
  let {size,mimetype,path}=req.file;
    let types=['jpeg','jpg','png','gif'];//允许上传的类型
    let tmpType=mimetype.split('/')[1];
    if(size>5000000){
        return res.send({err:-1,msg:'上传的内容不能超过5000000'})
    }else if(types.indexOf(tmpType)==-1){
        return res.send({err:-2,msg:'上传的类型错误'})
    }else{
    var appendName=req.file.originalname

    // 获取图片信息
    var sizeOf = require('image-size');
    const Jimp = require('jimp');
    // crop( x, y, w, h)
    async function imgpro() {
      // 读取图片
      const image = await Jimp.read(req.file.path);
      await image.resize(Jimp.AUTO, 720);
      await image.writeAsync(req.file.path);
    }
    await imgpro()
    sizeOf(req.file.path, function (err, dimensions) {
      const sql = 'insert into img_info set ?'
      db.query(sql, { 
        path: req.file.path, 
        size: req.file.size, 
        width: dimensions.width, 
        height: dimensions.height}, function (err, results) {
          if (err){
            console.log(err)
            return err
          } 
          if (results.affectedRows !== 1) {
            return -1
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
                    console.log(err)
                    return err
                  } 
                  if (results.affectedRows !== 1) {
                    return -1
                  }

             })
          
        })
          return 1
    })

    });

    fs.rename(req.file.path, `/uploads/${req.file.filename}.${appendName}`, function(err) {
      if(err) return err
    })
      const url = `http://124.223.196.177:8182/${req.file.path}`
      res.send({
        url:url
      })
  }
}