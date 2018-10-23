// pages/search/search.js
const app = getApp();
var pages = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index_info: {},
    types:"cat",
    id:0
  },
  //下拉刷新  
  onPullDownRefresh: function () {
    if (this.data.types == "cat") {
      this.get_active_bycat();
    } else {
      this.get_active_byuser();
    }
    wx.hideNavigationBarLoading();
    // 停止下拉动作  
    wx.stopPullDownRefresh();
  },
  //上拉加载更多
  loadMoreall:function(){
     
     if (this.data.types == "cat") {
       this.get_active_bycat_more();
     } else {
       this.get_active_byuser_more();
     }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
          types:options.types,
          id:options.id
      });
      if(this.data.types=="cat"){
      this.get_active_bycat();
      }else{
      this.get_active_byuser();  
      }
  },
  get_active_bycat:function(){
     var that = this;
     wx.request({
       url: app.Data.apiurl + '/api/index/get_active_bycat',
       method: 'GET',
       data: {
         page: 1,
         catid:this.data.id
       },
       header: {
         'content-type': 'json'
       },
       success: function (datas) {
         if (datas.data.code==200){
         that.setData({
           index_info: datas.data.res
         });
         wx.setNavigationBarTitle({
           title: datas.data.title//页面标题为路由参数
         });
         pages = 2;
         }
       }
     });
  },
  get_active_bycat_more: function () {
    var that = this;
    wx.showLoading({
      title: '玩命加载中',
    }) 
    wx.request({
      url: app.Data.apiurl + '/api/index/get_active_bycat',
      method: 'GET',
      data: {
        page: pages,
        catid: this.data.id
      },
      header: {
        'content-type': 'json'
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
          pages = pages + 1;
        }
        wx.hideLoading();
      }
    });
  },
  get_active_byuser:function(){
    var that = this;
    wx.request({
      url: app.Data.apiurl + '/api/index/get_active_byuser',
      method: 'GET',
      data: {
        page: 1,
        uid: this.data.id
      },
      header: {
        'content-type': 'json'
      },
      success: function (datas) {
        if (datas.data.code == 200) {
          that.setData({
            index_info: datas.data.res
          });
          wx.setNavigationBarTitle({
            title: datas.data.title//页面标题为路由参数
          });
          pages = 2;
        }
      }
    });
  },
  get_active_byuser_more: function () {
    var that = this;
    wx.showLoading({
      title: '玩命加载中',
    })
    wx.request({
      url: app.Data.apiurl + '/api/index/get_active_byuser',
      method: 'GET',
      data: {
        page: pages,
        uid: this.data.id
      },
      header: {
        'content-type': 'json'
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
          pages = pages + 1;
        }
        wx.hideLoading();
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
  tiaozhuan: function (event) {
    wx.navigateTo({
      url: '../index_detail/index_detail?id=' + event.currentTarget.id,
    })



  },
 

  

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})