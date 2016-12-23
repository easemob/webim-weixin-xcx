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
		emoji: WebIM.Emoji
	},
	onLoad: function(options) {
		var that = this									
		var options = JSON.parse(options.username)
		console.log(options)
		var num = wx.getStorageSync(options.your).length - 1
		if(num > 0) {
			this.setData({
				toView: wx.getStorageSync(options.your)[num].mid
			})
		}
		this.setData({
			yourname: options.your,
			myName: options.myName,
			inputMessage: '',
			chatMsg: wx.getStorageSync(options.your) || []
		})
		wx.setNavigationBarTitle({
		  	title: that.data.yourname
		})
	},
	onShow: function() {
		this.setData({
			inputMessage: ''
		})
	},
	bindMessage: function(e) {
		this.setData({
			userMessage: e.detail.value
		})
		console.log(this.data.userMessage)
	},
	cleanInput: function() {
		var that = this
		var setUserMessage = {
			sendInfo: that.data.userMessage
		}
		that.setData(setUserMessage)
	},
	sendMessage: function() {
		var that = this
	    console.log(that.data.userMessage)
	    console.log(that.data.sendInfo)
		var id = WebIM.conn.getUniqueId();
	    var msg = new WebIM.message('txt', id); 
	    msg.set({
	        msg: that.data.sendInfo,                       
	        to: that.data.yourname,                          
	        roomType: false,
	        success: function(id, serverMsgId) {
	            console.log('success')
	        }
	    });
	    console.log(msg)
	    msg.body.chatType = 'singleChat';
	    WebIM.conn.send(msg.body);
	    if(msg) {
	    	var value = WebIM.parseEmoji(msg.value.replace(/\n/mg, ''))
	    	var time = WebIM.time()
			var msgData = {
				info: {
					to: msg.body.to
				},
				username: that.data.myName,
				msg: {
					type: msg.type,
					data: value
				},
				style: 'self',
				time: time,
				mid: msg.id
			}
			that.data.chatMsg.push(msgData)
			console.log(that.data.chatMsg)
			wx.setStorage({
				key: that.data.yourname,
				data: that.data.chatMsg,
				success: function() {
					console.log('success', that.data)
					that.setData({
						chatMsg: that.data.chatMsg,
						emojiList: [],
						inputMessage:''
					})
					setTimeout(function() {
						that.setData({
							toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
						})
					}, 10)
				}
			})
			that.setData({
				userMessage: ''
			})
	    }
	},
	receiveMsg: function(msg,type) {
		var that = this 
		if(msg.from == that.data.yourname || msg.to == that.data.yourname) {
			console.log(msg)
			if(type == 'txt') {
				var value = WebIM.parseEmoji(msg.data.replace(/\n/mg, ''))
			} else if(type == 'emoji') {
				var value = msg.data
			}
			console.log(msg)
			
			console.log(value)
			var time = WebIM.time()
			var msgData = {
				info: {
					from: msg.from,
					to: msg.to
				},
				username: '',
				msg: {
					type: msg.type,
					data: value
				},
				style:'',
				time: time,
				mid: msg.type + msg.id
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
						chatMsg: that.data.chatMsg,
					})
					setTimeout(function() {
						that.setData({
							toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
						})
					}, 10)
				}
			})
		}
	},
	open_emoji: function() {
		this.setData({
			show: 'showEmoji',
			view: 'scroll_view_change'
		})
	},
	send_emoji: function(event) {
		var that = this
		var emoji = event.target.dataset.emoji
		var msglen = that.data.userMessage.length - 1
		if(emoji && emoji != '[del]') {
			var str = that.data.userMessage + emoji
		} else if(emoji == '[del]') {
			var start = that.data.userMessage.lastIndexOf('[')
			var end = that.data.userMessage.lastIndexOf(']')
			var len = end - start
			console.log(start,end,len)
			if(end != -1 && end == msglen && len >= 3 && len <= 4 ) {
				var str = that.data.userMessage.slice(0,start)
			} else {
				var str = that.data.userMessage.slice(0,msglen)
			}
		}
		console.log(str)
		this.setData({
			userMessage: str,
			inputMessage: str
		})
	},
	focus: function() {
		this.setData({
			show: 'emoji_list',
			view: 'scroll_view'
		})
	},
	cancel_emoji: function() {
		this.setData({
			show: 'emoji_list',
			view: 'scroll_view'
		})
	},
	scroll: function(e) {
		// console.log(e)
	},
	lower: function(e) {
		console.log(e)
	}
})

















