//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that=this
    var sessionId = wx.getStorageSync('sessionId')

    // 登录
    if (!sessionId){
      wx.login({
        success: function (res) {
          console.log(res.code)
          //发送请求
          wx.request({
            url: that.globalData.url +'bbs/wechat/login', //接口地址
            data: { code: res.code },
            header: {
              'content-type': 'application/json' //默认值
            },
            success: function (res) {
              console.log(res.data)
              wx.setStorageSync('sessionId', res.data.data.sessionId)
              console.log(res.data.data.sessionId)
            }
          })
        }
      }),
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: res => {
                  // 可以将 res 发送给后台解码出 unionId
                  this.globalData.userInfo = res.userInfo

                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况

                }
              })
            }
          }
        })

    }
    
  },
  checkUserInfo: function (cb) {
    let that = this
    var sessionId=wx.getStorageSync('sessionId')
    if (that.globalData.userInfo) {
      typeof cb == "function" && cb(that.globalData.userInfo, true);
    } else {
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: function (res) {
                that.globalData.userInfo = JSON.parse(res.rawData);
                typeof cb == "function" && cb(that.globalData.userInfo, true);
                console.log(res),
                wx.request({
                  url: that.globalData.url+'bbs/wechat/info?sessionId=' + sessionId,
                  data:{
                    rawData: res.rawData,
                    signature: res.signature,
                    encryptedData: res.encryptedData,
                    iv: res.iv
                  },
                  method:"POST",
                  success(res){ 
                  }
                })
              }
            })
          } else {
            typeof cb == "function" && cb(that.globalData.userInfo, false);
          }
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    // url:'https://ccnunercel.cn/'
    //url:'http://localhost:8011/'
    url:'https://ccnu9102.mynatapp.cc/'
  }
})