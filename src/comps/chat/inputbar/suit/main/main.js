let WebIM = require("../../../../../utils/WebIM")["default"];

Component({
	data: {
		inputMessage: "",
		userMessage: "",
		sendInfo: "",
		
		show: "emoji_list",
		view: "scroll_view",
	},
	method: {
		focus: function(){
			this.setData({
				show: "emoji_list",
				view: "scroll_view"
			});
		},

		cleanInput: function(){
			this.setData({
				sendInfo: this.data.userMessage
			});
		},

		bindMessage: function(e){
			this.setData({
				userMessage: e.detail.value
			});
		},

		sendMessage: function(){
			if(!this.data.userMessage.trim()) return;
			let me = this;
			let myName = wx.getStorageSync("myUsername");
			let id = WebIM.conn.getUniqueId();
			let msg = new WebIM.message("txt", id);
			msg.set({
				msg: this.data.sendInfo,
				to: this.data.yourname,
				roomType: false,
				success: function(id, serverMsgId){
					console.log("send text message success");
				}
			});
			msg.body.chatType = "singleChat";
			WebIM.conn.send(msg.body);
			if(msg){
				let value = WebIM.parseEmoji(msg.value.replace(/\n/mg, ""));
				this.data.chatMsg.push({
					info: {
						to: msg.body.to
					},
					username: this.data.myName,
					yourname: msg.body.to,
					msg: {
						type: msg.type,
						data: value
					},
					style: "self",
					time: WebIM.time(),
					mid: msg.id
				});
				// console.log(that.data.chatMsg)
				wx.setStorage({
					key: this.data.yourname + myName,
					data: this.data.chatMsg,
					success: function(){
						// console.log('success', that.data)
						me.setData({
							chatMsg: me.data.chatMsg,
							emojiList: [],
							inputMessage: ""
						});
						setTimeout(function(){
							me.setData({
								toView: me.data.chatMsg[me.data.chatMsg.length - 1].mid
							});
						}, 100);
					}
				});
				this.setData({
					userMessage: ""
				});
			}
		},
	},

	lifetimes: {
		created: function(){},
		attached: function(){},
		moved: function(){},
		detached: function(){},
		ready: function(){},
	},

	pageLifetimes: {
		// 组件所在页面的生命周期函数
		show: function(){
			this.setData({
				inputMessage: ""
			});
		},
		hide: function(){},
	},
});
