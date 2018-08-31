let WebIM = require("../../../../../utils/WebIM")["default"];
let msgType = require("../../../msgtype");

Component({
	properties: {
		username: {
			type: Object,
			value: {},
		}
	},
	data: {

	},
	methods: {
		// 未启用
		sendVideo(){
			var me = this;
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
							"Content-Type": "multipart/form-data"
						},
						success(res){
							var data = res.data;
							var dataObj = JSON.parse(data);
							var id = WebIM.conn.getUniqueId();		// 生成本地消息id
							var msg = new WebIM.message("img", id);
							msg.set({
								apiUrl: WebIM.config.apiURL,
								body: {
									type: "img",
									url: dataObj.uri + "/" + dataObj.entities[0].uuid,
									filetype: "mp4",
									filename: tempFilePaths
								},
								from: me.data.username.myName,
								to: me.data.username.your,
								roomType: false,
								chatType: "singleChat"
							});
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
	// 组件所在页面的生命周期函数
	show(){},
	hide(){},
});
