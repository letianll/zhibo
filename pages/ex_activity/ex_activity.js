  // pages/ex_activity/ex_activity.js
var app = getApp();
Page({

  /**  
   * 页面的初始数据 
   */
  data: { 
    currentTab: 0,
    listData: [],
    comlistData:[]
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取我的活动数据
    this.get_active();
    this.get_com_active();
  },
  get_active:function(){
    var _this = this;
    wx.request({
      url: app.Data.apiurl + '/api/zhibo/get_self_active.html',
      method: 'GET',
      data: {
        uid: app.Data.userInfo.user_id,
        types: 0
      },
      header: {
        'content-type': 'json'
      },
      success: function (datas) {
        if (datas.data.code == 200) {
          _this.setData({
            listData: datas.data.res
          })
        }else{
          _this.setData({
            listData: []
          })
        }

      }
    });
  },
  get_com_active: function () {
    var _this = this;
    wx.request({
      url: app.Data.apiurl + '/api/zhibo/get_self_active.html',
      method: 'GET',
      data: {
        uid: app.Data.userInfo.user_id,
        types: 1
      },
      header: {
        'content-type': 'json'
      },
      success: function (datas) {
        if (datas.data.code == 200) {
          _this.setData({
            comlistData: datas.data.res
          })
        }else{
          _this.setData({
            comlistData: []
          })
        }

      }
    });
  },
  //取消活动
  cancel_active:function(event){
    var id = event.currentTarget.id ;
    var _this = this;
    wx.showModal({
      title: '确定取消',
      content: '确定取消本次活动吗？\n',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.Data.apiurl + '/api/zhibo/cancel_active.html?id=' + id,
            method: 'GET',
            data: {},
            header: {
              'content-type': 'json'
            },
            success: function (datas) {
              if (datas.data.code == 200) {
                
                _this.get_active();
              } else {
                wx.showToast({
                  title: datas.data.msg,
                });
              }

            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  //开始直播
  start_active:function(event){
    var that =this;
    var urls;
    var aid = event.currentTarget.id;
    wx.scanCode({
      success: (res) => {
        urls = res.result + "&a_id=" + aid + "&u_id=" + app.Data.userInfo.user_id;
        console.log(urls);
        wx.request({
          url: urls,
          method: 'GET',
          data: {},
          header: {
            'content-type': 'json'
          },
          success: function (datas) {
            if (datas.data.code == 200) {
              console.log(datas.data.msg);
              wx.showToast({
                title: datas.data.msg,
                icon: 'none',
                duration: 2000
              })
              that.get_active();


            }else{
              wx.showToast({
                title: datas.data.msg,
                icon: 'fail',
                duration: 2000
              })
            }
          }
        });
        
      },
      fail: (res) => {
        wx.showToast({
          title: '失败',
          icon: 'fail',
          duration: 2000
        })
      },
      complete: (res) => {
      }
    })
  },

  //进入直播
  go_active:function(event){
    wx.redirectTo({
      url: '../video/video?id=' + event.currentTarget.id,
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
    // 显示顶部刷新图标  
    wx.showNavigationBarLoading();
    this.get_active();
    this.get_com_active();
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
  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
 

  

})