var WebIM = require("../../utils/WebIM")["default"];
let disp = require("../../utils/broadcast");

// 好友邀请提醒
Page({
	data: {
		groupList: [],
	},

	onLoad(options){
		var me = this;
		// 不需要 object 地址更新，就能刷
		disp.on("em.xmpp.invite.joingroup", function(){
			me.setData({
				groupList: getApp().globalData.saveGroupInvitedList
			});
			wx.setStorageSync("groupNotiData", getApp().globalData.saveGroupInvitedList)
		});

		this.setData({
			groupList: wx.getStorageSync("groupNotiData")
			//getApp().globalData.saveGroupInvitedList 
			// [{
			// 	from: "zdtest2",
			// 	reason: "",
			// 	roomid: "75443436847105",
			// 	type: "invite"
			// },
			// {
			// 	from: "zdtest3",
			// 	reason: "",
			// 	roomid: "75443436847105",
			// 	type: "invite"
			// }
			// ]
		});
	},
	onShow(){
		getApp().globalData.saveGroupInvitedList = [];
		this.listGroups()
	},

	listGroups(){
		var me = this;
		return WebIM.conn.listRooms({
			success: function(rooms){
				wx.setStorage({
					key: "listGroup",
					data: rooms
				});
			},
			error: function(err){
				console.log(err)
			}
		});
	},

	removeAndRefresh(removeId){
		
	},

});
