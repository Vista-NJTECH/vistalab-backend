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

    fs.unlink(req.file.path,function(error){
        if(error){
        return res.cc(error)
        }
    })

    const invoiceIns = response.data
    const sql = 'insert into invoice_info set ?'
        db.query(sql, { 
            invoicename: invoiceIns.detailList[0].name + invoiceIns.detailList[0].model, 
            applicant: req.body.applicant, 
            amount: invoiceIns.totalAmount, 
            remark: req.body.remark, 
            category: req.body.category}, function (err, results) {
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
}

exports.getall = (req, res) => {
    const userinfo = req.body
    const sql = `select * from invoice_info`
    db.query(sql, userinfo.username, function (err, results) {
  
      if (err) return res.cc(err)
  
      res.send({
        status: true,
        data: results,
      })
  
    })
    
}