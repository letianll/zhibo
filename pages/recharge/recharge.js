// Pages/recharge/recharge.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    total_fee:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  userTextInput: function (e) {
    if (e.detail.value == "") {
      return false;
    }
    this.setData({
      total_fee: e.detail.value
    });
  },
  pay_money: function () {
    var that= this;
    if(this.data.total_fee==0){
      wx.showToast({
        title: '金额不能为0',
      })
      return false;
    }
    wx.request({
      url: app.Data.apiurl + '/api/pay/pay_money',
      method: "GET",
      data: {
        uid: app.Data.userInfo.user_id,
        total_fee:this.data.total_fee
      },
      header: {
        'content-type': 'json' // 默认值
      },
      success: function (res) {  //后端返回的数据
        var data = res.data;
        console.log(data);
        wx.requestPayment({
          timeStamp: data['timeStamp'],
          nonceStr: data['nonceStr'],
          package: data['package'],
          signType: data['signType'],
          paySign: data['paySign'],
          success: function (ress) {
            that.pay_call_back(data.prepay_id, data.out_trade_no);
            
          },
          fail: function (res) {
            wx.showToast({
              title: '取消支付',
            })
          }
        })
      }
    });

  },
  pay_call_back: function (prepay_id, out_trade_no){
    wx.request({
      url: app.Data.apiurl + '/api/pay/pay_call_back',
      method: "GET",
      data: {
        uid: app.Data.userInfo.user_id,
        total_fee: this.data.total_fee,
        prepay_id: prepay_id,
        out_trade_no: out_trade_no
      },
      header: {
        'content-type': 'json' // 默认值
      },
      success: function (res) {
            if(res.data.code==200){
              wx.showToast({
                title: res.data.msg,
              })
              setTimeout(function () {
                wx.redirectTo({
                  url: '../pay/pay',
                }) 
              }, 1000)
            }else{
              wx.showToast({
                title: res.data.msg,
              })
            }
      }
    });
  },
})