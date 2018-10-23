// pages/my_fav/my_fav.js
var app = getApp();
var index_pages = 1;
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    index_info: {}, 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    
    //获取全部信息
    wx.request({
      url: app.Data.apiurl + '/api/index/get_active',
      method: 'GET',
      data: {
        page: 1,
        status: -1,
        types: 1,
        uid: app.Data.userInfo.user_id
      },
      header: {
        'content-type': 'json'
      },
      success: function (datas) {
        if (datas.data.code == 200) {
          that.setData({
            index_info: datas.data.res
          })
          index_pages = 2;
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
   loadMore: function () {
    var that = this;
    // 显示加载图标  
    wx.showLoading({
      title: '玩命加载中',
    })

    wx.request({
      url: app.Data.apiurl + '/api/index/get_active',
      method: "GET",
      data: {
        page: index_pages,
        status: -1,
        types: 1,
        uid: app.Data.userInfo.user_id
      },
      // 请求头部  
      header: {
        'content-type': 'application/text'
      },
      success: function (datas) {
        if (datas.data.code == 200) {

          var index_infos = that.data.index_info;
          for (var i = 0; i < datas.data.res.length; i++) {
            index_infos.push(datas.data.res[i]);
          }
          that.setData({
            index_info: that.data.index_info
          })
          // 页数+1  
          index_pages = index_pages + 1;
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  //以下为自定义点击事件
  tiaozhuan: function (event) {
    // console.log(evevt)
    //先查询用户是否已经下单

    //直接进入直播间

    wx.navigateTo({
      url: '../index_detail/index_detail?id=' + event.currentTarget.id,
    })


  }
})