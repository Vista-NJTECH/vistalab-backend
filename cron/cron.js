const cron = require("node-cron");
const {transporter} = require('../utils/email')
const db = require('../db/index')

function sendeMail() {
  console.log("Sending......");
  const query = 'SELECT email FROM user_info';
  db.query(query, function(error, results, fields) {
  if (error) {
    console.error(error);
    return;
  }

  // 遍历所有用户的 email，逐个发送邮件
  results.forEach(function(result) {
    const mailOptions = {
      from: '"测试邮件，请忽略" njtech_vista@163.com',
      to: result.email,
      subject: '这是一封测试邮件，请忽略',
      text: '这是一封测试邮件，请忽略'
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.error(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  });
});
}

// 设置每分钟执行一次任务
cron.schedule("* * * * *", sendeMail);
