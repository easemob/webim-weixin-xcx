let WebIM = require("../../../../../utils/WebIM")["default"];
let msgType = require("../../../msgtype");
let RECORD_CONST = require("record_status");
let RecordStatus = RECORD_CONST.RecordStatus;
let RecordDesc = RECORD_CONST.RecordDesc;

Component({
	properties: {
		username: {
			type: Object,
			value: {},
		}
	},
	data: {
		changedTouches: null,
		recordStatus: RecordStatus.HIDE,
		RecordStatus,
		RecordDesc,		// 模板中有引用
	},
	methods: {
		toggleWithoutAction(e){
			// 阻止 tap 冒泡
		},

		toggleRecordModal(){
			this.setData({
				recordStatus: this.data.recordStatus == RecordStatus.HIDE ? RecordStatus.SHOW : RecordStatus.HIDE
			});
		},

		handleRecordingMove(e){
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

		handleRecording(e){
			let me = this;
			this.data.changedTouches = e.touches[0];
			this.setData({
				recordStatus: RecordStatus.HOLD
			});

			let recorderManager = wx.getRecorderManager();
			recorderManager.onStart(() => {
				// console.log("开始录音...");
			});
			recorderManager.start({
				format: "mp3"
			});
			// 超时
			setTimeout(function(){
				me.handleRecordingCancel();
			}, 100000);
		},

		handleRecordingCancel(){
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
			let recorderManager = wx.getRecorderManager();
			recorderManager.onStop((res) => {
				// console.log("结束录音...", res);
				if(this.data.recordStatus == RecordStatus.RELEASE){
					console.log("user canceled");
					return;
				}
				// 上传
				this.uploadRecord(res.tempFilePath);
			});
			// 停止录音
			recorderManager.stop();
		},

		uploadRecord(tempFilePath){
			var str = WebIM.config.appkey.split("#");
			var me = this;
			wx.uploadFile({
				url: "https://a1.easemob.com/" + str[0] + "/" + str[1] + "/chatfiles",
				filePath: tempFilePath,
				name: "file",
				header: {
					"Content-Type": "multipart/form-data"
				},
				success(res){
					// 发送 xmpp 消息
					var msg = new WebIM.message(msgType.AUDIO, WebIM.conn.getUniqueId());
					var dataObj = JSON.parse(res.data);
					// 接收消息对象
					msg.set({
						apiUrl: WebIM.config.apiURL,
						body: {
							type: msgType.AUDIO,
							url: dataObj.uri + "/" + dataObj.entities[0].uuid,
							filetype: "",
							filename: tempFilePath
						},
						from: me.data.username.myName,
						to: me.data.username.your,
						roomType: false,
						chatType: "singleChat"
					});
					WebIM.conn.send(msg.body);
					me.triggerEvent(
						"newAudioMsg",
						{
							msg: msg,
							type: msgType.AUDIO,
						},
						{
							bubbles: true,
							composed: true
						}
					);
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
