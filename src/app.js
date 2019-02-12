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

function getCurrentRoute(){
	let pages = getCurrentPages();
	let currentPage = pages[pages.length - 1];
	return currentPage.route;
}

function calcUnReadSpot(){
	let myName = wx.getStorageSync("myUsername");
	let members = wx.getStorageSync("member") || [];
	let count = members.reduce(function(result, curMember, idx){
		let chatMsgs = wx.getStorageSync(curMember.name + myName) || [];
		return result + chatMsgs.length;
	}, 0);
	getApp().globalData.unReadSpot = count > 0;
	disp.fire("em.xmpp.unreadspot", count);
}

App({
	globalData: {
		unReadSpot: false,
		userInfo: null,
		saveFriendList: []
	},

	conn: {
		closed: false,
		curOpenOpt: {},
		open(opt){
			this.curOpenOpt = opt;
			WebIM.conn.open(opt);
			this.closed = false;
		},
		reopen(){
			if(this.closed){
				this.open(this.curOpenOpt);
			}
		},
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

		// 
		disp.on("em.main.ready", function(){
			calcUnReadSpot();
		});
		disp.on("em.chatroom.leave", function(){
			calcUnReadSpot();
		});
		disp.on("em.chat.session.remove", function(){
			calcUnReadSpot();
		});
		disp.on('em.chat.audio.fileLoaded', function(){
			calcUnReadSpot()
		});

		// 
		WebIM.conn.listen({
			onOpened(message){
				console.log("onOpened", message);
				WebIM.conn.setPresence();
				if(getCurrentRoute() == "pages/login/login"){
					me.onLoginSuccess(wx.getStorageSync("myUsername"));
				}
			},
			onClosed(){
				me.conn.closed = true;
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
						for (let i = 0; i < me.globalData.saveFriendList.length; i ++) {
					      	if(me.globalData.saveFriendList[i].from === message.from){
					      		me.globalData.saveFriendList[i] = message
					      		disp.fire("em.xmpp.subscribe");
					      		return;
					 		}
					    }
						me.globalData.saveFriendList.push(message);
						disp.fire("em.xmpp.subscribe");
					}
					break;
				case "subscribed":
					wx.showToast({
						title: "添加成功",
						duration: 1000
					});
					break;
				case "unsubscribed":
					// wx.showToast({
					// 	title: "已拒绝",
					// 	duration: 1000
					// });
					break;
				case "memberJoinPublicGroupSuccess":
					wx.showToast({
						title: "已进群",
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
					//calcUnReadSpot();
					ack(message);
				}
			},
			
			onCmdMessage(message){
				console.log("onCmdMessage", message);
				if(message){
					if(onMessageError(message)){
						msgStorage.saveReceiveMsg(message, msgType.CMD);
					}
					calcUnReadSpot();
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
					calcUnReadSpot();
					ack(message);
				}
			},

			onEmojiMessage(message){
				console.log("onEmojiMessage", message);
				if(message){
					if(onMessageError(message)){
						msgStorage.saveReceiveMsg(message, msgType.EMOJI);
					}
					calcUnReadSpot();
					ack(message);
				}
			},

			onPictureMessage(message){
				console.log("onPictureMessage", message);
				if(message){
					if(onMessageError(message)){
						msgStorage.saveReceiveMsg(message, msgType.IMAGE);
					}
					calcUnReadSpot();
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
				if(error.type ==  WebIM.statusCode.WEBIM_CONNCTION_OPEN_ERROR){
					wx.showModal({
						title: "用户名或密码错误",
						confirmText: "OK",
						showCancel: false
					});
				}
			},
		});
	},
	onShow(){
		this.conn.reopen();
	},

	onLoginSuccess: function(myName){
		wx.showToast({
			title: "登录成功",
			icon: "success",
			duration: 1000
		});
		setTimeout(function(){
			wx.redirectTo({
				url: "../main/main?myName=" + myName
			});
		}, 1000);
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
