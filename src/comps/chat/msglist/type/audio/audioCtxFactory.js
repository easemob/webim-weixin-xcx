// 每一个音频消息都有自己的 ctx。
// 可以有多个 ctx，每次播放都能知道是哪个 ctx 在调用，从而让其他的 ctx pause。
// 消息销毁，记得处理 ctx。
// 主要是同步跨 ctx 的操作，保证只有一个 ctx 播放
let allCtx = {};
let inUseCtx = null;
let allComm = {}
function proxier(ctx){
	let __play__ = ctx.play;
	let __pause__ = ctx.pause;
	ctx.play = playProxier;
	ctx.pause = pauseProxier;
	function playProxier(){
		// 如果正在播放的不是自己，暂停
		if(inUseCtx && inUseCtx != this){
			inUseCtx.pause();
		}
		__play__.call(this);
		inUseCtx = this;
	}
	function pauseProxier(){
		// 只有是自己才 pause
		if(inUseCtx == this){
			__pause__.call(this);
		}
	}
}

module.exports = {
	getCtx(mid){
		let returnCtx = allCtx[mid];
		if(!returnCtx){
			returnCtx = wx.createInnerAudioContext();
			allCtx[mid] = returnCtx;
			proxier(returnCtx);
		}
		return returnCtx;
	},
	getAllCtx(){
		wx.setStorageSync("allCtx", JSON.stringify(Object.keys(allCtx)));
		return allCtx
	},
	getCommponet(mid,comm){
		let curComm = allComm[mid]
		if (!curComm) {
			allComm[mid] = comm
		}
		return allComm
	}
};
