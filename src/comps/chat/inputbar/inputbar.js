let RecordStatus = require("suit/audio/record_status").RecordStatus;

Component({
	data: {
		recordStatus: RecordStatus.HIDE,
		RecordStatus,
	},
	comps: {
		main: null,
		emoji: null,
		image: null,
		location: null,
		audio: null,
		// video: null,
	},
	method: {
		// 事件有长度限制：仅限 26 字符
		openCamera(){
			this.comps.image.openCamera();
		},

		sendImage(){
			this.comps.image.sendImage();
		},

		sendLocation(){
			this.comps.location.sendLocation();
		},

		openEmoji(){

		},

		toggleRecordModal(){

		},
	},

	lifetimes: {
		created(){},
		attached(){},
		moved(){},
		detached(){},
		ready(){
			let comps = this.comps;
			comps.main = this.selectComponent("chat-suit-main");
			comps.emoji = this.selectComponent("chat-suit-emoji");
			comps.image = this.selectComponent("chat-suit-image");
			comps.location = this.selectComponent("chat-suit-location");
			comps.audio = this.selectComponent("chat-suit-audio");
			// comps.video = this.selectComponent("chat-suit-video");
		},
	},

	pageLifetimes: {
		// 组件所在页面的生命周期函数
		show(){},
		hide(){},
	},
});
