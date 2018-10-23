// pages/webother/webother.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     urls:""
  },

  /** 
   * 生命周期函数--监听页面加载
   */ 
  onLoad: function (options) {
      if(options.types=="help"){
        var url = app.Data.apiurl + "/api/help/help_detail?id="+options.id;
        this.setData({
          urls:url
        })
      } else if (options.types == "xieyi"){
        var url = app.Data.apiurl + "/api/help/xieyi";
        this.setData({
          urls: url
        })
      }
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
  
  }
})