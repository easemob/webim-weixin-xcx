
let WebIM = wx.WebIM = require("utils/WebIM")["default"];
let msgStorage = require("comps/chat/msgstorage");
let msgType = require("comps/chat/msgtype");
let ToastPannel = require("./comps/toast/toast");
let disp = require("utils/broadcast");
let logout = false;

const AgoraMiniappSDK = require('./emedia/Agora_Miniapp_SDK_for_WeChat');
// const AgoraMiniappSDK = require('./emedia/Agora');
wx.AgoraMiniappSDK = AgoraMiniappSDK
console.log('WebIM', WebIM)
console.log('wx.AgoraMiniappSDK', wx.AgoraMiniappSDK)

let emediaState = require('comps/chat/multiEmedia/emediaState')

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
	if (pages.length > 0) {
		let currentPage = pages[pages.length - 1];
		return currentPage.route;
	}
	return '/'
}

// 不包含陌生人版本
// function calcUnReadSpot(message){
// 	let myName = wx.getStorageSync("myUsername");
// 	let members = wx.getStorageSync("member") || []; //好友
// 	var listGroups = wx.getStorageSync('listGroup')|| []; //群组
// 	let allMembers = members.concat(listGroups)
// 	let count = allMembers.reduce(function(result, curMember, idx){
// 		let chatMsgs;
// 		if (curMember.groupid) {
// 			chatMsgs = wx.getStorageSync(curMember.groupid + myName.toLowerCase()) || [];
// 		}else{
// 			chatMsgs = wx.getStorageSync(curMember.name.toLowerCase() + myName.toLowerCase()) || [];
// 		}
// 		return result + chatMsgs.length;
// 	}, 0);
// 	getApp().globalData.unReadMessageNum = count;
// 	disp.fire("em.xmpp.unreadspot", message);
// }
// 包含陌生人版本
function calcUnReadSpot(message){
	let myName = wx.getStorageSync("myUsername");
	wx.getStorageInfo({
		success: function(res){
			let storageKeys = res.keys
			let newChatMsgKeys = [];
			let historyChatMsgKeys = [];
			storageKeys.forEach((item) => {
				if (item.indexOf(myName) > -1 && item.indexOf('rendered_') == -1) {
					newChatMsgKeys.push(item)
				}
			})
			let count = newChatMsgKeys.reduce(function(result, curMember, idx){
				let chatMsgs;
				chatMsgs = wx.getStorageSync(curMember) || [];
				return result + chatMsgs.length;
			}, 0)

			getApp().globalData.unReadMessageNum = count;
			disp.fire("em.xmpp.unreadspot", message);
		}
	})
}

function saveGroups(){
	var me = this;
	return WebIM.conn.getGroup({
		limit: 50,
		success: function(res){
			wx.setStorage({
				key: "listGroup",
				data: res.data
			});
		},
		error: function(err){
			console.log(err)
		}
	});
}

