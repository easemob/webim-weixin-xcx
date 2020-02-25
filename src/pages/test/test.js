Page({
	data: {
		videoIcon: 'video_white',
		micphoneIcon: 'micphone_white',
		micphoneColor: '#fff',
		videoColor: '#fff',
		url: '',
		pubUrl: '',
		enableCamera: true,
		muted: false
	},

	onLoad(){
		console.log(2)
		var me = this
		wx.getStorage({
		  key: 'url',
		  success (res) {
		    console.log(res.data)
		    me.setData({
		    	url: res.data
		    })
		  }
		})

		this.LivePusherContext = wx.createLivePusherContext();
	},
	onUnload(){
		wx.setStorage({
		  key:"url",
		  data:this.data.url
		})
	},

	onHide(){
		wx.setStorage({
		  key:"url",
		  data:this.data.url
		})
	},

	bindUsername: function(e){
		this.setData({
			url: e.detail.value
		});
	},
	togglePlay(){
		let me = this
		console.log("%c togglePlay", "color:green")
		this.setData({
			enableCamera: !me.data.enableCamera,
			pubUrl: me.data.pubUrl,
			videoIcon: this.data.videoIcon == 'video_white'?'video_gray': 'video_white',
			videoColor: this.data.videoColor == '#fff'? '#aaa': '#fff'
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
	start(){
		console.log('url', this.data.url)
		var me = this
		this.setData({
			pubUrl: me.data.url || 'https://domain/push_stream'
		})
		wx.setStorage({
		  key:"url",
		  data:this.data.url
		})

		this.LivePusherContext.start()
		console.log(this.data.pubUrl)
	},
	stop(){
		// this.setData({
		// 	pubUrl: ''
		// })
		this.LivePusherContext.stop()
	}

});





