// pages/help/help.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.Data.apiurl + '/api/index/get_help.html',
      method: 'GET',
      data: {
      },
      header: {
        'content-type': 'json'
      },
      success: function (datas) {
        that.setData({
          listData: datas.data
        });
      }
    });
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
  
  },
  go_web: function (event){
    wx.navigateTo({
      url: '../webother/webother?id=' + event.currentTarget.id +"&types=help",
    })
  }
})