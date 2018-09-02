var WebIM = require("../../utils/WebIM")["default"];

Page({
	data: {
		friend_name: ""
	},

	bindFriendName: function(e){
		this.setData({
			friend_name: e.detail.value
		});
	},

	onShow: function(){
		// console.log(getCurrentPages())
	},

	sendMsg: function(){
		wx.showToast({
			title: "消息发送成功！",
			duration: 1500
		});
	},

	add_friend: function(){
		if(this.data.friend_name == ""){
			wx.showToast({
				title: "好友添加失败！",
				duration: 1500
			});
			return;
		}
		WebIM.conn.subscribe({
			to: this.data.friend_name
			// message: "hello!"
		});
		wx.showToast({
			title: "消息发送成功！",
			duration: 1500
		});
	}
});
