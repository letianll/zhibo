var util = require('../../utils/util.js'); 
// 获取全局应用程序实例对象
const app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面名称
   */
  
  /**
   * 页面的初始数据
   */

  data: {
    date: '2018-05-01',
    time:'08:00',
    active_group:[],
    city_group: [],
    shop_group: [],
    city_index:0,
    active_index: 0,
    shop_index: 0,
    n_index:0,
    Num: [2, 3, 4, 5],
  },
  bindDateChange(e) {
    this.setData({ date: e.detail.value });
  },
  bindTimeChange(e) {
    this.setData({ time: e.detail.value });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.get_active_cat();
    this.get_city();
    this.setData({
      date: util.formatDate(new Date())
    });
   
    
  },


  //获取活动分类
  get_active_cat:function(){
    var that = this;
    //获取活动分类
    wx.request({
      url: app.Data.apiurl + '/api/zhibo/get_active_group',
      method: 'GET',
      data: {},
      header: {
        'content-type': 'json'
      },
      success: function (datas) {
        if (datas.data.code == 200) {
          that.setData({
            active_group: datas.data.res
          })
        }
      }
    });
  },
  //获取活动城市
  get_city:function(){
    var that = this;
    //获取活动分类
    wx.request({
      url: app.Data.apiurl + '/api/zhibo/get_city',
      method: 'GET',
      data: {},
      header: {
        'content-type': 'json'
      },
      success: function (datas) {
        if (datas.data.code == 200) {
          that.setData({
            city_group: datas.data.res
          });
          that.get_shop(datas.data.res[0].id);
        }


      }
    });
  },
  //获取活动地点
  get_shop:function(cityid){
    var that = this;
    //获取活动分类
    wx.request({
      url: app.Data.apiurl + '/api/zhibo/get_shop',
      method: 'GET',
      data: {cityid:cityid},
      header: {
        'content-type': 'json'
      },
      success: function (datas) {
        if (datas.data.code == 200) {
          that.setData({
            shop_group: datas.data.res
          })
        }


      }
    });
  },
  //活动分类变化
  bindActiveChange: function (e) {
    this.setData({
      active_index: e.detail.value
    })
  },
  //城市变化
  bindCityChange:function(e){
    this.get_shop(this.data.city_group[e.detail.value].id);
    this.setData({
      city_index: e.detail.value
    })
    
  },
  //地点变化
  bindShopChange:function(e){
    this.setData({
      shop_index: e.detail.value
    }) 
  },
  //拼团人数变化
  bindNumChange:function(e){
    this.setData({
      n_index: e.detail.value
    })
  },
  //提交表单
  formSubmit: function (e) {
    var that = this;
    var formData = e.detail.value;
    var formID = e.detail.formId;
    if (formData.offline_price==""){
       wx.showToast({
         title:"拼团价格错误"
       });
       return false;
    }
    if (formData.name == "" ) {
      wx.showToast({
        title: "填写活动名称"
      });
      return false;
    }
    if (formData.detail == "") {
      wx.showToast({
        title: "填写活动简介"
      });
      return false;
    }
    formData.gid = this.data.active_group[formData.gid].id;
    formData.sid = this.data.shop_group[formData.sid].id;
    formData.cityid = this.data.city_group[formData.cityid].id;
    formData.start_time = formData.start_date + " " + formData.start_time;
    formData.totleneed_online_member = this.data.Num[formData.totleneed_online_member];
    console.log(formData);
    //return false;
    wx.request({
      url: app.Data.apiurl + '/api/zhibo/apply_active.html?uid=' + app.Data.userInfo.user_id + "&formid=" + formID,
      method: "POST",
      data: formData, 
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (datas) {
        if (datas.data.code == 200) {
          wx.showToast({
            title: datas.data.msg,
          });
          wx.redirectTo({
            url: '../ex_activity/ex_activity',
          })
        } else {
          wx.showToast({
            title: datas.data.msg,
          });
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
    // 执行coolsite360交互组件展示

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

  },
})

