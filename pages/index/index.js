//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: '环信即时通讯云',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../login/login'
    })
  },
  bindWs: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    // var num = 0
    // console.log('num')
    // console.log('num end')
    // console.log('onLoad')
    var pages = getCurrentPages()
    setTimeout(function() {
      pages[0].bindViewTap()
    },3000)
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
