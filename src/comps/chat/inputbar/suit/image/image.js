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
		openCamera(){
			var me = this;
			wx.chooseImage({
				count: 1,
				sizeType: ["original", "compressed"],
				sourceType: ["camera"],
				success(res){
					me.upLoadImage(res);
				}
			});
		},

		sendImage(){
			var me = this;
			wx.chooseImage({
				count: 1,
				sizeType: ["original", "compressed"],
				sourceType: ["album"],
				success(res){
					me.upLoadImage(res);
				},
			});
		},

		upLoadImage(res){
			var me = this;
			var tempFilePaths = res.tempFilePaths;
			wx.getImageInfo({
				src: res.tempFilePaths[0],
				success(res){
					var allowType = {
						jpg: true,
						gif: true,
						png: true,
						bmp: true
					};
					var str = WebIM.config.appkey.split("#");
					var width = res.width;
					var height = res.height;
					var index = res.path.lastIndexOf(".");
					var filetype = (~index && res.path.slice(index + 1)) || "";
					if(filetype.toLowerCase() in allowType){
						wx.uploadFile({
							url: "https://a1.easemob.com/" + str[0] + "/" + str[1] + "/chatfiles",
							filePath: tempFilePaths[0],
							name: "file",
							header: {
								"Content-Type": "multipart/form-data"
							},
							success(res){
								var data = res.data;
								var dataObj = JSON.parse(data);
								var id = WebIM.conn.getUniqueId();		// 生成本地消息 id
								var msg = new WebIM.message(msgType.IMAGE, id);
								var file = {
									type: msgType.IMAGE,
									size: {
										width: width,
										height: height
									},
									url: dataObj.uri + "/" + dataObj.entities[0].uuid,
									filetype: filetype,
									filename: tempFilePaths[0]
								};
								msg.set({
									apiUrl: WebIM.config.apiURL,
									body: file,
									from: me.data.username.myName,
									to: me.data.username.your,
									roomType: false,
									chatType: "singleChat"
								});
								WebIM.conn.send(msg.body);
								me.triggerEvent(
									"newImageMsg",
									{
										msg: msg,
										type: msgType.IMAGE
									},
									{
										bubbles: true,
										composed: true
									}
								);
							}
						});
					}
				}
			});
		},
	},
});
