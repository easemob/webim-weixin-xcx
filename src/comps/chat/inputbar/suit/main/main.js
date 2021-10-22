let WebIM = require("../../../../../utils/WebIM")["default"];
let msgType = require("../../../msgtype");
let disp = require("../../../../../utils/broadcast");

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
		inputMessage: "",		// render input 的值
		userMessage: "",		// input 的实时值
	},

	methods: {
		focus(){
			this.triggerEvent("inputFocused", null, { bubbles: true });
		},

		blur(){
			this.triggerEvent("inputBlured", null, { bubbles: true });
		},

		isGroupChat(){
			return this.data.chatType == msgType.chatType.CHAT_ROOM;
		},

		getSendToParam(){
			return this.isGroupChat() ? this.data.username.groupId : this.data.username.your;
		},

		// bindinput 不能打冒号！
		bindMessage(e){
			this.setData({
				userMessage: e.detail.value
			});
		},

		emojiAction(emoji){
			var str;
			var msglen = this.data.userMessage.length - 1;
			if(emoji && emoji != "[del]"){
				str = this.data.userMessage + emoji;
			}
			else if(emoji == "[del]"){
				let start = this.data.userMessage.lastIndexOf("[");
				let end = this.data.userMessage.lastIndexOf("]");
				let len = end - start;
				if(end != -1 && end == msglen && len >= 3 && len <= 4){
					str = this.data.userMessage.slice(0, start);
				}
				else{
					str = this.data.userMessage.slice(0, msglen);
				}
			}
			this.setData({
				userMessage: str,
				inputMessage: str
			});
		},

		sendMessage(){
			let me = this;

			String.prototype.trim=function()
			{
			     return this.replace(/(^\s*)|(\s*$)/g, '');
			}
			if(!this.data.userMessage.trim()){
				return;
			}
			let id = WebIM.conn.getUniqueId();
			let msg = new WebIM.message(msgType.TEXT, id);
			msg.set({
				msg: this.data.userMessage,
				from: this.data.username.myName,
				to: this.getSendToParam(),
				roomType: false,
				chatType: this.data.chatType,
				success(id, serverMsgId){
					console.log('成功了')
					disp.fire('em.chat.sendSuccess', id, me.data.userMessage);
					me.triggerEvent(
						"newTextMsg",
						{
							msg: msg,
							type: msgType.TEXT,
						},
						{
							bubbles: true,
							composed: true
						}
					);
				},
				fail(id, serverMsgId){
					console.log('失败了')
					console.log('id',id)
					console.log('serverMsgId',serverMsgId)
				}
			});
			if(this.data.chatType == msgType.chatType.CHAT_ROOM){
				msg.setGroup("groupchat");
			}
			WebIM.conn.send(msg.body).catch(err => {
				console.log('err', err)
				if(err.type === 507){
					wx.showToast({
					  title: '你已经被禁言',
					  icon: 'error',
					  duration: 2000
					})

				}
			})
			
			//
			this.setData({
				userMessage: "",
				inputMessage: "",
			});
		},
	},

	// lifetimes
	created(){},
	attached(){},
	moved(){},
	detached(){},
	ready(){},
});
