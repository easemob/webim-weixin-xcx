let WebIM = require("../../utils/WebIM")["default"];

Page({
	data: {
		username: ""
	},
	onLoad: function(){
		var myUsername = wx.getStorageSync("myUsername");
		this.setData({
			username: myUsername
		});
	},
	tab_contact: function(){
		wx.redirectTo({
			url: "../main/main?myName=" + this.data.username
		});
	},
	tab_chat: function(){
		wx.redirectTo({
			url: "../chat/chat"
		});
	},
	person: function(){
		var myUsername = wx.getStorageSync("myUsername");
		wx.navigateTo({
			url: "../friend_info/friend_info?yourname=" + myUsername
		});
	},
	logout: function(){
		wx.showModal({
			title: "是否退出登录",
			success: function(res){
				if(res.confirm){
					WebIM.conn.close();
					// wx.closeSocket()
					wx.redirectTo({
						url: "../login/login"
					});
				}
			}
		});
	}
});
