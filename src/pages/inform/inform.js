var WebIM = require("../../utils/WebIM")["default"];
let disp = require("../../utils/broadcast");

// 好友邀请提醒
Page({
	data: {
		friendList: [],
		myName: "",
	},

	onLoad(options){
		var me = this;
		// 不需要 object 地址更新，就能刷
		disp.on("em.xmpp.subscribe", function(){
			me.setData({
				friendList: getApp().globalData.saveFriendList
			});
		});
		this.setData({
			myName: options.myName,
			// 哈？global？好吧
			friendList: getApp().globalData.saveFriendList
		});
	},

	removeAndRefresh(removeId){
		var idx;
		this.data.friendList.forEach(function(v, k){
			if(v.from === removeId){
				idx = k;
			}
		});
		this.data.friendList.splice(idx, 1);
		getApp().globalData.saveFriendList.splice(idx, 1);
		if(!this.data.friendList.length){
			wx.navigateBack({
				url: "../main/main?myName=" + this.data.myName
			});
		}
		else{
			this.setData({
				friendList: this.data.friendList
			});
		}
	},

	agree(event){
		var me = this;
		// 同意（无回调）
		WebIM.conn.subscribed({
			to: event.currentTarget.dataset.from,
			message: "[resp:true]",
		});
		// 需要反向添加对方好友（无回调）
		WebIM.conn.subscribe({
			to: event.currentTarget.dataset.from,
			message: "[resp:true]",
		});
		wx.showToast({
			title: "OK",
			duration: 1000
		});
		setTimeout(function(){
			me.removeAndRefresh(event.currentTarget.dataset.from);
		}, 1000);
	},

	reject(event){
		var me = this;
		// 无回调
		WebIM.conn.unsubscribed({
			to: event.currentTarget.dataset.from,
			message: "rejectAddFriend",
		});
		wx.showToast({
			title: "已拒绝",
			duration: 1000
		});
		setTimeout(function(){
			me.removeAndRefresh(event.currentTarget.dataset.from);
		}, 1000);
	}
});
