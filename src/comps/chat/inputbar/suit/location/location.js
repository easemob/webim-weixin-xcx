let WebIM = require("../../../../../utils/WebIM")["default"];
let msgType = require("../../../msgtype");

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

	},
	methods: {
		isGroupChat(){
			return this.data.chatType == msgType.chatType.CHAT_ROOM;
		},

		getSendToParam(){
			return this.isGroupChat() ? this.data.username.groupId : this.data.username.your;
		},

		sendLocation(){
			var me = this;
			wx.authorize({
				scope: "scope.userLocation",
				fail(){
					wx.showToast({
						title: "已拒绝",
						icon: "none",
					});
				},
				success(){
					wx.chooseLocation({
						fail(){
							console.log(arguments);
						},
						complete(){
							console.log(arguments);
						},
						success(respData){
							var id = WebIM.conn.getUniqueId();
							var msg = new WebIM.message(msgType.LOCATION, id);
							msg.set({
								// location 需要消息值吗？写死不行？
								msg: "",
								from: me.data.username.myName,
								to: me.getSendToParam(),
								roomType: false,
								lng: respData.longitude,
								lat: respData.latitude,
								addr: respData.address,
								chatType: me.data.chatType,
								success(id, serverMsgId){

								}
							});
							if(me.data.chatType == msgType.chatType.CHAT_ROOM){
								msg.setGroup("groupchat");
							}
							WebIM.conn.send(msg.body);
							me.triggerEvent(
								"newLocationMsg",
								{
									msg: msg,
									type: msgType.LOCATION
								},
								{
									bubbles: true,
									composed: true
								}
							);
						}
					});
				}
			});
		},
	},
});
