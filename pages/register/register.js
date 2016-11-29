var strophe = require('../../utils/strophe.js')
var WebIM = require('../../utils/WebIM.js')
var WebIM = WebIM.default

Page({
	data: {
		username: '',
		password: ''
	},
	bindUsername: function(e) {
		this.setData({
			username: e.detail.value
		})
	},
	bindPassword: function(e) {
		this.setData({
			password: e.detail.value
		})
	},
	register: function() {
        var that = this
        if(that.data.username == '') {
			wx.showModal({
				title: 'Please enter username',
				confirmText: 'OK',
				showCancel: false
			})
		}else if(that.data.password == '') {
			wx.showModal({
				title: 'Please enter password',
				confirmText: 'OK',
				showCancel: false
			})
		}else {
			var options = {
	            apiUrl: WebIM.config.apiURL,
	            username: that.data.username,
	            password: that.data.password,
	            nickname: '',
	            appKey: WebIM.config.appkey,
	            success: function(res) {
	            	if(res.statusCode == '200') {
	            		wx.showToast({
			              title: '注册成功',
			              icon: 'success',
			              duration: 2000
			            });
	            	}	
	            }
        	}
        	WebIM.utils.registerUser(options)
		}
        
    }
})