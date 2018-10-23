//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
  }, 
  
  onLoad: function () {
    // 获取用户信息
    
  },
  onReady:function(){
    var that =this;
    
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          that.setData({
            hasUserInfo:true
          });
          app.setUserinfo();
          setTimeout(function(){
            wx.switchTab({
              url: '../index/index',
            }); 
          },2000);
         
        }

      }
    })
  },
  getUserInfo: function (e) { 
    if (e.detail.userInfo) {
    app.setUserinfo();
    wx.switchTab({
      url: '../index/index',
    });
    }else{
      wx.showToast({
        title: "为了您更好的体验,请先同意授权",
        icon: 'none',
        duration: 2000
      });
    }
  }
})
