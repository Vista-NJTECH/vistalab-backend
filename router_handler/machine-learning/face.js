const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../../config')
const db = require('../../db/index')
const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios')
const https = require('https')

exports.facelogin = async (req, res) => {
    const url = 'http://124.223.196.177:8182/face/facerecog'
    const form = new FormData();

    form.append("image", fs.createReadStream(req.file.path), "test.png");
    var resp
    try {
        resp = await axios.post(url, form, {
            headers: {
            ...form.getHeaders(),
            }
        });
        if(!resp.status){
            res.cc("登录失败!")
        }
        if(!resp.status != 200){
            res.cc("登录失败!")
        }

        //console.log(resp.status)
    const sql = `select id, password, username, name, email, avatar, level, created_time from user_info where name=?`
    db.query(sql, resp.data, function (err, results) {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 执行 SQL 语句成功，但是查询到数据条数不等于 1
        if (results.length !== 1) return res.cc('登录失败！')

        if(results[0].avatar == null) results[0].avatar = config.userinfo.default_avatar
        const user = { ...results[0], password: '', avatar: config.url_prefix + results[0].avatar}
        const usertoken = { ...results[0], password: '', avatar: '', name: "", email: "", level: "",created_time: "" }
        const tokenStr = jwt.sign(usertoken, config.jwtSecretKey, {
        expiresIn: config.expiresIn,
        })

        //res.cookie("token",'vista ' + tokenStr,{maxAge:config.cookieage,httpOnly:true});

        res.send({
        status: true,
        message: '登录成功！',
        userinfo : user,
        token: 'Bearer ' + tokenStr,
        })
    })
    
    } catch (error) {
        res.cc(error)
    }

    
    
}