let WebIM = require("../../utils/WebIM")["default"];
let disp = require("../../utils/broadcast");

Page({
	data: {
		username: "",
		unReadSpot: false,
	},
	onLoad: function(){
		var myUsername = wx.getStorageSync("myUsername");
		var me = this;
		this.setData({
			username: myUsername
		});
		disp.on("em.xmpp.unreadspot", function(count){
			me.setData({
				unReadSpot: count > 0
			});
		});
	},
	onShow(){
		this.setData({
			unReadSpot: getApp().globalData.unReadSpot,
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
