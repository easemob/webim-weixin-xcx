var WebIM = require("../../utils/WebIM")["default"];

// 好友邀请提醒
Page({
	data: {
		friendList: []
	},

	onLoad: function(options){
		this.setData({
			friendList: getApp().globalData.saveFriendList
		});
		WebIM.conn.getRoster({
			success: function(roster){

			}
		});
	},

	agree: function(event){
		WebIM.conn.subscribed({
			to: event.target.id,
			message: "[resp:true]"
		});
		WebIM.conn.subscribe({
			to: event.target.id,
			message: "[resp:true]"
		});
	},

	reject: function(event){
		WebIM.conn.unsubscribed({
			to: event.target.id,
			message: "rejectAddFriend"
		});
	}
});
