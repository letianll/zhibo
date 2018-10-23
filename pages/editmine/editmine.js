

const util = require('../../utils/util.js')
// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
 
  /**
   * 页面的初始数据
   */

  data: {
  
    sex: [{ name: '男', value: 0 },
    { name: '女', value: 1 }],
     index:0,
     country_group:["中国 China","美国 U.S","加拿大 Canda"],
     city_group:["北京 Beijing","上海 Shanghai"],
     index1:0,
  

  
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  bindPickerChange1: function (e) {
    this.setData({
      index1: e.detail.value
    })
  },
  //提交表单
  formSubmit:function(e){
    var that = this;
    var formData = e.detail.value;
    console.log(formData);
    if (formData.fname == "" || formData.sname == ""){
      wx.showToast({
        title: '姓名不能为空',
      });
      return false;

    }
    if (formData.sex == "") {
      wx.showToast({
        title: '请选择性别',
      });
      return false;

    }
    if (formData.mobile == "") {
      wx.showToast({
        title: '电话号码不能为空',
      });
      return false;

    }
    if (formData.email == "") {
      wx.showToast({
        title: 'EMAIL不能为空',
      });
      return false;

    }
    if (formData.specialties == "") {
      wx.showToast({
        title: '请填写专业领域',
      });
      return false;

    }
    wx.showModal({
      title: '表单确认',
      content: '确认资料填写完整无误！',
      success: function (res) {
    //开始验证表单
    wx.request({
      url: app.Data.apiurl + '/api/zhibo/save_anchor.html?uid=' + app.Data.userInfo.user_id,
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
          setTimeout(function(){
            wx.switchTab({
              url: '../mine/mine',
            }); 
          },1000);
        } else {
          wx.showToast({
            title: datas.data.msg,
          });
        }
      }
    });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    // 注册coolsite360交互模块
    wx.request({
      url: app.Data.apiurl + '/api/zhibo/get_anchor_detail.html?uid=' + app.Data.userInfo.user_id,
      method: "POST",
      data: formData,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (datas) {
             
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


  //以下为自定义点击事件
  
})

