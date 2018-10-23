
const app = getApp()
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
var tempFilePath;
var timestamp, recordertime; 
var act_id;
var self;  
var start_time,end_time;
Page({ 

  /**
   * 页面的初始数据
   */
  data: {
    //直播ID
    active_id:0, 
    currentTab: 0,
    playing: false,
    videoContext: {},
    //互动消息数组
    msgdata:{},
    //字幕消息数组
    zimudata:{},
    //字幕定时器
    zimu_timer:'',
    //消息定时器
    msg_timer:'',
    texton:true,
    user_msg:"",
    taplock:false,
    voicetext:"按住说话",
    fullScreen: true,
    //拉流地址
    playUrl: "",
    orientation: "vertical",
    objectFit: "contain",
    muted: false,
    backgroundMuted: false,
    debug: false,
    exterFlag: false, //为了兼容微信iOS客户端的bug增加的控制字段，打开debug的时候把操作view remove再add
  },

  onPlayClick: function () {

    var url = this.data.playUrl;
    if (url.indexOf("rtmp:") == 0) {
    } else if (url.indexOf("https:") == 0 || url.indexOf("http:") == 0) {
      if (url.indexOf(".flv") != -1) {
      }
    } else {
      wx.showToast({
        title: '播放地址不合法，目前仅支持rtmp,flv方式!',
        icon: 'loading',
      })
    }

    this.setData({
      playing: !this.data.playing,
    })

    if (this.data.playing) {
      this.data.videoContext.play();
      console.log("video play()");
      wx.showLoading({
        title: '',
      })
    } else {
      this.data.videoContext.stop();
      console.log("video stop()");
      wx.hideLoading();
    }
  },

  onOrientationClick: function () {
    if (this.data.orientation == "vertical") {
      this.data.orientation = "horizontal";
    } else {
      this.data.orientation = "vertical";
    }

    this.setData({
      orientation: this.data.orientation
    })
  },

  onObjectfitClick: function () {
    if (this.data.objectFit == "fillCrop") {
      this.data.objectFit = "contain";
    } else {
      this.data.objectFit = "fillCrop";
    }

    this.setData({
      objectFit: this.data.objectFit
    })
  },

  onLogClick: function () {
    this.setData({
      debug: !this.data.debug
    })
    var that = this;
    setTimeout(() => {
      that.setData({
        exterFlag: !that.data.exterFlag
      })
    }, 10)
  },

  onMuteClick: function () {
    this.setData({
      muted: !this.data.muted
    })
  },
  //切换按钮
  onkeybordClick:function(){
    this.setData({
      texton: !this.data.texton
    })
  },
  //文本框输入
  userTextInput: function (e) {
    var that = this;
    if(e.detail.value==""){
      return false;
    }
    this.setData({
      user_msg: e.detail.value
    });
    //将文本数据提交
    wx.request({
      url: app.Data.apiurl + '/api/voice/user_msg.html',
      method:"POST",
      data: {
        a_id: this.data.active_id,
        u_id: app.Data.userInfo.user_id,
        u_name: app.Data.userInfo.nickname,
        u_img: app.Data.userInfo.headimg,
        zh_txt: this.data.user_msg
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (datas) {
           if(datas.data.code==200){
             wx.showToast({
               title: "发送留言成功",
             });
            that.setData({
               user_msg: ""
             });
           }else{
             wx.showToast({
               title: "发送留言失败",
             });
           }
      }
    });
    
    
  },
  //长按语音按钮
  OnVoice:function(){
    
    const options = {
      duration: 10000,//指定录音的时长，单位 ms
      sampleRate: 16000,//采样率
      numberOfChannels: 1,//录音通道数
      encodeBitRate: 96000,//编码码率
      format: 'mp3',//音频格式，有效值 aac/mp3
      frameSize: 50,//指定帧大小，单位 KB
    }

    //直播禁音
    this.setData({
      muted: true
    });
    //开始计时
    start_time = Date.parse(new Date())/1000;

    //开始录音
    
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('recorder start');
      timestamp = Date.parse(new Date());
      this.setData({
        voicetext: "开始录音"
      });
      wx.showLoading({
        title: '正在录音'
      })
    });
    //错误回调
    recorderManager.onError((res) => {
      console.log(res);
    })
  },
  OffVoice: function () {
    wx.hideLoading();
    end_time = Date.parse(new Date()) / 1000;
    
    this.setData({
      voicetext: "按住说话"
    })
    if(end_time-start_time<=2){
      wx.showToast({
        title: '说话时间太短'
      });
      this.setData({
        muted: false
      });
      return false;
    }
    wx.showLoading({
      title: '正在处理'
    });
    
    var _this = this; 
    recorderManager.stop();
    recorderManager.onStop((res) => {
      recordertime = Date.parse(new Date()) - timestamp;
      this.tempFilePath = res.tempFilePath;
      console.log('停止录音', res.tempFilePath)
      const { tempFilePath } = res
      wx.uploadFile({
        url: app.Data.apiurl + '/api/voice/wxupload.html', 
        filePath: tempFilePath,
        name: 'voice',
        formData: {
          a_id: this.data.active_id,
          u_id: app.Data.userInfo.user_id,
          u_name: app.Data.userInfo.nickname,
          u_img: app.Data.userInfo.headimg 
        },
        success: function (res) { 
          console.log(res); 
          var data = JSON.parse(res.data);
          if (data.flag == "ok") {
          wx.hideLoading();
           wx.showToast({
             title: "发送留言成功",
           });
          } else {
            wx.hideLoading();
            wx.showToast({
              title: "录音无法识别",
            });
          }
          //直播播放
          _this.setData({
            muted: false
          })
        },
        fail: function (res) {
          wx.hideLoading();
          wx.showToast({
            title: "录音无法识别",
          });
        }
      })



    })
  },
  onFullScreenClick: function () {

    if (!this.data.fullScreen) {
      this.data.videoContext.requestFullScreen({
        direction: 0,

      })

    } else {
      this.data.videoContext.exitFullScreen({

      })
    }
  },

  onPlayEvent: function (e) {
    console.log(e.detail.code);
    if (e.detail.code == -2301) {
      this.stop();
      wx.showToast({
        title: '直播尚未开始',
      })
    }
    if (e.detail.code == 2004) {
      wx.hideLoading();
    }
  },

  onFullScreenChange: function (e) {
    this.setData({
      fullScreen: e.detail.fullScreen
    })
    console.log(e);
    wx.showToast({
      title: this.data.fullScreen ? '全屏' : '退出全屏',
    })
  },

  stop: function () {
    this.setData({
      playing: false,
      // playUrl: "rtmp://2157.liveplay.myqcloud.com/live/2157_wx_live_test1",
      orientation: "vertical",
      objectFit: "contain",
      muted: false,
      fullScreen: false,
      backgroundMuted: false,
      debug: false,
      exterFlag: false,
    })
    this.data.videoContext.stop();
    wx.hideLoading();
  },

  createContext: function () {
    this.setData({
      videoContext: wx.createLivePlayerContext("video-livePlayer")
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    act_id = options.id;
    self = this;
    //gethudong();  
    //getzimu();
    var that = this;
    //开始字幕定时器
    this.setData({
        zimu_timer:setInterval(function(){
          wx.request({
            url: app.Data.apiurl + '/api/zhibo/get_zimu.html',
            method: 'GET',
            data: { a_id: that.data.active_id },
            header: {
              'content-type': 'json'
            },
            success: function (datas) {
              if(datas.data.code==200){
              that.setData({ 
                zimudata: datas.data.res
              });
             }
            }
          }); 
        },1000),
        msg_timer: setInterval(function () {
          wx.request({
            url: app.Data.apiurl + '/api/zhibo/get_hudong.html',
            method: 'GET',
            data: { a_id: that.data.active_id },
            header: {
              'content-type': 'json'
            },
            success: function (datas) {
              if (datas.data.code == 200) {
                that.setData({
                  msgdata: datas.data.res
                });
               
              } else if (datas.data.code == 100){
                 wx.showModal({
                   title: '直播已经结束',
                   content: '点击退出按钮退出直播间',
                   showCancel:false,
                   success:function(res) {
                     if (res.confirm) {
                       wx.navigateBack({
                         
                       })
                     }
                   }
                 })
              }
            }
          });
        }, 3000)
    })

    //去接口获取店铺id与桌id
    wx.request({
      url: app.Data.apiurl + '/api/zhibo/get_sid_zid?a_id=' + act_id,
      method: 'GET',
      header: {
        'content-type': 'json'
      },
      success: function (datas) {
        console.log(datas);
        self.setData({
          active_id: datas.data.id,
          playUrl: "rtmp://23289.liveplay.myqcloud.com/live/23289_" + datas.data.zid,
        })  
        console.log(self.data.playUrl);

      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.createContext();
    console.log(this.data.videoContext);

    wx.setKeepScreenOn({
      keepScreenOn: true,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 保持屏幕常亮
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
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
    clearInterval(this.data.zimu_timer);
    clearInterval(this.data.msg_timer);


    this.stop();

    wx.setKeepScreenOn({
      keepScreenOn: false,
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
     
    }
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
  }




  

})

