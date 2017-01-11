var strophe = require('../../utils/strophe.js')
var WebIM = require('../../utils/WebIM.js')
var WebIM = WebIM.default

Page({
    data: {
        chatMsg: [],
        emojiStr: '',
        yourname: '',
        myName: '',
        sendInfo: '',
        userMessage: '',
        inputMessage: '',
        indicatorDots: true,
        autoplay: false,
        interval: 5000,
        duration: 1000,
        show: 'emoji_list',
        view: 'scroll_view',
        toView: '',
        emoji: WebIM.Emoji,
        emojiObj: WebIM.EmojiObj,
        showRecordHandler: false,
    },
    onLoad: function (options) {
        var that = this
        console.log(options)
        var myName = wx.getStorageSync('myUsername')
        console.log(myName)
        var options = JSON.parse(options.username)
        var num = wx.getStorageSync(options.your + myName).length - 1
        if (num > 0) {
            setTimeout(function () {
                that.setData({
                    toView: wx.getStorageSync(options.your + myName)[num].mid
                })
            }, 10)
        }
        this.setData({
            yourname: options.your,
            myName: myName,
            inputMessage: '',
            chatMsg: wx.getStorageSync(options.your + myName) || []
        })
        console.log(that.data.chatMsg)
        wx.setNavigationBarTitle({
            title: that.data.yourname
        })
    },
    onShow: function () {
        var that = this
        this.setData({
            inputMessage: ''
        })
    },
    bindMessage: function (e) {
        this.setData({
            userMessage: e.detail.value
        })
    },
    cleanInput: function () {
        var that = this
        var setUserMessage = {
            sendInfo: that.data.userMessage
        }
        that.setData(setUserMessage)
    },
    //***************** 录音 ***************************
    toggleRecordHandler: function () {
        if (!this.data.showRecordHandler) {
            wx.showModal({
                content: 'hold to record'
            })
        }

        this.setData({
            showRecordHandler: !this.data.showRecordHandler
        })
    },
    handleRecording: function () {
        var self = this
        console.log('handleRecording')
        // wx.showModal({
        //     title: '录音中',
        //     showCancel: false,
        //     showConfirm: false,
        // })

        wx.startRecord({
            fail: function (err) {
                // 时间太短会失败
                console.log(err)
            },
            success: function (res) {
                var tempFilePath = res.tempFilePath
                console.log(tempFilePath)
                self.uploadRecord(tempFilePath)
            },
            complete: function () {
                console.log("complete")
            }
        })

        setTimeout(function () {
            //超时 
            wx.stopRecord()
        }, 100000)
    },
    handleRecordingCancel: function () {
        console.log('handleRecordingCancel')
        wx.stopRecord()
    },
    playRecord: function (e) {
        let {url} = e.target.dataset
        console.log(url)
        wx.showToast({
            title: '下载' + url,
            duration: 1000
        })
        wx.downloadFile({
            url: url,
            success: function (res) {
                console.log(res)
                wx.showToast({
                    title: '播放' + res.tempFilePath,
                    duration: 1000
                })
                wx.playVoice({
                    filePath: res.tempFilePath
                })
            },
            fail: function (err) {
                wx.showToast({
                    title: JSON.stringify(err),
                    duration: 3000
                })
            }
        })
    },
    uploadRecord: function (tempFilePath) {
        var str = WebIM.config.appkey.split('#')
        var that = this
        wx.uploadFile({
            url: 'https://a1.easemob.com/' + str[0] + '/' + str[1] + '/chatfiles',
            filePath: tempFilePath,
            name: 'file',
            header: {
                'Content-Type': 'multipart/form-data'
            },
            success: function (res) {
                console.log(res)
                // return;

                // 发送xmpp消息
                var msg = new WebIM.message('audio', WebIM.conn.getUniqueId())
                var data = res.data
                var dataObj = JSON.parse(data)
                var file = {
                    type: 'audio',
                    'url': dataObj.uri + '/' + dataObj.entities[0].uuid,
                    'filetype': '',
                    'filename': tempFilePath
                }
                var option = {
                    apiUrl: WebIM.config.apiURL,
                    body: file,
                    to: that.data.yourname,                  // 接收消息对象
                    roomType: false,
                    chatType: 'singleChat'
                }
                msg.set(option)
                WebIM.conn.send(msg.body)
                // 本地消息展示
                var time = WebIM.time()
                var msgData = {
                    info: {
                        to: msg.body.to
                    },
                    username: that.data.myName,
                    yourname: msg.body.to,
                    msg: {
                        type: msg.type,
                        data: msg.body.body.url,
                        url: msg.body.body.url,
                    },
                    style: 'self',
                    time: time,
                    mid: msg.id
                }
                that.data.chatMsg.push(msgData)
                console.log(that.data.chatMsg)
                // 存储到本地消息
                var myName = wx.getStorageSync('myUsername')
                wx.setStorage({
                    key: that.data.yourname + myName,
                    data: that.data.chatMsg,
                    success: function () {
                        //console.log('success', that.data)
                        that.setData({
                            chatMsg: that.data.chatMsg
                        })
                        setTimeout(function () {

                            that.setData({
                                toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
                            })
                        }, 10)
                    }
                })
            }
        })
    },
    sendMessage: function () {
        var that = this
        // //console.log(that.data.userMessage)
        // //console.log(that.data.sendInfo)
        var myName = wx.getStorageSync('myUsername')
        var id = WebIM.conn.getUniqueId();
        var msg = new WebIM.message('txt', id);
        msg.set({
            msg: that.data.sendInfo,
            to: that.data.yourname,
            roomType: false,
            success: function (id, serverMsgId) {
                //console.log('success')
            }
        });
        // //console.log(msg)
        msg.body.chatType = 'singleChat';
        WebIM.conn.send(msg.body);
        if (msg) {
            var value = WebIM.parseEmoji(msg.value.replace(/\n/mg, ''))
            var time = WebIM.time()
            var msgData = {
                info: {
                    to: msg.body.to
                },
                username: that.data.myName,
                yourname: msg.body.to,
                msg: {
                    type: msg.type,
                    data: value
                },
                style: 'self',
                time: time,
                mid: msg.id
            }
            that.data.chatMsg.push(msgData)
            // console.log(that.data.chatMsg)

            wx.setStorage({
                key: that.data.yourname + myName,
                data: that.data.chatMsg,
                success: function () {
                    //console.log('success', that.data)
                    that.setData({
                        chatMsg: that.data.chatMsg,
                        emojiList: [],
                        inputMessage: ''
                    })
                    setTimeout(function () {
                        that.setData({
                            toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
                        })
                    }, 100)
                }
            })
            that.setData({
                userMessage: ''
            })
        }
    },
    receiveMsg: function (msg, type) {
        var that = this
        var myName = wx.getStorageSync('myUsername')
        if (msg.from == that.data.yourname || msg.to == that.data.yourname) {
            //console.log(msg)
            if (type == 'txt') {
                var value = WebIM.parseEmoji(msg.data.replace(/\n/mg, ''))
            } else if (type == 'emoji') {
                var value = msg.data
            }
            //console.log(msg)
            //console.log(value)
            var time = WebIM.time()
            var msgData = {
                info: {
                    from: msg.from,
                    to: msg.to
                },
                username: '',
                yourname: msg.from,
                msg: {
                    type: type,
                    data: value,
                    url: msg.url
                },
                style: '',
                time: time,
                mid: msg.type + msg.id
            }
            if (msg.from == that.data.yourname) {
                msgData.style = ''
                msgData.username = msg.from
            } else {
                msgData.style = 'self'
                msgData.username = msg.to
            }
            //console.log(msgData, that.data.chatMsg, that.data)
            that.data.chatMsg.push(msgData)
            wx.setStorage({
                key: that.data.yourname + myName,
                data: that.data.chatMsg,
                success: function () {
                    //console.log('success', that.data)
                    that.setData({
                        chatMsg: that.data.chatMsg,
                    })
                    setTimeout(function () {
                        that.setData({
                            toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
                        })
                    }, 100)
                }
            })
        }
    },
    openEmoji: function () {
        this.setData({
            show: 'showEmoji',
            view: 'scroll_view_change'
        })
    },
    sendEmoji: function (event) {
        var that = this
        var emoji = event.target.dataset.emoji
        var msglen = that.data.userMessage.length - 1
        if (emoji && emoji != '[del]') {
            var str = that.data.userMessage + emoji
        } else if (emoji == '[del]') {
            var start = that.data.userMessage.lastIndexOf('[')
            var end = that.data.userMessage.lastIndexOf(']')
            var len = end - start
            if (end != -1 && end == msglen && len >= 3 && len <= 4) {
                var str = that.data.userMessage.slice(0, start)
            } else {
                var str = that.data.userMessage.slice(0, msglen)
            }
        }
        this.setData({
            userMessage: str,
            inputMessage: str
        })
    },
    sendImage: function () {
        var that = this
        var pages = getCurrentPages()
        pages[1].cancelEmoji()
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album'],
            success: function (res) {
                //console.log(res)
                //console.log(pages)
                if (pages[1]) {
                    pages[1].upLoadImage(res, that)
                }
            }
        })
    },
    // sendVideo: function() {
    //     var that = this
    //     wx.chooseVideo({
    //         sourceType: ['album', 'camera'],
    //         maxDuration: 60,
    //         camera: 'back',
    //         success: function(res) {
    //             console.log(res)
    //             var tempFilePaths = res.tempFilePath
    //             var str = WebIM.config.appkey.split('#')
    //             wx.uploadFile({
    //                 url: 'https://a1.easemob.com/'+ str[0] + '/' + str[1] + '/chatfiles',
    //                 filePath: tempFilePaths,
    //                 name: 'file',
    //                 header: {
    //                     'Content-Type': 'multipart/form-data'
    //                 },
    //                 success: function (res) {
    //                         var data = res.data

    //                         var dataObj = JSON.parse(data)
    //                         console.log(dataObj)
    //                         var id = WebIM.conn.getUniqueId();                   // 生成本地消息id
    //                         var msg = new WebIM.message('img', id);
    //                         console.log(msg)
    //                         var file = {
    //                             type: 'img',
    //                             'url': dataObj.uri + '/' + dataObj.entities[0].uuid,
    //                             'filetype': 'mp4',
    //                             'filename': tempFilePaths
    //                         }
    //                         //console.log(file)
    //                         var option = {
    //                             apiUrl: WebIM.config.apiURL,
    //                             body: file,
    //                             to: that.data.yourname,                  // 接收消息对象
    //                             roomType: false,
    //                             chatType: 'singleChat'
    //                         }
    //                         msg.set(option)
    //                         WebIM.conn.send(msg.body)
    //                         if (msg) {
    //                             //console.log(msg,msg.body.body.url)
    //                             var time = WebIM.time()
    //                             var msgData = {
    //                                 info: {
    //                                     to: msg.body.to
    //                                 },
    //                                 username: that.data.myName,
    //                                 yourname: msg.body.to,
    //                                 msg: {
    //                                     type: msg.type,
    //                                     data: msg.body.body.url
    //                                 },
    //                                 style: 'self',
    //                                 time: time,
    //                                 mid: msg.id
    //                             }
    //                             that.data.chatMsg.push(msgData)
    //                             console.log(that.data.chatMsg)
    //                             var myName = wx.getStorageSync('myUsername')
    //                             wx.setStorage({
    //                                 key: that.data.yourname + myName,
    //                                 data: that.data.chatMsg,
    //                                 success: function () {
    //                                     //console.log('success', that.data)
    //                                     that.setData({
    //                                         chatMsg: that.data.chatMsg
    //                                     })
    //                                     setTimeout(function () {
    //                                         that.setData({
    //                                             toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
    //                                         })
    //                                     }, 10)
    //                                 }
    //                             })
    //                         }

    //                 }
    //             })
    //         }
    //     })
    // },
    receiveImage: function (msg, type) {
        var that = this
        var myName = wx.getStorageSync('myUsername')
        //console.log(msg)
        if (msg) {
            //console.log(msg)
            var time = WebIM.time()
            var msgData = {
                info: {
                    from: msg.from,
                    to: msg.to
                },
                username: msg.from,
                yourname: msg.from,
                msg: {
                    type: 'img',
                    data: msg.url
                },
                style: '',
                time: time,
                mid: 'img' + msg.id
            }
            //console.log(msgData)
            that.data.chatMsg.push(msgData)
            //console.log(that.data.chatMsg)
            wx.setStorage({
                key: that.data.yourname + myName,
                data: that.data.chatMsg,
                success: function () {
                    //console.log('success', that.data)
                    that.setData({
                        chatMsg: that.data.chatMsg
                    })
                    setTimeout(function () {
                        that.setData({
                            toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
                        })
                    }, 100)
                }
            })
        }
    },
    openCamera: function () {
        var that = this
        var pages = getCurrentPages()
        pages[1].cancelEmoji()
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['camera'],
            success: function (res) {
                if (pages[1]) {
                    pages[1].upLoadImage(res, that)
                }
            }
        })
    },
    focus: function () {
        this.setData({
            show: 'emoji_list',
            view: 'scroll_view'
        })
    },
    cancelEmoji: function () {
        this.setData({
            show: 'emoji_list',
            view: 'scroll_view'
        })
    },
    scroll: function (e) {
        // //console.log(e)
    },
    lower: function (e) {
        //console.log(e)
    },
    upLoadImage: function (res, that) {
        //console.log(res)
        var tempFilePaths = res.tempFilePaths
        //console.log(tempFilePaths)
        wx.getImageInfo({
            src: res.tempFilePaths[0],
            success: function (res) {
                // console.log(res)
                var allowType = {
                    'jpg': true,
                    'gif': true,
                    'png': true,
                    'bmp': true
                };
                var str = WebIM.config.appkey.split('#')
                var width = res.width
                var height = res.height
                var index = res.path.lastIndexOf('.')
                if (index != -1) {
                    var filetype = res.path.slice(index + 1)
                }
                if (filetype.toLowerCase() in allowType) {
                    wx.uploadFile({
                        url: 'https://a1.easemob.com/' + str[0] + '/' + str[1] + '/chatfiles',
                        filePath: tempFilePaths[0],
                        name: 'file',
                        header: {
                            'Content-Type': 'multipart/form-data'
                        },
                        success: function (res) {
                            var data = res.data
                            var dataObj = JSON.parse(data)
                            // console.log(dataObj)
                            var id = WebIM.conn.getUniqueId();                   // 生成本地消息id
                            var msg = new WebIM.message('img', id);
                            var file = {
                                type: 'img',
                                size: {
                                    width: width,
                                    height: height
                                },
                                'url': dataObj.uri + '/' + dataObj.entities[0].uuid,
                                'filetype': filetype,
                                'filename': tempFilePaths[0]
                            }
                            //console.log(file)
                            var option = {
                                apiUrl: WebIM.config.apiURL,
                                body: file,
                                to: that.data.yourname,                  // 接收消息对象
                                roomType: false,
                                chatType: 'singleChat'
                            }
                            msg.set(option)
                            WebIM.conn.send(msg.body)
                            if (msg) {
                                //console.log(msg,msg.body.body.url)
                                var time = WebIM.time()
                                var msgData = {
                                    info: {
                                        to: msg.body.to
                                    },
                                    username: that.data.myName,
                                    yourname: msg.body.to,
                                    msg: {
                                        type: msg.type,
                                        data: msg.body.body.url,
                                        size: {
                                            width: msg.body.body.size.width,
                                            height: msg.body.body.size.height,
                                        }
                                    },
                                    style: 'self',
                                    time: time,
                                    mid: msg.id
                                }
                                that.data.chatMsg.push(msgData)
                                //console.log(that.data.chatMsg)
                                var myName = wx.getStorageSync('myUsername')
                                wx.setStorage({
                                    key: that.data.yourname + myName,
                                    data: that.data.chatMsg,
                                    success: function () {
                                        //console.log('success', that.data)
                                        that.setData({
                                            chatMsg: that.data.chatMsg
                                        })
                                        setTimeout(function () {
                                            that.setData({
                                                toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
                                            })
                                        }, 10)
                                    }
                                })
                            }
                        }
                    })
                }
            }
        })
    },
    previewImage: function (event) {
        var url = event.target.dataset.url
        wx.previewImage({
            urls: [url]  // 需要预览的图片http链接列表
        })
    }
})

















