var getUsers = function(){
   //获取授权情况
  wx.getSetting({
    success: res => {
      if (res.authSetting['scope.userInfo']) {
       
      }
      else {
        console.log("123");
      }
    }
  })
}





module.exports = {
  getUsers: getUsers
}