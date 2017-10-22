require('./utils/strophe.js')
var WebIM = require('./utils/WebIM.js').default

//app.js   
App({
    getRoomPage: function () {
        return this.getPage("pages/chatroom/chatroom")
    },
    getPage: function (pageName) {
        var pages = getCurrentPages()
        return pages.find(function (page) {
            return page.__route__ == pageName
        })
    },
    onLaunch: function () {
        //调用API从本地缓存中获取数据
        var that = this
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        WebIM.conn.listen({
            onOpened: function (message) {
                WebIM.conn.setPresence()
            },
            onPresence: function (message) {
                switch(message.type){
                    case "unsubscribe":
                        pages[0].moveFriend(message);
                        break;
                    case "subscribe":
                        if (message.status === '[resp:true]') {
                            return
                        } else {
                            pages[0].handleFriendMsg(message)
                        }
                        break;
                    case "joinChatRoomSuccess":
                        console.log('Message: ', message);
                        wx.showToast({
                            title: "JoinChatRoomSuccess",
                        });
                        break;
                    case "memberJoinChatRoomSuccess":
                        console.log('memberMessage: ', message);
                        wx.showToast({
                            title: "memberJoinChatRoomSuccess",
                        });
                        break;
                    case "memberLeaveChatRoomSuccess":
                        console.log("LeaveChatRoom");
                        wx.showToast({
                            title: "leaveChatRoomSuccess",
                        });
                        break;
                }
            },
            onRoster: function (message) {
                var pages = getCurrentPages()
                if (pages[0]) {
                    pages[0].onShow()
                }
            },

            onVideoMessage: function(message){
                console.log('onVideoMessage: ', message);
                var page = that.getRoomPage()
                if (message) {
                    if (page) {
                        page.receiveVideo(message, 'video')
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
                                type: 'video',
                                data: message.url
                            },
                            style: '',
                            time: time,
                            mid: 'video' + message.id
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

            onAudioMessage: function (message) {
                console.log('onAudioMessage', message)
                var page = that.getRoomPage()
                console.log(page)
                if (message) {
                    if (page) {
                        page.receiveMsg(message, 'audio')
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
                                type: 'audio',
                                data: value
                            },
                            style: '',
                            time: time,
                            mid: 'audio' + message.id
                        }
                        console.log("Audio msgData: ", msgData);
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

            onLocationMessage: function (message) {
                console.log("Location message: ", message);
            },

            onTextMessage: function (message) {
                var page = that.getRoomPage()
                console.log(page)
                if (message) {
                    if (page) {
                        page.receiveMsg(message, 'txt')
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
                var page = that.getRoomPage()
                //console.log(pages)
                if (message) {
                    if (page) {
                        page.receiveMsg(message, 'emoji')
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
                var page = that.getRoomPage()
                if (message) {
                    if (page) {
                        //console.log("wdawdawdawdqwd")
                        page.receiveImage(message, 'img')
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
            onError: function (error) {
                // 16: server-side close the websocket connection
                if (error.type == WebIM.statusCode.WEBIM_CONNCTION_DISCONNECTED) {
                    if (WebIM.conn.autoReconnectNumTotal < WebIM.conn.autoReconnectNumMax) {
                        return;
                    }

                    wx.showToast({
                        title: 'server-side close the websocket connection',
                        duration: 1000
                    });
                    wx.redirectTo({
                        url: '../login/login'
                    });
                    return;
                }

                // 8: offline by multi login
                if (error.type == WebIM.statusCode.WEBIM_CONNCTION_SERVER_ERROR) {
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

        
    }
    ,
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
    }
    ,
    globalData: {
        userInfo: null,
        chatMsg: []
    }
})