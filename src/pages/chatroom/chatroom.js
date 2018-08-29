let WebIM = require("../../utils/WebIM")["default"];

Page({
	data: {
		chatMsg: [],
		emojiStr: "",
		yourname: "",
		myName: "",
		sendInfo: "",
		userMessage: "",
		inputMessage: "",
		indicatorDots: true,
		autoplay: false,
		interval: 5000,
		duration: 1000,
		show: "emoji_list",
		view: "scroll_view",
		toView: "",
		emoji: WebIM.Emoji,
		emojiObj: WebIM.EmojiObj,
		msgView: {},
	},

	onLoad: function(options){
		let me = this;
		console.log(options);
		let myName = wx.getStorageSync("myUsername");
		console.log(myName);
		options = JSON.parse(options.username);
		let num = wx.getStorageSync(options.your + myName).length - 1;
		if(num > 0){
			setTimeout(function(){
				me.setData({
					toView: wx.getStorageSync(options.your + myName)[num].mid
				});
			}, 10);
		}
		this.setData({
			yourname: options.your,
			myName: myName,
			inputMessage: "",
			chatMsg: wx.getStorageSync(options.your + myName) || []
		});
		console.log(this.data.chatMsg);
		wx.setNavigationBarTitle({
			title: this.data.yourname
		});
	},

	onShow: function(){
		this.setData({
			inputMessage: ""
		});
	},

	bindMessage: function(e){
		this.setData({
			userMessage: e.detail.value
		});
	},

	cleanInput: function(){
		var setUserMessage = {
			sendInfo: this.data.userMessage
		};
		this.setData(setUserMessage);
	},

	sendMessage: function(){
		if(!this.data.userMessage.trim()) return;
		// console.log(that.data.userMessage)
		// console.log(that.data.sendInfo)
		let me = this;
		let myName = wx.getStorageSync("myUsername");
		let id = WebIM.conn.getUniqueId();
		let msg = new WebIM.message("txt", id);
		msg.set({
			msg: this.data.sendInfo,
			to: this.data.yourname,
			roomType: false,
			success: function(id, serverMsgId){
				console.log("send text message success");
			}
		});
		// console.log(msg)
		console.log("Sending textmessage");
		msg.body.chatType = "singleChat";
		WebIM.conn.send(msg.body);
		if(msg){
			let value = WebIM.parseEmoji(msg.value.replace(/\n/mg, ""));
			this.data.chatMsg.push({
				info: {
					to: msg.body.to
				},
				username: this.data.myName,
				yourname: msg.body.to,
				msg: {
					type: msg.type,
					data: value
				},
				style: "self",
				time: WebIM.time(),
				mid: msg.id
			});
			// console.log(that.data.chatMsg)
			wx.setStorage({
				key: this.data.yourname + myName,
				data: this.data.chatMsg,
				success: function(){
					// console.log('success', that.data)
					me.setData({
						chatMsg: me.data.chatMsg,
						emojiList: [],
						inputMessage: ""
					});
					setTimeout(function(){
						me.setData({
							toView: me.data.chatMsg[me.data.chatMsg.length - 1].mid
						});
					}, 100);
				}
			});
			this.setData({
				userMessage: ""
			});
		}
	},

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

	openEmoji: function(){
		this.setData({
			show: "showEmoji",
			view: "scroll_view_change"
		});
	},

	sendEmoji: function(event){
		var str;
		var emoji = event.target.dataset.emoji;
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

	sendImage: function(){
		var me = this;
		var pages = getCurrentPages();
		pages[1].cancelEmoji();
		wx.chooseImage({
			count: 1,
			sizeType: ["original", "compressed"],
			sourceType: ["album"],
			success: function(res){
				if(pages[1]){
					pages[1].upLoadImage(res, me);
				}
			},
		});
	},

	sendLocation: function(){
		var me = this;
		var pages = getCurrentPages();
		pages[1].cancelEmoji();
		wx.chooseLocation({
			success: function(respData){
				var id = WebIM.conn.getUniqueId();
				var msg = new WebIM.message("location", id);
				msg.set({
					msg: me.data.sendInfo,
					to: me.data.yourname,
					roomType: false,
					lng: respData.longitude,
					lat: respData.latitude,
					addr: respData.address,
					success: function(id, serverMsgId){
						// console.log('success')
					}
				});
				// console.log(msg);
				msg.body.chatType = "singleChat";
				WebIM.conn.send(msg.body);
			}
		});
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

	openCamera: function(){
		var me = this;
		var pages = getCurrentPages();
		pages[1].cancelEmoji();
		wx.chooseImage({
			count: 1,
			sizeType: ["original", "compressed"],
			sourceType: ["camera"],
			success: function(res){
				if(pages[1]){
					pages[1].upLoadImage(res, me);
				}
			}
		});
	},

	focus: function(){
		this.setData({
			show: "emoji_list",
			view: "scroll_view"
		});
	},

	cancelEmoji: function(){
		this.setData({
			show: "emoji_list",
			view: "scroll_view"
		});
	},

	scroll: function(e){
		// console.log(e)
	},

	lower: function(e){
		// console.log(e)
	},

	// upLoadImage 是一个异步回调，context 用来保证上下文一致性
	// 类 react 环境也会有上下文不一致？？不应该是所有的 comp 都是 new 的吗？
	upLoadImage: function(res, context){
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
								to: context.data.yourname,		// 接收消息对象
								roomType: false,
								chatType: "singleChat"
							};
							msg.set(option);
							WebIM.conn.send(msg.body);
							if(msg){
								context.data.chatMsg.push({
									info: {
										to: msg.body.to
									},
									username: context.data.myName,
									yourname: msg.body.to,
									msg: {
										type: msg.type,
										data: msg.body.body.url,
										size: {
											width: msg.body.body.size.width,
											height: msg.body.body.size.height,
										}
									},
									style: "self",
									time: WebIM.time(),
									mid: msg.id
								});
								wx.setStorage({
									key: context.data.yourname + wx.getStorageSync("myUsername"),
									data: context.data.chatMsg,
									success: function(){
										// console.log('success', that.data)
										context.setData({
											chatMsg: context.data.chatMsg
										});
										setTimeout(function(){
											context.setData({
												toView: context.data.chatMsg[context.data.chatMsg.length - 1].mid
											});
										}, 10);
									}
								});
							}
						}
					});
				}
			}
		});
	},

	previewImage: function(event){
		var url = event.target.dataset.url;
		wx.previewImage({
			urls: [url]		// 需要预览的图片 http 链接列表
		});
	},






	// 未启用
	// sendVideo: function(){
	// 	var that = this;
	// 	wx.chooseVideo({
	// 		sourceType: ["album", "camera"],
	// 		maxDuration: 60,
	// 		camera: "back",
	// 		success: function(res){
	// 			console.log(res);
	// 			var tempFilePaths = res.tempFilePath;
	// 			var str = WebIM.config.appkey.split("#");
	// 			wx.uploadFile({
	// 				url: "https://a1.easemob.com/" + str[0] + "/" + str[1] + "/chatfiles",
	// 				filePath: tempFilePaths,
	// 				name: "file",
	// 				header: {
	// 					"Content-Type": "multipart/form-data"
	// 				},
	// 				success: function(res){
	// 					var data = res.data;
	// 					var dataObj = JSON.parse(data);
	// 					console.log(dataObj);
	// 					var id = WebIM.conn.getUniqueId();                   // 生成本地消息id
	// 					var msg = new WebIM.message("img", id);
	// 					console.log(msg);
	// 					var file = {
	// 						type: "img",
	// 						url: dataObj.uri + "/" + dataObj.entities[0].uuid,
	// 						filetype: "mp4",
	// 						filename: tempFilePaths
	// 					};
	// 					// console.log(file)
	// 					var option = {
	// 						apiUrl: WebIM.config.apiURL,
	// 						body: file,
	// 						to: that.data.yourname,		// 接收消息对象
	// 						roomType: false,
	// 						chatType: "singleChat"
	// 					};
	// 					msg.set(option);
	// 					WebIM.conn.send(msg.body);
	// 					if(msg){
	// 						// console.log(msg,msg.body.body.url)
	// 						var time = WebIM.time();
	// 						var msgData = {
	// 							info: {
	// 								to: msg.body.to
	// 							},
	// 							username: that.data.myName,
	// 							yourname: msg.body.to,
	// 							msg: {
	// 								type: msg.type,
	// 								data: msg.body.body.url
	// 							},
	// 							style: "self",
	// 							time: time,
	// 							mid: msg.id
	// 						};
	// 						that.data.chatMsg.push(msgData);
	// 						console.log(that.data.chatMsg);
	// 						var myName = wx.getStorageSync("myUsername");
	// 						wx.setStorage({
	// 							key: that.data.yourname + myName,
	// 							data: that.data.chatMsg,
	// 							success: function(){
	// 								// console.log('success', that.data)
	// 								that.setData({
	// 									chatMsg: that.data.chatMsg
	// 								});
	// 								setTimeout(function(){
	// 									that.setData({
	// 										toView: that.data.chatMsg[that.data.chatMsg.length - 1].mid
	// 									});
	// 								}, 10);
	// 							}
	// 						});
	// 					}
	//
	// 				}
	// 			});
	// 		}
	// 	});
	// },

	// 测试用
	testInterfaces: function(){
		WebIM.conn.joinChatRoom({
			roomId: "21873157013506",
			success: function(respData){
				wx.showToast({
					title: "JoinChatRoomSuccess",
				});
				console.log("Response data: ", respData);
			}
		});
		// WebIM.conn.getChatRooms({
		// 	apiUrl: WebIM.config.apiURL,
		// 	pagenum: 1,
		// 	pagesize: 20,
		// 	success: function(resp){
		// 		console.log(resp);
		// 	},
		// 	error: function(e){
		// 		console.log(e);
		// 	}
		// });
	},

	quitChatRoom: function(){
		console.log("ScareCrow");
		WebIM.conn.quitChatRoom({
			roomId: "21873157013506",
			success: function(){
				console.log("quitChatRoom");
			},
		});
	},

});
