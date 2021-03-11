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

	},
	methods: {
		isGroupChat(){
			return this.data.chatType == msgType.chatType.CHAT_ROOM;
		},

		getSendToParam(){
			return this.isGroupChat() ? this.data.username.groupId : this.data.username.your;
		},

		// 未启用
		sendVideo(){
			var me = this;
			var token = WebIM.conn.context.accessToken
			wx.chooseVideo({
				sourceType: ["album", "camera"],
				maxDuration: 30,
				camera: "back",
				success(res){
					var tempFilePaths = res.tempFilePath;
					var str = WebIM.config.appkey.split("#");
					var domain = wx.WebIM.conn.apiUrl + '/'
					wx.uploadFile({
						url: domain + str[0] + "/" + str[1] + "/chatfiles",
						filePath: tempFilePaths,
						name: "file",
						header: {
							"Content-Type": "multipart/form-data",
							Authorization: "Bearer " + token
						},
						success(res){
							var data = res.data;
							var dataObj = JSON.parse(data);
							var id = WebIM.conn.getUniqueId();		// 生成本地消息id
							var msg = new WebIM.message(msgType.VIDEO, id);
							msg.set({
								apiUrl: WebIM.config.apiURL,
								accessToken: token,
								body: {
									type: msgType.VIDEO,
									url: dataObj.uri + "/" + dataObj.entities[0].uuid,
									filetype: "mp4",
									filename: tempFilePaths,
									accessToken: token,
								},
								from: me.data.username.myName,
								to: me.getSendToParam(),
								roomType: false,
								chatType: me.data.chatType,
								success: function (argument) {
									disp.fire('em.chat.sendSuccess', id);
								}
							});
							if(me.isGroupChat()){
								msg.setGroup("groupchat");
							}
							WebIM.conn.send(msg.body);
							me.triggerEvent(
								"newVideoMsg",
								{
									msg: msg,
									type: msgType.VIDEO
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

	// lifetimes
	created(){},
	attached(){},
	moved(){},
	detached(){},
	ready(){},
});
