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
			//if (this.data.curStatus == playStatus.STOP){
			let id = this.data.msg.mid;
			let audioCtx = this.data.__comps__.audioCtx;
			let allCtx = JSON.parse(wx.getStorageSync("allCtx"))
			this.setData({
				opcity: 1
			})
			allCtx.map((elem, index)=>{
					//if (elem!=id) {
						clearInterval(wx.inter)
						this.allCtx[elem].stop()

					//}
				})
			if (this.data.curStatus == playStatus.PLAYING ) {
				return this.audioPause()
			} else if (this.data.curStatus == playStatus.STOP) {
				
				

				audioCtx.src = this.data.msg.msg.url;
				audioCtx.autoplay = false;
				audioCtx.loop = false;
				

				audioCtx.play();
				audioCtx.isend = false
				this.data.curStatus = playStatus.PLAYING
				audioCtx.onTimeUpdate(()=>{

				})
				audioCtx.onPlay(()=>{
					if (this.data.curStatus == playStatus.PLAYING) {
					wx.inter = setInterval(() => {
						let opcity = this.data.opcity;
						this.setData({
							opcity: opcity == 1 ? 0.4 : 1
						})
						this.id = id
					}, 500)
					audioCtx.offPlay();
				}
				})

				audioCtx.onEnded(() => {
					this.data.curStatus = playStatus.STOP
					audioCtx.isend = true
					clearInterval(wx.inter)

					this.setData({
						opcity: 1
					})
					audioCtx.offEnded();
				})

			}
		},

		audioPause(){
			let audioCtx = this.data.__comps__.audioCtx;
			audioCtx.pause();
			this.data.curStatus = playStatus.STOP
			clearInterval(audioCtx.inter)
			this.setData({
				opcity: 1
			})
			audioCtx.isend = false
			audioCtx.offEnded();
			audioCtx.offPause();
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
		 this.audioPause();
		 this.setData({
			opcity: 1
		})
		// this.delEvent();
	},
	ready(){
		//console.log('render 消息', this.properties.msg)
		let audioCtx
			= this.data.__comps__.audioCtx
			= audioCtxFc.getCtx(this.data.msg.mid);
		this.allCtx = audioCtxFc.getAllCtx();
		this.allComm = audioCtxFc.getCommponet(this.data.msg.mid, this);
		//let audioCtx = wx.createInnerAudioContext();

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
