var emediaState = require('../multiEmedia/emediaState')
Component({
	properties: {//接收父组件传过来的值
	    username: null,//定义接收参数变量及允许传入参数类型
		action: null,
		groupId: null
	},

	lifetimes: {
		attached: function () {
			this.LivePusherContext = wx.createLivePusherContext()
			this.initConfr()
			let myUserId = wx.WebIM.conn.context.jid.name
			console.log('properties', this.properties)
			let action = this.properties.action
			if (emediaState.confr.type == 0) {
				this.setData({
					isAudio: true
				})
			}
			this.getToken(myUserId, emediaState.confr.channel)
			this.getTimer()
		}
	},

	data: {
		devicePositionIcon: 'switchCamera_white',
		devicePositionColor: '#fff',
		micphoneIcon: 'micphone_white',
		micphoneColor: '#fff',
		videoIcon: 'video_white',
		videoColor: '#fff',
		beautyIcon: 'beauty',
		beautyColor: '#fff',
		enableCamera: true,
		devicePosition: 'front',
		muted: false,

		isCalling: true,
		pubUrl: '',
		subUrl: '',
		time: '',
		isAudio: false
	},

	methods: {
		initConfr(userId){
			let me = this
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
						console.log('subscribe', url)
						me.setData({
							subUrl: url,
							showInvite: false
						})
					}, 
					(err) => {console.log('error', err)}
				)
			});
			client.on("stream-removed", (user) => {
	        	this.hangup()
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

		joinChannel(token, channel, uid){
			console.log('token ----', token, channel, uid)
			this.client.join(token, channel, uid, (res) => {
			  	console.log(`client join channel success`, res);
			  	this.publish()
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
				// setTimeout(() => {
				// 	this.LivePusherContext.start()
				// }, 1000)
				
			}, e => {
			  	console.log(`client publish failed: ${e.code} ${e.reason}`);
			});
		},

		statechange(e){
			console.log('statechange', e)
		},
		netstatusChange(e){
			console.log('netstatusChange', e)
		},

		togglePlay(){
			let me = this
			console.log("%c togglePlay", "color:green")
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
			this.setData({
				muted: !this.data.muted,
				micphoneIcon: this.data.micphoneIcon == 'micphone_white'? 'micphone_gray': 'micphone_white',
				micphoneColor: this.data.micphoneColor == '#fff'? '#aaa': '#fff'
			})
		},

		toggleBeauty(){
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
	}
})

