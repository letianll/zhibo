

const util = require('../../utils/util.js')
// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
 
  /**
   * 页面的初始数据
   */

  data: {
  
    sex: [{ name: 'Male', value: 0 },
    { name: 'Female', value: 1 }],
     index:0,
     country_group:[],
     city_group:[],
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
    var formID = e.detail.formId;
    if (formData.fname == "" || formData.sname == ""){
      wx.showToast({
        title: 'Input name',
        icon:"none"
      });
      return false;

    }
    if (formData.sex == "") {
      wx.showToast({
        title: 'choose gender',
        icon: "none"
      });
      return false;

    }
    if (formData.mobile == "") {
      wx.showToast({
        title: 'Input mobile',
        icon: "none"
      });
      return false;

    }
    if (formData.email == "") {
      wx.showToast({
        title: 'Input Email',
        icon: "none"
      });
      return false;

    }
    if (formData.specialties == "") {
      wx.showToast({
        title: 'Input Occupation',
        icon: "none"
      });
      return false;

    }
    if (formData.xieyi == "") {
      wx.showToast({
        title: 'please agree terms',
        icon: "none"
      });
      return false;

    }
    wx.showModal({
      title: 'form validation',
      content: 'Confirm that the information is complete and correct.\r\n Please be patient and wait for the audit after submission.',
      success: function (res) {
    //开始验证表单
    wx.request({
      url: app.Data.apiurl + '/api/zhibo/apply_anchor.html?uid=' + app.Data.userInfo.user_id+"&formid="+formID,
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
    var that = this;
    // 注册coolsite360交互模块
    //检测是否为主播
    wx.request({
      url: app.Data.apiurl + '/api/zhibo/is_anchor.html',
      method: "GET",
      data: {
        uid: app.Data.userInfo.user_id
      },
      header: {
        'content-type': 'json'
      },
      success: function (datas) {
        if(datas.data.code==-1){
          wx.showToast({
            title: datas.data.msg,
          });
          setTimeout(function () {
            wx.navigateBack({
              
            });
          }, 1000);
        }
      }
    });
    //获取国籍
    wx.request({
      url: app.Data.apiurl + '/api/zhibo/get_wxall.html',
      method: "GET",
      data:{
      },
      header: {
        'content-type': 'json'
      },
      success: function (datas) {
          that.setData({
            country_group:datas.data.country,
            city_group: datas.data.city
          });
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
  go_tiaokuan:function(){
    wx.navigateTo({
      url: '../webother/webother?&types=xieyi',
    })
  }
})

