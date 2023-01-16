const db = require('../db/index')

exports.getCompetition = (req, res) => {
    const sql = `select * from compitition_info`
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        if (results.length == 0) return res.cc('获取信息失败！')
        var data = []
        for(let i in results){
            var link2json = JSON.parse(results[i].link);
            const result = { ...results[i], link: link2json}
            data.push(result)
        }
        res.send({
          status: true,
          message: 'success',
          data: data,
        })
      })
    }