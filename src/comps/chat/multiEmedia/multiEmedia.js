const WebIM = wx.WebIM
const emediaState = require('./emediaState')
Component({
	properties: {//接收父组件传过来的值
	    username: null,//定义接收参数变量及允许传入参数类型
		action: null,
		groupId: null
	},
	lifetimes: {
	    attached: function() {
	    	const me = this
	    	const myUserId = wx.WebIM.conn.context.userId
			wx.setKeepScreenOn({
			  	keepScreenOn: true
			})
			this.setData({
				myName: myUserId
			})
			this.getTimer()
			
			let subUrls = []

			this.LivePusherContext = wx.createLivePusherContext()
			
			this.initClient()
			console.log('会议信息', emediaState)
			this.getToken(myUserId, emediaState.confr.channel)


			// if(this.data.action&&this.data.action.action == 'join'){
			// 	this.getToken(myUserId, emediaState.confr.channel)
			// }else{
			// 	// const channelName = Math.uuid(8)
			// 	this.getToken(myUserId, channelName)
			// }

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
					beauty: 9,
					beautyColor: '#fff',
					enableCamera: true
				})
			}

			// wx.emedia.mgr.onMemberJoined = function(mem){
			// 	console.log("++++++++++ member", mem)
			// 	var jid = wx.WebIM.conn.context.jid
			// 	let identityName = jid.appKey + '_' + jid.name+ '@' + jid.domain
			// 	// let identityName = wx.WebIM.conn.context.jid.split("/")[0]
			// 	// 如果是自己进入会议了，开始发布流
			// 	if(mem.name == identityName){
			// 		let rtcId = wx.emedia.util.getRtcId()
			// 		// wx.emedia.mgr.pubStream(rtcId).then(function(res){
			// 		// 	me.setData({
			// 		// 		pubUrl: res.data.rtmp
			// 		// 	})
			// 		// })

			// 		var enableCamera = me.data.enableCamera;
			// 	    console.warn("begin enable camera", me.data.enableCamera);

			// 	    //默认enableCamera为false  关闭摄像头时声音不会有延迟，否则有延迟
			// 	    //所以最好别用autopush
			// 		me.setData({
			// 			enableCamera: false,
			// 			//pubUrl: me.data.url + 'record_type=audio' || 'https://domain/push_stream',
			// 		}, () => {
			// 			// var enableCameraDefault = true
			// 	        //if(!enableCameraDefault){ //治疗不推流的毛病
			// 	        	// console.log('关闭摄像头推流')
			// 	        	setTimeout(() => {
			// 			    	me.LivePusherContext.start({
			// 			    		success: function () {
			// 			        		// console.log('关闭摄像头推流', enableCamera)
			// 			        		enableCamera && me.setData({enableCamera: enableCamera})
			// 			        	}
			// 			    	})
			// 			    }, 1500)
			// 	        // }else{
			// 	        // 	me.LivePusherContext.start({
			// 		       //  	success: function () {
			// 		       //  		console.log('开始推流了', enableCamera)
			// 		       //    		enableCamera && me.setData({enableCamera: enableCamera})
			// 		       //  	}
			// 		       //  })
			// 	        // }
			// 	    })
			// 	}
			// }
			// wx.emedia.mgr.onStreamAdded = function(stream){
			// 	console.log('%c onAddStream', 'color: green', stream)
			// 	let streamId = stream.id
			// 	// setTimeout(() => {
			// 		if(subUrls.length > 8){
			// 			return
			// 		}
			// 		wx.emedia.mgr.subStream(streamId).then(function(data){
			// 			console.log('%c 订阅流成功', 'color:green', data)
			// 			// let playContext = wx.createLivePlayerContext(streamId, me)
			// 			let subUrl = {
			// 				streamId: streamId,
			// 				subUrl: data.data.rtmp,
			// 				memName: stream.memName.split("_")[1].split("@")[0],
			// 				// playContext: playContext
			// 			}
			// 			subUrls.push(subUrl)
			// 			console.log('%c subUrls 11 ....', "background:yellow")
			// 			console.log(subUrls)
	
			// 			me.setData({
			// 				subUrls: subUrls,
			// 				showInvite: false
			// 			})
			// 		})
			// 	// }, 2000)

			// }
			// wx.emedia.mgr.onStreamRemoved = function(stream){
			// 	console.log('%c onRemoveStream', 'color: red', stream)
			// 	subUrls = subUrls.filter((item) => {
			// 		if(item.streamId != stream.id){
			// 			return item
			// 		}else{
			// 			console.log('%c ------', 'backgroukd:yellow')
			// 			console.log(item)
			// 			// item.playContext.stop({
			// 			// 	success: function(){
			// 			// 		console.log('关闭成功')
			// 			// 	},
			// 			// 	complete: function(){
			// 			// 		console.log('关闭成功')
			// 			// 	}
			// 			// })
			// 		}
			// 	})
			// 	obj[stream.id] = false
			// 	me.setData({
			// 		subUrls: subUrls,
			// 	})
			// 	console.log('subUrls', subUrls)
			// }

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
		beauty: 9,
		beautyColor: '#fff',
		myName: '',
		confrId: '',
		enableCamera: true,
		time: '',
		clickPeding: false
	},

	methods: {
		initClient(){
			// ------------------- agora------------
			let me = this;
			let client = this.client = new wx.AgoraMiniappSDK.Client();
			client.setRole('broadcaster')
			const appId = "15cb0d28b87b425ea613fc46f7c9f974";
			client.init(appId, () => {
			  	console.log(`client init success`);
			}, e => {
			  	console.log(`client init failed: ${e} ${e.code} ${e.reason}`);
			  	reject(e)
			});

			// --------------- subscribed ------------
			client.on("stream-added", e => {
				console.log('stream-added ------- ', e)
				client.subscribe(e.uid, 
					(url) => {
						let memName = ''
						if (me.uid2userids[e.uid]) {
							memName = me.uid2userids[e.uid]
							setSubUser(url, memName)
						}else{
							me.getConfDetail(wx.WebIM.conn.context.userId, emediaState.confr.channel, (res) => {
								memName = res[e.uid]
								setSubUser(url, memName)
							})
						}
					}, 
					(err) => {console.log('error', err)}
				)

				function setSubUser(url, memName){
					console.log('subscribe', url)
					let subUrls = me.data.subUrls
					subUrls.push({subUrl: url, memName: memName})
					me.setData({
						subUrls: subUrls,
						showInvite: false
					})
				}
			});

			client.on("stream-removed", (user) => {
	        	console.log('-- 对方已离开 ---', user)
	            let subUrls = me.data.subUrls.filter((item) => {
	            	if (item.memName != me.uid2userids[user.uid]) {
	            		return item
	            	}
	            });
				me.setData({
					subUrls: subUrls
				})
	        })
		},
		getToken(userId, channelName){
			let me = this
			wx.request({
				url: `https://a1-hsb.easemob.com/token/rtcToken?userAccount=${userId}&channelName=${channelName}&appkey=${encodeURIComponent('easemob-demo#easeim')}`,//仅为示例，并非真实的接口地址
				header: {
				    'Authorization': 'Bearer ' + wx.WebIM.conn.context.accessToken
				},
				success (res) {
				    console.log('请求token成功', res)
				    let {accessToken, agoraUserId} = res.data
				    me.joinChannel(accessToken, channelName, agoraUserId)
				},
				fail(res){
				  	console.log('请求token失败', res)
				}
			})
		},
		getConfDetail(userId, channelName, callback){
			let me = this
			wx.request({
				url: `https://a1-hsb.easemob.com/channel/mapper?userAccount=${userId}&channelName=${channelName}&appkey=${encodeURIComponent('easemob-demo#easeim')}`,//仅为示例，并非真实的接口地址
				header: {
				    'Authorization': 'Bearer ' + wx.WebIM.conn.context.accessToken
				},
				success (res) {
				    // let result = res.data.result
				    me.uid2userids = res.data.result
				    callback&&callback(res.data.result)
				},
				fail(res){
				}
			})
		},
		joinChannel(token, channel, uid){
			console.log('token ----', token, channel, uid)
			this.client.join(token, channel, uid, (res) => {
			  	console.log(`client join channel success`, res);
			  	this.publish()
			  	this.getConfDetail(wx.WebIM.conn.context.userId, channel)
			}, e => {
			  	console.log('join fail', e)
			});
		},
		publish(){
			this.client.publish(url => {
			  	console.log(`client publish success`, url);
			  	this.setData({
					pubUrl: url
				})
				setTimeout(() => {
					this.LivePusherContext.start()
				}, 1000)
			}, e => {
			  	console.log(`client publish failed: ${e.code} ${e.reason}`);
			});
		},

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
		},

		clickPending(){
			this.data.clickPeding = true
			setTimeout(() => {
				this.data.clickPeding = false;
			}, 1000)
		},
		
		togglePlay(){
			let me = this
			console.log("%c togglePlay", "color:green")
			if (this.data.clickPeding) {return};
			this.clickPending()
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
			if (this.data.clickPeding) {return};
			this.clickPending()
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
		},

		toggleMuted(){
			console.log("%c toggleMuted", "color:green")
			if (this.data.clickPeding) {return};
			this.clickPending()
			this.setData({
				muted: !this.data.muted,
				micphoneIcon: this.data.micphoneIcon == 'micphone_white'? 'micphone_gray': 'micphone_white',
				micphoneColor: this.data.micphoneColor == '#fff'? '#aaa': '#fff'
			})
		},

		toggleBeauty(){
			if (this.data.clickPeding) {return};
			this.clickPending()
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
			emediaState.hangup()
			this.client.leave();
		},
		inviteMember(){
			this.triggerEvent('inviteMember', this.data.groupId)
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