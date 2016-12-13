var strophe = require('../../utils/strophe.js')
var WebIM = require('../../utils/WebIM.js')
var WebIM = WebIM.default

Page({
	data: {
		chatMsg: [],
		yourname: '',
		sendInfo: ''
	},
	onLoad: function(options) {
		var that = this										
		var options = JSON.parse(options.username)
		console.log(options)
		console.log(wx.getStorageSync(options.your))
		this.setData({
			yourname: options.your,
			chatMsg: wx.getStorageSync(options.your) || []
		}) 
	},
	bindMessage: function(e) {
		this.setData({
			sendInfo: e.detail.value
		})
	},
	sendMessage: function() {
		var that = this
		var id = WebIM.conn.getUniqueId();
	    var msg = new WebIM.message('txt', id);
	    msg.set({
	        msg: that.data.sendInfo,                       
	        to: that.data.yourname,                          
	        roomType: false,
	        success: function(id, serverMsgId) {
	        	console.log(id)
	            console.log("zzzzzz")
	        }
	    });
	    console.log("vvvvvvvv",msg)
	    msg.body.chatType = 'singleChat';
	    WebIM.conn.send(msg.body);
	},
	chat: function(msg) {
		var that = this 
		if(msg.from == that.data.yourname || msg.to == that.data.yourname) {
			console.log(msg)
			var date = new Date()
			var time = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
			var msgData = {
				info: {
					from: msg.from,
					to: msg.to
				},
				username: '',
				msg: {
					type: msg.type,
					data: msg.data
				},
				style:'',
				time: time
			}
			if(msg.from == that.data.yourname) {
				msgData.style = ''
				msgData.username = msg.from
			} else {
				msgData.style = 'self'
				msgData.username = msg.to
			}
			console.log(msgData, that.data.chatMsg, that.data)
			that.data.chatMsg.push(msgData)
			wx.setStorage({
				key: that.data.yourname,
				data: that.data.chatMsg,
				success: function() {
					console.log('success', that.data)
					that.setData({
						chatMsg: that.data.chatMsg
					})
				}
			})
		}
	}
})

















