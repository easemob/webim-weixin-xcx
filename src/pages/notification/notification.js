let disp = require("../../utils/broadcast");
Page({
	data: {
		messageNum: 0,
		unReadSpotNum: 0,
		groupInviteNum: 0,
		unReadTotalNotNum: 0
	},

	onLoad(option){
		let me = this;
		//监听加好友申请
		disp.on("em.xmpp.subscribe", function(){
			me.setData({
				messageNum: getApp().globalData.saveFriendList.length,
				unReadTotalNotNum: getApp().globalData.saveFriendList.length + getApp().globalData.saveGroupInvitedList.length
			});
		});

		//监听未读消息数
		disp.on("em.xmpp.unreadspot", function(){
			me.setData({
				unReadSpotNum: getApp().globalData.unReadMessageNum,
			});
		});
		//监听加群通知数
		disp.on("em.xmpp.invite.joingroup", function(){
			me.setData({
				groupInviteNum: getApp().globalData.saveGroupInvitedList.length,
				unReadTotalNotNum: getApp().globalData.saveFriendList.length + getApp().globalData.saveGroupInvitedList.length
			});
		});

		wx.setStorageSync("friendNotiData", getApp().globalData.saveFriendList)
		wx.setStorageSync("groupNotiData", getApp().globalData.saveGroupInvitedList)
	},

	onShow(){
		this.setData({
			messageNum: getApp().globalData.saveFriendList.length,
			unReadSpotNum: getApp().globalData.unReadMessageNum > 99 ? '99+' : getApp().globalData.unReadMessageNum,
			groupInviteNum: getApp().globalData.saveGroupInvitedList.length,
			unReadTotalNotNum: getApp().globalData.saveFriendList.length + getApp().globalData.saveGroupInvitedList.length
		});
		if (getApp().globalData.isIPX) {
			this.setData({
				isIPX: true
			})
		}
	},

	into_friendNot: function(){
		wx.navigateTo({
			url: "../notification_friendDetail/friendDetail?myName=" + wx.getStorageSync("myUsername")
		});
	},

	into_groupNot: function(){
		wx.navigateTo({
			url: "../notification_groupDetail/groupDetail?myName=" + wx.getStorageSync("myUsername")
		});
	},

	tab_contact: function(){
		wx.redirectTo({
			url: "../main/main?myName=" + wx.getStorageSync("myUsername")
		});
	},
	tab_chat: function(){
		wx.redirectTo({
			url: "../chat/chat"
		});
	},
	tab_setting: function(){
		wx.redirectTo({
			url: "../setting/setting"
		});
	},
})