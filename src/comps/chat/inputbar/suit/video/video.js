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

		// 未启用
		sendVideo(){
			var me = this;
			var token = WebIM.conn.context.accessToken
			wx.chooseVideo({
				sourceType: ["album", "camera"],
				maxDuration: 60,
				camera: "back",
				success(res){
					var tempFilePaths = res.tempFilePath;
					var str = WebIM.config.appkey.split("#");
					wx.uploadFile({
						url: "https://a1.easemob.com/" + str[0] + "/" + str[1] + "/chatfiles",
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
							var msg = new WebIM.message("video", id);
							msg.set({
								apiUrl: WebIM.config.apiURL,
								body: {
									type: "video",
									url: dataObj.uri + "/" + dataObj.entities[0].uuid,
									filetype: "mp4",
									filename: tempFilePaths
								},
								from: me.data.username.myName,
								to: me.getSendToParam(),
								roomType: false,
								chatType: me.data.chatType,
							});
							if(me.data.chatType == msgType.chatType.CHAT_ROOM){
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
