var strophe = require('../../utils/strophe.js')
var WebIM = require('../../utils/WebIM.js')
var WebIM = WebIM.default

Page({
	data: {
		chatMsg: [],
		yourname: '',
		myName: '',
		sendInfo: '',
		userMessage: '',
		emoji: [
			'../../images/faces/ee_1.png',
			'../../images/faces/ee_2.png',
			'../../images/faces/ee_3.png',
			'../../images/faces/ee_4.png',
			'../../images/faces/ee_5.png',
			'../../images/faces/ee_6.png',
			'../../images/faces/ee_7.png',
			'../../images/faces/ee_8.png',
			'../../images/faces/ee_9.png',
			'../../images/faces/ee_10.png',
			'../../images/faces/ee_11.png',
			'../../images/faces/ee_12.png',
			'../../images/faces/ee_13.png',
			'../../images/faces/ee_14.png',
			'../../images/faces/ee_15.png',
			'../../images/faces/ee_16.png',
			'../../images/faces/ee_17.png',
			'../../images/faces/ee_18.png',
			'../../images/faces/ee_19.png',
			'../../images/faces/ee_20.png',
			'../../images/faces/ee_21.png',
			'../../images/faces/ee_22.png',
			'../../images/faces/ee_23.png',
			'../../images/faces/ee_24.png',
			'../../images/faces/ee_25.png',
			'../../images/faces/ee_26.png'
		]
	},
	onLoad: function(options) {
		var that = this										
		var options = JSON.parse(options.username)
		console.log(options)
		console.log(wx.getStorageSync(options.your))
		this.setData({
			yourname: options.your,
			myName: options.myName,
			chatMsg: wx.getStorageSync(options.your) || []
		}) 
	},
	bindMessage: function(e) {
		this.setData({
			userMessage: e.detail.value
		})
	},
	cleanInput: function() {
		var setUserMessage = {
			sendInfo: this.data.userMessage
		}
		this.setData(setUserMessage)
	},
	sendMessage: function() {
		var that = this
		var id = WebIM.conn.getUniqueId();
	    var msg = new WebIM.message('txt', id);
	    console.log(msg)
	    msg.set({
	        msg: that.data.sendInfo,                       
	        to: that.data.yourname,                          
	        roomType: false,
	        success: function(id, serverMsgId) {
	            console.log('success')
	        }
	    });
	    msg.body.chatType = 'singleChat';
	    WebIM.conn.send(msg.body);
	    if(msg) {
	    	var date = new Date()
	    	var Hours = date.getHours(); 
            var Minutes = date.getMinutes(); 
            var Seconds = date.getSeconds();
            var time = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' 
            + (Hours < 10 ? "0" + Hours : Hours) + ':' + (Minutes < 10 ? "0" + Minutes : Minutes) + ':' + (Seconds < 10 ? "0" + Seconds : Seconds)
			var msgData = {
				info: {
					to: msg.body.to
				},
				username: that.data.myName,
				msg: {
					type: msg.type,
					data: msg.value
				},
				style:'self',
				time: time
			}
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
			that.setData({
				userMessage: ''
			})
	    }
	},
	receiveMsg: function(msg) {
		var that = this 
		if(msg.from == that.data.yourname || msg.to == that.data.yourname) {
			console.log(msg)
			var date = new Date()
			var Hours = date.getHours(); 
            var Minutes = date.getMinutes(); 
            var Seconds = date.getSeconds(); 
            var time = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' 
            + (Hours < 10 ? "0" + Hours : Hours) + ':' + (Minutes < 10 ? "0" + Minutes : Minutes) + ':' + (Seconds < 10 ? "0" + Seconds : Seconds)
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
	},
	send_emoji: function() {

	}
})

















