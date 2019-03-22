let audioCtxFc = require("audioCtxFactory");
let playStatus = require("playStatus");
Component({
	properties: {
		msg: {
			type: Object,
			val: {}
		},
	},
	data: {
		playStatus: playStatus,
		curStatus: playStatus.STOP,
		time: "0'",
		opcity: 1,
		__comps__: {
			audioCtx: null,
		}
	},
	methods: {
		audioPlay(){
			if (this.data.curStatus == playStatus.STOP) {
				this.data.curStatus = playStatus.PLAYING
				let audioCtx = wx.createInnerAudioContext();

				audioCtx.src = this.data.msg.msg.url;
				audioCtx.autoplay = false;
				audioCtx.loop = false;

				audioCtx.play();
				audioCtx.onTimeUpdate(()=>{

				})
				audioCtx.onPlay(()=>{
					this.inter = setInterval(() => {
						let opcity = this.data.opcity;
						this.setData({
							opcity: opcity == 1 ? 0.4 : 1
						})
					}, 500)

				})
				audioCtx.onEnded(() => {
					this.data.curStatus = playStatus.STOP
					clearInterval(this.inter)
					this.setData({
						opcity: 1
					})
				})
			}
		},

		audioPause(){
			let audioCtx = this.data.__comps__.audioCtx;
			audioCtx.pause();
		},

		addEvent(){
			let audioCtx = this.data.__comps__.audioCtx;
			// audioCtx.onPlay(this.onPlaying);
			// audioCtx.onPause(this.onPause);
			// audioCtx.onWaiting(this.onPause);
			// audioCtx.onStop(this.onDone);
			// audioCtx.onEnded(this.onDone);
			// audioCtx.onError(this.onDone);
			// audioCtx.onTimeUpdate(this.onTimeUpdate);
		},

		delEvent(){
			let audioCtx = this.data.__comps__.audioCtx;
			// audioCtx.offPlay(this.onPlaying);
			// audioCtx.offPause(this.onPause);
			// audioCtx.offWaiting(this.onPause);
			// audioCtx.offStop(this.onDone);
			// audioCtx.offEnded(this.onDone);
			// audioCtx.offError(this.onDone);
			// 多次播放会丢失这个回调，所以不用卸载
			 //audioCtx.offTimeUpdate(this.onTimeUpdate);
		},
	},

	// lifetimes
	created(){
	},
	attached(){
		//this.setData({time: this.properties.msg.msg.length + 'first'})
		this.setData({
			time: this.properties.msg.msg.length + "''",
			style: this.properties.msg.style
		})
		let audioCtx = wx.createInnerAudioContext();

		audioCtx.src = this.data.msg.msg.url;
		audioCtx.autoplay = false;
		audioCtx.loop = false;

		audioCtx.onPlay(()=>{
			audioCtx.play();
		})
		
		audioCtx.onTimeUpdate(()=>{
		})

	},
	moved(){
	},
	detached(){
		// this.audioPause();
		// this.delEvent();
	},
	ready(){
		//console.log('render 消息', this.properties.msg)
		let audioCtx = wx.createInnerAudioContext();

			audioCtx.src = this.data.msg.msg.url;
			audioCtx.autoplay = false;
			audioCtx.loop = false;

			audioCtx.onPlay(()=>{
				audioCtx.play();
			})
			audioCtx.onStop(()=>{
			})
			
			audioCtx.onTimeUpdate(()=>{
			})

		// let audioCtx
		// 	= this.data.__comps__.audioCtx
		// 	= audioCtxFc.getCtx(this.data.msg.mid);
		// audioCtx.src = this.data.msg.msg.url;
		// audioCtx.autoplay = false;
		// audioCtx.loop = false;
		//
		
		// this.onPlaying = () => {
		// 	console.log("onPlaying", JSON.stringify(this.data));
		// 	// this.setData({
		// 	// 	curStatus: playStatus.PLAYING
		// 	// });
		// };
		// this.onPause = () => {
		// 	console.log("onPause", JSON.stringify(this.data));
		// 	// 第二次播放会立即抛出一个异常的 onPause
		// 	if(parseInt(this.data.time, 10) < 1){
		// 		return;
		// 	}
		// 	this.setData({
		// 		curStatus: playStatus.PAUSE,
		// 		time: "0'",
		// 	});
		// };
		// this.onDone = () => {
		// 	//console.log("onDone", JSON.stringify(this.data));
		// 	this.setData({
		// 		curStatus: playStatus.STOP,
		// 		time: "0'",
		// 	});
		// };
		// 多次播放会丢失这个回调
		// this.onTimeUpdate = () => {
		// 	this.setData({
		// 		time: (audioCtx.currentTime >> 0) + "'",
		// 	});
		// };
		// this.addEvent();
	},
});
