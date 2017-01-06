var strophe = require('../../utils/strophe.js')
var WebIM = require('../../utils/WebIM.js')
var WebIM = WebIM.default

Page({
    data: {
        name: '',
        psd: '',
        grant_type: "password",
        array: ['老大王浩', '老二代凡', '老三李瀚', '老四郭超','老五丁锐', '老六徐达', '老七钟泽方', '老八张鹏飞'],
        objectArray: [
          {
            user: 'wh',
            pwd:'123'
          },
          {
            user: 'df',
            pwd:'123'
          },
          {
            user: 'lh',
            pwd:'123'
          },
          {
            user: 'gc',
            pwd:'123'
          },
          {
            user: 'dr',
            pwd:'123'
          },
          {
            user: 'xd',
            pwd:'123'
          },
          {
            user: 'zzf',
            pwd:'123'
          },
          {
            user: 'zpf',
            pwd:'123'
          }
        ],
        index: '',
        hidden: 'input'
    },
    bindPickerChange: function(e) {
        console.log(e)
        this.setData({
          index: e.detail.value,
          name: this.data.objectArray[e.detail.value].user,
          psd: this.data.objectArray[e.detail.value].pwd,
          hidden: 'show'
        })
    },
    bindUsername: function (e) {
        this.setData({
            name: e.detail.value
        })
    },
    bindPassword: function (e) {
        this.setData({
            psd: e.detail.value
        })
    },
    login: function () {
        console.log('login')
        var that = this
        if (that.data.name == '') {
            wx.showModal({
                title: '请输入用户名！',
                confirmText: 'OK',
                showCancel: false
            })
        } else if (that.data.psd == '') {
            wx.showModal({
                title: '请输入密码！',
                confirmText: 'OK',
                showCancel: false
            })
        } else {
            var options = {
                apiUrl: WebIM.config.apiURL,
                user: that.data.name,
                pwd: that.data.psd,
                grant_type: that.data.grant_type,
                appKey: WebIM.config.appkey
            }
            wx.setStorage({
                key: "myUsername",
                data: that.data.name
            })
            console.log('open')
            WebIM.conn.open(options)
        }
    }
})




