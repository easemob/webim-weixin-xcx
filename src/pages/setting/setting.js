let WebIM = require("../../utils/WebIM")["default"];
let disp = require("../../utils/broadcast");
Page({
	data: {
		yourname: "",
		messageNum: 0,
		unReadSpotNum: 0,
		unReadNoticeNum: 0,
		unReadTotalNotNum: 0
	},

	onLoad: function(option){
		let me = this;
		this.setData({
			yourname: wx.getStorageSync("myUsername")
		});
		//监听加好友申请
		disp.on("em.xmpp.subscribe", function(){
			me.setData({
				messageNum: getApp().globalData.saveFriendList.length,
				unReadTotalNotNum: getApp().globalData.saveFriendList.length + getApp().globalData.saveGroupInvitedList.length
			});
		});

		//监听未读“聊天”
		disp.on("em.xmpp.unreadspot", function(){
			me.setData({
				unReadSpotNum: getApp().globalData.unReadMessageNum,
			});
		});

		//监听未读“通知”数
		disp.on("em.xmpp.invite.joingroup", function(count){
			me.setData({
				unReadNoticeNum: getApp().globalData.saveGroupInvitedList.length,
				unReadTotalNotNum: getApp().globalData.saveFriendList.length + getApp().globalData.saveGroupInvitedList.length
			});
		});
	},

	onShow(){
		this.setData({
			messageNum: getApp().globalData.saveFriendList.length,
			unReadSpotNum: getApp().globalData.unReadMessageNum > 99 ? '99+' : getApp().globalData.unReadMessageNum,
			unReadNoticeNum: getApp().globalData.saveGroupInvitedList.length,
			unReadTotalNotNum: getApp().globalData.saveFriendList.length + getApp().globalData.saveGroupInvitedList.length
		});
		if (getApp().globalData.isIPX) {
			this.setData({
				isIPX: true
			})
		}
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

	tab_notification: function(){
		wx.redirectTo({
			url: "../notification/notification"
		});
	},

	goGeneralSetting: function(){
		wx.navigateTo({
			url: "../setting_general/setting_general"
		});
	},

	goEmediaSetting: function(){
		wx.navigateTo({
			url: "../emediaSetting/emediaSetting"
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
