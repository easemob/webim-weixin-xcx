let msgStorage = require("../msgstorage");
let disp = require("../../../utils/broadcast");
let LIST_STATUS = {
	SHORT: "scroll_view_change",
	NORMAL: "scroll_view"
};

let page = 0;
let Index = 0;
let curMsgMid = ''
let isFail = false
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
		clickMsg(data){
			if(data.currentTarget.dataset.msg.ext&&data.currentTarget.dataset.msg.ext.msg_extension){
				this.triggerEvent("clickMsg", data.currentTarget.dataset.msg.ext)
			}
		},
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
			let me = this
			// 手动去重 这操作没必要
			// if (curChatMsg.length > 1) {
			// 	this.data.chatMsg.map(function(elem, index) {
			// 		curChatMsg.map(function(item, i) {
			// 			if(elem.mid == item.mid){
			// 				//me.data.chatMsg.splice(index, 1)
			// 				curChatMsg.splice(i, 1)
			// 			}
			// 		})
			// 	})
			// }
			

			var historyChatMsgs = wx.getStorageSync("rendered_" + sessionKey) || [];
			// if (curChatMsg.length) {
			// 	console.log(curMsgMid.substring(curMsgMid.length - 10) , curChatMsg[0].mid.substring(curChatMsg[0].mid.length - 10))
			// }
			
			// if(curChatMsg.length && curMsgMid.substring(curMsgMid.length - 10) == curChatMsg[curChatMsg.length - 1].mid.substring(curChatMsg[0].mid.length - 10)){
			// 	//curChatMsg[curChatMsg.length - 1].msg.data[0].isSuc = true
			// 	curChatMsg[curChatMsg.length - 1].isSuc = true
			// }
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

			let chatMsg = wx.getStorageSync(sessionKey) || [];
			chatMsg.map(function(item, index) {
				curChatMsg.map(function(item2, index2) {
					if (item2.mid == item.mid) {
						chatMsg.splice(index, 1)
					}
				})
			})
			

			wx.setStorageSync(sessionKey, chatMsg);
			Index = historyChatMsgs.slice(-10).length;

			wx.pageScrollTo({
				scrollTop: 5000,
				duration: 300,
			})
			this.triggerEvent('render')
			if (isFail) {
				//this.renderFail(sessionKey)
			}
		},
		renderFail(sessionKey){
			let me = this
			let msgList = me.data.chatMsg
			msgList.map((item) =>{
				if (item.mid.substring(item.mid.length - 10) == curMsgMid.substring(curMsgMid.length - 10)) {
					item.msg.data[0].isFail = true
					item.isFail = true

					me.setData({
						chatMsg: msgList
					})
				}
			})
			if (me.curChatMsg[0].mid == curMsgMid) {
				me.curChatMsg[0].msg.data[0].isShow = false;
				me.curChatMsg[0].isShow = false
			}
			wx.setStorageSync("rendered_" + sessionKey, msgList);
			isFail = false
		},

		onFullscreenchange(e){
			disp.fire('em.message.fullscreenchange', e.detail)
		}
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
		wx.setStorageSync(sessionKey, null);
		// disp.on("em.chat.sendSuccess", function(mid){
		// 	curMsgMid = mid
		// 	let msgList = me.data.chatMsg
		// 	msgList.map((item) =>{
		// 		if (item.mid.substring(item.mid.length - 10) == mid.substring(mid.length - 10)) {

		// 			item.msg.data[0].isSuc = true
		// 			item.isSuc = true

		// 			me.setData({
		// 				chatMsg: msgList
		// 			})
		// 		}
		// 	})
		// 	if (me.curChatMsg[0].mid == curMsgMid) {
		// 		me.curChatMsg[0].msg.data[0].isShow = true
		// 		me.curChatMsg[0].isShow = true
		// 	}
		// 	wx.setStorageSync("rendered_" + sessionKey, msgList);
		// 	console.log('msgList', msgList)
			
		// })

		disp.on('em.xmpp.error.sendMsgErr', function(errMsgs) {
			// curMsgMid = err.data.mid
			isFail = true
			// return
			let msgList = me.data.chatMsg
			msgList.map((item) =>{
				for( let item2 in errMsgs){
					if (item.mid.substring(item.mid.length - 10) == item2.substring(item2.length - 10)) {
						item.msg.data[0].isFail = true
						item.isFail = true

						me.setData({
							chatMsg: msgList
						})
					}
				
				}
			})
			// if (me.curChatMsg[0].mid == curMsgMid) {
				// me.curChatMsg[0].msg.data[0].isShow = false;
				// me.curChatMsg[0].isShow = false
			// }
			wx.setStorageSync("rendered_" + sessionKey, msgList);
			// disp.fire('em.megList.refresh')
		});

		msgStorage.on("newChatMsg", function(renderableMsg, type, curChatMsg, sesskey){
			me.curChatMsg = curChatMsg;
			if(!me.__visibility__) return;
			// 判断是否属于当前会话
			if(username.groupId){
				// 群消息的 to 是 id，from 是 name
				if(renderableMsg.info.from == username.groupId || renderableMsg.info.to == username.groupId){
					if (sesskey == sessionKey) {
						me.renderMsg(renderableMsg, type, curChatMsg, sessionKey, 'newMsg');
					}
					
				}
			}
			else if(renderableMsg.info.from == username.your || renderableMsg.info.to == username.your){
				if (sesskey == sessionKey) {
					me.renderMsg(renderableMsg, type, curChatMsg, sessionKey, 'newMsg');
				}
			}

		});


	},
});
