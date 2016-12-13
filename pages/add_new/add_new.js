var strophe = require('../../utils/strophe.js')
var WebIM = require('../../utils/WebIM.js')
var WebIM = WebIM.default

//WebIM.conn  实例化的connection  
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
	    // var id = WebIM.conn.getUniqueId()
	    // var msg = new WebIM.message('txt', id)
	    // // console.log(msg)
	    // msg.set({
	    //     msg: 'hello, world',                       // 消息内容
	    //     to: 'wjy666',                          // 接收消息对象
	    //     roomType: false,
	    //     success: function (id, serverMsgId) {
	    //         console.log("send private text Success")
	    //     },
	    //     fail: function(error) {
	    //     	console.log('send error')
	    //     }
	    // });
	    // msg.body.chatType = 'singleChat';
	    // WebIM.conn.send(msg.body)
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
		        to: that.data.friend_name,
		        message: "Hello!"                   // Demo里面接收方没有展现出来这个message，在status字段里面
		    })
	    } 
	    
	}
})



















