
// 引入coolsite360交互配置设定


// 获取全局应用程序实例对象
var app = getApp();
var index_pages = 1;
var com_pages =1;
// 创建页面实例对象
Page({
  /**
   * 页面名称
   */
  name: "list",
  /**
   * 页面的初始数据
   */

  data: {
   
    currentTab: 0,
    index_info: {}, 
    com_info: {},

  
  },
  loadMore: function () {
    var that = this;
    // 显示加载图标  
    wx.showLoading({
      title: '玩命加载中',
    })

    wx.request({
      url: app.Data.apiurl + '/api/index/get_self_active',
      method: "GET",
      data: {
        page: index_pages,
        uid: app.Data.userInfo.user_id,
        types: 0
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
  loadcomMore: function () {
    var that = this;
    // 显示加载图标  
    wx.showLoading({
      title: '玩命加载中',
    })

    wx.request({
      url: app.Data.apiurl + '/api/index/get_self_active',
      method: "GET",
      data: {
        page: com_pages,
        uid: app.Data.userInfo.user_id,
        types: 1
      },
      // 请求头部  
      header: {
        'content-type': 'application/text'
      },
      success: function (datas) {
        if (datas.data.code == 200) {

          var com_infos = that.data.com_info;
          for (var i = 0; i < datas.data.res.length; i++) {
            com_infos.push(datas.data.res[i]);
          }
          that.setData({
            com_info: that.data.com_info
          })
          // 页数+1  
          com_pages = com_pages + 1;
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
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    
    //获取全部信息
    this.get_index();
    this.get_com();
  },
  get_index:function(){
    var that = this;
    wx.request({
      url: app.Data.apiurl + '/api/index/get_self_active',
      method: 'GET',
      data: {
        page: 1,
        uid: app.Data.userInfo.user_id,
        types:0
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
        }else{
          that.setData({
            index_info:{}
          })
        }

      }
    });
  },
  get_com:function(){
    var that = this;
    wx.request({
      url: app.Data.apiurl + '/api/index/get_self_active',
      method: 'GET',
      data: {
        page: 1,
        uid: app.Data.userInfo.user_id,
        types: 1
      },
      header: {
        'content-type': 'json'
      },
      success: function (datas) {
        if (datas.data.code == 200) {
          that.setData({
            com_info: datas.data.res
          })
          com_pages = 2;
        }else{
          that.setData({
            com_info: {}
          })
        }

      }
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
    // 显示顶部刷新图标  
    wx.showNavigationBarLoading();
    this.get_index();
    this.get_com();
    // 隐藏导航栏加载框  
    wx.hideNavigationBarLoading();
    // 停止下拉动作  
    wx.stopPullDownRefresh();
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

