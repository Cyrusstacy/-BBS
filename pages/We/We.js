// pages/We/We.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardCur:0,
    pagenum:1,
    isLoading:false,
    noData:false,
    last:false,
    TabCur: 0,
    scrollLeft: 0,
    list:[
      {noData:true},
      { noData: true },
      { noData: true },
      { noData: true },
      { noData: true },
      { noData: true },
      { noData: true },
    ],
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'http://img.ccnunercel.cn/bbs/img/yinghua1.jpg'
    }, {
      id: 1,
      type: 'image',
        url: 'http://img.ccnunercel.cn/bbs/img/lou.jpg',
    }, {
      id: 2,
      type: 'image',
        url: 'http://img.ccnunercel.cn/bbs/img/tushuguan.jpg'
    }, {
      id: 3,
      type: 'image',
        url: 'http://img.ccnunercel.cn/bbs/img/yinghua2.jpg'
    }, {
      id: 4,
      type: 'image',
        url: 'http://img.ccnunercel.cn/bbs/img/huanghua.jpg'
    }],

  },

  /**
   * 获取帖子列表
   */

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this
    wx.request({
      url: app.globalData.url + 'bbs/topic/all',
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        var nav=res.data.data
        console.log(nav)
        that.setData({
          nav:nav
        })
        wx.request({
          url: app.globalData.url + 'bbs/article/list?size=5&topicType=0',
          headers: {
            'Content-Type': 'application/json'
          },
          success: function (res) {
            console.log(res.data.data)
            if (res.data.data.content != 0) {
              var a = 'list[' + 0 + '].data'
              var b = 'list[' + 0 + '].last'
              var c = 'list[' + 0 + '].pagenum'
              var d = 'list[' + 0 + '].noData'
              //将获取到的json数据，存在名字叫list的这个数组中
              that.setData({
                [a]: res.data.data.content,
                [b]: res.data.data.last,
                [c]: 1,
                [d]: false
                //res代表success函数的事件对，data是固定的，list是数组
              })
            }
          }
        })
        for(var i=1;i<nav.length;i++){
          wx.request({
            url: app.globalData.url + 'bbs/article/list?size=5' + '&topicType=' + nav[i].topicType,
            headers: {
              'Content-Type': 'application/json'
            },
            success: function (res) {
              console.log(res.data.data)
              if(res.data.data.content!=0){
              var a = 'list[' + res.data.data.content[0].articleTopicType + '].data'
              var b = 'list[' + res.data.data.content[0].articleTopicType + '].last'
              var c = 'list[' + res.data.data.content[0].articleTopicType + '].pagenum'
              var d = 'list[' + res.data.data.content[0].articleTopicType + '].noData'
              //将获取到的json数据，存在名字叫list的这个数组中
              that.setData({
                [a]: res.data.data.content,
                [b]: res.data.data.last,
                [c]: 1,
                [d]: false
                //res代表success函数的事件对，data是固定的，list是数组
              })
              }
            }
          })
        }
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
    var that = this
    var tabcur = that.data.TabCur
    var a = 'list[' + tabcur + '].data'
    var b = 'list[' + tabcur + '].last'
    var c = 'list[' + tabcur + '].pagenum'
    var d = 'list[' + tabcur + '].noData'
    wx.request({
      url: app.globalData.url + 'bbs/article/list?size=5' + '&topicType=' + tabcur,
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.data)
        if (res.data.data.content != 0) {
          //将获取到的json数据，存在名字叫list的这个数组中
          that.setData({
            [a]: res.data.data.content,
            [b]: res.data.data.last,
            [c]: 1,
            [d]: false
            //res代表success函数的事件对，data是固定的，list是数组
          })
          wx.stopPullDownRefresh()
        }
      }
    })

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    var tabcur = that.data.TabCur
    var a = 'list[' + tabcur + '].pagenum'
    var pagenum = that.data.list[tabcur].pagenum + 1; 
    that.setData({
      [a]: pagenum, 
      isLoading:true,
    })
    that.getdatalist();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  bindKeyInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  Search(e){
    var that = this
    var searchKey = that.data.inputValue;
    wx.navigateTo({
      url: '/pages/search/search?searchKey=' + searchKey,
    })
  },
  searchKeywords(e){
    var searchKey = e.currentTarget.dataset.keywords;
    wx.navigateTo({
      url: '/pages/search/search?searchKey=' + searchKey,
    })
  },
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  getdatalist: function () { 
    var that = this;
    var tabcur = that.data.TabCur
    if(!that.data.list[tabcur].last){
      wx.request({
        url: app.globalData.url + 'bbs/article/list?page=' + that.data.list[tabcur].pagenum + '&size=6' + '&topicType='+tabcur,
        method: "GET",
        success: function (res) {
          var last = res.data.data.last
          var arr1 = that.data.list[tabcur].data;
          var arr2 = res.data.data.content;
          var a = 'list[' + tabcur + '].data'
          var b = 'list[' + tabcur + '].last'
          arr1 = arr1.concat(arr2);
          console.log(arr2)
          that.setData({
            [a]: arr1,
            isLoading: false,
            [b]:last
          })
        }
      })
    }else{
      var c = 'list[' + tabcur + '].noData'
      that.setData({
        [c]:true,
        isLoading: false
      })
    }
  }
})