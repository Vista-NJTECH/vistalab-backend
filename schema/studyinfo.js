const joi = require('joi')

/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */

module.exports.studyinfo_schema = joi.object({
    classification : joi.string().required(),
    coursename : joi.string().required(),
    title : joi.string().required(),
    link : joi.string().required(),
    id : joi.string(),
    tags : joi.string(),
});