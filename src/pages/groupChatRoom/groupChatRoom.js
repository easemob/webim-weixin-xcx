let disp = require("../../utils/broadcast");
Page({
	data: {
		username: {
			your: "",
		},
	},
	
	// options = 系统传入的 url 参数
	onLoad(options){
		let username = JSON.parse(options.username);
		this.setData({ username: username });
		wx.setNavigationBarTitle({
			title: username.your
		});
	},

	onUnload(){
		disp.fire("em.chatroom.leave");
	},

	onPullDownRefresh: function () {
	  	wx.showNavigationBarLoading();
	    this.selectComponent('#groupchat').getMore()
	    // 停止下拉动作
	    wx.hideNavigationBarLoading();
	    wx.stopPullDownRefresh();
  	},
});
