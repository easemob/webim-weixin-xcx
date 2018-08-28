// 获取应用实例
var app = getApp();
Page({
	timeOut: null,
	data: {
		motto: "环信即时通讯云",
		userInfo: {},
		login: false
	},
	// 事件处理函数
	bindViewTap: function(){
		clearTimeout(this.timeOut);
		wx.redirectTo({
			url: "../login/login"
		});
	},
	onLoad: function(){
		this.timeOut = setTimeout(function(){
			wx.redirectTo({
				url: "../login/login"
			});
		}, 3000);
		var that = this;
		// 调用应用实例的方法获取全局数据
		app.getUserInfo(function(userInfo){
			// 更新数据
			that.setData({
				userInfo: userInfo
			});
		});
	}
});
