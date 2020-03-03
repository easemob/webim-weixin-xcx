const WebIM = wx.WebIM
Component({
	properties: {//接收父组件传过来的值
	    username: null,//定义接收参数变量及允许传入参数类型
		action: null
	},
	lifetimes: {
	    attached: function() {
			wx.setKeepScreenOn(true)
			this.setData({
				myName: wx.WebIM.conn.context.userId
			})
			var me = this
			let subUrls = []
			let obj = {};
			// var service = this.service = new wx.emedia.XService({
			//     listeners: {
			//         onMeExit: function (reason, failed) {
			//             //console.info("onMeExit", this);
			//             reason = (reason || 0);
			//             switch (reason){
			//                 case 0:
			//                     reason = "正常挂断";
			//                     break;
			//                 case 1:
			//                     reason = "没响应";
			//                     break;
			//                 case 2:
			//                     reason = "服务器拒绝";
			//                     break;
			//                 case 3:
			//                     reason = "对方忙";
			//                     break;
			//                 case 4:
			//                     reason = "失败,可能是网络或服务器拒绝";
			//                     if(failed === -9527){
			//                         reason = "失败,网络原因";
			//                     }
			//                     if(failed === -500){
			//                         reason = "Ticket失效";
			//                     }
			//                     if(failed === -502){
			//                         reason = "Ticket过期";
			//                     }
			//                     if(failed === -504){
			//                         reason = "链接已失效";
			//                     }
			//                     if(failed === -508){
			//                         reason = "会议无效";
			//                     }
			//                     if(failed === -510){
			//                         reason = "服务端限制";
			//                     }
			//                     break;
			//                 case 5:
			//                     reason = "不支持";
			//                     break;
			//                 case 10:
			//                     reason = "其他设备登录";
			//                     break;
			//                 case 11:
			//                     reason = "会议关闭";
			//                     break;
			//             }
			//         },
			//     }
			// });

			this.LivePusherContext = wx.createLivePusherContext()
			
			if(this.data.action&&this.data.action.action == 'join'){
				this.joinConf(this.data.action)
			}else{
				this.createConf()
			}
			wx.emedia.mgr.onMemberExited = function(reason){

			};

			wx.emedia.mgr.onMemberJoined = function(mem){
				console.log("++++++++++ member", mem)
				let identityName = wx.WebIM.conn.context.jid.split("/")[0]
				// 如果是自己进入会议了，开始发布流
				if(mem.name == identityName){
					let rtcId = wx.emedia.util.getRtcId()
					wx.emedia.mgr.pubStream(rtcId).then(function(res){
						me.setData({
							pubUrl: res.data.rtmp
						})
					})

					var enableCamera = me.data.enableCamera;
				    console.warn("begin enable camera", me.data.enableCamera);

				    //默认enableCamera为false  关闭摄像头时声音不会有延迟，否则有延迟
				    //所以最好别用autopush
					me.setData({
						enableCamera: false,
						pubUrl: me.data.url || 'https://domain/push_stream',
					}, () => {
				      	me.LivePusherContext.start({
				        	success: function () {
				          		enableCamera && me.setData({enableCamera: enableCamera})
				        	}
				        })
				    })
				}
			}
			wx.emedia.mgr.onStreamAdded = function(stream){
				console.log('%c onAddStream', 'color: green', stream)
				let streamId = stream.id
				// setTimeout(() => {
					if(subUrls.length > 8){
						return
					}
					wx.emedia.mgr.subStream(streamId).then(function(data){
						console.log('%c 订阅流成功', 'color:green', data)
						// let playContext = wx.createLivePlayerContext(streamId, me)
						let subUrl = {
							streamId: streamId,
							subUrl: data.data.rtmp,
							memName: stream.memName.split("_")[1].split("@")[0],
							// playContext: playContext
						}
						subUrls.push(subUrl)
						console.log('%c subUrls 11 ....', "background:yellow")
						console.log(subUrls)
	
						me.setData({
							subUrls: subUrls,
							showInvite: false
						})
					})
				// }, 2000)

			}
			wx.emedia.mgr.onStreamRemoved = function(stream){
				console.log('%c onRemoveStream', 'color: red', stream)
				subUrls = subUrls.filter((item) => {
					if(item.streamId != stream.id){
						return item
					}else{
						console.log('%c ------', 'backgroukd:yellow')
						console.log(item)
						// item.playContext.stop({
						// 	success: function(){
						// 		console.log('关闭成功')
						// 	},
						// 	complete: function(){
						// 		console.log('关闭成功22')
						// 	}
						// })
					}
				})
				obj[stream.id] = false
				me.setData({
					subUrls: subUrls,
				})
				console.log('subUrls', subUrls)
			},
			wx.emedia.mgr.onConfrAttrsUpdated = function(e){
				console.log('onConfrAttrsUpdated: ', e)
			}
	    },
	    detached: function() {
			wx.emedia.mgr.exitConference(this.data.confrId)
	    },
  	},
	data: {
		pubUrl: "",
  		subUrls: [],
  		showInvite: true,
  		devicePosition: "front",
  		muted: false,
  		playVideoMuted: false,

  		devicePositionIcon: 'switchCamera_white',
  		devicePositionColor: '#fff',
  		micphoneIcon: 'micphone_white',
  		micphoneColor: '#fff',
  		videoIcon: 'video_white',
		videoColor: '#fff',
		beauty: 0,
		beautyColor: '#fff',
		myName: '',
		confrId: '',
		enableCamera: true
	},

	methods: {
		createConf(){

			console.log('>>> createConf');
			
			var me = this
			let rec = wx.getStorageSync("rec") || false;
			let recMerge = wx.getStorageSync("recMerge") || false;
			//参数：会议类型 密码 是否录制 是否合并
			wx.emedia.mgr.createConference(11, '', rec, recMerge).then(function(data){
				console.log('成功', data)
				let ticket = data.data.ticket
				let ticketJosn = JSON.parse(ticket)
				let confrId = ticketJosn.confrId

				wx.emedia.mgr.joinConferenceWithTicket(confrId, ticket).then(function(res){
					console.log('加入会议成功', res)
				})
				// wx.emedia.mgr.joinConference(confrId, '').then(function(res){
				// 	console.log('加入会议成功', res)
				// })
				
				me.setData({
					confrId
				})
				me.triggerEvent('createConfrSuccess', {confrId: confrId, groupId: me.data.username.groupId})
			})
		},

		joinConf(data){
			console.log('加入会议 ————-------————')
			let me = this
			wx.emedia.mgr.getConferenceTkt(data.confrId, data.password).then(function(data){
				console.log('申请reqTkt成功', data.data)
				let ticket = data.data.ticket || ''
				let tktObj = JSON.parse(ticket)
				wx.emedia.mgr.joinConferenceWithTicket(data.confrId, ticket).then(function(res){
					console.log('加入会议成功', res)
				})
				me.setData({
					confrId: tktObj.confrId
				})
				me.triggerEvent('createConfrSuccess', {confrId: tktObj.confrId, groupId: me.data.username.groupId})
			})
		},
		
		togglePlay(){
			let me = this
			console.log("%c togglePlay", "color:green")

			// this.LivePusherContext.stop()
			this.setData({
				enableCamera: !me.data.enableCamera,
				pubUrl: me.data.pubUrl,
				videoIcon: this.data.videoIcon == 'video_white'?'video_gray': 'video_white',
				videoColor: this.data.videoColor == '#fff'? '#aaa': '#fff'
			}, () => {
				// this.LivePusherContext.start()
			})
		},

		toggleCamera(){
			console.log("%c toggleCamera", "color:green")
			let me = this
			me.LivePusherContext.stop()
			me.LivePusherContext.switchCamera({
				success: function(){
					me.setData({
						devicePosition: me.data.devicePosition == 'fron' ? 'back' : 'front',
						devicePositionIcon: me.data.devicePositionIcon =='switchCamera_white'?'switchCamera_gray': 'switchCamera_white',
						devicePositionColor: me.data.devicePositionColor == '#fff'? '#aaa':'#fff'
					}, () => {
						me.LivePusherContext.start()
					})
				}
			})

			// 	测试更新会议属性
			// wx.emedia.mgr.setConferenceAttrs({
			// 	key: 'zdtest',
			// 	val: 'change_status',
			// 	success: function(){console.log('改变状态成功')},
			// 	error: function(){console.log('改变状态失败')},
			// 	confrId: this.data.confrId
			// })
		},

		toggleMuted(){
			console.log("%c toggleMuted", "color:green")
			this.setData({
				muted: !this.data.muted,
				micphoneIcon: this.data.micphoneIcon == 'micphone_white'? 'micphone_gray': 'micphone_white',
				micphoneColor: this.data.micphoneColor == '#fff'? '#aaa': '#fff'
			})
		},

		// toggleVoice(){
		// 	console.log("%c toggleVoice", "color:green")
		// 	this.setData({
		// 		playVideoMuted: !this.data.playVideoMuted
		// 	})
		// },

		toggleBeauty(){
			this.setData({
				beauty: this.data.beauty == 0 ? 9 : 0,
				beautyColor: this.data.beautyColor == '#fff'? '#aaa': '#fff'
			})
		},

		hangup(){
			console.log('挂断', this.data.confrId)
			wx.emedia.mgr.exitConference(this.data.confrId)
			this.triggerEvent('hangup')
		},
		inviteMember(){
			this.triggerEvent('inviteMember')
		},
		statechange(e){
			console.log('live-pusher code:', e.detail)
		},
		netstatusChange(e){
			console.log('net status:', e.detail)
		}
	},

})