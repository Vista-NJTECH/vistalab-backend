const db = require('../db/index')

exports.submit = async (req, res) => {
  const {feedback} = req.body
  if(feedback == "sign") return res.cc("https://backend.vistalab.top/public/ctf/html/sign.html", true)
  if(feedback == "secondkey") return res.cc("/public/ctf/html/flag2.html", true)
  if(feedback == "flag3flag") return res.cc("BaconCipher : AABABABBBABAAABAABBAAABAABAABBABBAAAABAA   key : AABBAABBABABBABAAABB", true)
  if(feedback == "good") { 
    res.setHeader("png", "http://139.196.138.115:8081/public/pngpng.png")
    return res.cc("success!QAQ-header!", true)
  }
  if(feedback == "byebye") { 
    const sql = 'insert into feedback set ?'
    await db.query(sql, { 
      feedback: "通关一人",
    }, function (err, noresults) {
        if (err){
          return res.cc(err)
        } 
    })
    return res.cc("Congratulations! Very simple!", true)
  }else
  {if(feedback == "") return res.cc("不能为空!")

  const sql = 'insert into feedback set ?'
  db.query(sql, { 
    feedback: feedback,
  }, function (err, noresults) {
      if (err){
        return res.cc(err)
      } 
      res.send({
          status: true,
          message: '提交成功',
          })
  })}
}

exports.getAll = (req, res) => {
  const sql = 'SELECT * from feedback order by created_time desc'
  db.query(sql, function (err, results) {
      if (err){
        return res.cc(err)
      } 
      let groupedByDate = {};
      results.forEach(function(feedback) {
          let date = new Date(feedback.created_time);
          let dateKey = date.getUTCFullYear()+"-"+ (date.getUTCMonth()+1) +"-"+date.getUTCDate();
          if (!groupedByDate[dateKey]) {
              groupedByDate[dateKey] = [];
          }
          groupedByDate[dateKey].push(feedback);
      });
      let newData=Object.entries(groupedByDate).map(([date, data]) => ({date, data}));
      res.send({
          status: true,
          data: newData,
          })
  })
}
  
exports.delete = (req, res) => {
  const sql = 'DELETE from feedback WHERE id =?'
  db.query(sql, [req.body.id], function (err, results) {
      if (err){
        return res.cc(err)
      } 
      res.cc("success", true)
  })
}