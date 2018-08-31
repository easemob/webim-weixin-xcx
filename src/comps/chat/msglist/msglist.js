let msgStorage = require("../msgstorage");
let LIST_STATUS = {
	SHORT: "scroll_view_change",
	NORMAL: "scroll_view"
};

Component({
	properties: {
		username: {
			type: Object,
			value: {},
		}
	},
	data: {
		view: LIST_STATUS.NORMAL,
		toView: "",
		chatMsg: [],
	},
	methods: {
		normalScroll(){
			this.setData({
				view: LIST_STATUS.NORMAL
			});
		},

		shortScroll(){
			this.setData({
				view: LIST_STATUS.SHORT
			});
		},

		onTap(){
			this.triggerEvent("msglistTap", null, { bubbles: true });
		},

		previewImage(event){
			var url = event.target.dataset.url;
			wx.previewImage({
				urls: [url]		// 需要预览的图片 http 链接列表
			});
		},

		renderMsg(renderableMsg, type, curChatMsg){
			this.setData({
				chatMsg: curChatMsg,
				// 跳到最后一条
				toView: curChatMsg[curChatMsg.length - 1].mid,
			});
		},
	},

	// lifetimes
	created(){},
	attached(){},
	moved(){},
	detached(){},
	ready(){
		let me = this;
		let username = this.data.username;
		let myUsername = wx.getStorageSync("myUsername");
		let sessionKey = username.your + myUsername;
		let chatMsg = wx.getStorageSync(sessionKey) || [];
		chatMsg.length && this.setData({
			chatMsg: chatMsg,
			toView: chatMsg[chatMsg.length - 1].mid,
		});
		msgStorage.on("newChatMsg", function(renderableMsg, type, curChatMsg){
			// 判断是否属于当前会话
			if(renderableMsg.info.from == username.your || renderableMsg.info.to == username.your){
				me.renderMsg(renderableMsg, type, curChatMsg);
			}
		});
	},
	// 组件所在页面的生命周期函数
	show(){},
	hide(){},
});
