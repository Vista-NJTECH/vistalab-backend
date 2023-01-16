const db = require('../db/index')
const fs = require('fs')
const config = require('../config')

const {GetTimeGap} = require("../utils/project_utils")

const {checkPermission} = require("../utils/user_utils")

function largest(arr, n, i)
            {
                if (i == n - 1) {
                    return arr[i];
                }
                let recMax = largest(arr, n, i + 1);
                return Math.max(recMax, arr[i]);
            }

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
    sql = `select * from project_ins where project_ins.id = ? AND ((select concat(project_ins.view_group, ',') regexp concat(replace(?,',',',|'),',')) = 1) AND state != '0'`

    db.query(sql, params, async function(err, results) {
        if (err) return res.cc(err)
        let data = []
        let cycles = []
        if(results.length === 0){
          await new Promise((resolve, reject) => { 
            const checkSql = `SELECT ddl, stl, cycleLength FROM project_info WHERE id = ?`;
            const checkParams = [id];
            db.query(checkSql, checkParams, async (err, result) => {
              if (err)return res.cc(err);
              else {
                  var tempjson = {}
                  tempjson["cycle"] = 1
                  tempjson["cycle_time"] = await GetTimeGap(
                    result[0].stl,
                    result[0].cycleLength, 
                    0,
                    result[0].ddl,)
                  tempjson["data"] = []
                  data.push(tempjson)
                  resolve(data)
              }
            })
          })
        }
        else{
          for(let i in results) {
          if(cycles.indexOf(results[i].cycle) < 0){
            var tempjson = {}
            cycles.push(results[i].cycle)
            tempjson["cycle"] = results[i].cycle
            tempjson["cycle_time"] = results[i].cycle_time
            tempjson["data"] = []
            delete results[i].cycle_time
            delete results[i].created_time
            tempjson["data"].push(results[i])
            data.push(tempjson)
          }else{
            delete results[i].cycle_time
            delete results[i].created_time
            data[cycles.indexOf(results[i].cycle)]["data"].push(results[i])
          }
          if(i == results.length - 1 && largest(cycles, cycles.length, 0) < data[largest(cycles, cycles.length, 0) - 1 ]["data"][0].project_all_cycles){
            

            const nextcycle = largest(cycles, cycles.length, 0) + 1
            var tempjson = {}
            tempjson["cycle"] = nextcycle
            tempjson["cycle_time"] = await GetTimeGap(
              data[nextcycle - 2]["data"][0].stl, 
              data[nextcycle - 2]["data"][0].cycleLength, 
              nextcycle - 1,
              data[nextcycle - 2]["data"][0].ddl)
            tempjson["data"] = []
            data.push(tempjson)
          }
          };
        }
        res.send({
        status: true,
        data: data,
        })
    })
}

exports.getall = async (req, res) => {
  if(!req.auth) delete req.auth
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
    sql = `select * from project_info where (((select concat(project_info.view_group, ',') regexp concat(replace(?,',',',|'),',')) = 1) and state != '0') order by created_time desc`

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
          var members = ''
          for(let j in results2){
            members += results2[j].name + " "
          }
          delete data[i].member_id
          data[i].members = members
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
  
    ddl = new Date(req.body.date)
    stl = new Date();
    stl.setTime(stl.getTime() + 8 * 60 * 60 * 1000);
    const timeDiff = ddl.getTime() - stl;
    const daysDiff = timeDiff / (1000 * 3600 * 24);
    const cycleLength = req.body.cycleLength || 7;
    const numberOfCycles = Math.ceil(daysDiff / cycleLength);
    if(numberOfCycles < 1) return res.cc("日期错误!")
    const projectInfo = {
        title: req.body.title,
        details: req.body.details,
        members_id: req.auth.id,
        stl:stl,
        ddl: ddl,
        cycles:numberOfCycles,
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
    var cycle_time
    await new Promise((resolve, reject) => { 
      const checkSql = `SELECT * FROM project_info WHERE id = ? and state != '0'`;
      const checkParams = [req.body.id];
      db.query(checkSql, checkParams, async (err, result) => {
        if (err) {
          reject(err);
          return res.cc(err);
        } else {
          if (result.length === 0) return res.cc('Invalid project_id!');
          if(!result[0].members_id.includes(req.auth.id)) return res.cc('您没有权限添加!');
          if(result[0].cycles < req.body.cycle) return res.cc('超过截止日期!');
          cycle_time = await GetTimeGap(result[0].stl, result[0].cycleLength, req.body.cycle - 1, result[0].ddl)
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
        cycle_time: cycle_time, 
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
  return res.cc("暂不支持!")
}

exports.delete = async (req, res) => {
  if(!await checkPermission(req.auth.id, "admin")) return res.cc("您没有权限删除!")
  const sql = 'UPDATE project_info SET ? WHERE id = ?';
  db.query(sql, [{state : 0},req.body.id], (err, results) => {
    if (err) return res.cc(err);
    if(results.affectedRows === 0) return res.cc("删除失败!")
    res.cc('项目删除成功!',true);
  });
}