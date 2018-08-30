let WebIM = require("../../../utils/WebIM")["default"];

Component({
	data: {

	},
	method: {
		receiveMsg: function(msg, type){
			var myName = wx.getStorageSync("myUsername");
			var me = this;
			var time = WebIM.time();
			var msgData = {
				info: {
					from: msg.from,
					to: msg.to
				},
				username: "",
				yourname: msg.from,
				msg: {
					type: type,
					data: null,
					url: msg.url
				},
				style: "",
				time: time,
				mid: msg.type + msg.id
			};
			if(msg.from == this.data.yourname){
				msgData.style = "";
				msgData.username = msg.from;
			}
			else{
				msgData.style = "self";
				msgData.username = msg.to;
			}

			// 发给我的或者我发的，才处理？
			if(msg.from == this.data.yourname || msg.to == this.data.yourname){
				if(type == "txt" || type == "emoji"){
					if(type == "txt"){
						msgData.value = WebIM.parseEmoji(msg.data.replace(/\n/mg, ""));
					}
					else if(type == "emoji"){
						msgData.value = msg.data;
					}
					this.data.chatMsg.push(msgData);
					wx.setStorage({
						key: this.data.yourname + myName,
						data: this.data.chatMsg,
						success: function(){
							if(type == "audio") return;
							// console.log('success', that.data)
							me.setData({
								chatMsg: me.data.chatMsg,
							});
							setTimeout(function(){
								me.setData({
									toView: me.data.chatMsg[me.data.chatMsg.length - 1].mid
								});
							}, 100);
						}
					});
				}
				else if(type == "audio"){
					// 如果是音频则请求服务器转码
					console.log("Audio Audio msg: ", msg);
					console.log("get token: ", msg.accessToken);
					console.log("Download");
					wx.downloadFile({
						url: msg.url,
						header: {
							"X-Requested-With": "XMLHttpRequest",
							Accept: "audio/mp3",
							Authorization: "Bearer " + msg.accessToken
						},
						success: function(res){
							console.log("downloadFile success Play", res);
							// wx.playVoice({
							// 	filePath: res.tempFilePath
							// });
							msg.url = res.tempFilePath;
							msgData.msg.url = msg.url;
							me.data.chatMsg.push(msgData);
							me.setData({
								chatMsg: me.data.chatMsg,
							});
						},
						fail: function(e){
							console.log("downloadFile failed", e);
						}
					});
				}
			}
		},

		receiveImage: function(msg, type){
			var me = this;
			var myName = wx.getStorageSync("myUsername");
			var time = WebIM.time();
			if(msg){
				this.data.chatMsg.push({
					info: {
						from: msg.from,
						to: msg.to
					},
					username: msg.from,
					yourname: msg.from,
					msg: {
						type: "img",
						data: msg.url
					},
					style: "",
					time: time,
					mid: "img" + msg.id
				});
				wx.setStorage({
					key: this.data.yourname + myName,
					data: this.data.chatMsg,
					success: function(){
						me.setData({
							chatMsg: me.data.chatMsg
						});
						setTimeout(function(){
							me.setData({
								toView: me.data.chatMsg[me.data.chatMsg.length - 1].mid
							});
						}, 100);
					}
				});
			}
		},

		receiveVideo: function(msg, type){
			var me = this;
			var myName = wx.getStorageSync("myUsername");
			var time = WebIM.time();
			if(msg){
				this.data.chatMsg.push({
					info: {
						from: msg.from,
						to: msg.to
					},
					username: msg.from,
					yourname: msg.from,
					msg: {
						type: "video",
						data: msg.url
					},
					style: "",
					time: time,
					mid: "video" + msg.id
				});
				wx.setStorage({
					key: this.data.yourname + myName,
					data: this.data.chatMsg,
					success: function(){
						me.setData({
							chatMsg: me.data.chatMsg
						});
						setTimeout(function(){
							me.setData({
								toView: me.data.chatMsg[me.data.chatMsg.length - 1].mid
							});
						}, 100);
					}
				});
			}
		},

		previewImage: function(event){
			var url = event.target.dataset.url;
			wx.previewImage({
				urls: [url]		// 需要预览的图片 http 链接列表
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
