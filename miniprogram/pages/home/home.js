import { apiRequest } from '../../api/request';
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

  // 检验参数
  validate() {
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
      return 0;
    }
    if (!videoUrl) {
      wx.showToast({
        title: '请输入视频地址',
        icon: 'none'
      });
      return 0;
    }
  },

  /**
   * 点击提取视频
   */
  async extractVideo() {
    try {
      const { videoUrl } = this.data;
      const validateCode = this.validate();
      if (validateCode === 0) return; 
      const { data: { token } } = await apiRequest({
        url: '/api/getToken',
        method: 'post'
      });
      const cityRes = await apiRequest({
        url: '/cityjson',
        data: {
          id: 'utf-8'
        },
        baseUrl: 'https://pv.sohu.com' 
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
      const { data: videoRes } = await apiRequest({
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
    } catch(err) {
      wx.showToast({
        title: err,
        icon: 'none'
      })
    }
  },

  copyUrl() {
    wx.setClipboardData({
      data: this.data.noWatermarkVideoUrl,
      success() {
        wx.showToast({
          title: '复制成功',
        })
      }
    })
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