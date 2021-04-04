/**
 * api 服务
 * @param {*} url 
 * @param {*} data 
 * @param {*} method 
 */
const apiRequest = ({
  url,
  data,
  method = 'get',
  baseUrl = 'https://qsy.xiaofany.com'
}) => {
  wx.showLoading({
    title: '加载中...',
  })
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + url,
      method,
      data,
      success(res) {
        const isSucc = res.data.code ? 
          res.data.code === 200 : 
          res.statusCode == 200;
        if (isSucc) {
          resolve(res.data);
        } else {
          reject(res.data.message || res.errMsg);
        }
      },
      fail(err) {
        reject(JSON.stringify(err));
      },
      complete() {
        wx.hideLoading()
      }
    })
  });
}

const cloudRequest = (name, data) => {
  wx.showLoading({
    title: '加载中...',
  })
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name,
      data,
      success(res) {
        resolve(res.result)
      },
      fail(err) {
        console.error(`[云函数] [${name}] 调用失败`, err);
        reject(err)
      },
      complete() {
        wx.hideLoading()
      },
    })
  });
}

export {
  apiRequest, cloudRequest
}