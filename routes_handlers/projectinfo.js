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
    let groups = "common"
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
    let groups = 'common';
    if (req.auth) {
      const myQuery = 'SELECT username FROM user_info WHERE id = ?';
      let results = await new Promise((resolve, reject) => {
        db.query(myQuery, req.auth.id, (err, results) => {
          if (err) {
            reject(err);
            return res.cc(err);
          } else {
            resolve(results);
          }
        });
      });
      groups = groups + "," +results[0].username;
    }
  
    // Insert new project into database
    const projectInfo = {
        title: req.body.title,
        details: req.body.details,
        members_id: req.auth.id,
        view_group: groups
    };
  
    const sql = 'INSERT INTO project_info SET ?';
    db.query(sql, projectInfo, (err, results) => {
      if (err) return res.cc(err);
      res.send({
        status: true,
        message: 'success'
      });
    });
}

exports.submit = async (req, res) => {
    const checkSql = 'SELECT * FROM project_info WHERE id = ?';
    const checkParams = [req.body.id];
    db.query(checkSql, checkParams, (err, results) => {
      if (err) return res.cc(err);
      if (results.length === 0) {
        return res.send({
          status: false,
          message: 'Invalid project_id'
        });
        }
    })

    const processInfo = {
        project_id: req.body.id,
        cycle: req.body.cycle,
        member_id: req.auth.id,
        remark: req.body.remark,
        current_work: req.body.current_work,
        future_plan: req.body.future_plan,
      };
    
      const sql = 'INSERT INTO process_info SET ?';
      db.query(sql, processInfo, (err, results) => {
        if (err) return res.cc(err);
        res.send({
          status: true,
          message: 'Process created successfully'
        });
      });
}

exports.update = async (req, res) => {

}

exports.delete = async (req, res) => {

}