var strophe = require('../../utils/strophe.js')
var WebIM = require('../../utils/WebIM.js')
var WebIM = WebIM.default
//console.log(WebIM)
Page({
    data: {
        username: '',
        password: '',
        nickname: '',
        name: 'asdfghj',
        psd: '123456',
        grant_type: "password"
    },
    bindKeyInput: function (e) {
        this.setData({
            username: e.detail.value
        })
    },
    bindPsdInput: function (e) {
        this.setData({
            password: e.detail.value
        })
    },
    bindNameInput: function (e) {
        this.setData({
            nickname: e.detail.value
        })
    },
    usernameInput: function (e) {
        this.setData({
            name: e.detail.value
        })
    },
    psdInput: function (e) {
        this.setData({
            psd: e.detail.value
        })
    },
    submit: function () {
        var that = this
        //console.log(WebIM)
        var options = {
            apiUrl: WebIM.config.apiURL,
            username: that.data.username,
            password: that.data.password,
            nickname: that.data.nickname,
            appKey: 'orgName#appName'
        }
        WebIM.default.utils.registerUser(options)

        // wx.request({
        //     url: 'https://a1.sdb.easemob.com/easemob-demo/chatdemoui/users',
        //     data: {
        //         username: that.data.username,
        //         password: that.data.password,
        //         nickname: that.data.nickname
        //     },
        //      header: {
        //       'content-type': 'application/json'
        //     },
        //     method: 'POST',
        //     success: function(res) {
        //         //console.log(res)
        //     }
        // })
    },

    login: function () {
        var that = this
        var conn = new WebIM.connection({
            url: WebIM.config.xmppURL,
            isAutoLogin: WebIM.config.isAutoLogin,
            isMultiLoginSessions: WebIM.config.isMultiLoginSessions
        })
        conn.listen({
            onError: function () {
                //console.log('onError', arguments)
            }
        })
        var options = {
            apiUrl: WebIM.config.apiURL,
            user: that.data.name,
            pwd: that.data.psd,
            grant_type: that.data.grant_type,
            appKey: WebIM.config.appkey
        }
        conn.open(options);


        // var that = this
        // wx.request({
        //     url: 'https://a1.sdb.easemob.com/easemob-demo/chatdemoui/token',
        //     data: {
        //         grant_type: that.data.grant_type,
        //         username: that.data.name,
        //         password: that.data.psd               
        //     },
        //     header: {
        //         'content-type':'application/json'
        //     },
        //     method: 'POST',
        //     success: function(res) {
        //         if(res.statusCode == 200) {
        //             that.webSocket()
        //         }
        //     }
        // })

    },
    webSocket: function () {
        wx.connectSocket({
            url: 'wss://im-api.sandbox.easemob.com/ws/',
            method: "GET"
        })
        wx.onSocketOpen(function (res) {
            //console.log('WebSocket连接已打开！')
            wx.sendSocketMessage({
                data: "Hello,World:"
            })
        })
        wx.onSocketMessage(function (msg) {
            //console.log(msg)
        })
        wx.onSocketClose(function () {
            //console.log('WebSocket连接已经关闭!')
        })
    }
})