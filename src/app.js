require("sdk/libs/strophe");
let WebIM = require("utils/WebIM")["default"];
let msgStorage = require("comps/chat/msgstorage");
let msgType = require("comps/chat/msgtype");
let disp = require("utils/broadcast");

function ack(receiveMsg){
	// 处理未读消息回执
	var bodyId = receiveMsg.id;         // 需要发送已读回执的消息id
	var ackMsg = new WebIM.message("read", WebIM.conn.getUniqueId());
	ackMsg.set({
		id: bodyId,
		to: receiveMsg.from
	});
	WebIM.conn.send(ackMsg.body);
}

function onMessageError(err){
	if(err.type === "error"){
		wx.showToast({
			title: err.errorText
		});
		return false;
	}
	return true;
}

App({
	globalData: {
		userInfo: null,
		saveFriendList: []
	},

	// getPage(pageName){
	// 	var pages = getCurrentPages();
	// 	return pages.find(function(page){
	// 		return page.__route__ == pageName;
	// 	});
	// },

	onLaunch(){
		// 调用 API 从本地缓存中获取数据
		var me = this;
		var logs = wx.getStorageSync("logs") || [];
		logs.unshift(Date.now());
		wx.setStorageSync("logs", logs);

		WebIM.conn.listen({
			onOpened(message){
				console.log("onOpened", message);
				WebIM.conn.setPresence();
			},
			onInviteMessage(message){
				console.log("onInviteMessage", message);
				wx.showModal({
					title: message.from + " 已邀你入群 " + message.roomid,
					success(){
						disp.fire("em.xmpp.invite.joingroup", message);
					},
					error(){
						disp.fire("em.xmpp.invite.joingroup", message);
					}
				});
			},
			onPresence(message){
				console.log("onPresence", message);
				switch(message.type){
				case "unsubscribe":
					// pages[0].moveFriend(message);
					break;
				// 好友邀请列表
				case "subscribe":
					if(message.status === "[resp:true]"){

					}
					else{
						// pages[0].handleFriendMsg(message);
						me.globalData.saveFriendList.push(message);
						disp.fire("em.xmpp.subscribe");
					}
					break;
				case "subscribed":
						wx.showToast({
							title: message.to + "已同意",
							duration: 1000
						});
					break;
				case "unsubscribed":
						wx.showToast({
							title: message.to + "已拒绝",
							duration: 1000
						});
					break;
				case "memberJoinPublicGroupSuccess":
						wx.showToast({
							title: message.to + "已进群",
							duration: 1000
						});
					break;
				// 好友列表
				// case "subscribed":
				// 	let newFriendList = [];
				// 	for(let i = 0; i < me.globalData.saveFriendList.length; i++){
				// 		if(me.globalData.saveFriendList[i].from != message.from){
				// 			newFriendList.push(me.globalData.saveFriendList[i]);
				// 		}
				// 	}
				// 	me.globalData.saveFriendList = newFriendList;
				// 	break;
				// 删除好友
				case "unavailable":
					disp.fire("em.xmpp.contacts.remove", message);
					break;

				// case "joinChatRoomSuccess":
				// 	wx.showToast({
				// 		title: "JoinChatRoomSuccess",
				// 	});
				// 	break;
				// case "memberJoinChatRoomSuccess":
				// 	wx.showToast({
				// 		title: "memberJoinChatRoomSuccess",
				// 	});
				// 	break;
				// case "memberLeaveChatRoomSuccess":
				// 	wx.showToast({
				// 		title: "leaveChatRoomSuccess",
				// 	});
				// 	break;

				default:
					break;
				}
			},

			onRoster(message){
				console.log("onRoster", message);
				// let pages = getCurrentPages();
				// if(pages[0]){
				// 	pages[0].onShow();
				// }
			},

			// onVideoMessage(message){
			// 	console.log("onVideoMessage: ", message);
			// 	if(message){
			// 		msgStorage.saveReceiveMsg(message, msgType.VIDEO);
			// 	}
			// },

			onAudioMessage(message){
				console.log("onAudioMessage", message);
				if(message){
					if(onMessageError(message)){
						msgStorage.saveReceiveMsg(message, msgType.AUDIO);
					}
					ack(message);
				}
			},

			// onLocationMessage(message){
			// 	console.log("Location message: ", message);
			// 	if(message){
			// 		msgStorage.saveReceiveMsg(message, msgType.LOCATION);
			// 	}
			// },

			onTextMessage(message){
				console.log("onTextMessage", message);
				if(message){
					if(onMessageError(message)){
						msgStorage.saveReceiveMsg(message, msgType.TEXT);
					}
					ack(message);
				}
			},

			onEmojiMessage(message){
				console.log("onEmojiMessage", message);
				if(message){
					if(onMessageError(message)){
						msgStorage.saveReceiveMsg(message, msgType.EMOJI);
					}
					ack(message);
				}
			},

			onPictureMessage(message){
				console.log("onPictureMessage", message);
				if(message){
					if(onMessageError(message)){
						msgStorage.saveReceiveMsg(message, msgType.IMAGE);
					}
					ack(message);
				}
			},

			// 各种异常
			onError(error){
				// 16: server-side close the websocket connection
				if(error.type == WebIM.statusCode.WEBIM_CONNCTION_DISCONNECTED){
					if(WebIM.conn.autoReconnectNumTotal < WebIM.conn.autoReconnectNumMax){
						return;
					}
					wx.showToast({
						title: "server-side close the websocket connection",
						duration: 1000
					});
					wx.redirectTo({
						url: "../login/login"
					});
					return;
				}
				// 8: offline by multi login
				if(error.type == WebIM.statusCode.WEBIM_CONNCTION_SERVER_ERROR){
					wx.showToast({
						title: "offline by multi login",
						duration: 1000
					});
					wx.redirectTo({
						url: "../login/login"
					});
				}
			},
		});
	},

	getUserInfo(cb){
		var me = this;
		if(this.globalData.userInfo){
			typeof cb == "function" && cb(this.globalData.userInfo);
		}
		else{
			// 调用登录接口
			wx.login({
				success(){
					wx.getUserInfo({
						success(res){
							me.globalData.userInfo = res.userInfo;
							typeof cb == "function" && cb(me.globalData.userInfo);
						}
					});
				}
			});
		}
	},

});
