
// 获取全局应用程序实例对象
var app = getApp();
var index_pages=1;
var hot_pages=1;
var care_pages = 1;
// 创建页面实例对象
Page({
  /**
   * 页面名称
   */
  name: "logs", 
  /**
   * 页面的初始数据
   */

  data: {
    // tab切换 
    currentTab: 0,
    index_info: {}, 
    hot_info: {}, 
    care_info: {},  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() { 
    
    
    //获取全部信息
    this.get_all_active();
    this.get_fov_active();
    this.get_aochor_fav();
    
  },
  //下拉获取更多数据
  loadMoreall:function(){
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
        types: 0,
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
  //下拉获取更多收藏数据
  loadMorefav:function(){
    var that = this;
    // 显示加载图标  
    wx.showLoading({
      title: '玩命加载中',
    })
    wx.request({
      url: app.Data.apiurl + '/api/index/get_active',
      method: "GET",
      data: {
        page: hot_pages,
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
          var hot_infos = that.data.hot_info;
          for (var i = 0; i < datas.data.res.length; i++) {
            hot_infos.push(datas.data.res[i]);
          }
          that.setData({
            hot_info: that.data.hot_info
          })
          // 页数+1  
          hot_pages = hot_pages + 1;
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
  //获取更多主播数据
  loadMoreaochor:function(){
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
  //获取全部活动信息
  get_all_active:function(){
    var that = this;
    index_pages=1;
    wx.request({
      url: app.Data.apiurl + '/api/index/get_active',
      method: 'GET',
      data: {
        page: index_pages,
        status: -1,
        types: 0,
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
          index_pages = index_pages + 1;
        }

      }
    });
  },
 //获取收藏数据

 get_fov_active:function(){
   var that = this;
   hot_pages=1;
   wx.request({
     url: app.Data.apiurl + '/api/index/get_active',
     method: 'GET',
     data: { 
       page: hot_pages,
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
           hot_info: datas.data.res
         })
         hot_pages = hot_pages + 1;
       }
      
     }
   });
 },
  //获取关注主播信息
  get_aochor_fav:function(){
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
          that.setData({
            care_info: datas.data.res
          })
          care_pages = care_pages + 1;
        }

      }
    });
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },
  
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    this.get_all_active();
    this.get_fov_active();
    this.get_aochor_fav();
    // 隐藏导航栏加载框  
    wx.hideNavigationBarLoading();
    // 停止下拉动作  
    wx.stopPullDownRefresh();
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
   tiaozhuan: function (event) {
       wx.navigateTo({
         url: '../index_detail/index_detail?id=' + event.currentTarget.id,
       })
    

    
  },
  //主播跳转
   go_anchor: function (event){
     wx.navigateTo({
       url: '../search/search?types=user&id=' + event.currentTarget.id,
     })
   }
})

