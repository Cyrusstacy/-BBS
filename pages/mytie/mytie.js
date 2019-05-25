// pages/mytie/mytie.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //我的帖子数据
    pagenum: 1,
    isLoading: false,
    noData: false,
    last: false,
    list:[]

  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取我的帖子数据
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
   this.setData({
      pagenum: 1,
      isLoading: false,
      noData: false,
      last: false,
      list: []
   })
   this.onLoad()
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

// 用户长按删除帖子
  longPress: function (e) {
    var that=this
    var sessionId = wx.getStorageSync("sessionId")
    var articleId = e.currentTarget.dataset.curindex
    console.log(e.currentTarget)
    wx.showModal({ //使用模态框提示用户进行操作

      title: '亲爱的',

      content: '你将删除此帖子！',
      success(res){
        if(res.confirm){
          wx.request({
            url: app.globalData.url +'bbs/article/delete?sessionId=' + sessionId + '&articleId=' + articleId ,
            method:'get',
            success:function(res){
              wx.startPullDownRefresh()
            }
          })


        }
      }
    })
    

  },
  getdatalist: function () {
    var sessionId = wx.getStorageSync('sessionId')
    var that = this;
    if (!that.data.last) {
      wx.request({
        url: app.globalData.url + 'bbs/article/myArticle?sessionId=' + sessionId + '&page=' + that.data.pagenum,
        method: "GET",
        success: function (res) {
          console.log(res.data)
          var last = res.data.data.last
          var arr1 = that.data.list;
          var arr2 = res.data.data.content;
          arr1 = arr1.concat(arr2);
          that.setData({
            list: arr1,
            isLoading: false,
            last: last
          })
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