App({
	ToastPannel,
	globalData: {
		unReadMessageNum: 0,
		userInfo: null,
		saveFriendList: [],
		saveGroupInvitedList: [],
		isIPX: false, //是否为iphone X
		channel: ''
	},

	conn: {
		closed: false,
		curOpenOpt: {},
		open(opt){
			wx.showLoading({
			  	title: '正在初始化客户端...',
			  	mask: true
			})
			this.curOpenOpt = opt;
			WebIM.conn.open(opt);
			this.closed = false;
		},
		reopen(){
			if(this.closed){
				//this.open(this.curOpenOpt);
				WebIM.conn.open(this.curOpenOpt);
				this.closed = false;
			}
		}
	},

	// getPage(pageName){
	// 	var pages = getCurrentPages();
	// 	return pages.find(function(page){
	// 		return page.__route__ == pageName;
	// 	});
	// },

	onLaunch(){
		// 调用 API 从本地缓存中获取数据
		wx.setInnerAudioOption({obeyMuteSwitch: false})
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

		disp.on('em.main.deleteFriend', function(){
			calcUnReadSpot()
		});
		disp.on('em.chat.audio.fileLoaded', function(){
			calcUnReadSpot()
		});

		// 音视频邀请
		disp.on('emedia.confirmRing', function(){
			
		});
		
		// 
		WebIM.conn.listen({
			onOpened(message){
				console.log('im登录成功')
				// WebIM.conn.setPresence();
				if(getCurrentRoute() == "pages/login/login" || getCurrentRoute() == "pages/login_token/login_token"){
					me.onLoginSuccess(wx.getStorageSync("myUsername").toLowerCase());
				}

				let identityToken = WebIM.conn.context.accessToken
				let identityName = WebIM.conn.context.jid
			},
			onReconnect(){
				wx.showToast({
					title: "重连中...",
					duration: 2000
				});
			},
			onSocketConnected(){
				wx.showToast({
					title: "socket连接成功",
					duration: 2000
				});
			},
			onClosed(){
				wx.showToast({
					title: "网络已断开",
					icon: 'none',
					duration: 2000
				});
				wx.redirectTo({
						url: "../login/login"
					});
				me.conn.closed = true;
				WebIM.conn.close();
			},
			onInviteMessage(message){
				me.globalData.saveGroupInvitedList.push(message);
				disp.fire("em.xmpp.invite.joingroup", message);
				// wx.showModal({
				// 	title: message.from + " 已邀你入群 " + message.roomid,
				// 	success(){
				// 		disp.fire("em.xmpp.invite.joingroup", message);
				// 	},
				// 	error(){
				// 		disp.fire("em.xmpp.invite.joingroup", message);
				// 	}
				// });
			},
			onReadMessage(message){
				//console.log('已读', message)
			},
			onPresence(message){
				console.log("onPresence", message);
				switch(message.type){
				case "unsubscribe":
					console.log('unsubscribe')
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
					disp.fire("em.xmpp.subscribed");
					break;
				case "unsubscribed":
					// 延时1.5秒， 防止刚登录时和登录的toast重合
					setTimeout(() => {
						wx.showToast({
							title: message.from + "已退订",
							duration: 2000
						});
					}, 1500)
					
					disp.fire("em.xmpp.unsubscribed");
					break;
				case "direct_joined":
					saveGroups();
					wx.showToast({
						title: "已进群",
						duration: 1000
					});
					break;
				case "memberJoinPublicGroupSuccess":
					saveGroups();
					wx.showToast({
						title: "已进群",
						duration: 1000
					});
					break;
				case 'invite':
					let info = message.from + '邀请你加入群组'
					wx.showModal({
					  title: '提示',
					  content: info,
					  success (res) {
					    if (res.confirm) {
					      console.log('用户点击确定')
					      WebIM.conn.agreeInviteIntoGroup({
					      	invitee: WebIM.conn.context.userId,
							groupId: message.gid,
							success: () => {
								saveGroups();
								console.log('加入成功')
							}
					      })
					    } else if (res.cancel) {
					      console.log('用户点击取消')
					      WebIM.conn.rejectInviteIntoGroup({
					      	invitee: WebIM.conn.context.userId,
							groupId: message.gid
					      })
					    }
					  }
					})
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
					disp.fire("em.xmpp.contacts.remove");
					disp.fire("em.xmpp.group.leaveGroup", message);
					break;

				case 'deleteGroupChat':
					disp.fire("em.xmpp.invite.deleteGroup", message);
					break;

				case "leaveGroup": 
					disp.fire("em.xmpp.group.leaveGroup", message);
					break;

				case "removedFromGroup": 
					disp.fire("em.xmpp.group.leaveGroup", message);
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
				// let pages = getCurrentPages();
				// if(pages[0]){
				// 	pages[0].onShow();
				// }
			},

			onVideoMessage(message){
				console.log("onVideoMessage: ", message);
				if(message){
					msgStorage.saveReceiveMsg(message, msgType.VIDEO);
				}
				calcUnReadSpot(message);
				ack(message);
			},

			onAudioMessage(message){
				console.log("onAudioMessage", message);
				if(message){
					if(onMessageError(message)){
						msgStorage.saveReceiveMsg(message, msgType.AUDIO);
					}
					calcUnReadSpot(message);
					ack(message);
				}
			},
			
			onCmdMessage(message){
				console.log("onCmdMessage", message);
				if(message){
					emediaState.onMessage(message)

					if(onMessageError(message)){
						msgStorage.saveReceiveMsg(message, msgType.CMD);
					}
					calcUnReadSpot(message);
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
					calcUnReadSpot(message);
					ack(message);
					if (message.ext.action == "invite") {
						emediaState.onMessage(message)
					}
					if(message.ext.msg_extension){
						let msgExtension = JSON.parse(message.ext.msg_extension)
						let conferenceId = message.ext.conferenceId
						let password = message.ext.password
						disp.fire("em.xmpp.videoCall", {
							msgExtension: msgExtension,
							conferenceId: conferenceId,
							password: password
						});
					}
				}
			},

			onEmojiMessage(message){
				console.log("onEmojiMessage", message);
				if(message){
					if(onMessageError(message)){
						msgStorage.saveReceiveMsg(message, msgType.EMOJI);
					}
					calcUnReadSpot(message);
					ack(message);
				}
			},

			onPictureMessage(message){
				console.log("onPictureMessage", message);
				if(message){
					if(onMessageError(message)){
						msgStorage.saveReceiveMsg(message, msgType.IMAGE);
					}
					calcUnReadSpot(message);
					ack(message);
				}
			},

			onFileMessage(message){
				console.log('onFileMessage', message);
				if (message) {
					if(onMessageError(message)){
						msgStorage.saveReceiveMsg(message, msgType.FILE);
					}
					calcUnReadSpot(message);
					ack(message);
				}
			},

			// 各种异常
			onError(error){
				console.log('error', error)

				if (error.type == 40) { //send msg fail
					disp.fire("em.xmpp.error.sendMsgErr", error.failMsgs);
				}

				// 16: server-side close the websocket connection
				if(error.type == WebIM.statusCode.WEBIM_CONNCTION_DISCONNECTED && !logout){
					if(WebIM.conn.autoReconnectNumTotal >= WebIM.conn.autoReconnectNumMax){
						wx.showToast({
							title: "server-side close the websocket connection",
							duration: 1000
						});
						WebIM.conn.close();
						wx.redirectTo({
							url: "../login/login"
						});
						logout = true
					}
					return
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
					wx.hideLoading()
					disp.fire("em.xmpp.error.passwordErr");
					// wx.showModal({
					// 	title: "用户名或密码错误",
					// 	confirmText: "OK",
					// 	showCancel: false
					// });
				}
				if (error.type == WebIM.statusCode.WEBIM_CONNCTION_AUTH_ERROR) {
					wx.hideLoading()
					disp.fire("em.xmpp.error.tokenErr");
				}
				if (error.type == 16) {///sendMsgError
					// https://developers.weixin.qq.com/community/develop/doc/00084a400202787b54f8c9e6357800
					// 因为上面的原因 这里不要一直提示了
					return 
					console.log('socket_errorsocket_error', error)
					wx.showToast({
						title: "网络已断开",
						icon: 'none',
						duration: 2000
					});
					disp.fire("em.xmpp.error.sendMsgErr", error);
				}
			},
		});
		this.checkIsIPhoneX();
		
	},
	onShow(){
		// 从搜索页面进的时候退出后再回来会回到首页，此时并没有调用退出，导致登录不上
		// 判断当前是登录状态直接跳转到chat页面
		const pages = getCurrentPages();
		const currentPage = pages[pages.length - 1];
		// 选择图片或者拍照也会触发onShow，所以忽略聊天页面
		if (WebIM.conn.isOpened() && currentPage.route != "pages/chatroom/chatroom" && currentPage.route != "pages/groupChatRoom/groupChatRoom") {
			let myName = wx.getStorageSync("myUsername");
			wx.redirectTo({
				url: "../chat/chat?myName=" + myName
			});
		}
	},

	// onHide(){

	// 	WebIM.conn.close();
	// 	WebIM.conn.stopHeartBeat();
	// },

	// onUnload(){
	// 	WebIM.conn.close();
	// 	WebIM.conn.stopHeartBeat();
	// 	wx.redirectTo({
	// 		url: "../login/login?myName=" + myName
	// 	});
	// },

	onLoginSuccess: function(myName){
		wx.hideLoading()

		wx.redirectTo({
			url: "../chat/chat?myName=" + myName
		});

		// wx.redirectTo({
		// 	url: "../emediaInvite/emediaInvite?myName=" + myName
		// });
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
	checkIsIPhoneX: function() {
	    const me = this
	    wx.getSystemInfo({
	      	success: function (res) {
		        // 根据 model 进行判断
		        if (res.model.search('iPhone X') != -1) {
		          	me.globalData.isIPX = true
		        }
	      	}
	    })
	},

});

