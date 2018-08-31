let msgStorage = require("msgstorage");

Component({
	properties: {
		username: {
			type: Object,
			value: {},
		}
	},
	data: {
		__comps__: {
			msglist: null,
			inputbar: null,
			audio: null,
		},
	},
	methods: {
		toggleRecordModal(){
			this.data.__comps__.audio.toggleRecordModal();
		},
		
		normalScroll(){
			this.data.__comps__.msglist.normalScroll();
			this.data.__comps__.inputbar.cancelEmoji();
		},

		shortScroll(){
			this.data.__comps__.msglist.shortScroll();
		},

		saveSendMsg(evt){
			msgStorage.saveMsg(evt.detail.msg, evt.detail.type);
			this.data.__comps__.inputbar.cancelEmoji();
		},
	},
	// lifetimes
	created(){ console.log("created"); },
	attached(){ console.log("attached"); },
	ready(){
		console.log("ready");
		this.data.__comps__.inputbar = this.selectComponent("#chat-inputbar");
		this.data.__comps__.msglist = this.selectComponent("#chat-msglist");
		this.data.__comps__.audio = this.selectComponent("#chat-suit-audio");
	},
	moved(){ console.log("moved"); },
	detached(){ console.log("detached"); },
	// 组件所在页面的生命周期函数
	show(){ console.log("show"); },
	hide(){ console.log("hide"); },
});
