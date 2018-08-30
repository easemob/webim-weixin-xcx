let WebIM = require("../../utils/WebIM")["default"];

Component({
	data: {
		username: { your: "" },
		yourname: "",
		myName: "",
		chatMsg: [],
	},

	// chat 组件 API
	method: {
		receiveMsg(msg, type){
			if(type == "location") return;

			let me = this;
			this.data.chatMsg.push({
				info: {
					to: msg.body.to
				},
				username: this.data.myName,
				yourname: msg.body.to,
				msg: {
					type: msg.type,
					data: msg.body.body.url,
					size: {
						width: msg.body.body.size.width,
						height: msg.body.body.size.height,
					}
				},
				style: "self",
				time: WebIM.time(),
				mid: msg.id
			});
			wx.setStorage({
				key: this.data.yourname + wx.getStorageSync("myUsername"),
				data: this.data.chatMsg,
				success: function(){
					me.setData({
						chatMsg: me.data.chatMsg
					});
					setTimeout(function(){
						me.setData({
							toView: me.data.chatMsg[me.data.chatMsg.length - 1].mid
						});
					}, 10);
				}
			});
		}
	},

	lifetimes: {
		created(){},
		attached(){},
		moved(){},
		detached(){},
		ready(){
			let me = this;
			let username = this.data.username;
			let myName = wx.getStorageSync("myUsername");
			let num = wx.getStorageSync(username.your + myName).length - 1;
			if(num > 0){
				setTimeout(function(){
					me.setData({
						toView: wx.getStorageSync(username.your + myName)[num].mid
					});
				}, 10);
			}
			this.setData({
				yourname: username.your,
				myName: myName,
				chatMsg: wx.getStorageSync(username.your + myName) || [],
			});
		},
	},

	pageLifetimes: {
		// 组件所在页面的生命周期函数
		show(){},
		hide(){},
	},
});
