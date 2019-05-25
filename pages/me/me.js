// pages/me/me.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showPopup: false,
    likeNew:false,
    messageNew:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that=this
    var sessionId = wx.getStorageSync("sessionId")
    app.checkUserInfo(function (userInfo, isLogin) {
      if (!isLogin) {
        /**wx.redirectTo({
        url: '../authorization/authorization?backType=' + blogId
        })**/
        that.setData({
          showPopup: true
        })
        return;
      }else{
        wx.request({
          url: app.globalData.url +'bbs/message/newLike?sessionId=' + sessionId,
          headers: {
            'Content-Type': 'application/json'
          },
          success: function (res) {
            that.setData({
              likeNew: res.data.data,
            })
          }
        });
        wx.request({
          url: app.globalData.url + 'bbs/message/newReply?sessionId=' + sessionId,
          headers: {
            'Content-Type': 'application/json'
          },
          success: function (res) {
            that.setData({
              messageNew: res.data.data,
            })
          }
        })
      }
    })

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
    this.onLoad()
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
   * 获取用户信息
   */
  onGotUserInfo: function (e) {
    console.log("nickname=" + e.detail.userInfo.nickName);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo)
    var sessionId = wx.getStorageSync('sessionId')
    var that = this
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      wx.getUserInfo({
        success: function (res) {
          app.globalData.userInfo = JSON.parse(res.rawData);
          typeof cb == "function" && cb(app.globalData.userInfo, true);
          console.log(res),
            wx.request({
              url: app.globalData.url + 'bbs/wechat/info?sessionId=' + sessionId,
              data: {
                rawData: res.rawData,
                signature: res.signature,
                encryptedData: res.encryptedData,
                iv: res.iv
              },
              method: "POST",
              success(res) {
              }
            })
        }
      })
      this.setData({
        showPopup: !this.data.showPopup
      });
    } else {
      wx.switchTab({
        url: '../We/We'
      })
    }
  },

  /**
   * 返回
   */
  navigateBack: function (e) {
    wx.switchTab({
      url: '../We/We'
    })
  }
})