// 云函数入口文件
const cloud = require('wx-server-sdk')
const { runDouyin } = require('./core')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  const { url } = event;

  const { noWatermarkVideoUrl, shareTitle } = await runDouyin(url);
  
  return {
    noWatermarkVideoUrl,
    shareTitle
  }
}