const fs = require('fs')
const config = require('../config')
const db = require('../db/index')

module.exports.checkPermission = async function(uid, inGroup){
    return new Promise((resolve, reject) => {
        db.query(`SELECT p_group FROM user_info WHERE id =?`, [uid], function (error, results, fields) {
            if (error) reject(error)
            var array = results[0].p_group
            resolve(array.includes(inGroup));
        });
    });
}

module.exports.addPermission = async function(uid, inGroup){
    return new Promise((resolve, reject) => {
        db.query(`SELECT p_group FROM user_info WHERE id =?`, [uid], function (error, results, fields) {
            if (error) reject(error)
            var array = results[0].p_group.split(",").map(String);
            if(array.includes(inGroup)) resolve({"status" : false, "code" : 2, "message" : "User has been in this group!"});
            array.push(inGroup)
            db.query(`UPDATE user_info SET ?  WHERE id =?`, [{p_group : array.toString()}, uid], function (error, results, fields) {
                if (error) reject(error)
                resolve({"status" : false, "code" : 0, data : array});
            });
        });
    });
}