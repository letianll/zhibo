// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面名称
   */
  name: "pay",
  /**
   * 页面的初始数据
   */

  data: {
  
    userinfo:{},
    money:0,
    now_price:6,
    backurl:-1,
    needmoney:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    this.setData({
      backurl: options.backurl,
      needmoney: options.needmoney 
    });
    console.log(this.data.backurl);
    this.get_money();
    if(this.data.needmoney<=6){
      this.setData({
        now_price:6
      });
    } else if (this.data.needmoney > 6 && this.data.needmoney <=19){
      this.setData({
        now_price: 19
      });
    } else if (this.data.needmoney > 19 && this.data.needmoney <= 99) {
      this.setData({
        now_price: 99
      });
    } else if (this.data.needmoney > 99 && this.data.needmoney <= 299) {
      this.setData({
        now_price: 299
      });
    }else{
      this.setData({
        now_price: 6
      });
    }
  },
  get_money:function(){
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
  //显示余额明细
  show_list:function(){
    wx.redirectTo({
      url: '../pay_list/pay_list',
    });
  },
  //显示提现明细
  show_outlist: function () {
    wx.redirectTo({
      url: '../out_list/out_list',
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {
    // 执行coolsite360交互组件展示
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    
  },
  select_price:function(e){
    var that = this;
    that.setData({ now_price: e.currentTarget.dataset.price });
  },

  //以下为自定义点击事件
  pay_money:function(){
    var that = this;
    wx.request({
      url: app.Data.apiurl + '/api/pay/pay_money',
      method: "GET",
      data: {
        uid: app.Data.userInfo.user_id,
        total_fee: this.data.now_price
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
  pay_call_back: function (prepay_id, out_trade_no) {
    var that =this;
    wx.request({
      url: app.Data.apiurl + '/api/pay/pay_call_back',
      method: "GET",
      data: {
        uid: app.Data.userInfo.user_id,
        total_fee: this.data.now_price,
        prepay_id: prepay_id,
        out_trade_no: out_trade_no
      },
      header: {
        'content-type': 'json' // 默认值
      },
      success: function (res) {
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.msg,
          })
          that.get_money();
          if (that.data.backurl!=undefined){
          setTimeout(function(){
            let pages = getCurrentPages();//当前页面
            let prevPage = pages[pages.length - 2];//上一页面
            prevPage.setData({//直接给上移页面赋值
              money: that.data.money
            });
            wx.navigateBack({//返回
             
            })
          },1000);
          }
        } else {
          wx.showToast({
            title: res.data.msg,
          })
        }
      }
    });
  },
  go_moneyout:function(){
     wx.redirectTo({
       url: '../moneyout/moneyout',
     })
  }
})

