let msgStorage = require("../msgstorage");
let LIST_STATUS = {
	SHORT: "scroll_view_change",
	NORMAL: "scroll_view"
};

let page = 0;
let Index = 0;

Component({
	properties: {
		username: {
			type: Object,
			value: {},
		},
	},
	data: {
		view: LIST_STATUS.NORMAL,
		toView: "",
		chatMsg: [],
		__visibility__: false,
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

		getHistoryMsg(){
			let me = this
			let username = this.data.username;
			let myUsername = wx.getStorageSync("myUsername");
			let sessionKey = username.groupId ? username.groupId + myUsername : username.your + myUsername;
			let historyChatMsgs = wx.getStorageSync("rendered_" + sessionKey) || [];

			if (Index < historyChatMsgs.length) {
				let timesMsgList = historyChatMsgs.slice(-Index-10, -Index)

				this.setData({
					chatMsg: timesMsgList.concat(me.data.chatMsg),
					toView: timesMsgList[timesMsgList.length - 1].mid,
				});
				Index += timesMsgList.length;
				if (timesMsgList.length == 10) {
					page ++
				}
				wx.stopPullDownRefresh()
			}
		},

		renderMsg(renderableMsg, type, curChatMsg, sessionKey, isnew){
			var historyChatMsgs = wx.getStorageSync("rendered_" + sessionKey) || [];
			historyChatMsgs = historyChatMsgs.concat(curChatMsg);

			//console.log('当前历史',renderableMsg)
			//console.log('历史消息', historyChatMsgs)
			if(!historyChatMsgs.length) return;
			if (isnew == 'newMsg') {
				this.setData({
					chatMsg: this.data.chatMsg.concat(curChatMsg),
					// 跳到最后一条
					toView: historyChatMsgs[historyChatMsgs.length - 1].mid,
				});
			}else{
				this.setData({
					chatMsg: historyChatMsgs.slice(-10),
					// 跳到最后一条
					toView: historyChatMsgs[historyChatMsgs.length - 1].mid,
				});
			}
			

			wx.setStorageSync("rendered_" + sessionKey, historyChatMsgs);
			wx.setStorageSync(sessionKey, null);
			Index = historyChatMsgs.slice(-10).length;
			wx.pageScrollTo({
			  	scrollTop: 9999,
			})
		},
	},

	// lifetimes
	created(){
	},
	attached(){
		this.__visibility__ = true;
		page = 0;
		Index = 0;
	},
	moved(){},
	detached(){
		this.__visibility__ = false;
	},
	ready(event){
		let me = this;
		if (getApp().globalData.isIPX) {
			this.setData({
				isIPX: true
			})
		}
		let username = this.data.username;
		let myUsername = wx.getStorageSync("myUsername");

		let sessionKey = username.groupId
			? username.groupId + myUsername
			: username.your + myUsername;

		let chatMsg = wx.getStorageSync(sessionKey) || [];

		this.renderMsg(null, null, chatMsg, sessionKey);

		msgStorage.on("newChatMsg", function(renderableMsg, type, curChatMsg){
			if(!me.__visibility__) return;
			// 判断是否属于当前会话
			if(username.groupId){
				// 群消息的 to 是 id，from 是 name
				if(renderableMsg.info.from == username.groupId || renderableMsg.info.to == username.groupId){
					me.renderMsg(renderableMsg, type, curChatMsg, sessionKey, 'newMsg');
				}
			}
			else if(renderableMsg.info.from == username.your || renderableMsg.info.to == username.your){
				me.renderMsg(renderableMsg, type, curChatMsg, sessionKey, 'newMsg');
			}

		});


	},
});
