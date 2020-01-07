
Component({
	lifetimes: {
	    attached: function() {
	      // 在组件实例进入页面节点树时执行
	      	console.log('在组件实例进入页面节点树时执行')
	      	this.pushVideoContext = wx.createVideoContext('pushVideo')
		  	this.playVideoContext = wx.createVideoContext('playVideo')

		  	this.LivePusherContext = wx.createLivePusherContext()
	      	
	      	this.createConf()
	    },
	    detached: function() {
	      // 在组件实例被从页面节点树移除时执行
	      console.log('在组件实例被从页面节点树移除时执行')
	      this.service&&this.service.exit()
	    },
  	},
  	data: {
  		pubUrl: "",
  		subUrl: "",
  		showInvite: true,
  		devicePosition: "front",
  		muted: false,
  		playVideoMuted: false
	},
	methods: {
		createConf(){
			var me = this
			var a = 1
			console.log('%c 创建会议', 'color:green')
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
			            me.setData({
							subUrl: stream.rtmp
						})
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
			        onEnter: function(member, mem){
			        	console.log('%c onEnter', 'color:green')
			        	console.log(member)
			        	console.log(mem)
			        	if(a == 1){
			        	wx.emedia.mgr.pubStream({
							rtcId: wx.emedia.util.getRtcId(),
							success: function(data){
								console.log('获取到的sub-url', data)
								//getApp().globalData.subUrl = data.rtmp
								me.setData({
									pubUrl: data.rtmp
								})
							}
						})
						a = 2
			        }
			        },
			        onAddMember: function(){console.log('onAddMember')},    
			        onRemoveMember: function(){console.log('onRemoveMember')},  
			        onRemoveStream: function(){console.log('onRemoveStream')},  
			        onClose: function(){console.log('onClose')}
			    }
			});

			let identityToken = wx.WebIM.conn.context.accessToken
			let identityName = wx.WebIM.conn.context.jid

			wx.emedia.mgr.createConfr({
				identityName: 'easemob-demo#chatdemoui_zd1@easemob.com',
			 	identityToken: identityToken,//'YWMtLFeEbBpOEeqD-sMgAnWU5U1-S6DcShHjkNXh_7qs2vUy04pwHuER6YGUI5WOSRNCAwMAAAFu6V9A4ABPGgDCHHYPZf0jtQbrjH97smaj5nqfv0jQI3WQ2Idfa30bqg',
			 	confrType: 11,
				password: '',
				success: function(data){
					var ticket = JSON.parse(data.ticket)
					//ticket.url = ticket.url//.replace('localhost', '172.17.2.55')
					var ssss = service.setup(ticket)
					console.log('ssss', ssss)
					console.log('%c 创建会议成功', 'color:green')
					console.log(data)
					service.join()

					me.triggerEvent('createConfrSuccess', ssss)
					wx.emedia.onAddStream2=function(data){
						console.log('%c onAddStream22', 'color:green')
						console.log(data)
						let streamId = data.pubS.id
						
						wx.emedia.mgr.subStream({
							streamId: streamId,
							success: function(data){
								console.log('%c 订阅流成功', 'color:green')
								console.log(data)
								me.setData({
									subUrl: data.rtmp,
									showInvite: false
								})
							}
						})
						
					}
				}
			})
		},

		togglePlay(){
			console.log("%c togglePlay", "color:green")
			this.LivePusherContext.pause()
		},

		toggleCamera(){
			console.log("%c toggleCamera", "color:green")
			this.setData({
				devicePosition: this.data.devicePosition == 'fron' ? 'back' : 'front'
			})
			this.LivePusherContext.switchCamera()
		},

		toggleMuted(){
			console.log("%c toggleMuted", "color:green")
			this.setData({
				muted: !this.data.muted
			})
		},

		toggleVoice(){
			console.log("%c toggleVoice", "color:green")
			this.setData({
				playVideoMuted: !this.data.playVideoMuted
			})
		},

		hangup(){
			console.log("%c hangup", "color:green")
			this.service&&this.service.exit()
		}
	},

})

