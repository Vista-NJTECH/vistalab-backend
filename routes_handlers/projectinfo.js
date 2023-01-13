const db = require('../db/index')
const fs = require('fs')
const config = require('../config')

const {studyinfo_schema} = require("../schema/studyinfo")

const {deleteImg, saveImg} = require("../utils/image_utils")

const {checkPermission} = require("../utils/user_utils")

exports.getProject = async (req, res) => {
  req.connection.setTimeout(100000);
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
    sql = `select * from project_ins where project_ins.id = ? AND ((select concat(project_ins.view_group, ',') regexp concat(replace(?,',',',|'),',')) = 1)`

    db.query(sql, params, function(err, results) {
        if (err) return res.cc(err)
        let data = []
        let cycles = []
        for(let i in results) {
          if(cycles.indexOf(results[i].cycle) < 0){
            var tempjson = {}
            cycles.push(results[i].cycle)
            tempjson[results[i].cycle] = []
            tempjson[results[i].cycle].push(results[i])
            data.push(tempjson)
          }else{
            data[cycles.indexOf(results[i].cycle)][results[i].cycle].push(results[i])
          }
        };
        res.send({
        status: true,
        data: data,
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

    db.query(sql, params, async function(err, results) {
        data = results
        if (err) return res.cc(err)
        for(let i in data){
          ids = data[i].members_id
          params = [ids]
          
          sql = `select name from user_info where ((select concat(user_info.id, ',') regexp concat(replace(?,',',',|'),',')) = 1)`
          let results2 = await new Promise((resolve, reject) => db.query(sql, params, async (err, results) => {
            if (err) {
              reject(err)
              return res.cc(err)
            } else {
              resolve(results);
            }
          }));
          var mambers = ''
          for(let j in results2){
            mambers += results2[j].name + " "
          }
          delete data[i].member_id
          data[i].mambers = mambers
        }
        
        res.send({
          status: true,
          data: data,
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
        ddl: req.body.date,
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
    await new Promise((resolve, reject) => { 
      const checkSql = 'SELECT * FROM project_info WHERE id = ?';
      const checkParams = [req.body.id];
      db.query(checkSql, checkParams, (err, result) => {
        if (err) {
          reject(err);
          return res.cc(err);
        } else {
          if (result.length === 0) return res.cc('Invalid project_id!');
          if(result[0].members_id.indexOf(req.auth.id) < 0) return res.cc('您没有权限添加!');
          resolve(result);
        }
        
      })
    });
    await new Promise((resolve, reject) => {
      const checkcycle = 'SELECT * FROM process_info WHERE project_id = ? and member_id = ? and cycle = ?';
      const checkParams = [req.body.id, req.auth.id, req.body.cycle];
      db.query(checkcycle, checkParams, (err, result_cycle) => {
        if (err) {
          reject(err);
          return res.cc(err);
        } else {
          if (result_cycle.length != 0) return res.cc('您已经添加过该周期记录!');
          resolve(result_cycle);
        }
        
      })
    });
    const processInfo = {
        project_id: req.body.id,
        cycle: req.body.cycle,
        member_id: req.auth.id,
        remark: req.body.remark,
        current_work: req.body.work,
        future_plan: req.body.plan,
      };
    
      const sql = 'INSERT INTO process_info SET ?';
      db.query(sql, processInfo, (err, results) => {
        if (err) return res.cc(err);
        res.send({
          status: true,
          message: '项目进度提交成功!'
        });
      });
}

exports.update = async (req, res) => {

}

exports.delete = async (req, res) => {

}