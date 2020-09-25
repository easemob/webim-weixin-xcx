let disp = require("../../utils/broadcast");

Page({
	data: {
		username: {
			your: "",
		},
	},

	// options = 系统传入的 url 参数
	onLoad(options){
		let me = this
		let username = options && JSON.parse(options.username) || {};
		this.setData({ username: username });
		wx.setNavigationBarTitle({
			title: username.your
		});
		disp.on('em.megList.refresh', function(){
			const pages = getCurrentPages();
			const currentPage = pages[pages.length - 1];
			if ( currentPage.route == "pages/chatroom/chatroom") {
				me.onLoad()
			}
		})
	},

	onUnload(){
		disp.fire("em.chatroom.leave");
	},

	onPullDownRefresh: function () {
	  	wx.showNavigationBarLoading();
	    this.selectComponent('#chat').getMore()
	    // 停止下拉动作
	    wx.hideNavigationBarLoading();
	    wx.stopPullDownRefresh();
  	},

});
