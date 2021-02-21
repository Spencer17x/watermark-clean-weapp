import { apiRequest } from '../../api/request';

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
    const { videoUrl } = this.data;
    const res = await apiRequest('/dy', {
      url: videoUrl
    });
    const { noWatermarkVideoUrl } = res.data;
    this.setData({
      noWatermarkVideoUrl
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