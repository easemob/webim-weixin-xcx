let RecordStatus = require("suit/audio/record_status").RecordStatus;
let msgType = require("../msgtype");

Component({
	properties: {
		username: {
			type: Object,
			value: {}
		},
		chatType: {
			type: String,
			value: msgType.chatType.SINGLE_CHAT,
		},
	},
	data: {
		recordStatus: RecordStatus.HIDE,
		RecordStatus,
		__comps__: {
			main: null,
			emoji: null,
			image: null,
			location: null,
			video: null,
			ptopcall: null
		},
	},
	methods: {
		// 事件有长度限制：仅限 26 字符
		toggleRecordModal(){
			this.triggerEvent(
				"tapSendAudio",
				null,
				{
					bubbles: true,
					composed: true
				}
			);
		},

		onMakeVideoCall(evt){
	  		this.triggerEvent('makeVideoCall', evt.detail)
	  	},

	  	onMakeAudioCall(evt){
	  		this.triggerEvent('makeAudioCall', evt.detail)
		},

		sendVideo(){
			this.data.__comps__.video.sendVideo();
		},

		openCamera(){
			this.data.__comps__.image.openCamera();
		},

		openEmoji(){
			this.data.__comps__.emoji.openEmoji();
		},

		cancelEmoji(){
			this.data.__comps__.emoji.cancelEmoji();
		},

		sendImage(){
			this.data.__comps__.image.sendImage();
		},

		sendLocation(){
			// this.data.__comps__.location.sendLocation();
		},

		emojiAction(evt){
			this.data.__comps__.main.emojiAction(evt.detail.msg);
		},

		callVideo(){
			console.log('this.data.__comps__.ptopcall', this.data.__comps__.ptopcall)

			console.log('username', this.data.username)
			if (this.data.username.groupId) {
				this.data.__comps__.ptopcall.show('group')
			}else{
				this.data.__comps__.ptopcall.show('contact')
			}
		}
	},

	// lifetimes
	created(){},
	attached(){},
	moved(){},
	detached(){},
	ready(){
		this.setData({
			isIPX: getApp().globalData.isIPX
		})
		let comps = this.data.__comps__;
		comps.main = this.selectComponent("#chat-suit-main");
		comps.emoji = this.selectComponent("#chat-suit-emoji");
		comps.image = this.selectComponent("#chat-suit-image");
		comps.ptopcall = this.selectComponent("#chat-suit-ptopcall")
		// comps.location = this.selectComponent("#chat-suit-location");
		comps.video = this.selectComponent("#chat-suit-video");
	},
});
