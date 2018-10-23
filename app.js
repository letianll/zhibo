//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
   
    // 登录
    // 获取用户信息
    wx.getSetting({
      success: res => {
        
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.setUserinfo();
 
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
        else{ 
          console.log(res);
          setTimeout(function(){
            wx.redirectTo({
              url: '/pages/wxlogin/wxlogin',
            })
          },1000);
          
          
        }
      }
    })
    
  },
  Data: {
    userInfo: {
      user_id:null,
      headimg:null,
      nickname:null,
      is_anchor:null,
      name:null,
      mobile:null,
      anchor_id:null
    },
    apiurl:"https://zhibo.ranmengwork.cn/index.php"

  },
  
  setUserinfo:function(){
    var _this = this;
    if (!this.Data.userInfo.user_id) {
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.getUserInfo({
              withCredentials: true,
              success: function (res_user) {
                wx.request({
                  url: _this.Data.apiurl + '/api/index/decrypt_demo',
                  method: 'GET',
                  data: {
                    code: res.code,
                    encryptedData: res_user.encryptedData,
                    iv: res_user.iv
                  },
                  header: {
                    'content-type': 'json' 
                  },
                  success: function (datas) {
                    
                    _this.Data.userInfo.user_id = datas.data.user_id;
                    _this.Data.userInfo.nickname = datas.data.nickName;
                    _this.Data.userInfo.headimg = datas.data.avatarUrl;
                    _this.Data.userInfo.is_anchor = datas.data.is_anchor;
                    _this.Data.userInfo.anchor_id = datas.data.anchor_id;
                    _this.Data.userInfo.mobile = datas.data.mobile;
                    _this.Data.userInfo.name = datas.data.name;

                  }
                });

              }
            });

          }

        }

      });

    }


  }

})