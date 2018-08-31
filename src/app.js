require("sdk/libs/strophe");
let WebIM = require("utils/WebIM")["default"];
let msgStorage = require("comps/chat/msgstorage");
let msgType = require("comps/chat/msgtype");

App({
	globalData: {
		userInfo: null,
	},

	// getPage: function(pageName){
	// 	var pages = getCurrentPages();
	// 	return pages.find(function(page){
	// 		return page.__route__ == pageName;
	// 	});
	// },

	onLaunch: function(){
		// 调用API从本地缓存中获取数据
		var that = this;
		var logs = wx.getStorageSync("logs") || [];
		logs.unshift(Date.now());
		wx.setStorageSync("logs", logs);

		WebIM.conn.listen({
			onOpened: function(message){
				WebIM.conn.setPresence();
			},
			onPresence: function(message){
				switch(message.type){
				case "unsubscribe":
					pages[0].moveFriend(message);
					break;
				case "subscribe":
					if(message.status === "[resp:true]"){

					}
					else{
						pages[0].handleFriendMsg(message);
					}
					break;
				case "joinChatRoomSuccess":
					console.log("Message: ", message);
					wx.showToast({
						title: "JoinChatRoomSuccess",
					});
					break;
				case "memberJoinChatRoomSuccess":
					console.log("memberMessage: ", message);
					wx.showToast({
						title: "memberJoinChatRoomSuccess",
					});
					break;
				case "memberLeaveChatRoomSuccess":
					console.log("LeaveChatRoom");
					wx.showToast({
						title: "leaveChatRoomSuccess",
					});
					break;
				default:
					break;
				}
			},

			onRoster: function(message){
				var pages = getCurrentPages();
				if(pages[0]){
					pages[0].onShow();
				}
			},

			// onVideoMessage: function(message){
			// 	console.log("onVideoMessage: ", message);
			// 	if(message){
			// 		msgStorage.saveReceiveMsg(message, msgType.VIDEO);
			// 	}
			// },

			onAudioMessage: function(message){
				console.log("onAudioMessage", message);
				if(message){
					msgStorage.saveReceiveMsg(message, msgType.AUDIO);
				}
			},

			// onLocationMessage: function(message){
			// 	console.log("Location message: ", message);
			// 	if(message){
			// 		msgStorage.saveReceiveMsg(message, msgType.LOCATION);
			// 	}
			// },

			onTextMessage: function(message){
				console.log("onTextMessage", message);
				if(message){
					msgStorage.saveReceiveMsg(message, msgType.TEXT);
				}
			},

			onEmojiMessage: function(message){
				console.log("onEmojiMessage", message);
				if(message){
					msgStorage.saveReceiveMsg(message, msgType.EMOJI);
				}
			},

			onPictureMessage: function(message){
				console.log("onPictureMessage", message);
				if(message){
					msgStorage.saveReceiveMsg(message, msgType.IMAGE);
				}
			},

			// 各种异常
			onError: function(error){
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

	getUserInfo: function(cb){
		var me = this;
		if(this.globalData.userInfo){
			typeof cb == "function" && cb(this.globalData.userInfo);
		}
		else{
			// 调用登录接口
			wx.login({
				success: function(){
					wx.getUserInfo({
						success: function(res){
							me.globalData.userInfo = res.userInfo;
							typeof cb == "function" && cb(me.globalData.userInfo);
						}
					});
				}
			});
		}
	},

});
