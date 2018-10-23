//index.js
//获取应用实例
const app = getApp()
var pages = 1;
var sc_pages = 1;
var buy_pages =1;
Page({
  data: {
    movies: {},
    catlist:{},
    index_info:{},
    sc_info:{},
    buy_info:{},
    currentTab: 0,
  },
    //下拉刷新  
    onPullDownRefresh: function () {
      // 显示顶部刷新图标  
      wx.showNavigationBarLoading();
      this.get_index_active();
      this.get_fov_active();
      this.get_buy_active();
          // 隐藏导航栏加载框  
          wx.hideNavigationBarLoading();
          // 停止下拉动作  
          wx.stopPullDownRefresh();
    
    },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //以下为自定义点击事件
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
  onLoad: function () {
    var _this = this;
    //myfun.getUsers();
    //获取用户信息
    //app.setUserinfo();
     
  //获取首页数据  
    wx.request({
      url: app.Data.apiurl + '/api/index/get_lunbo',
      method: 'GET', 
      data: {},
      header: {
        'content-type': 'json'
      },
      success: function (datas) {
        _this.setData({
          movies:datas.data
        })
        
      }
    });
    //获取分类信息
    wx.request({
      url: app.Data.apiurl + '/api/index/get_group',
      method: 'GET',
      data: {},
      header: {
        'content-type': 'json'
      },
      success: function (datas) {
        _this.setData({
          catlist: datas.data
        })

      }
    });

    //获取首页数据  
    this.get_index_active();
    this.get_fov_active();
    this.get_buy_active();
  },
  
  get_index_active:function(){
    var _this = this;
    wx.request({
      url: app.Data.apiurl + '/api/index/get_active',
      method: 'GET',
      data: {
        page: 1,
        status: -1
      },
      header: {
        'content-type': 'json'
      },
      success: function (datas) {
        if (datas.data.code == 200) {
          _this.setData({
            index_info: datas.data.res
          })
          // 页数+1  
          pages = pages + 1;
        }else{
          _this.setData({
            index_info:{}
          })
        }
      }
    });
  },
  get_index_more:function(){
    var that = this;
    // 显示加载图标  
    wx.showLoading({
      title: '玩命加载中',
    })

    wx.request({
      url: app.Data.apiurl + '/api/index/get_active',
      method: "GET",
      data: {
        page: pages,
        status: -1
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
          pages = pages + 1;
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
  //收藏
  get_fov_active: function () {
    var that = this;
    sc_pages = 1;
    wx.request({
      url: app.Data.apiurl + '/api/index/get_active',
      method: 'GET',
      data: {
        page: sc_pages,
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
            sc_info: datas.data.res
          })
          sc_pages = sc_pages + 1;
        }else{
          that.setData({
            sc_info: []
          })
        }

      }
    });
  },
  //下拉获取更多收藏数据
  get_sc_more: function () {
    var that = this;
    // 显示加载图标  
    wx.showLoading({
      title: '玩命加载中',
    })
    wx.request({
      url: app.Data.apiurl + '/api/index/get_active',
      method: "GET",
      data: {
        page:sc_pages,
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
          var sc_infos = that.data.sc_info;
          for (var i = 0; i < datas.data.res.length; i++) {
            sc_infos.push(datas.data.res[i]);
          }
          that.setData({
            sc_info: that.data.sc_info
          })
          // 页数+1  
          sc_pages = sc_pages + 1;
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

  //获取已参团活动
  get_buy_active:function(){
    var that = this;
    //获取全部信息
    wx.request({
      url: app.Data.apiurl + '/api/index/get_self_active',
      method: 'GET',
      data: {
        page: 1,
        uid: app.Data.userInfo.user_id,
        types:-1
      },
      header: {
        'content-type': 'json'
      },
      success: function (datas) {
        if (datas.data.code == 200) {
          that.setData({
            buy_info: datas.data.res
          })
          buy_pages = 2;
        }else{
          that.setData({
            buy_info: []
          })
        }

      }
    });

  },
  get_buy_more:function(){
    var that = this;
    // 显示加载图标  
    wx.showLoading({
      title: '玩命加载中',
    })

    wx.request({
      url: app.Data.apiurl + '/api/index/get_self_active',
      method: "GET",
      data: {
        page: buy_pages,
        uid: app.Data.userInfo.user_id,
        types: -1
      },
      // 请求头部  
      header: {
        'content-type': 'application/text'
      },
      success: function (datas) {
        if (datas.data.code == 200) {

          var buy_infos = that.data.buy_info;
          for (var i = 0; i < datas.data.res.length; i++) {
            buy_infos.push(datas.data.res[i]);
          }
          that.setData({
            buy_info: that.data.buy_info
          })
          // 页数+1  
          buy_pages = buy_pages + 1;
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



  //跳转到搜索页面
  go_search:function(event){
    console.log(event.currentTarget.id);
    wx.navigateTo({
      url: '../search/search?types=cat&id=' + event.currentTarget.id,
    })
  }

})
