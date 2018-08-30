let WebIM = require("../../../../../utils/WebIM")["default"];

Component({
	data: {
		yourname: "",
	},
	method: {
		openCamera(){
			var me = this;
			wx.chooseImage({
				count: 1,
				sizeType: ["original", "compressed"],
				sourceType: ["camera"],
				success: function(res){
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
				success: function(res){
					me.upLoadImage(res);
				},
			});
		},

		upLoadImage: function(res){
			var me = this;
			var tempFilePaths = res.tempFilePaths;
			wx.getImageInfo({
				src: res.tempFilePaths[0],
				success: function(res){
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
							success: function(res){
								var data = res.data;
								var dataObj = JSON.parse(data);
								var id = WebIM.conn.getUniqueId();		// 生成本地消息 id
								var msg = new WebIM.message("img", id);
								var file = {
									type: "img",
									size: {
										width: width,
										height: height
									},
									url: dataObj.uri + "/" + dataObj.entities[0].uuid,
									filetype: filetype,
									filename: tempFilePaths[0]
								};
								var option = {
									apiUrl: WebIM.config.apiURL,
									body: file,
									to: me.data.yourname,		// 接收消息对象
									roomType: false,
									chatType: "singleChat"
								};
								msg.set(option);
								WebIM.conn.send(msg.body);
								this.triggerEvent(
									"newImageMsg",
									{
										msg: msg,
										type: "image"
									},
									{ bubbles: true }
								);
							}
						});
					}
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
