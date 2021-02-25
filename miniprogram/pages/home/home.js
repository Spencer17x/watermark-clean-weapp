import { apiRequest, cloudRequest } from '../../api/request';
import { mySign } from '../../utils/sign'

const app = getApp();

// 抖音平台测试链接：
// https://v.douyin.com/JEWbnGg/

Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoUrl: '',
    noWatermarkVideoUrl: ''
  },

  /**
   * 输入视频地址
   * @param {} e 
   */
  inputVideoUrl(e) {
    const { value: videoUrl } = e.detail;
    this.setData({videoUrl});
  },

  /**
   * 点击提取视频
   */
  async extractVideo() {
    const { openid } = app.globalData;
    const { videoUrl } = this.data;
    if (!openid) {
      wx.showModal({
        title: '提示',
        content: '当前状态未登录，请点击确认去登录',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/user/user',
            });
          }
        }
      })
      return;
    }
    if (!videoUrl) {
      wx.showToast({
        title: '请输入视频地址',
        icon: 'none'
      });
      return;
    }
    // 获取去水印解析视频的token
    const tokenRes = await apiRequest({
      url: '/api/getToken',
      method: 'post'
    });
    const { token } = tokenRes;

    // 获取解析接口所需的returnCitySN
    const cityRes = await apiRequest({
      baseUrl: 'https://pv.sohu.com',
      url: '/cityjson?ie=utf-8',
    });
    const cityArr = cityRes.split(' ');
    const returnCitySN = {
      cip: cityArr[4].replace('"', '').replace('",', ''),
      cid: cityArr[6].replace('"', '').replace('",', ''),
      cname: cityArr[8].replace('"', '').replace('"};', '')
    };
    const t = new Date().getTime();
    const sign = mySign(videoUrl, t, token, returnCitySN);
    // 解析并去水印
    const videoRes = await apiRequest({
      url: '/api/analyze',
      data: {
        token,
        url: videoUrl,
        t,
        sign
      },
      method: 'post'
    });
    this.setData({
      noWatermarkVideoUrl: videoRes.video
    })
  },

  // 点击保存按钮
  async save() {
    try {
      const { noWatermarkVideoUrl } = this.data;
      const videoUrl = noWatermarkVideoUrl.startsWith('https') ? noWatermarkVideoUrl : noWatermarkVideoUrl.replace('http', 'https')
      const filePath = await this.downloadVideo(videoUrl);
      const res = await this.saveVideo(filePath);
      if (res.errMsg === 'saveVideoToPhotosAlbum:ok') {
        wx.showToast({
          title: '保存成功',
          icon: 'none'
        });
      } else {
        wx.showToast({
          title: 'saveVideoToPhotosAlbum error',
          icon: 'none'
        });
      }
    } catch(err) {
      wx.showToast({
        title: JSON.stringify(err),
        icon: 'none'
      })
    }
  },

  /**
   * 把视频下载到本地
   * @param {*} url 
   */
  downloadVideo(url) {
    return new Promise((resolve, reject) => {
      const fileName = new Date().valueOf();
      wx.downloadFile({
        url,
        filePath: wx.env.USER_DATA_PATH + '/' + fileName + '.mp4',
        success(res) {
          if (res.statusCode === 200) {
            resolve(res.filePath)
          } else {
            reject(res);
          }
        },
        fail(err) {
          reject(err);
        }
      })
    })
  },

  /**
   * 保存视频
   * @param {*} filePath 
   */
  saveVideo(filePath) {
    return new Promise((resolve, reject) => {
      wx.saveVideoToPhotosAlbum({
        filePath,
        success(res) {
          resolve(res)
        },
        fail(err) {
          reject(err);
        }
      })
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})