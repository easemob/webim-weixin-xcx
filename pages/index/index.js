//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: '环信即时通讯云',
    userInfo: {},
    login: false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.redirectTo({
      url: '../login/login'
    })
    // this.setData({
    //   login: true
    // }) 
  },
  onLoad: function () {
     // var set = setTimeout(function() {
     //       wx.redirectTo({
     //          url: '../login/login'
     //      })
     //    },3000)
     //  if(this.data.login){
     //    clearTimeout(set)
     //  }
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})
