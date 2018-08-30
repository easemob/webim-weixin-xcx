let WebIM = require("../../../../../utils/WebIM")["default"];
let RecordStatus = require("record_status").RecordStatus;
let RecordDesc = require("record_status").RecordDesc;

Component({
	data: {
		changedTouches: null,
		recordStatus: RecordStatus.HIDE,
		RecordDesc,		// 模板中有引用
		yourname: "",
		sendInfo: "",
	},
	method: {
		toggleWithoutAction: function(e){
			console.log("toggleWithoutModal 拦截请求不做处理");
		},

		toggleRecordModal: function(e){
			this.setData({
				recordStatus: this.data.recordStatus == RecordStatus.HIDE ? RecordStatus.SHOW : RecordStatus.HIDE
			});
		},

		handleRecordingMove: function(e){
			var touches = e.touches[0];
			var changedTouches = this.data.changedTouches;
			if(!changedTouches){
				return;
			}

			if(this.data.recordStatus == RecordStatus.SWIPE){
				if(changedTouches.pageY - touches.pageY < 20){
					this.setData({
						recordStatus: RecordStatus.HOLD
					});
				}
			}
			if(this.data.recordStatus == RecordStatus.HOLD){
				if(changedTouches.pageY - touches.pageY > 20){
					this.setData({
						recordStatus: RecordStatus.SWIPE
					});
				}
			}
		},

		handleRecording: function(e){
			console.log("handleRecording");
			let me = this;
			this.data.changedTouches = e.touches[0];
			this.setData({
				recordStatus: RecordStatus.HOLD
			});
			wx.startRecord({
				fail: function(err){
					// 时间太短会失败
					console.log(err);
				},
				success: function(res){
					console.log("success");
					// 取消录音发放状态 -> 退出不发送
					if(me.data.recordStatus == RecordStatus.RELEASE){
						console.log("user canceled");
						return;
					}
					// console.log(tempFilePath)
					me.uploadRecord(res.tempFilePath);
				},
				complete: function(){
					console.log("complete");
					me.handleRecordingCancel();
				}
			});
			// 超时
			setTimeout(function(){
				me.handleRecordingCancel();
			}, 100000);
		},

		handleRecordingCancel: function(){
			console.log("handleRecordingCancel");
			// 向上滑动状态停止：取消录音发放
			if(this.data.recordStatus == RecordStatus.SWIPE){
				this.setData({
					recordStatus: RecordStatus.RELEASE
				});
			}
			else{
				this.setData({
					recordStatus: RecordStatus.HIDE
				});
			}
			wx.stopRecord();
		},

		uploadRecord: function(tempFilePath){
			var str = WebIM.config.appkey.split("#");
			var me = this;
			wx.uploadFile({
				url: "https://a1.easemob.com/" + str[0] + "/" + str[1] + "/chatfiles",
				filePath: tempFilePath,
				name: "file",
				header: {
					"Content-Type": "multipart/form-data"
				},
				success: function(res){
					// 发送 xmpp 消息
					var msg = new WebIM.message("audio", WebIM.conn.getUniqueId());
					var dataObj = JSON.parse(res.data);
					// 接收消息对象
					msg.set({
						apiUrl: WebIM.config.apiURL,
						body: {
							type: "audio",
							url: dataObj.uri + "/" + dataObj.entities[0].uuid,
							filetype: "",
							filename: tempFilePath
						},
						to: me.data.yourname,
						roomType: false,
						chatType: "singleChat"
					});
					WebIM.conn.send(msg.body);
					// 本地消息展示
					me.data.chatMsg.push({
						info: {
							to: msg.body.to
						},
						username: me.data.myName,
						yourname: msg.body.to,
						msg: {
							type: msg.type,
							data: msg.body.body.url,
							url: msg.body.body.url,
						},
						style: "self",
						time: WebIM.time(),
						mid: msg.id
					});
					// 存储到本地消息
					wx.setStorage({
						key: me.data.yourname + wx.getStorageSync("myUsername"),
						data: me.data.chatMsg,
						success: function(){
							// console.log('success', that.data)
							me.setData({
								chatMsg: me.data.chatMsg
							});
							setTimeout(function(){
								me.setData({
									toView: me.data.chatMsg[me.data.chatMsg.length - 1].mid
								});
							}, 10);
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
