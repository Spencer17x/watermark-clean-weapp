/**
 * api 服务
 * @param {*} url 
 * @param {*} data 
 * @param {*} method 
 */
const apiRequest = (url, data, method = 'get',) => {
  const baseUrl = 'http://localhost:3000';
  wx.showLoading({
    title: '加载中...',
  })
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + url,
      method,
      data,
      success(res) {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail(err) {
        reject(err);
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