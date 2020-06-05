
// require("sdk/libs/strophe");
let WebIM = wx.WebIM = require("utils/WebIM")["default"];
let msgStorage = require("comps/chat/msgstorage");
let msgType = require("comps/chat/msgtype");
let ToastPannel = require("./comps/toast/toast");
let disp = require("utils/broadcast");
let logout = false;

//emedia_for_miniProgram-test是沙箱环境测试版，线上环境请用emedia_for_miniProgram这个文件
const emedia = wx.emedia = require("./emedia/emedia_for_miniProgram") 

console.log('emedia', emedia)
console.log('WebIM', WebIM)

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

function calcUnReadSpot(message){
	let myName = wx.getStorageSync("myUsername");
	let members = wx.getStorageSync("member") || []; //好友
	var listGroups = wx.getStorageSync('listGroup')|| []; //群组
	let allMembers = members.concat(listGroups)
	let count = allMembers.reduce(function(result, curMember, idx){
		let chatMsgs;
		if (curMember.groupid) {
			chatMsgs = wx.getStorageSync(curMember.groupid + myName.toLowerCase()) || [];
		}else{
			chatMsgs = wx.getStorageSync(curMember.name.toLowerCase() + myName.toLowerCase()) || [];
		}
		return result + chatMsgs.length;
	}, 0);
	getApp().globalData.unReadMessageNum = count;
	disp.fire("em.xmpp.unreadspot", message);
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
		isIPX: false //是否为iphone X
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

				// service.setup({"tktId":"13H9ZH0001TE29IFLK000C7TK2","url":"wss://172.17.2.55/confr/multipeople?CONFRID=13H9ZH0001TE29IFLK000C1M3&forward=127.0.0.1&port=9092","confrId":"13H9ZH0001TE29IFLK000C1M3","password":"","type":"communication_mix","memName":"easemob-demo#chatdemoui_zdtest@easemob.com","hmac":"SSZpG1K0U6cuIl8TWWV06yXgBaQ=","timestamp":1575962109914,"rights":15}
				// )
				// service.join()
				//"{"tktId":"13H851UX8XTE10GSUIQ00C1TK2","url":"wss://rtc-turn4-hsb.easemob.com/ws?CONFRID=13H851UX8XTE10GSUIQ00C1&forward=10.29.117.29&port=9092","confrId":"13H851UX8XTE10GSUIQ00C1","password":"","type":"communication_mix","memName":"easemob-demo#chatdemoui_zdtest@easemob.com","hmac":"Ak0tITkTxIp+RFlDC/B3LKm2iMw=","timestamp":1575873756927,"rights":7}"
				// emedia.mgr.createConfr({
				// 	identityName: 'easemob-demo#chatdemoui_zdtest4@easemob.com',
				//  	identityToken: identityToken,//'YWMtLFeEbBpOEeqD-sMgAnWU5U1-S6DcShHjkNXh_7qs2vUy04pwHuER6YGUI5WOSRNCAwMAAAFu6V9A4ABPGgDCHHYPZf0jtQbrjH97smaj5nqfv0jQI3WQ2Idfa30bqg',
				//  	confrType: 11,
				// 	password: '',
				// 	success: function(data){
				// 		var ticket = JSON.parse(data.ticket)
				// 		//ticket.url = ticket.url//.replace('localhost', '172.17.2.55')
				// 		var ssss = service.setup(ticket)
				// 		console.log('ssss', ssss)
				// 		service.join()

				// 		wx.emedia.onAddStream=function(data){
				// 			console.log('onAddStream', data)
				// 			getApp().globalData.subUrl = data.rtmp
				// 		}
				// 	}
				// })

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
				// wx.showToast({
				// 	title: "网络已断开",
				// 	icon: 'none',
				// 	duration: 2000
				// });
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
				//console.log("onPresence", message);
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
					disp.fire("em.xmpp.subscribed");
					break;
				case "unsubscribed":
					// wx.showToast({
					// 	title: "已拒绝",
					// 	duration: 1000
					// });
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
				console.log(error)
				// 16: server-side close the websocket connection
				if(error.type == WebIM.statusCode.WEBIM_CONNCTION_DISCONNECTED && !logout){
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
					logout = true
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
				if (error.type == 'socket_error') {///sendMsgError
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
	// onShow(){
	// 	WebIM.conn.reconnect();
	// },

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

