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
            onOpened: function (message) {
                //console.log("kkkkkkk")
            },
            onPresence: function (message) {
                console.log('onPresence',message)
                var pages = getCurrentPages()
                if (message.type == "unsubscribe") {
                    pages[0].moveFriend(message)
                }
                if (message.type === "subscribe") {
                    console.log('MMMMMMMMMMMMMM',message.status)
                    if(message.status === '[resp:true]') {
                      return
                    } else {
                      pages[0].handleFriendMsg(message)
                    }    
                }
            },
            onRoster: function (message) {
                //console.log('onRoster',message)
                var pages = getCurrentPages()
                if (pages[0]) {
                    pages[0].onShow()
                }
            },
            onTextMessage: function (message) {
                //console.log('onTextMessage',message)
                var pages = getCurrentPages()
                //console.log(pages)
                if (message) {
                    if (pages[1]) {
                        pages[1].receiveMsg(message, 'txt')
                    } else {
                        var chatMsg = that.globalData.chatMsg || []
                        var value = WebIM.parseEmoji(message.data.replace(/\n/mg, ''))
                        var time = WebIM.time()
                        var msgData = {
                            info: {
                                from: message.from,
                                to: message.to
                            },
                            username: message.from,
                            yourname: message.from,
                            msg: {
                                type: 'txt',
                                data: value
                            },
                            style: '',
                            time: time,
                            mid: 'txt' + message.id
                        }
                        chatMsg = wx.getStorageSync(msgData.yourname + message.to) || []
                        chatMsg.push(msgData)
                        wx.setStorage({
                            key: msgData.yourname + message.to,
                            data: chatMsg,
                            success: function () {
                                //console.log('success')
                            }
                        })
                    }
                }
            },
            onEmojiMessage: function (message) {
                //console.log('onEmojiMessage',message)
                var pages = getCurrentPages()
                //console.log(pages)
                if (message) {
                    if (pages[1]) {
                        pages[1].receiveMsg(message, 'emoji')
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
                                type: 'emoji',
                                data: message.data
                            },
                            style: '',
                            time: time,
                            mid: 'emoji' + message.id
                        }
                        msgData.style = ''
                        chatMsg = wx.getStorageSync(msgData.yourname + message.to) || []
                        chatMsg.push(msgData)
                        //console.log(chatMsg)
                        wx.setStorage({
                            key: msgData.yourname + message.to,
                            data: chatMsg,
                            success: function () {
                                //console.log('success')
                            }
                        })
                    }
                }
            },
            onPictureMessage: function (message) {
                //console.log('Picture',message);
                var pages = getCurrentPages()
                if (message) {
                    if (pages[1]) {
                        //console.log("wdawdawdawdqwd")
                        pages[1].receiveImage(message, 'img')
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
                            style: '',
                            time: time,
                            mid: 'img' + message.id
                        }
                        msgData.style = ''
                        chatMsg = wx.getStorageSync(msgData.yourname + message.to) || []
                        chatMsg.push(msgData)
                        wx.setStorage({
                            key: msgData.yourname + message.to,
                            data: chatMsg,
                            success: function () {
                                //console.log('success')
                            }
                        })
                    }
                }
            },
            // 各种异常
            onError: (error) => {
                console.log(error)
                // 16: server-side close the websocket connection
                if (error.type == WebIM.statusCode.WEBIM_CONNCTION_DISCONNECTED) {
                    console.log('WEBIM_CONNCTION_DISCONNECTED 123', WebIM.conn.autoReconnectNumTotal, WebIM.conn.autoReconnectNumMax);
                    if (WebIM.conn.autoReconnectNumTotal < WebIM.conn.autoReconnectNumMax) {
                        return;
                    }
                    // wx.('Error', 'server-side close the websocket connection')
                    // NavigationActions.login()/

                    wx.showToast({
                        title: 'server-side close the websocket connection',
                        duration: 1000
                    });
                    wx.redirectTo({
                        url: '../login/login'
                    })
                    return;
                }
                // 8: offline by multi login
                if (error.type == WebIM.statusCode.WEBIM_CONNCTION_SERVER_ERROR) {
                    console.log('WEBIM_CONNCTION_SERVER_ERROR');
                    // Alert.alert('Error', 'offline by multi login')
                    // NavigationActions.login()

                    wx.showToast({
                        title: 'offline by multi login',
                        duration: 1000
                    })
                    wx.redirectTo({
                        url: '../login/login'
                    })
                    return;
                }
            },
        })
    },
    getUserInfo: function (cb) {
        var that = this
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
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
    globalData: {
        userInfo: null,
        chatMsg: []
    }
})