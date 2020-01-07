const WebIM = wx.WebIM
Component({
	properties: {//接收父组件传过来的值
	    username: null,//定义接收参数变量及允许传入参数类型
	    action: null
	},
	lifetimes: {
	    attached: function() {
	    	var me = this
	    	console.log('%c 初始化...', 'color:green')
			var service = this.service = new wx.emedia.XService({
			    listeners: { //以下监听，this object == me == service.current
			        onMeExit: function (reason, failed) {
			            //console.info("onMeExit", this);
			            reason = (reason || 0);
			            switch (reason){
			                case 0:
			                    reason = "正常挂断";
			                    break;
			                case 1:
			                    reason = "没响应";
			                    break;
			                case 2:
			                    reason = "服务器拒绝";
			                    break;
			                case 3:
			                    reason = "对方忙";
			                    break;
			                case 4:
			                    reason = "失败,可能是网络或服务器拒绝";
			                    if(failed === -9527){
			                        reason = "失败,网络原因";
			                    }
			                    if(failed === -500){
			                        reason = "Ticket失效";
			                    }
			                    if(failed === -502){
			                        reason = "Ticket过期";
			                    }
			                    if(failed === -504){
			                        reason = "链接已失效";
			                    }
			                    if(failed === -508){
			                        reason = "会议无效";
			                    }
			                    if(failed === -510){
			                        reason = "服务端限制";
			                    }
			                    break;
			                case 5:
			                    reason = "不支持";
			                    break;
			                case 10:
			                    reason = "其他设备登录";
			                    break;
			                case 11:
			                    reason = "会议关闭";
			                    break;
			            }
			        },

			        onAddMember: function (member) {
			            console.info("onAddMember", this);
			        },
			        onRemoveMember: function (member, reason) {
			            //console.info("onRemoveMember", this);
			        },

			        onAddStream: function (stream) {
			        	console.log('%c onAddStream', 'color:green')
			            console.info(stream);
			   //          me.setData({
						// 	subUrl: stream.rtmp
						// })
					},
					onPub: function(cver, memId, memObj){
						console.log('%c onPub', 'color:green')
						console.info(memObj);

						let streamId = memObj.id
						let subUrls = []
						setTimeout(() => {
							wx.emedia.mgr.subStream({
								streamId: streamId,
								success: function(data){
									console.log('%c 订阅流成功', 'color:green')
									console.log(data)

									let subUrl = {
										streamId: streamId,
										subUrl: data.rtmp
									}

									if(subUrls.length == 0){
										subUrls.push(subUrl)
									}else{
										subUrls.forEach((item) => {
											if(item.streamId != streamId){
												subUrls.push(subUrl)
											}else{
												item = subUrl
											}
										})
									}
									
									me.setData({
										subUrls: subUrls,
										showInvite: false
									})

									// wx.emedia.mgr.pubStream({
									// 	rtcId: wx.emedia.util.getRtcId(),
									// 	success: function(data){
									// 		console.log('获取到的sub-url', data)
								
									// 		me.setData({
									// 			pubUrl: data.rtmp
									// 		})
									// 	}
									// })
								}
							})
						}, 2000)
					},
					subscribeStream: function(stream){
						console.log('%c subscribeStream', 'color:green')
						console.info(stream);
					},
			        onRemoveStream: function (stream) {
			            //console.info("onRemoveStream", this);
			        },
			        onUpdateStream: function (stream, update) {
			            //console.info("onUpdateStream", this);
			        },
			        onNetworkWeak: function () {
			            //console.info("onNetworkWeak", this);
			            //displayEvent("当前通话连接质量不佳");
			        },
			        onNotSupportPublishVideoCodecs: function (stream) {
			            //console.info("onNotSupportPublishVideoCodecs", this);
			        },
			      
			        onNotifyEvent: function (evt) {
			 
			        },
			        onEnter: function(cver, mem){
			        	console.log('%c onEnter', 'color:green')
						console.log(mem)
						
						if(mem.isSelf){
							wx.emedia.mgr.pubStream({
								rtcId: wx.emedia.util.getRtcId(),
								success: function(data){
									console.log('获取到的pub-url', data)
									me.setData({
										pubUrl: data.rtmp
									})
								}
							})
						}
			        },
			        onAddMember: function(){console.log('onAddMember')},    
			        onRemoveMember: function(){console.log('onRemoveMember')},  
			        onRemoveStream: function(){console.log('onRemoveStream')},  
			        onClose: function(){console.log('onClose')}
			    }
			});

		  	this.LivePusherContext = wx.createLivePusherContext()
		  	if(this.data.action&&this.data.action.action == 'join'){
		  		this.joinConf(this.data.action)
		  	}else{
		  		this.createConf()
		  	}

	      	console.log('多人视频页面收到的参数', this.properties)
	      	
	    },
	    detached: function() {
	      this.service&&this.service.exit()
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
  		videoColor: '#fff'
	},

	methods: {
		createConf(){
			var me = this

			let identityToken = wx.WebIM.conn.context.accessToken
			let identityName = wx.WebIM.conn.context.jid.split("/")[0]

			wx.emedia.mgr.createConfr({
				identityName: identityName, //easemob-demo#chatdemoui_zd1@easemob.com',
			 	identityToken: identityToken,//'YWMtLFeEbBpOEeqD-sMgAnWU5U1-S6DcShHjkNXh_7qs2vUy04pwHuER6YGUI5WOSRNCAwMAAAFu6V9A4ABPGgDCHHYPZf0jtQbrjH97smaj5nqfv0jQI3WQ2Idfa30bqg',
			 	confrType: 11,
				password: '',
				success: function(data){
					var ticket = JSON.parse(data.ticket)
					let confrId = ticket.confrId
					//ticket.url = ticket.url//.replace('localhost', '172.17.2.55')
					var ssss = me.service.setup(ticket)
					console.log('ssss', ssss)
					console.log('%c 创建会议成功', 'color:green')
					console.log(data)
					me.service.join()
					
					me.triggerEvent('createConfrSuccess', {confrId: confrId, groupId: me.data.username.groupId})
					// wx.emedia.onAddStream2=function(data){
					// 	console.log('%c onAddStream22', 'color:green')
					// 	console.log(data)
					// 	console.log(data.pubS.id)
					// 	let streamId = data.pubS.id
					// 	let subUrls = []
					// 	setTimeout(() => {
					// 	wx.emedia.mgr.subStream({
					// 		streamId: streamId,
					// 		success: function(data){
					// 			console.log('%c 订阅流成功', 'color:green')
					// 			console.log(data)

					// 			let subUrl = {
					// 				streamId: streamId,
					// 				subUrl: data.rtmp
					// 			}

					// 			if(subUrls.length == 0){
					// 				subUrls.push(subUrl)
					// 			}else{
					// 				subUrls.forEach((item) => {
					// 					if(item.streamId != streamId){
					// 						subUrls.push(subUrl)
					// 					}else{
					// 						item = subUrl
					// 					}
					// 				})
					// 			}
								
					// 			me.setData({
					// 				subUrls: subUrls,
					// 				showInvite: false
					// 			})

					// 			// wx.emedia.mgr.pubStream({
					// 			// 	rtcId: wx.emedia.util.getRtcId(),
					// 			// 	success: function(data){
					// 			// 		console.log('获取到的sub-url', data)
							
					// 			// 		me.setData({
					// 			// 			pubUrl: data.rtmp
					// 			// 		})
					// 			// 	}
					// 			// })
					// 		}
					// 	})
					// 	}, 2000)
					// }
				}
			})
		},

		joinConf(data){
			let me = this
			let identityToken = wx.WebIM.conn.context.accessToken
			let identityName = wx.WebIM.conn.context.jid.split("/")[0]
			var params = {
				identityName: identityName,
			    identityToken: identityToken,
		        confrId: data.confrId,
		        password: data.password,
		        success: function(data){
		        	console.log('申请reqTkt成功', data)
		        	let ticket = data.data.ticket || {}
		        	me.service.setup(ticket)

					me.service.join()

					me.triggerEvent('createConfrSuccess', {confrId: data.confrId, groupId: me.data.username.groupId})
					
					wx.emedia.onAddStream2=function(data, mem){
						console.log('%c onAddStream22', 'color:green')
						console.log(data)
						console.log(mem)

						let streamId = data.pubS.id
						let subUrls = []

						setTimeout(() => {

							wx.emedia.mgr.subStream({
								streamId: streamId,
								success: function(data){
									console.log('%c 订阅流成功', 'color:green')
									console.log(data)

									let subUrl = {
										streamId: streamId,
										subUrl: data.rtmp
									}

									if(subUrls.length == 0){
										subUrls.push(subUrl)
									}else{
										subUrls.forEach((item) => {
											if(item.streamId != streamId){
												subUrls.push(subUrl)
											}else{
												item = subUrl
											}
										})
									}
									
									me.setData({
										subUrls: subUrls,
										showInvite: false
									})
								}
							})

						}, 3000)
						
					}
		        }
	    	}
	    	wx.emedia.mgr.reqTkt(params)
		},
		
		togglePlay(){
			console.log("%c togglePlay", "color:green")
			
			if (this.data.videoIcon == 'video_white') {
				this.LivePusherContext.pause()
			}else{
				this.LivePusherContext.resume()
			}
			this.setData({
				videoIcon: this.data.videoIcon == 'video_white'?'video_gray': 'video_white',
				videoColor: this.data.videoColor == '#fff'? '#aaa': '#fff'
			})

		},

		toggleCamera(){
			console.log("%c toggleCamera", "color:green")
			this.setData({
				devicePosition: this.data.devicePosition == 'fron' ? 'back' : 'front',
				devicePositionIcon: this.data.devicePositionIcon =='switchCamera_white'?'switchCamera_gray': 'switchCamera_white',
				devicePositionColor: this.data.devicePositionColor == '#fff'? '#aaa':'#fff'
			})
			this.LivePusherContext.switchCamera()
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

		hangup(){
			console.log("%c hangup", "color:green")
			this.service&&this.service.exit()
			this.triggerEvent('hangup')
		},
		inviteMember(){
			this.triggerEvent('inviteMember')
		}
	},

})