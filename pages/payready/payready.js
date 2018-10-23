const app = getApp();
var self;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail_data:{},
    price:0,
    id:0,
    money:0,
    types:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    self = this;
    this.setData({
      id: options.id,
      types:options.types
    });
    //获取详细信息
    
    wx.request({
      url: app.Data.apiurl + '/api/index/active_detail',
      method: 'GET',
      data: { id: options.id },
      header: {
        'content-type': 'json'
      }, 
      success: function (datas) {
        if (datas.data.code == 200) {
          self.setData({
            detail_data: datas.data.res
          })
          
          //线下
          if (self.data.types==0){
            self.setData({
              price: datas.data.res.offline_price
            })
          }else{
            self.setData({ 
              price: datas.data.res.online_price
            })
          }
        }
      }
    });


    //获取用户余额
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
          self.setData({
            money: datas.data.money
          })
        }

      }
    });

  },
  //立即参团
  buy_it:function(){
    if (this.data.detail_data.aid == app.Data.userInfo.user_id) {
      wx.showToast({
        title: '无法报名',
      })
        ;
      return false;
    }
    var that = this;
    if (this.data.detail_data.id == "undefined" || this.data.detail_data.id ==null){
      wx.showToast({
        title: "数据异常",
      })
      return false;

    }
   var modalstr = "";
   if(that.data.types==0){
     modalstr += "线下参团:" + that.data.detail_data.offline_price +"元\r\n";
   }else{
     modalstr += "线上观看:" + that.data.detail_data.online_price + "元\r\n";
   }
   modalstr += that.data.detail_data.name +"\r\n";
   modalstr += "活动开始时间:"+that.data.detail_data.start_time;

    wx.showModal({
      title: '支付确认',
      content: modalstr,
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.Data.apiurl + '/api/zhibo/buy_active.html',
            method: 'GET',
            data: {
              aid:that.data.detail_data.id,
              uid: app.Data.userInfo.user_id,
              types: that.data.types
            },
            header: {
              'content-type': 'json'
            },
            success: function (datas) {
              if (datas.data.code == 200) {
                wx.showToast({
                  title: datas.data.msg,
                })
                setTimeout(function () {
                  let pages = getCurrentPages();//当前页面
                  let prevPage = pages[pages.length - 2];//上一页面
                  prevPage.get_active_detail();
                  prevPage.get_base_status();
                  wx.navigateBack({//返回

                  })
                }, 1000);
              } else {
                wx.showToast({
                  title: datas.data.msg,
                })
              }

            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  //立即充值
  go_pay:function(){
    wx.navigateTo({
      url: '../pay/pay?backurl=payready&needmoney='+this.data.price,
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