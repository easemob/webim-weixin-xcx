const WebIM = wx.WebIM
const emediaState = require('./emediaState')
let disp = require("../../../utils/broadcast");
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
				url: `https://a1.easemob.com/token/rtcToken/v1?userAccount=${userId}&channelName=${channelName}&appkey=${encodeURIComponent('easemob-demo#easeim')}`,//仅为示例，并非真实的接口地址
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
				url: `https://a1.easemob.com/channel/mapper?userAccount=${userId}&channelName=${channelName}&appkey=${encodeURIComponent('easemob-demo#easeim')}`,//仅为示例，并非真实的接口地址
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
			if (!token || !channel || !uid) { return }
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

		joinRoom(data){},
		createConf(){},

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