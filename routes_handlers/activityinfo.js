const db = require('../db/index');
const fs = require('fs');
const config = require('../config');

const { activityinfo_schema } = require('../schema/activityinfo');
const image_utils = require('../utils/image_utils');

// 获取活动信息
exports.getActivity = (req, res) => {
  let sql;
  const { count } = req.query;

  sql = `
    SELECT activity_info.id, title, date, detail, path, width, height, base64 
    FROM img_info, activity_info 
    WHERE img_info.id = activity_info.img_id 
    ORDER BY date DESC
    ${count ? 'LIMIT ?' : ''}
  `;

  db.query(sql, [parseInt(count)], (err, results) => {
    if (err) return res.cc(err);
    if (!results.length) return res.cc('获取用户信息失败！');

    const data = results.map((result) => ({
      id: result.id,
      title: result.title,
      date: result.date,
      detail: result.detail,
      img: {
        width: result.width,
        height: result.height,
        path: result.path,
        base64: result.base64,
      },
    }));

    res.send({
      status: true,
      data,
      prefix: config.url_prefix,
    });
  });
};

// 添加活动信息
exports.addActivity = async (req, res) => {
  try {
    // 表单验证
    const validation = activityinfo_schema.validate(req.body);
    if (validation.error) throw new Error(validation.error);

    let img_path = 'public/src/default.png';
    let img_id = 1;

    if (req.file) {
      img_path = req.file.path;
      const imgInfo = await image_utils.saveImg(req);

      // 保存图片信息到数据库
      const [imgResult] = await db.query('INSERT INTO img_info SET ?', {
        path: img_path,
        size: imgInfo.info.size,
        blur: imgInfo.blurl,
        base64: imgInfo.base64url,
        width: imgInfo.info.width,
        height: imgInfo.info.height,
      });
      if (!imgResult.affectedRows) throw new Error('插入数据库img_info失败');
      img_id = imgResult.insertId;
    }

    // 保存活动信息到数据库
    const [activityResult] = await db.query('INSERT INTO activity_info SET ?', {
      title: req.body.title,
      date: req.body.date,
      detail: req.body.detail,
      img_id,
    });
    if (!activityResult.affectedRows) throw new Error('插入数据库activity_info失败');

    res.cc('上传成功!', true);
  } catch (err) {
    res.cc(err.message);
  }
};

// 删除活动信息
exports.delete = async (req, res) => {
  try {
    const [[result]] = await db.query('SELECT * FROM img_info, activity_info WHERE img_info.id = activity_info.img_id AND activity_info.id = ?', [req.body.id]);
    if (!result) throw new Error('没有可删除记录');

    if (result.img_id !== 1) {
      // 删除物理文件
      fs.unlinkSync(result.path);

      // 删除图片信息
      await db.query('DELETE FROM img_info WHERE id=?', [result.img_id]);
    }

    // 删除活动信息
    await db.query('DELETE FROM activity_info WHERE id=?', [req.body.id]);

    res.cc('删除成功!', true);
  } catch (err) {
    res.cc(err.message);
  }
};

// 更新活动信息
exports.update = async (req, res) => {
  try {
    const validation = activityinfo_schema.validate(req.body);
    if (validation.error) throw new Error(validation.error);

    if (req.file) {
      const imgInfo = await image_utils.saveImg(req);

      // 更新图片信息
      await db.query('UPDATE img_info SET ? WHERE id = ?', [{
        path: req.file.path,
        size: imgInfo.info.size,
        blur: imgInfo.blurl,
        base64: imgInfo.base64url,
        width: imgInfo.info.width,
        height: imgInfo.info.height,
      }, req.body.id]);
    }

    // 更新活动信息
    await db.query('UPDATE activity_info SET ? WHERE id = ?', [{
      title: req.body.title,
      date: req.body.date,
      detail: req.body.detail,
    }, req.body.id]);

    res.cc('更新成功!', true);
  } catch (err) {
    res.cc(err.message);
  }
};
