// pages/tiezi/tiezi.js
const app = getApp()
let isFocusing = false;
 Page({

  data: {
    articleId: [],
    InputBottom: 0,
    commentId: "",
    placeholder: "评论...",
    focus: false,
    toName: "",
    commentContent: "",
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showPopup: false,
    modalName:'Modal',
    data2: [],
    pagenum: 1,
    isLoading: false,
    noData: false,
    last: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query){
    var that=this
    var articleId = query.articleId
    var sessionId = wx.getStorageSync('sessionId')
    app.checkUserInfo(function (userInfo, isLogin) {
      if (!isLogin) {
        /**wx.redirectTo({
        url: '../authorization/authorization?backType=' + blogId
        })**/
        that.setData({
          showPopup: true
        })
        return;
      }
    })
    wx.request({
      url: app.globalData.url +'bbs/article/content?sessionId=' + sessionId + '&articleId=' + articleId,
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        //将获取到的json数据，存在名字叫list的这个数组中
        console.log(res.data)
        that.setData({
          data1: res.data.data,
          //res代表success函数的事件对，data是固定的，list是数组
        })
      }
    })
    wx.request({
      url: app.globalData.url +'bbs/comment/list?sessionId=' + sessionId+ '&articleId=' + articleId,
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        //将获取到的json数据，存在名字叫list的这个数组中
        that.setData({
          data2: res.data.data.content,
          last:res.data.data.last
          //res代表success函数的事件对，data是固定的，list是数组
        })
      }
    })
    wx.request({
      url: app.globalData.url +'bbs/comment/hot?sessionId=' + sessionId + '&articleId=' + articleId,
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        //将获取到的json数据，存在名字叫list的这个数组中
        that.setData({
          hotCom: res.data.data,
          //res代表success函数的事件对，data是固定的，list是数组
        })
      }
    })
  },

  onReachBottom: function () {
     var that = this;
     var pagenum = that.data.pagenum + 1;
     that.setData({
       pagenum: pagenum,
       isLoading: true,
     })
     that.getdatalist();
   },
//  查看图片
ViewImage(e) {
  wx.previewImage({
    urls: this.data.data1.articleImages,
    current: e.currentTarget.dataset.url
  });
},

delTiezi: function (e) {
    var that=this
    var sessionId = wx.getStorageSync("sessionId")
    var articleId = that.data.data1.articleId
    wx.showModal({ //使用模态框提示用户进行操作

      title: '亲爱的',

      content: '你将删除此帖子！',
      success(res){
        if(res.confirm){
          wx.request({
            url: app.globalData.url +'bbs/article/delete?sessionId=' + sessionId + '&articleId=' + articleId ,
            method:'get',
            success:function(res){
              wx.switchTab({
                url: "pages/We/We"
              })
            }
          })


        }
      }
    })
    

  },


// 帖子点赞
   likeThis: function (e) {
       var that = this.data.data1;
       var hasChange = that.isLike;
       var sessionId = wx.getStorageSync('sessionId')
       if (hasChange !== undefined) {
         if (hasChange) {
           that.articleLikeNum--;
           that.isLike = false;
         } else {
           that.articleLikeNum++;
           that.isLike = true;
         }
         this.setData({
           data1: that,
         })
       };
       wx.request({
         url: app.globalData.url +'bbs/article/like?sessionId=' + sessionId,
         data:{
          isLike: that.isLike ? 1 : 0,
          likeArticleId: that.articleId
         },
         method:'post',
         success: function (res) {
           console.log(res.data)
         }
       })
   },
// 帖子收藏
   collectThis: function (e) {
     var that = this.data.data1;
     var hasChange = that.isCollect;
     var sessionId = wx.getStorageSync('sessionId')
     if (hasChange !== undefined) {
       if (hasChange) {
         that.isCollect = false;
         wx.showToast({
           title: '已取消收藏',
           icon: 'success',
           duration: 2000
         });
       } else {
         that.isCollect = true;
         wx.showToast({
           title: '收藏成功',
           icon: 'success',
           duration: 2000
         });
       }
       this.setData({
         data1: that
       })
     };
     console.log(that.isCollect)
     wx.request({
       url: app.globalData.url +'bbs/article/collect?sessionId=' + sessionId,
       data: {
         isCollect: that.isCollect ? 1 : 0,
         collectArticleId: that.articleId
       },
       method: 'post',
       success(res){
         console.log(res.data)
       }
     })
   },
