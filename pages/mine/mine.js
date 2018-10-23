// pages/mine/mine.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {  
     userinfo:{},
     
  },
  
  getUserInfo: function (e) { 
    var that = this;
    app.setUserinfo();
    setTimeout(function () {
      that.setData({
        userinfo: app.Data.userInfo
      });
    }, 1000); 
    this.getMineInfo();
    console.log(this.data.userinfo);
  },
  /** 
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this; 
    this.setData({
      userinfo: app.Data.userInfo
    });
    this.getMineInfo();
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
  //获取用户信息
  getMineInfo:function(){
    var that = this;
    wx.request({
      url: app.Data.apiurl + '/api/index/get_user_info.html',
      method: 'GET',
      data: {
        id: app.Data.userInfo.user_id
      },
      header: {
        'content-type': 'json'
      },
      success: function (datas) {

        app.Data.userInfo.user_id = datas.data.id;
        app.Data.userInfo.nickname = datas.data.nickname;
        app.Data.userInfo.headimg = datas.data.avatarUrl;
        app.Data.userInfo.is_anchor = datas.data.is_anchor;
        app.Data.userInfo.anchor_id = datas.data.anchor_id;
        app.Data.userInfo.mobile = datas.data.mobile;
        app.Data.userInfo.name = datas.data.name;
        that.setData({
          userinfo: datas.data
        });
      }
    });
    
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.getMineInfo();
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
    return {
      title: '8 Billion Coffee',
      desc: '最具人气的线上互动!',
      path: '/pages/wxlogin/wxlogin'
    }

  },
  myAccount: function () {
    wx.navigateTo({
      url: '../pay/pay',
    })

  },

   
  myList: function () {
    wx.navigateTo({
      url: '../list/list',
    })
  },
  Share: function () {
    wx.navigateTo({
      url: '',
    })
  },
  Help: function () {
    wx.navigateTo({
      url: '../help/help',
    })
  },
  applyHost: function () {
    if (this.data.userinfo.apply_anchor==0){
    wx.navigateTo({
      url: '../apply/apply',
    })
    }else{
      wx.showToast({
        title: '已提交过申请',
      })
    }
  },
  applyFav:function(){
    wx.navigateTo({
      url: '../my_fav/my_fav',
    })
  },
  applyActivity: function () {
    wx.navigateTo({
      url: '../ex_activity/ex_activity',
    })
  },
  editMine: function () {
    wx.navigateTo({
      url:'../editmine/editmine'
    })
  },
  addActivity:function(){
    wx.navigateTo({
      url: '../activity/activity'
    })
  }


})