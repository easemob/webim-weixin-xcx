var strophe = require('../../utils/strophe.js')
var WebIM = require('../../utils/WebIM.js')
var WebIM = WebIM.default

//WebIM.conn  实例化的  
Page({
	data: {
		friend_name:''
	},
	bindFriendName: function(e) {
		this.setData({
			friend_name: e.detail.value
		})
	},
	onShow: function() {
		console.log(getCurrentPages())
	},
	sendMsg: function() {
		wx.showToast({
			title: '消息发送成功！',
			duration: 1500
		})
	},
	add_friend: function() {
	    var that = this
	    if(that.data.friend_name == '') {
	    	wx.showToast({
	    		title: '好友添加失败！',
	    		duration: 1500
	    	})
	    	return false
	    }
	    else {
		    WebIM.conn.subscribe({
		        to: that.data.friend_name
		        // message: "hello!"                   
		    })
		    wx.showToast({
	    		title: '消息发送成功！',
	    		duration: 1500
	    	})
	    }  
	}
})



















