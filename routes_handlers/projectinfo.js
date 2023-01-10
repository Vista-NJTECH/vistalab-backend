const db = require('../db/index')
const fs = require('fs')
const config = require('../config')

const {studyinfo_schema} = require("../schema/studyinfo")

const {deleteImg, saveImg} = require("../utils/image_utils")

const {checkPermission} = require("../utils/user_utils")

exports.getProject = async (req, res) => {
    const {id} = req.query
    groups = "common"
    if(req.auth){
        const myQuery = `select p_group from user_info where id= ?`
        let results = await new Promise((resolve, reject) => db.query(myQuery, req.auth.id, async (err, results) => {
        if (err) {
            reject(err)
            return res.cc(err)
        } else {
            resolve(results);
        }
        }));
        groups = results[0].p_group
    }

    params = [id, groups]
    sql = `select * from project_ins where project_ins.project_id = ? AND ((select concat(project_ins.view_group, ',') regexp concat(replace(?,',',',|'),',')) = 1)`

    db.query(sql, params, function(err, results) {
        if (err) return res.cc(err)
        const count = results.length == 10 ? 10 : results.length
        res.send({
        status: true,
        data: results,
        })
    })
}

exports.getall = async (req, res) => {
    groups = "common"
    if(req.auth){
        const myQuery = `select p_group from user_info where id= ?`
        let results = await new Promise((resolve, reject) => db.query(myQuery, req.auth.id, async (err, results) => {
        if (err) {
            reject(err)
            return res.cc(err)
        } else {
            resolve(results);
        }
        }));
        groups = results[0].p_group
    }

    params = [groups]
    sql = `select * from project_info where ((select concat(project_info.view_group, ',') regexp concat(replace(?,',',',|'),',')) = 1)`

    db.query(sql, params, function(err, results) {
        if (err) return res.cc(err)
        const count = results.length == 10 ? 10 : results.length
        res.send({
        status: true,
        data: results,
        })
    })
}

exports.add = async (req, res) => {

}

exports.update = async (req, res) => {

}

exports.delete = async (req, res) => {

}