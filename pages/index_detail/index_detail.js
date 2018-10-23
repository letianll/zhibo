const app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
var self;
Page({
   data: {
      detail_data:{},
      id:0,
      is_gz:0,
      is_sc:0,
      sc_num:0,
      gz_num:0,
      winWidth: 0,
      winHeight: 0,
      // tab切换 
      currentTab: 0,
      is_buy:-1,
    },
  
  onLoad (options) {
     self = this;
     this.setData({
      id:options.id
     });
     this.get_active_detail();
     this.get_base_status();

  },
  //获取详细信息
  get_active_detail:function(){
    //获取详细信息
    var that = this;
    wx.request({
      url: app.Data.apiurl + '/api/index/active_detail',
      method: 'GET',
      data: { id: that.data.id },
      header: {
        'content-type': 'json'
      },
      success: function (datas) {

        if (datas.data.code == 200) {
          that.setData({
            detail_data: datas.data.res
          })
          wx.setNavigationBarTitle({
            title: datas.data.res.name//页面标题为路由参数
          })
          var article = datas.data.res.desc;
          WxParse.wxParse('article', 'html', article, that, 5);
        }
      }
    });
  },

  //获取基本状态
  get_base_status:function(){
    //获取收藏关注状态
    var that = this;
    wx.request({
      url: app.Data.apiurl + '/api/zhibo/sg_status',
      method: 'GET',
      data: {
        id: that.data.id,
        uid: app.Data.userInfo.user_id
      },
      header: {
        'content-type': 'json'
      },
      success: function (datas) {
        if (datas.data.code == 200) {
          console.log(datas.data);
          self.setData({
            is_sc: datas.data.is_sc,
            is_gz: datas.data.is_gz,
            sc_num:datas.data.sc_num,
            gz_num:datas.data.gz_num, 
            is_buy: datas.data.is_buy
          })
        }
      }
    });
  },

  //以下为自定义点击事件
  tiaozhuan_xianxia: function () {
    if (this.data.detail_data.aid == app.Data.userInfo.user_id){
      wx.showToast({
        title: '无法报名自己的活动',
        icon: 'none',
        duration: 2000
      })
      ;
      return false;
    }
    
    wx.navigateTo({
            url: '../payready/payready?id=' + this.data.id+"&types=0",
    });
  },
  tiaozhuan_xianshang: function() {
    if (this.data.detail_data.aid == app.Data.userInfo.user_id) {
      wx.showToast({
        title: '无法报名自己的活动',
        icon: 'none',
        duration: 2000
      })
        ;
      return false;
    }
     wx.navigateTo({
              url: '../payready/payready?id=' + this.data.id + "&types=1",
     });
    },

    // 收藏活动
    shoucang: function () {
      if(this.data.is_sc==0){
        this.setData({
          is_sc:1
        })
      }else{
        this.setData({
          is_sc:0
        })
      }
      wx.request({
        url: app.Data.apiurl + '/api/zhibo/tiaozhuan_sc',
        method: "GET", 
        data: {
          id:this.data.id,
          uid:app.Data.userInfo.user_id,
          type: this.data.is_sc
        },
        header: {
          'content-type': 'application/text'
        },
        success: function (datas) {
         
          if (datas.data.code == 200) {
            wx.showToast({
              title: datas.data.msg,
              icon: 'success',
              duration: 2000
            })
            self.get_base_status();
            self.shuaxin_index();   
          } else {
            wx.showToast({
              title: datas.data.msg,
              icon: 'fail',
              duration: 2000
            })
            self.get_base_status(); 
            self.shuaxin_index();  
          }
    
        }
      })
    },


    // 关注主播
    guanzhu: function () {
      if (this.data.is_gz == 0) {
        this.setData({
          is_gz: 1
        })
      } else {
        this.setData({
          is_gz: 0
        })
      }
      wx.request({
        url: app.Data.apiurl + '/api/zhibo/tiaozhuan_gz',
        method: "GET", 
        data: {
          id: this.data.detail_data.aid,
          uid: app.Data.userInfo.user_id,
          type: this.data.is_gz

        },
        header: {
          'content-type': 'application/text'
        },
        success: function (datas) {
        
          if (datas.data.code == 200) { 
            wx.showToast({
              title: datas.data.msg,
              icon: 'success',
              duration: 2000
            })
            self.get_base_status();
            self.shuaxin_index(); 
          }else{
            wx.showToast({
              title: datas.data.msg,
              icon: 'fail',
              duration: 2000
            })
            self.get_base_status();
            self.shuaxin_index();   
          }

        }
      })
    },

    //打开地图
    open_map:function(){
      var that = this;
      wx.openLocation({ //出发wx.openLocation API
        latitude: Number(that.data.detail_data.map_long), //坐标纬度（从地图获取坐标）
        longitude: Number(that.data.detail_data.map_lat), //坐标经度（从地图获取坐标）
        name: that.data.detail_data.shop_name, //打开后显示的地址名称
        address: that.data.detail_data.shop_addr //打开后显示的地址汉字
      })
    },
    //跳转到二维码页面
    tiaozhuan_drink:function(){
        wx.navigateTo({
          url: '../qrcode/qrcode?aid='+this.data.id,
        })
    },
    //进入直播
    tiaozhuan_video:function(){
      var that = this;
      wx.request({
        url: app.Data.apiurl + '/api/zhibo/is_buy',
        method: 'GET',
        data: {
          uid: app.Data.userInfo.user_id,
          aid: that.data.id
        },
        header: {
          'content-type': 'json'
        },
        success: function (datas) {
          //直接进入直播间
          if (datas.data.code == 200) {
            wx.navigateTo({
              url: '../video/video?id=' + that.data.id,
            })
          }
          else if (datas.data.code == 100){
             wx.showToast({
               title: '尚未开始',
             })
          }
          //询问用户是否参团
          else {
            wx.showModal({
              title: '订单确认',
              content: '您尚未拼团，是否立即拼团？',
              success: function (res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../payready/payready?id=' + that.data.id+ "&types=1",
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }

        }
      });
    },
    //扫码参加线下活动
    scan_qr:function(){
      var that = this;
      var urls;
      var aid = this.data.id;
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
                wx.showToast({
                  title: datas.data.msg,
                  icon: 'none',
                  duration: 2000
                })
              } else {
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

    //tab选单点击事件
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
    //下拉刷新
    onPullDownRefresh: function () {
      wx.showNavigationBarLoading();
      this.get_active_detail();
      this.get_base_status();
      // 隐藏导航栏加载框   
      wx.hideNavigationBarLoading();
      // 停止下拉动作  
      wx.stopPullDownRefresh();
    },
    shuaxin_index:function(){
      let pages = getCurrentPages();//当前页面
      let prevPage = pages[pages.length - 2];//上一页面
      prevPage.get_index_active();
      prevPage.get_fov_active();
      prevPage.get_buy_active();
    }
})

