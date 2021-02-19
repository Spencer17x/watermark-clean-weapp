const request = (url, data, method = 'get',) => {
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
      fail(res) {
        reject(res);
      },
      complete() {
        wx.hideLoading()
      }
    })
  });
}

export default request;