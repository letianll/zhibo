// Pages/recharge/recharge.js

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     money:0,
     total_fee:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    // 获取用户余额
    wx.request({
      url: app.Data.apiurl + '/api/zhibo/get_money',
      method: 'GET',
      data: {
        uid: app.Data.userInfo.user_id
      },
      header: {
        'content-type': 'json'
      },
      success: function (datas) {
        if (datas.data.code == 200) {
          _this.setData({
            money: datas.data.money
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
  
  },
  userTextInput: function (e) {
    if (e.detail.value == "") {
      return false;
    }
    this.setData({
      total_fee: e.detail.value
    });
  },
  moneyout:function(){
      if(this.data.total_fee>this.data.money){
        wx.showToast({
          title: '余额不足',
        });
        return false;
      } 
      var that = this;
      wx.showModal({
        title: '余额提现',
        content: '是否确定提现' + this.data.total_fee +'元,申请提交后请耐心等待工作人员审核！',
        success: function (res) {
          wx.request({
            url: app.Data.apiurl + '/api/zhibo/get_moneyout',
            method: 'GET',
            data: {
              uid: app.Data.userInfo.user_id,
              total_fee: that.data.total_fee
            },
            header: {
              'content-type': 'json'
            },
            success: function (datas) {
              if (datas.data.code == 200) {
                  wx.showToast({
                    title: datas.data.msg,
                  });
                  setTimeout(function(){
                    wx.redirectTo({
                      url: '../out_list/out_list',
                    })
                  },1000);
              }else{
                wx.showToast({
                  title: datas.data.msg,
                })
              }

            }
          });

        }
      })

  }
})