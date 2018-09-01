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
});
