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

    WebIM.conn.listen({
      onOpened: function(message) {
        console.log("kkkkkkk")
      },
      onPresence: function(message) {
        console.log('onPresence',message)
        var pages = getCurrentPages()
        if(message.type == "unsubscribe") {
            pages[1].moveFriend(message)
        }
        if(message.type === "subscribe") {
            pages[1].handleFriendMsg(message)
        }
      },
      onRoster: function(message) {
			    console.log('onRoster',message) 
          var pages = getCurrentPages()
          if(pages[1]) {
            pages[1].onShow()
          }
			},
      onTextMessage: function (message) {
          console.log('onTextMessage',message)
          var pages = getCurrentPages()
          console.log(pages)
          if(message) {
              if(pages[2]) {
                 pages[2].receiveMsg(message,'txt')
            } else {
                var chatMsg = that.globalData.chatMsg || []
                var value = WebIM.parseEmoji(message.data.replace(/\n/mg, ''))
                var time = WebIM.time()
                var msgData = {
                  info: {
                    from: message.from,
                    to: message.to
                  },
                  username: '',
                  yourname: message.from,
                  msg: {
                    type: message.type,
                    data: value
                  },
                  style:'',
                  time: time,
                  mid: message.id
                }
                msgData.style = ''
                chatMsg = wx.getStorageSync(msgData.yourname) || []
                chatMsg.push(msgData)
                wx.setStorage({
                  key: msgData.yourname,
                  data: chatMsg,
                  success: function() {
                    console.log('success')
                  }
                })
              }
          }
        },
        onEmojiMessage: function(message) {
          console.log('onEmojiMessage',message)
          var pages = getCurrentPages()
          console.log(pages)
          if(message) {
              if(pages[2]) {
                  pages[2].receiveMsg(message,'emoji')
            } else {
                var chatMsg = that.globalData.chatMsg || []
                var time = WebIM.time()
                var msgData = {
                  info: {
                    from: message.from,
                    to: message.to
                  },
                  username: '',
                  yourname: message.from,
                  msg: {
                    type: 'img',
                    data: message.url
                  },
                  style:'',
                  time: time,
                  mid: message.id
                }
                msgData.style = ''
                chatMsg = wx.getStorageSync(msgData.yourname) || []
                chatMsg.push(msgData)
                wx.setStorage({
                  key: msgData.yourname,
                  data: chatMsg,
                  success: function() {
                    console.log('success')
                  }
                })
              }
          }
        },
        onPictureMessage: function (message) {
          console.log('Picture',message);
          var pages = getCurrentPages()
          if(message) {
            if(pages[2]) {
                console.log("wdawdawdawdqwd")
                pages[2].receiveImage(message,'img')
            } else {
                var chatMsg = that.globalData.chatMsg || []
                var time = WebIM.time()
                var msgData = {
                  info: {
                    from: message.from,
                    to: message.to
                  },
                  username: message.from,
                  yourname: message.from,
                  msg: {
                    type: 'img',
                    data: message.url
                  },
                  style:'',
                  time: time,
                  mid: 'img' + message.id
                }
                msgData.style = ''
                chatMsg = wx.getStorageSync(msgData.yourname) || []
                chatMsg.push(msgData)
                wx.setStorage({
                  key: msgData.yourname,
                  data: chatMsg,
                  success: function() {
                    console.log('success')
                  }
                })
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
    userInfo:null,
    chatMsg: []
  }
})