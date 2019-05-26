const app = getApp()

Page({

  data: {
    imgList: [],
    modalName: null,
    textareaAValue: '',
    inputValue: '',
    inputValue1: '',
    imgUrl: [],
    showPopup: false,
    picker: [],
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    ColorList: [{
      title: '失物招领',
      name: 'cyan',
      color: '#1cbbb4'
    },
    {
      title: '吐槽',
      name: 'cyan',
      color: '#1cbbb4'
    },
    {
      title: '兼职',
      name: 'cyan',
      color: '#1cbbb4'
    },
    {
      title: '家教',
      name: 'cyan',
      color: '#1cbbb4'
    },
    {
      title: '家教',
      name: 'cyan',
      color: '#1cbbb4'
    },
    {
      title: '美食',
      name: 'cyan',
      color: '#1cbbb4'
    },
    {
      title: '拍照打卡',
      name: 'cyan',
      color: '#1cbbb4'
    },
    {
      title: '探店',
      name: 'cyan',
      color: '#1cbbb4'
    }]
  },

  onLoad(options) {
    var that=this 
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
          url: app.globalData.url + 'bbs/topic/list',
          headers: {
            'Content-Type': 'application/json'
          },
          success: function (res) {
            var nav = res.data.data
            that.setData({
              picker: nav
            })
          }
        })
      }
    })

  },
  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    })
  },

  bindKeyInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  keyWordsInput(e) {
    this.setData({
      inputValue1: e.detail.value
    })
  },

  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
    })
  },
  ChooseImage() {
    var that =this;
    wx.chooseImage({
      count: 8, //默认9
      sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
        for (let i = 0; i < res.tempFilePaths.length; i++) {
          wx.showLoading({
            title: '正在上传图片哟',
          })
          var str = res.tempFilePaths[i];
          var sessionId = wx.getStorageSync('sessionId')
          wx.uploadFile({
            url: app.globalData.url +'bbs/article/upload?sessionId=' + sessionId,
            filePath: str,
            name: 'multipartFile',
            success(res) {
              if(JSON.parse(res.data).code==0){
                console.log(JSON.parse(res.data).data)
                var arr1 = that.data.imgUrl;
                var arr2 = JSON.parse(res.data).data;
                arr1 = arr1.concat(arr2);
                that.setData({
                  imgUrl:arr1
                })
                wx.hideLoading()
              }else{
                wx.showToast({
                  title: JSON.parse(res.data).msg,
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
          
        }
        
        
      }
    });
  },
  ViewImage(e) {
    console.log(e.currentTarget.dataset)
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '亲爱的',
      content: '确定要删除这张回忆吗？',
      cancelText: '点错了',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1)
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  Publish(e){
    var that=this;
    var sessionId=wx.getStorageSync('sessionId');
    var articleContent = that.data.textareaAValue;
    var articleTitle= that.data.inputValue;
    var articleKeywords = that.data.inputValue1;
    var imgUrl = that.data.imgUrl ;
    var topicType = parseInt(that.data.index)+1;
    wx.showModal({
      title: '亲爱的',
      content: '确定要发布么？',
      cancelText: '点错了',
      confirmText: '确定',
      success: res =>{
        if (res.confirm) {
          wx.showLoading({
            title: '正在发布哟',
          })
          if (topicType == undefined || topicType.length == 0 ||articleContent == undefined || articleContent.length == 0 || articleTitle == undefined || articleTitle.length == 0 || articleKeywords == undefined || articleKeywords == 0) {
            wx.hideLoading()
            wx.showToast({
              title: '版块，标题，内容，标签，缺一不可哦！',
              icon: 'none',
              duration: 2500
            })
          }else{
            wx.request({
              url: app.globalData.url + 'bbs/article/create?sessionId=' + sessionId,
              data: {
                articleContent: articleContent,
                articleTitle: articleTitle,
                imgUrls: imgUrl,
                articleKeywords: articleKeywords,
                articleTopicType: topicType
              },
              method: 'post',
              success(res) {
                console.log(res.data)
                if (res.data.code == 0) {
                  wx.hideLoading()
                  wx.showToast({
                    title: '帖子已发布',
                    icon: 'success',
                    duration: 2000
                  })
                  wx.switchTab({
                    url: '../We/We',
                  })
                } else {
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none',
                    duration: 2000
                  })
                }
              }
            })
          }
        } else if (res.cancel) {
          return
        }
        
      }
    })
  },
  bindGetUserInfo: function (e) {
    var that = this
    var sessionId = wx.getStorageSync('sessionId')
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
  },
    
  showTag(e) {
    this.setData({
      isTag: e.detail.value
    })
  },
  addTag(e){
    var arr2 = e.currentTarget.dataset.content+' '
    var arr1 = this.data.inputValue1
    arr1 = arr1.concat(arr2);
    this.setData({
      inputValue1: arr1
    })
  }

  
}
)