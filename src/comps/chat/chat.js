let msgStorage = require("msgstorage");
let msgType = require("msgtype");
let WebIM = require("../../utils/WebIM")["default"];
let disp = require("../../utils/broadcast");
let emediaState = require("./multiEmedia/emediaState");
Component({
	properties: {
		username: {
			type: Object,
			value: {},
		},
		chatType: {
			type: String,
			value: msgType.chatType.SINGLE_CHAT,
		},
	},
	data: {
		__comps__: {
			msglist: null,
			inputbar: null,
			audio: null,
		},
		pubUrl: '',
		subUrl: '',
		showEmedia: false,
		showmultiEmedia: false,
		showSingleEmedia: false,
		showEmediaInvite: false,
		action: null,
		emediaAction: null,
		multiEmediaVisible: 'block',
		inputbarVisible: 'block',
		confrId: '',
		groupId: '',
		singleEmediaType: 1,
	},
	methods: {
		toggleRecordModal(){
			this.data.__comps__.audio.toggleRecordModal();
		},

		normalScroll(){
			this.data.__comps__.msglist.normalScroll();
			this.data.__comps__.inputbar.cancelEmoji();
		},

		shortScroll(){
			// this.setData({
			// 	height: 50%
			// })
			this.data.__comps__.msglist.shortScroll();
		},

		saveSendMsg(evt){
			msgStorage.saveMsg(evt.detail.msg, evt.detail.type);
			this.data.__comps__.inputbar.cancelEmoji();
		},

		getMore(){
			this.selectComponent('#chat-msglist').getHistoryMsg()
		},

		callVideo(callType, type){
	        if (emediaState.callStatus > 0) {
	            console.log('正在通话中')
	        }
	        const value = '邀请您进行视频通话'
	        const callId = wx.WebIM.conn.getUniqueId().toString();
	        const channelName = Math.uuid(8)
	        let username = this.data.username.your;

	        if (callType === 'contact') {
	            this.sendInviteMsg([username], channelName, callId, type)
	            emediaState.setConf({
	            	channel: channelName,
			    	token: '',
			    	type: type,
			    	callId: callId,
			    	callerDevId: wx.WebIM.conn.context.jid.clientResource,
			    	calleeDevId: null,
			    	confrName: '',
			    	callerIMName: this.data.username.myName,
			    	calleeIMName: username
	            })
	        }else if (selectTab === 'group'){
	            this.props.showInviteModal()
	            this.props.setGid(selectItem)
	            // this.props.updateConfrInfo(selectItem, false, false)
	        }

	        const inviteStatus = 1
	        emediaState.callStatus = inviteStatus

	        // rtc.timer = setTimeout(() => {
	        //     if (selectTab === 'contact') {
	        //         this.props.cancelCall(username)
	        //         this.props.hangup()
	        //     }else{
	        //         // 多人不做超时
	        //     }
	        // }, 30000)
	    },
	    // 点击发起视频的回调
		onMakeVideoCall(evt){
			console.log('evt --- ', evt)
			if (evt.detail == "group") {
				this.setData({
					showEmediaInvite: true,
					inputbarVisible: 'none',
					action: 'create'
					//showEmedia: true
				})
			}else{
				this.callVideo('contact', 1)
				this.setData({
					showSingleEmedia: true,
					inputbarVisible: 'none'
				})
			}
		},

		// 群组发起视频邀请的回调
		onStartConfr(data){
			console.log('发起邀请的回调', data.detail)
			const channel = Math.uuid(8)
			let callId = WebIM.conn.getUniqueId().toString();
			let username = this.data.username.your;
			getApp().globalData.channel = channel
			
			emediaState.setConf('callId', callId)
			// if(data.detail.action == 'invite'){
			this.sendInviteMsg(data.detail.confrMember, channel, callId, 2)
			// }

			emediaState.setConf({
            	channel: channel,
		    	token: '',
		    	type: 2,
		    	callId: callId,
		    	callerDevId: wx.WebIM.conn.context.jid.clientResource,
		    	calleeDevId: null,
		    	confrName: '',
		    	callerIMName: wx.WebIM.conn.context.userId,
		    	calleeIMName: username
            })

			this.setData({
				showEmediaInvite: false,
				showmultiEmedia: true,
				multiEmediaVisible: 'block',
				inputbarVisible: 'none',
				confrMember: data.detail.confrMember,
				emediaAction:{
					action: 'create'
				}
			})
		},

		joinConf(data){
			console.log('data ---', data)
			console.log('emediaState', emediaState)
			if(emediaState.confr.type == 1 || emediaState.confr.type == 0){
				this.setData({
					showSingleEmedia: true,
					inputbarVisible: 'none',
					emediaAction:{
						action: 'join'
					}
				})
			}else {
				this.setData({
					showEmediaInvite: false,
					showmultiEmedia: true,
					multiEmediaVisible: 'block',
					inputbarVisible: 'none',
					confrMember: 'confrMember',
					emediaAction:{
						action: 'join'
					}
				})
			}
		},

		onGoBack(){
			this.setData({
				showEmediaInvite: false,
				showmultiEmedia: true,
				multiEmediaVisible: 'block',
				inputbarVisible: 'none',
				confrMember: []
			})
		},

		onInviteMember(e){
			let username = this.data.username;
			if(!this.data.username.groupId){
				username.groupId = e.detail
			}
			
			this.setData({
				action: 'invite',
				showEmediaInvite: true,
				inputbarVisible: 'none',
				//showmultiEmedia: false
				multiEmediaVisible: 'none',
				username
			})
		},

		onMakeAudioCall(){
			this.callVideo('contact', 0)
			this.setData({
				showSingleEmedia: true,
				inputbarVisible: 'none',
				singleEmediaType: 0,
				emediaAction:{
					action: 'create'
				}
			})
		},

		onCreateConfrSuccess(data){
			console.log('创建会议回调', data)
			this.setData({
				confrId: data.detail.confrId
			})
			const channel = Math.uuid(8)
			getApp().globalData.channel = channel
			getApp().globalData.confrId = data.detail.confrId
			debugger
   			this.sendInviteMsg(this.data.confrMember, channel, data)
		},

		sendInviteMsg(members, channel, callId, type){
			console.log("%c members","background: green")
			console.log(members)
			members&&members.forEach((value) => {
				let id = wx.WebIM.conn.getUniqueId();
				let msg = new wx.WebIM.message('txt', id);
				msg.set({
					msg: wx.WebIM.conn.context.userId + ' invite you to video call',
					from: wx.WebIM.conn.context.userId,
					to: value,
					chatType: 'singleChat',
					ext: {
						action: 'invite',
	                    channelName: channel,
	                    type: type, //0为1v1音频，1为1v1视频，2为多人通话
	                    callerDevId: wx.WebIM.conn.context.jid.clientResource, // 主叫方设备Id
	                    callId: callId, // 随机uuid，每次呼叫都不同，代表一次呼叫
	                    ts: Date.now(),
	                    msgType: 'rtcCallWithAgora'
					},
					success(id, serverMsgId){
						console.log('发送邀请消息成功 to: '+value)
					},
					fail(id, serverMsgId){
						console.log('发送邀请消息失败了')
					}
				});
				// if(this.data.chatType == msgType.chatType.CHAT_ROOM){
				// 	msg.setGroup("groupchat");
				// }
				console.log('发送邀请')
				wx.WebIM.conn.send(msg.body);
			})
		},

		onClickInviteMsg(data){
			console.log('收到邀请消息')
			console.log(data)
			emediaState.answerCall('accept',{
				currentCallId: data.detail.ext.callId,
				callerDevId: data.detail.ext.callerDevId,
				to: data.detail.info.from 
			})
			// let confrId = data.detail.conferenceId
			// let msg_extension = typeof(data.detail.msg_extension) == 'string'?JSON.parse(data.detail.msg_extension):data.detail.msg_extension
			// let password = data.detail.password || ''
			// this.setData({
			// 	emediaAction: {
			// 		action: 'join',
			// 		confrId: confrId,
			// 		password: password,
			// 		roomName: data.detail.roomName || ''
			// 	},
			// 	showEmediaInvite: false,
			// 	showmultiEmedia: true,
			// 	inputbarVisible: 'none',
			// 	groupId: msg_extension.group_id
			// 	// username: {
			// 	// 	groupId: msg_extension.group_id
			// 	// }
			// })

			this.setData({
				showmultiEmedia: true,
				emediaAction: {
					action: 'join',
					...data.detail.ext
				}
			})
		},
		onHangup(){
			this.setData({
				showEmediaInvite: false,
				showmultiEmedia: false,
				showSingleEmedia: false,
				inputbarVisible: 'block'
			})
			getApp().globalData.confrId = ''
		},
		onRender(){
			wx.pageScrollTo({
				scrollTop: 5000,
				duration: 300,
				success: function(){console.log('滚动成功')},
				fail: function(){console.log('滚动失败')}
			})
		}
  	},

	// lifetimes
	created(){},
	attached(){},
	ready(){
		console.log('this data >> ',this.data)
		this.data.__comps__.inputbar = this.selectComponent("#chat-inputbar");
		this.data.__comps__.msglist = this.selectComponent("#chat-msglist");
		this.data.__comps__.audio = this.selectComponent("#chat-suit-audio");

		disp.on('em.message.fullscreenchange', (detail) => {
			if (detail.fullscreen) {
				this.setData({
					inputbarVisible: 'none'
				})
			}else{
				this.setData({
					inputbarVisible: 'block'
				})
			}
		})
	},
	moved(){},
	detached(){
	},
});
