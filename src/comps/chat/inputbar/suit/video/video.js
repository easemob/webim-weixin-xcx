let WebIM = require("../../../../../utils/WebIM")["default"];

Component({
	data: {
		yourname: ""
	},
	method: {
		// 未启用
		sendVideo: function(){
			var me = this;
			wx.chooseVideo({
				sourceType: ["album", "camera"],
				maxDuration: 60,
				camera: "back",
				success: function(res){
					var tempFilePaths = res.tempFilePath;
					var str = WebIM.config.appkey.split("#");
					wx.uploadFile({
						url: "https://a1.easemob.com/" + str[0] + "/" + str[1] + "/chatfiles",
						filePath: tempFilePaths,
						name: "file",
						header: {
							"Content-Type": "multipart/form-data"
						},
						success: function(res){
							var data = res.data;
							var dataObj = JSON.parse(data);
							var id = WebIM.conn.getUniqueId();		// 生成本地消息id
							var msg = new WebIM.message("img", id);
							msg.set({
								apiUrl: WebIM.config.apiURL,
								body: {
									// ？？？
									type: "img",
									url: dataObj.uri + "/" + dataObj.entities[0].uuid,
									filetype: "mp4",
									filename: tempFilePaths
								},
								to: me.data.yourname,			// 接收消息对象
								roomType: false,
								chatType: "singleChat"
							});
							WebIM.conn.send(msg.body);
							this.triggerEvent(
								"newVideoMsg",
								{
									msg: msg,
									type: "video"
								},
								{ bubbles: true }
							);
						}
					});
				}
			});
		},
	},

	lifetimes: {
		created: function(){},
		attached: function(){},
		moved: function(){},
		detached: function(){},
		ready: function(){},
	},

	pageLifetimes: {
		// 组件所在页面的生命周期函数
		show: function(){},
		hide: function(){},
	},
});