// 评论点赞
  praiseThis: function (e) {
    var commentId=e.currentTarget.dataset.commentid;
    console.log(commentId)
    var that = this.data.data2;
    var that1 = this.data.hotCom;
    var index = that.findIndex((element)=>(element.commentId==commentId))
    var index1 = that1.findIndex((element) => (element.commentId == commentId))
    console.log(that[index])
    var sessionId = wx.getStorageSync('sessionId');
    if (index!=-1) {
      var hasChange = that[index].isLike;
      if (hasChange !== undefined) {
        if (hasChange) {
          that[index].commentLikeNum--;
          that[index].isLike = false;
        } else {
          that[index].commentLikeNum++;
          that[index].isLike = true;
        }
        this.setData({
          data2: that
        })
      }
    };
    if (index1 != -1) {
      var hasChange = that1[index1].isLike;
      if (hasChange !== undefined) {
        if (hasChange) {
          that1[index1].commentLikeNum--;
          that1[index1].isLike = false;
        } else {
          that1[index1].commentLikeNum++;
          that1[index1].isLike = true;
        }
        this.setData({
          hotCom: that1
        })
      }
    };
    if(index!=-1){
      wx.request({
        url: app.globalData.url +'bbs/comment/like?sessionId=' + sessionId,
        data: {
          isLike: that[index].isLike ? 1 : 0,
          likeCommentId: commentId
        },
        method: 'post',
      })
    }else{
      wx.request({
        url: app.globalData.url +'bbs/comment/like?sessionId=' + sessionId,
        data: {
          isLike: that1[index1].isLike ? 1 : 0,
          likeCommentId: commentId
        },
        method: 'post',
      })
    }
  },

   InputFocus(e) {
     this.setData({
       InputBottom: e.detail.height
     })
   },
   InputBlur(e) {
     this.setData({
       InputBottom: 0
     })
   },

  // 点击评论时回复
   focusComment: function (e) {
     this.setData({
       InputBottom: e.detail.height
     })
     var that = this;
     var name = e.currentTarget.dataset.name;
     var commentId = e.currentTarget.dataset.id;
     isFocusing = true;

     that.setData({
       commentId: commentId,
       placeholder: "回复" + name + ":",
       focus: true,
       toName: name,
     });
   },
   /**
   * 聚焦时触发
   */
   onRepleyFocus: function (e) {
     this.setData({
       InputBottom: e.detail.height
     })
     var self = this;
     isFocusing = false;
     if (!self.data.focus) {
       self.setData({
         focus: true,
       })
     }
   },
   /**
    * 失去焦点时默认给文章评论
    */
   onReplyBlur: function (e) {
     this.setData({
       InputBottom: 0
     })
     var self = this;
     if (!isFocusing) {
       {
         const text = e.detail.value.trim();
         if (text === '') {
           self.setData({
             commentId: "",
             placeholder: "评论...",
             toName: "",
           });
         }

       }
     }
     console.log(isFocusing);
   },

// 提交评论
   reg: function (e) {

     wx.showLoading({
       title: '评论提交中',
     })

     var that = this
     var comment = e.detail.value.inputComment;

     if (comment == undefined || comment.length == 0) {
       wx.hideLoading()
       return
     }
     var toName = that.data.toName
     var commentId = that.data.commentId
     console.log(commentId)
     var articleId = that.data.data1.articleId
     var sessionId = wx.getStorageSync('sessionId')
     if (commentId === "") {
       var commentdata = {
         commentContent: comment,
         articleId: articleId
       }
       wx.request({
         url: app.globalData.url +'bbs/comment/create?sessionId='+sessionId,
         data: commentdata,
         method: 'post',
         success(res) {
           if (res.data.code == 0) {
             console.log(res.data)
             wx.hideLoading()
             wx.showToast({
               title: '评论已提交',
               icon: 'success',
               duration: 2000
             })
           } else {
             wx.showToast({
               title: res.data.msg,
               icon: 'none',
               duration: 2000
             })
           }
           that.setData({
             InputBottom: 0,
             commentId: "",
             placeholder: "评论...",
             focus: false,
             toName: "",
             commentContent: "",
           })
           that.onLoad({ articleId: articleId })
         }
       })
     } else {
       var replydata = {
         replyContent: "回复 " + toName + "：" + comment,
         commentId: commentId
       }
       wx.request({
         url: app.globalData.url +'bbs/reply/create?sessionId=' + sessionId,
         data: replydata,
         method: 'post',
         success(res) {
           if (res.data.code == 0) {
             console.log(res.data)
             wx.hideLoading()
             wx.showToast({
               title: '评论已提交',
               icon: 'success',
               duration: 2000
             })
           } else {
             wx.showToast({
               title: res.data.msg,
               icon: 'none',
               duration: 2000
             })
           }
           that.setData({
             InputBottom: 0,
             commentId: "",
             placeholder: "评论...",
             focus: false,
             toName: "",
             commentContent: "",
             pagenum:1
           })
           that.onLoad({ articleId: articleId })
         }
       })
     }
   },

   bindGetUserInfo: function (e) {
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
                 console.log(res)
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
  //  评论分页
   getdatalist: function () {
     var that = this;
     if (!that.data.last) {
       wx.request({
         url: app.globalData.url + 'bbs/comment/list?page=' + that.data.pagenum + '&size=3',
         method: "GET",
         success: function (res) {
           var last = res.data.data.last
           var arr1 = that.data.data2;
           var arr2 = res.data.data.content;
           arr1 = arr1.concat(arr2);
           console.log(arr2)
           that.setData({
             data2: arr1,
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

  /**
   * 获取帖子详情
  
  geTieziId(tieziId){
    let that=this
    wx.request({
      url: '?tieziId='+tieziId,
      success(res){
        if(res.data.code===0){
          that.setData({
            tieziInfo:123

          })
        }
      }
    })
  },

  /**
   * 获取评论详情
 
  getCommentList(tieziId){
    wx.request({
      url: '?tieziId='+tieziId,
      success(res)
    })
  },


  */

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  