let WebIM = require("../../utils/WebIM")["default"];
let disp = require("../../utils/broadcast");

Page({
	data: {
		username: "",
	},
	onLoad: function(){
		let myUsername = wx.getStorageSync("myUsername");
		let me = this;
		this.setData({
			username: myUsername
		});

		this.setData({
			switchStatus: WebIM.config.isDebug
		});
	},
	
	onShow(){
		this.setData({
			switchStatus: WebIM.config.isDebug
		});
	},

	openDebug(event){
		WebIM.isDebug({
			isDebug: event.detail.value
		});
	}

});
