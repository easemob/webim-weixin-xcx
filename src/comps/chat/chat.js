let msgStorage = require("msgstorage");
let msgType = require("msgtype");
let WebIM = require("../../utils/WebIM")["default"];
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
		showEmediaInvite: false,
		action: null,
		emediaAction: null,
		multiEmediaVisible: 'block',
		inputbarVisible: 'block',
		confrId: '',
		groupId: ''
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
			this.data.__comps__.msglist.shortScroll();
		},

		saveSendMsg(evt){
			msgStorage.saveMsg(evt.detail.msg, evt.detail.type);
			this.data.__comps__.inputbar.cancelEmoji();
		},

		getMore(){
			this.selectComponent('#chat-msglist').getHistoryMsg()
		},

		onMakeVideoCall(){
			this.setData({
				showEmediaInvite: true,
				inputbarVisible: 'none',
				action: 'create'
				//showEmedia: true
			})
		},

		onStartConfr(data){
			console.log('发起邀请的回调', data.detail)
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
			if(data.detail.action == 'invite'){
				this.sendInviteMsg(data.detail.confrMember, getApp().globalData.confrId)
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
			this.setData({
				showEmediaInvite: true,
				showmultiEmedia: false,
				inputbarVisible: 'none'
			})
		},

		onCreateConfrSuccess(data){
			console.log('创建会议回调', data)
			this.setData({
				confrId: data.detail.confrId
			})
			getApp().globalData.confrId = data.detail.confrId
   			this.sendInviteMsg(this.data.confrMember, data.detail.confrId, data)
		},

		sendInviteMsg(members, confrId, data){
			console.log("%c members","background: green")
			console.log(members)
			members&&members.forEach((value) => {
				let id = WebIM.conn.getUniqueId();
				let msg = new WebIM.message('txt', id);

				msg.set({
					msg: wx.WebIM.conn.context.userId + ' invite you to video call',
					from: wx.WebIM.conn.context.userId,
					to: value,
					roomType: false,
					chatType: 'chat',
					ext: {
						msg_extension: JSON.stringify({
							inviter: wx.WebIM.conn.context.userId,
							group_id: this.data.username.groupId
						}),
						roomName: data&&data.detail.roomName || '',
						password: data&&data.detail.password || '',
						conferenceId: confrId
					},
					success(id, serverMsgId){
						console.log('发送邀请消息成功 to: '+value)
						//disp.fire('em.chat.sendSuccess', id, me.data.userMessage);
					},
					fail(id, serverMsgId){
						console.log('发送邀请消息失败了')
					}
				});
				// if(this.data.chatType == msgType.chatType.CHAT_ROOM){
				// 	msg.setGroup("groupchat");
				// }
				console.log('发送邀请')
				WebIM.conn.send(msg.body);

			})
		},

		onClickInviteMsg(data){
			console.log('收到邀请消息')
			console.log(data)
			let confrId = data.detail.conferenceId
			let msg_extension = typeof(data.detail.msg_extension) == 'string'?JSON.parse(data.detail.msg_extension):data.detail.msg_extension
			let password = data.detail.password || ''
			this.setData({
				emediaAction: {
					action: 'join',
					confrId: confrId,
					password: password,
					roomName: data.detail.roomName || ''
				},
				showEmediaInvite: false,
				showmultiEmedia: true,
				inputbarVisible: 'none',
				groupId: msg_extension.group_id
				// username: {
				// 	groupId: msg_extension.group_id
				// }
			})
		},
		onHangup(){
			this.setData({
				showEmediaInvite: false,
				showmultiEmedia: false,
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
	},
	moved(){},
	detached(){
	},

});
