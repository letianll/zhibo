// pages/qrcode/qrcode.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     imgurl:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
       var that = this;
       wx.request({
         url: 'https://zhibo.ranmengwork.cn/phpqrcode/get_drink.php?aid=' + options.aid + "&uid=" + app.Data.userInfo.user_id,
         method: 'GET',
         data: {
           aid: options.aid,
           uid: app.Data.userInfo.user_id
         },
         header: {
           'content-type': 'json'
         },
         success: function (datas) {
           if (datas.data.code == 200) {
             that.setData({
               imgurl: datas.data.imgurl
             })
            
           }

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
  
  }
})