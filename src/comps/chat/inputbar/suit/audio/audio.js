let WebIM = require("../../../../../utils/WebIM")["default"];
let msgType = require("../../../msgtype");
let RECORD_CONST = require("record_status");
let RecordStatus = RECORD_CONST.RecordStatus;
let RecordDesc = RECORD_CONST.RecordDesc;
let disp = require("../../../../../utils/broadcast");
let RunAnimation = false
const InitHeight = [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50]
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
		changedTouches: null,
		recordStatus: RecordStatus.HIDE,
		RecordStatus,
		RecordDesc,		// 模板中有引用
		radomheight: InitHeight,
		recorderManager: wx.getRecorderManager(),
		recordClicked: false
	},
	methods: {
		toggleWithoutAction(e){
			// 阻止 tap 冒泡
		},

		toggleRecordModal(){
			this.setData({
				recordStatus: this.data.recordStatus == RecordStatus.HIDE ? RecordStatus.SHOW : RecordStatus.HIDE,
				radomheight: InitHeight,
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
		    me.setData({
		      	recordClicked: true
		    })
		    setTimeout(() => {
		      	if (me.data.recordClicked == true) {
		        	executeRecord()
		      	}
		    }, 350)
		    function executeRecord(){
			    wx.getSetting({
			      	success: (res) => {
				        let recordAuth = res.authSetting['scope.record']
				        if (recordAuth == false) { //已申请过授权，但是用户拒绝
				          	wx.openSetting({
					            success: function (res) {
					              let recordAuth = res.authSetting['scope.record']
					              if (recordAuth == true) {
					                wx.showToast({
							        	title: "授权成功",
							        	icon: "success"
							        })
					              } else {
					                wx.showToast({
							        	title: "请授权录音",
							        	icon: "none"
							        })
					              }
					              me.setData({
					                isLongPress: false
					              })
					            }
				          	})
				        } else if (recordAuth == true) { // 用户已经同意授权
				          	startRecord()
				        } else { // 第一次进来，未发起授权
					        wx.authorize({
					            scope: 'scope.record',
					            success: () => {//授权成功
					              	wx.showToast({
							        	title: "授权成功",
							        	icon: "success"
							        })
					            }
					        })
				        }
				    },
				    fail: function () {
				        wx.showToast({
				        	title: "鉴权失败，请重试",
				        	icon: "none"
				        })
			      	}
			    })
		    }

			function startRecord(){
				me.data.changedTouches = e.touches[0];
				me.setData({
					recordStatus: RecordStatus.HOLD
				});
				RunAnimation = true;
				me.myradom();

				let recorderManager = me.data.recorderManager || wx.getRecorderManager();
				recorderManager.onStart(() => {
					// console.log("开始录音...");
				});
				recorderManager.start({
					format: "mp3"
				});
				// 超时
				setTimeout(function(){
					me.handleRecordingCancel();
					RunAnimation = false
				}, 100000);
			}
		},

		handleRecordingCancel(){
			RunAnimation = false
			let recorderManager = this.data.recorderManager;
			// 向上滑动状态停止：取消录音发放
			if(this.data.recordStatus == RecordStatus.SWIPE){
				this.setData({
					recordStatus: RecordStatus.RELEASE
				});
			}
			else{
				this.setData({
					recordStatus: RecordStatus.HIDE,
					recordClicked: false
				});
			}

			recorderManager.onStop((res) => {
				// console.log("结束录音...", res);
				if(this.data.recordStatus == RecordStatus.RELEASE){
					console.log("user canceled");
					this.setData({
						recordStatus: RecordStatus.HIDE
					});
					return;
				}
				if (res.duration < 1000) {
			        wx.showToast({
			        	title: "录音时间太短",
			        	icon: "none"
			        })
			    } else {
			        // 上传
					this.uploadRecord(res.tempFilePath, res.duration);
			    }
			});
			// 停止录音
			recorderManager.stop();
		},

		isGroupChat(){
			return this.data.chatType == msgType.chatType.CHAT_ROOM;
		},

		getSendToParam(){
			return this.isGroupChat() ? this.data.username.groupId : this.data.username.your;
		},

		uploadRecord(tempFilePath, dur){
			var str = WebIM.config.appkey.split("#");
			var me = this;
			var token = WebIM.conn.context.accessToken
			wx.uploadFile({
				url: "https://a1.easemob.com/" + str[0] + "/" + str[1] + "/chatfiles",
				filePath: tempFilePath,
				name: "file",
				header: {
					"Content-Type": "multipart/form-data",
					Authorization: "Bearer " + token
				},
				success(res){
					// 发送 xmpp 消息
					var id = WebIM.conn.getUniqueId();
					var msg = new WebIM.message(msgType.AUDIO, id);
					var dataObj = JSON.parse(res.data);
					// 接收消息对象
					msg.set({
						apiUrl: WebIM.config.apiURL,
						accessToken: token,
						body: {
							type: msgType.AUDIO,
							url: dataObj.uri + "/" + dataObj.entities[0].uuid,
							filetype: "",
							filename: tempFilePath,
							accessToken: token,
							length: Math.ceil(dur / 1000)
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
					msg.body.length = Math.ceil(dur / 1000);
					//console.log('发送的语音消息', msg.body)
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

		myradom(){
		    const that = this;
		    var _radomheight = that.data.radomheight;
		    for (var i = 0; i < that.data.radomheight.length; i++) {
		      //+1是为了避免为0
		     _radomheight[i] = (100 * Math.random().toFixed(2))+10;
		    }
		    that.setData({
		        radomheight: _radomheight
		    });
		    if (RunAnimation) {
		    	setTimeout(function () {that.myradom(); }, 500);
		    }else{
		    	return
		    }
	  	}
	},

	// lifetimes
	created(){},
	attached(){},
	moved(){},
	detached(){},
	ready(){},
});
