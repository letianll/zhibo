// pages/anchor_detail/anchor_detail.js

const app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
var self;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail_data: {},
    id: 0,
    is_gz: 0,
    gz_num: 0,
    winWidth: 0,
    winHeight: 0,
    index_info:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    self = this;
    this.setData({
      id: options.id
    });
    this.get_anchor_detail();
    this.get_active_byuser();
  },
  //获取详细信息
  get_anchor_detail: function () {
    //获取详细信息
    var that = this;
    wx.request({
      url: app.Data.apiurl + '/api/index/anchor_detail',
      method: 'GET',
      data: { 
        id: that.data.id,
        uid: app.Data.userInfo.user_id
         },
      header: {
        'content-type': 'json'
      },
      success: function (datas) {

        if (datas.data.code == 200) {
          that.setData({
            detail_data: datas.data.res,
            is_gz: datas.data.res.is_gz,
            gz_num: datas.data.res.gz_num
          })
          wx.setNavigationBarTitle({
            title: datas.data.res.name//页面标题为路由参数
          });
          var article = datas.data.res.specialties;
          WxParse.wxParse('article', 'html', article, that, 5);
        }
      }
    });
  },
  get_active_byuser: function () {
    var that = this;
    wx.request({
      url: app.Data.apiurl + '/api/index/get_active_byanchor',
      method: 'GET',
      data: {
        uid: this.data.id
      },
      header: {
        'content-type': 'json'
      },
      success: function (datas) {
        if (datas.data.code == 200) {
          that.setData({
            index_info: datas.data.res
          });
        }
      }
    });
  },
  // 关注主播
  guanzhu: function () {
    if (this.data.is_gz == 0) {
      this.setData({
        is_gz: 1
      })
    } else {
      this.setData({
        is_gz: 0
      })
    }
    
    wx.request({
      url: app.Data.apiurl + '/api/zhibo/tiaozhuan_gz',
      method: "GET",
      data: {
        id: this.data.id,
        uid: app.Data.userInfo.user_id,
        type: this.data.is_gz

      },
      header: {
        'content-type': 'application/text'
      },
      success: function (datas) {

        if (datas.data.code == 200) {
          wx.showToast({
            title: datas.data.msg,
            icon: 'success',
            duration: 2000
          })
          self.get_anchor_detail();
          self.shuaxin_index();
        } else {
          wx.showToast({
            title: datas.data.msg,
            icon: 'fail',
            duration: 2000
          })
          self.get_anchor_detail();
          self.shuaxin_index();
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
    wx.showNavigationBarLoading();
    this.get_anchor_detail();
    this.get_active_byuser();
    // 隐藏导航栏加载框  
    wx.hideNavigationBarLoading();
    // 停止下拉动作  
    wx.stopPullDownRefresh();
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
  
  },
  shuaxin_index:function () {
    let pages = getCurrentPages();//当前页面
    let prevPage = pages[pages.length - 2];//上一页面
    prevPage.get_anchor();
    prevPage.get_aochor_fav();
  }
})