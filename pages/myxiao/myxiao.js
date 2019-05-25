// pages/myxiao/myxiao.js
const app = getApp()
Page({


  /**
   * 页面的初始数据
   */
  data: {
    pagenum: 1,
    isLoading: false,
    noData: false,
    last: false,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getdatalist()
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
    var that = this;
    var pagenum = that.data.pagenum + 1;
    that.setData({
      pagenum: pagenum,
      isLoading: true,
    })
    that.getdatalist();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getdatalist: function () {
    var sessionId = wx.getStorageSync('sessionId')
    var that = this;
    if (!that.data.last) {
      wx.request({
        url: app.globalData.url + 'bbs/message/reply?sessionId=' + sessionId + '&page=' + that.data.pagenum,
        method: "GET",
        success: function (res) {
          console.log(res.data.data);
          var last = res.data.data.last
          var arr1 = that.data.list;
          var arr2 = res.data.data.content;
          arr1 = arr1.concat(arr2);
          that.setData({
            list: arr1,
            isLoading: false,
            last: last
          })
          console.log(that.data.list)
        }
      })
    } else {
      that.setData({
        noData: true,
        isLoading: false
      })
    }
  }
})