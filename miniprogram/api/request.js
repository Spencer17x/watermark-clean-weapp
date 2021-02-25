/**
 * api 服务
 * @param {*} url 
 * @param {*} data 
 * @param {*} method 
 */
const apiRequest = (obj) => {
  const { url, data, method = 'get', baseUrl = 'https://qsy.xiaofany.com' } = obj;
  wx.showLoading({
    title: '加载中...',
  })
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + url,
      method,
      data,
      success(res) {
        if (
          res.statusCode === 200 && 
          res.data.code === 200 && 
          baseUrl === 'https://qsy.xiaofany.com'
        ) {
          resolve(res.data.data);
        } else if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          console.log('reject', res);
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