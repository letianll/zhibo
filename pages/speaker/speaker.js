// pages/speaker/speaker.js
var app = getApp();

var care_pages=0;
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    index_info: {},
    hot_info: {},
    care_info: {},  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.get_anchor();
     this.get_aochor_fav();
  },
  get_anchor:function(){
    var that = this;
    wx.request({
      url: app.Data.apiurl + '/api/zhibo/get_anchor',
      method: 'GET',
      data: { },
      header: { 
        'content-type': 'json'
      },
      success: function (datas) {
        if (datas.data.code == 200) {
          that.setData({
            index_info: datas.data.active_data,
          });
        }

      } 
    });
  },
  //获取关注主播信息
  get_aochor_fav: function () {
    var that = this;
    care_pages = 1; 
    wx.request({
      url: app.Data.apiurl + '/api/index/get_aochor_fav',
      method: 'GET',
      data: {
        page: care_pages,
        uid: app.Data.userInfo.user_id
      },
      header: {
        'content-type': 'json'
      },
      success: function (datas) {
        if (datas.data.code == 200) {
          console.log(datas.data.res);
          that.setData({
            care_info: datas.data.res
          })
          care_pages = care_pages + 1;
        }else{
          that.setData({
            care_info: []
          })
        }

      }
    });
  },
  //获取更多主播数据
  loadMoreaochor: function () {
    var that = this;
    // 显示加载图标  
    wx.showLoading({
      title: '玩命加载中',
    })
    wx.request({
      url: app.Data.apiurl + '/api/index/get_aochor_fav',
      method: "GET",
      data: {
        page: care_pages,
        uid: app.Data.userInfo.user_id
      },
      // 请求头部  
      header: {
        'content-type': 'application/text'
      },
      success: function (datas) {
        if (datas.data.code == 200) {
          var care_infos = that.data.care_info;
          for (var i = 0; i < datas.data.res.length; i++) {
            hot_infos.push(datas.data.res[i]);
          }
          that.setData({
            care_info: that.data.care_info
          })
          // 页数+1  
          care_pages = care_pages + 1;
          wx.hideLoading();
        } else {
          wx.showToast({
            title: '暂无更多数据',
          })
          wx.hideLoading();
        }

      }
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
    this.get_anchor();
    this.get_aochor_fav(); 
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
  //主播跳转
  go_anchor: function (event) {
    
    wx.navigateTo({
      url: '../anchor_detail/anchor_detail?id=' + event.currentTarget.id,
    })
  }
})