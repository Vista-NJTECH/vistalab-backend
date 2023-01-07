const fs = require('fs')
const config = require('../config')

module.exports.saveImg = async function (req, resize = {}){
    let {size,mimetype,path}=req.file;
    let types=['jpeg','jpg','png','gif'];
    let tmpType=mimetype.split('/')[1];
    //-------------------------------
    if(size > config.studyinfo.maxSize){
      fs.unlink(filepath,function(error){
        if(error){
          return res.cc(error)
        }
      })
      return res.cc('上传的内容不能超过' + config.studyinfo.maxSize)
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
    
    /*
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
    
    */
    var blurl = encode(new Uint8ClampedArray(data), info.width, info.height, 4, 4)
    const decoded = decode(blurl, info.width, info.height)
  
    const savename = req.file.path.split("/")[req.file.path.split("/").length-1]
    
    const image = await sharp(Buffer.from(decoded), {
      raw:{
        channels: 4,
        width: info.width, 
        height: info.height
      }
    }).png({
      overshootDeringing: true,
      quality: 40,
    }).toBuffer()
    //.toFile(config.studyinfo.base64SavePath + savename)
  
    var base64url = `data:image/png;base64,${image.toString('base64')}`
    //console.log(base64url);
    //var base64url = config.studyinfo.base64SavePath + savename;
  
    return {
      blurl: blurl, 
      base64url: base64url,
      info: info
    }
  }