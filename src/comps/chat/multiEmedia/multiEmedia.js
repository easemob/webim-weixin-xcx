const WebIM = wx.WebIM
Component({
	properties: {//接收父组件传过来的值
	    username: null,//定义接收参数变量及允许传入参数类型
		action: null,
		groupId: null
	},
	lifetimes: {
	    attached: function() {
			wx.setKeepScreenOn({
			  keepScreenOn: true
			})
			this.setData({
				myName: wx.WebIM.conn.context.userId
			})

			this.getTimer()
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
				// 音视频sdk提供两种创建、加入会议的api 使用任意一种都可以：（1） 一种是通过会议id ticket 或者 会议id 密码加入会议 如使用下面 joinConf
				// （2）另一种是通过房间名 密码加入 如使用下面joinRoom

				//this.joinConf(this.data.action) // （1）
				//this.joinRoom(this.data.action) // （2）
				if (this.data.action.roomName) {
					console.log('使用joinroom')
					this.joinRoom(this.data.action)
				}else{
					console.log('使用joinConf')
					this.joinConf(this.data.action)
				}
			}else{
				// 创建会议同样是两种api （1）一种是使用createConf 单纯创建一个会议，需要再申请ticket 或者用密码加入会议 如使用下面的createConf
				// （2）也可以使用joinRoom，通过房间名、密码创建房间并直接加入 不需再进行加入会议的操作
				this.joinRoom() // （1）
				//this.createConf() // （2）
			}
			wx.emedia.mgr.onMediaChanaged = function(e){
				console.log('onMediaChanaged', e)
			}
			wx.emedia.mgr.onConferenceExit = function(e){
				console.log('onConferenceExit', e)
			}
			wx.emedia.mgr.onMemberExited = function(reason){
				console.log('onMemberExited', reason)
			};
 
			wx.emedia.mgr.onStreamControl = function(mem){
				console.log('onStreamControl', mem)
			}

			wx.emedia.mgr.onStreamControl.onSoundChanage = function(a, b, c, d){
				console.log('onSoundChanage')
			}

			wx.emedia.mgr.onReconnect = function (res, ent){
				// 发生断网重连，相当于重新加入会议

				// 清空live-player 否则在原来的后面追加，导致原来的黑屏显示
				subUrls = []

				// 重新加入恢复到初始状态，防止和控制按钮状态不符

				// 重连后摄像头方向不会改变
				me.setData({
					subUrls: [],
					showInvite: true,
			  		devicePosition: "front",
			  		muted: false,
			  		playVideoMuted: false,

			  		
			  		micphoneIcon: 'micphone_white',
			  		micphoneColor: '#fff',
			  		videoIcon: 'video_white',
			  		beautyIcon: 'beauty',
					videoColor: '#fff',
					beauty: 0,
					beautyColor: '#fff',
					enableCamera: true
				})
			}

			wx.emedia.mgr.onMemberJoined = function(mem){
				console.log("++++++++++ member", mem)
				var jid = wx.WebIM.conn.context.jid
				let identityName = jid.appKey + '_' + jid.name+ '@' + jid.domain
				// let identityName = wx.WebIM.conn.context.jid.split("/")[0]
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
						pubUrl: me.data.url + 'record_type=audio' || 'https://domain/push_stream',
					}, () => {
						// var enableCameraDefault = true
				        //if(!enableCameraDefault){ //治疗不推流的毛病
				        	// console.log('关闭摄像头推流')
				        	setTimeout(() => {
						    	me.LivePusherContext.start({
						    		success: function () {
						        		// console.log('关闭摄像头推流', enableCamera)
						        		enableCamera && me.setData({enableCamera: enableCamera})
						        	}
						    	})
						    }, 1500)
				        // }else{
				        // 	me.LivePusherContext.start({
					       //  	success: function () {
					       //  		console.log('开始推流了', enableCamera)
					       //    		enableCamera && me.setData({enableCamera: enableCamera})
					       //  	}
					       //  })
				        // }
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
						// 		console.log('关闭成功')
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
  		beautyIcon: 'beauty',
  		micphoneColor: '#fff',
  		videoIcon: 'video_white',
		videoColor: '#fff',
		beauty: 0,
		beautyColor: '#fff',
		myName: '',
		confrId: '',
		enableCamera: true,
		time: ''
	},

	methods: {
		joinRoom(data){
			let id = WebIM.conn.getUniqueId();
			let roomName = 'wxConfr' + id //随机的房间名，防止和别人的房间名冲突
			let rec = wx.getStorageSync("rec") || false;
			let recMerge = wx.getStorageSync("recMerge") || false;
			let params = {
				roomName,
				password: '',
				role: 7,
				config: {
					rec,
					recMerge
				}
			}
			if (data) {
				params.roomName = data.roomName
				params.password = data.password
			}
			let me = this;
			wx.emedia.mgr.joinRoom(params).then((res) => {
				console.log('res', res)
				let confrId = res.confrId
				me.setData({
					confrId: confrId
				})
				me.triggerEvent('createConfrSuccess', {confrId: confrId, groupId: me.data.username.groupId, roomName: params.roomName, password: params.password})
			})

			let rtcId = wx.emedia.util.getRtcId()
			wx.emedia.mgr.pubStream(rtcId).then(function(res){
				me.setData({
					pubUrl: res.data.rtmp
				})
			})
		},
		createConf(){
			console.log('>>> createConf');
			
			var me = this
			let rec = wx.getStorageSync("rec") || false;
			let recMerge = wx.getStorageSync("recMerge") || false;
			//参数：会议类型 密码 是否录制 是否合并
			wx.emedia.mgr.createConference(10, '', rec, recMerge).then(function(data){
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
			console.log(data)
			let me = this
			wx.emedia.mgr.getConferenceTkt(data.confrId, data.password).then(function(res){
				console.log('申请reqTkt成功', res.data)
				let ticket = res.data.ticket || ''
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
				this.LivePusherContext.start()
			})
		},

		toggleCamera(){
			console.log("%c toggleCamera", "color:green")
			let me = this
			// me.LivePusherContext.stop()
			me.LivePusherContext.switchCamera({
				success: function(){
					me.setData({
						devicePosition: me.data.devicePosition == 'fron' ? 'back' : 'front',
						devicePositionIcon: me.data.devicePositionIcon =='switchCamera_white'?'switchCamera_gray': 'switchCamera_white',
						devicePositionColor: me.data.devicePositionColor == '#fff'? '#aaa':'#fff'
					}, () => {
						// me.LivePusherContext.start()
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
				beautyColor: this.data.beautyColor == '#fff'? '#aaa': '#fff',
				beautyIcon: this.data.beautyIcon == 'beauty' ? 'beauty_gray': 'beauty'
			})
		},

		hangup(){
			console.log('挂断', this.data.confrId)
			wx.emedia.mgr.exitConference(this.data.confrId)
			this.triggerEvent('hangup')
			this.stopTimer()
		},
		inviteMember(){
			this.triggerEvent('inviteMember')
		},
		statechange(e){
			console.log('>>>>>>>>>live-pusher code:', e.detail)
			if (e.detail.code === 5001) {
				// 部分安卓手机在接电话时会停止推拉流报错，状态码5001，此时退出会议。 https://developers.weixin.qq.com/community/develop/doc/0006ac6d7a4968fa675a49fef53c00
				this.hangup()
				console.error('由于有电话接入，已退出会议')
			}
		},
		netstatusChange(e){
			console.log('>>>>>>>>>>net status:', e.detail)
		},

		getTimer(){
			let count = 0;
			let time = '00:00:00'
			this.timer = setInterval(() => {
                count++;
                let s = showNum(count % 60);
                let m = showNum(parseInt((count / 60)) % 60)
                let h = showNum(parseInt(count / 60 / 60))
                time = `${h}:${m}:${s}`
                this.setData({
                	time
                })
            }, 1000)

            function showNum(num) {
                if (num < 10) {
                    return '0' + num
                }
                return num
            }

		},
		stopTimer(){
			clearInterval(this.timer)
		}
	},

})