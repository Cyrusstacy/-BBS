// pages/pinglun/pinglun.js
const app = getApp()
let isFocusing = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    InputBottom: 0,
    replyId: "",
    placeholder: "",
    focus: false,
    toName: "",
    commentContent: "",
    pagenum: 1,
    isLoading: false,
    noData: false,
    last: false,
    articleDelete:false
  },
  onLoad: function (query) {
    var that = this
    var commentId = query.pinglunId
    console.log(query)
    var sessionId = wx.getStorageSync('sessionId')
    wx.request({
      url: app.globalData.url +'bbs/comment/content?sessionId=' + sessionId + '&commentId=' + commentId,
      headers: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          comment: res.data.data,
          placeholder: "回复" + res.data.data.userName + ":",
          toName: res.data.data.userName,
          commentId:commentId,
          articleDelete: res.data.data.isArticleDelete

        })
      }
    }),
      wx.request({
        url: app.globalData.url +'bbs/reply/list?sessionId=' + sessionId + '&commentId=' + commentId,
        headers: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          console.log(res.data)
          that.setData({
            reply: res.data.data.content,
          })
        }
      })
  },
  onShow: function () {
   
  },
  // 评论点赞
  likeThis: function (e) {
    var that = this.data.comment;
    var hasChange = that.isLike;
    var sessionId = wx.getStorageSync('sessionId')
    if (hasChange !== undefined) {
      if (hasChange) {
        that.commentLikeNum--;
        that.isLike = false;
      } else {
        that.commentLikeNum++;
        that.isLike = true;
      }
      this.setData({
        comment: that
      })
    };
    wx.request({
      url: 'http://localhost/bbs/comment/like?sessionId=' + sessionId,
      data: {
        isLike: that.isLike ? 1 : 0,
        likeCommentId: that.commentId
      },
      method: 'post',
    })
  },
  // 点击relpy时回复
  focusComment: function (e) {
    this.setData({
      InputBottom: e.detail.height
    })
    var that = this;
    var name = e.currentTarget.dataset.name;
    var replyId = e.currentTarget.dataset.id;
    isFocusing = true;

    that.setData({
      replyId: replyId,
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
   * 失去焦点时默认给评论
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
            replyId: "",
            placeholder: "回复" + self.data.comment.userName + ":",
            toName: self.data.comment.userName,
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
    var replytId = that.data.replytId
    var commentId = that.data.comment.commentId
    var sessionId = wx.getStorageSync('sessionId')
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
          replyId: "",
          placeholder: "回复" + that.data.comment.userName + ":",
          focus: false,
          toName: that.data.comment.userName,
          commentContent: "",
          pagenum:1
        })
        that.onLoad({ pinglunId: commentId })
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
  //  回复分页
  getdatalist: function () {
    var that = this;
    if (!that.data.last) {
      wx.request({
        url: app.globalData.url + 'bbs/reply/list?page=' + that.data.pagenum + '&size=3',
        method: "GET",
        success: function (res) {
          var last = res.data.data.last
          var arr1 = that.data.reply;
          var arr2 = res.data.data.content;
          arr1 = arr1.concat(arr2);
          console.log(arr2)
          that.setData({
            reply: arr1,
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