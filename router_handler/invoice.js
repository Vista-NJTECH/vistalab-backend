const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios')
const db = require('../db/index')

exports.add = async (req, res) => {
    const url = 'http://invoice.heycore.com/invoice/extrat'
    const form = new FormData();

    const pdffile = fs.createReadStream(req.file.path);

    form.append('file', pdffile, req.file.originalname);

    const response = await axios.post(url, form, {
        headers: {
          ...form.getHeaders(),
        },
      });

    const invoiceIns = response.data

    const sql_user = `select name from user_info where id= ? `
    db.query(sql_user, req.auth.id, function (err, results) {
        if (err) return res.cc(err)
        const sql = 'insert into invoice_info set ?'
        db.query(sql, { 
            invoicename: invoiceIns.detailList[0].name + invoiceIns.detailList[0].model, 
            applicant: results[0].name, 
            applicant_id: req.auth.id, 
            amount: invoiceIns.totalAmount, 
            remark: req.body.remark, 
            category: req.body.category,
            path : req.file.path
        }, function (err, results) {
            if (err){
                return res.cc(err)
            } 
            if (results.affectedRows !== 1) {
                return res.cc("插入数据库invoice_info失败!")
            }
            return res.cc({
                amount: invoiceIns.totalAmount
            }, true)
        })
    })

    
}

exports.getall = (req, res) => {
    const sql = `select * from invoice_info`
    db.query(sql, function (err, results) {
      if (err) return res.cc(err)
  
      res.send({
        status: true,
        data: results,
      })
  
    })
    
}

exports.delete = (req, res) => {
    const sql_user = `select applicant_id, path from invoice_info where id= ? `
    db.query(sql_user, req.body.id, function (err, results) {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('id错误!')
        if (results[0].applicant_id != req.auth.id) return res.cc('您没有权限删除!')
        const sql = `delete from invoice_info WHERE id=?`
        db.query(sql, [req.body.id],function(err, results2) {
            if (err) return res.cc(err)
            fs.unlink(results[0].path,function(error){
                if(error){
                  return res.cc(error)
                }
            return res.cc('发票删除成功!', true)
            })
        })
    })

    
}

exports.unstate = (req, res) => {
    const sql_user = `select name from user_info where id= ? `
    db.query(sql_user, req.auth.id, function (err, results) {
      if (err) return res.cc(err)
  
      res.send({
        status: true,
        data: results,
      })
  
    })

    const sql = `delete from schedule_info WHERE id=?`
    db.query(sql, [req.body.id],function(err, results2) {
      if (err) return res.cc(err)
      return res.cc('日程删除成功!', true)
    })
}