var strophe = require('../../utils/strophe.js')
var WebIM = require('../../utils/WebIM.js')
var WebIM = WebIM.default

Page({
	data: {
		chatMsg: [],
		emojiList: [],
		yourname: '',
		myName: '',
		sendInfo: '',
		userMessage: '',
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
		console.log(wx.getStorageSync(options.your))
		var num = wx.getStorageSync(options.your).length - 1
		if(num > 0) {
			this.setData({
				toView: wx.getStorageSync(options.your)[num].mid
			})
		}
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
	    	var value = WebIM.parseEmoji(msg.value.replace(/\n/mg, ''))
	    	var date = new Date()
	    	var Hours = date.getHours(); 
            var Minutes = date.getMinutes(); 
            var Seconds = date.getSeconds();
            var time = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + ' ' 
            + (Hours < 10 ? "0" + Hours : Hours) + ':' + (Minutes < 10 ? "0" + Minutes : Minutes) + ':' + (Seconds < 10 ? "0" + Seconds : Seconds)
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
	receiveMsg: function(msg, type) {
		var that = this 
		if(msg.from == that.data.yourname || msg.to == that.data.yourname) {
			console.log(msg)
			var date = new Date()
			var Hours = date.getHours(); 
            var Minutes = date.getMinutes(); 
            var Seconds = date.getSeconds(); 
            var time = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + ' ' 
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
		if(event.target.dataset.emoji && event.target.dataset.emoji != '[del]') {
			that.data.emojiList.push(event.target.dataset.emoji)
			var str = that.data.emojiList.join("")
		} else if(event.target.dataset.emoji == '[del]') {
			that.data.emojiList.pop()
			var str = that.data.emojiList.join("")
		}
		this.setData({
			userMessage: str
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

















