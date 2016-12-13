var strophe = require('./utils/strophe.js')
var WebIM = require('./utils/WebIM.js')
var WebIM = WebIM.default

//app.js   
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var that = this
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // {
    //   byId: {
    //     a: {
    //       type: 'chat',
    //       to: 
    //       id: 
    //       body: {type: 'image'}
    //     },
    //     b: {},
    //   },
    //   chat: {
    //     roomid1: [a,b,c]
    //   },
    //   groupchat: {
    //     roomid1: [d,e,f]
    //   }
    // }
    WebIM.conn.listen({
      onOpened: function(message) {
        console.log("kkkkkkk")
      },
      onPresence: function(msg) {
        console.log('onPresence',msg)
        var pages = getCurrentPages()
        if(pages[1]) {
          pages[1].deleteFriend(msg)
        }
      },
      onRoster: function(message) {
			    console.log('onRoster',message) 
          var pages = getCurrentPages()
          if(message) {
            pages[2].sendMsg(message)
          }
			},
      onTextMessage: function (message) {
          console.log('onTextMessage',message)
          var pages = getCurrentPages()
          console.log(pages)
          if(message) {
              if(pages[2]) {
                 pages[2].chat(message)
            }
          }
        }
    })
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null
  }
})