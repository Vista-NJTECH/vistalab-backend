const cron = require("node-cron");

// 定义定时任务函数
function myTask() {
  console.log("Hello, world!");
}

// 设置每分钟执行一次任务
cron.schedule("* * * * *", myTask);
