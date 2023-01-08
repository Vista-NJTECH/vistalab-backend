const fs = require('fs')
const config = require('../config')
const db = require('../db/index')

module.exports.checkPermission = async function(uid, inGroup){
    var sql = `SELECT user_info.group FROM user_info WHERE id =?`
    db.query(sql, [uid], function (err, results) {
        if(err) return false
        var list = results[0].group
        return list.includes(inGroup)
    })
}