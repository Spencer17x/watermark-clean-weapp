// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { OPENID: openid, APPID: appid, UNIONID: unionid } = wxContext;
  const { data } = await db.collection('user').where({
    openid
  }).get();
  if (!data.length) {
    console.log('add user')
    await db.collection('user').add({
      data: {
        openid
      }
    });
  }
  return {
    event,
    openid,
    appid,
    unionid,
  };
}