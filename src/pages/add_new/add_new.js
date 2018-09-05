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
		let me = this;
		if(me.data.friend_name == ""){
			wx.showToast({
				title: "好友添加失败！",
				duration: 1500
			});
			return;
		}
		WebIM.conn.subscribe({
			to: me.data.friend_name
		});

		// 判断当前是否存在该好友
		let rosters = {
			success: function(roster){
				var member = [];
				for(let i = 0; i < roster.length; i++){
					if(roster[i].subscription == "both"){
						member.push(roster[i]);
					}
				}
				if(me.isExistFriend(me.data.friend_name, member)){
					wx.showToast({
						title: "已经是你的好友",
						duration: 1500
					});
				}
				else{
					wx.showToast({
						title: "消息发送成功！",
						duration: 1500
					});
				}
				// console.log(member)
			}
		};
		WebIM.conn.getRoster(rosters);
	},
	isExistFriend: function(name, list){
		for(let index = 0; index < list.length; index++){
			if(name == list[index].name){
				return true
			}
		}
		return false
	}
});
