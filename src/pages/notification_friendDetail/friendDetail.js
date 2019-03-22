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
			wx.setStorageSync("friendNotiData", getApp().globalData.saveFriendList)
		});

		this.setData({
			myName: wx.getStorageSync("myUsername"),
			// 哈？global？好吧
			friendList: wx.getStorageSync("friendNotiData")
			//getApp().globalData.saveFriendList 
			// [{
			// 	chatroom: false,
			// 	code: "",
			// 	from: "zdtest2",
			// 	fromJid: "easemob-demo#chatdemoui_zdtest2@easemob.com",
			// 	original_type: "subscribe",
			// 	presence_type: "",
			// 	status: "zdtest2请求添加好友",
			// 	to: "zdtest",
			// 	toJid: "easemob-demo#chatdemoui_zdtest@easemob.com/webim",
			// 	type: "subscribe"
			// },
			// {
			// 	chatroom: false,
			// 	code: "",
			// 	from: "zdtest3",
			// 	fromJid: "easemob-demo#chatdemoui_zdtest3@easemob.com",
			// 	original_type: "subscribe",
			// 	presence_type: "",
			// 	status: "zdtest3请求添加好友",
			// 	to: "zdtest",
			// 	toJid: "easemob-demo#chatdemoui_zdtest@easemob.com/webim",
			// 	type: "subscribe"
			// }
			// ]
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
		// if(!this.data.friendList.length){
		// 	wx.navigateBack({
		// 		url: "../main/main?myName=" + this.data.myName
		// 	});
		// }
		// else{
		// 	this.setData({
		// 		friendList: this.data.friendList
		// 	});
		// }
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

		this.data.friendList.forEach((item) => {
			if (item.from == event.currentTarget.dataset.from) {
				item.type = 'subscribed';
				item.typeText = '已同意';
				wx.setStorageSync("friendNotiData", this.data.friendList)
				//getApp().globalData.saveFriendList = this.data.friendList;
				this.setData({
					friendList: this.data.friendList
				})
			}
		})
		this.removeAndRefresh(event.currentTarget.dataset.from);
		this.getRoster();
	},
	getRoster(){
		let me = this;
		let rosters = {
			success(roster){
				var member = [];
				for(let i = 0; i < roster.length; i++){
					if(roster[i].subscription == "both"){
						member.push(roster[i]);
					}
				}
				wx.setStorage({
					key: "member",
					data: member
				});
			},
			error(err){
				console.log(err);
			}
		};
		WebIM.conn.getRoster(rosters);
	},
	reject(event){
		var me = this;
		// 无回调
		WebIM.conn.unsubscribed({
			to: event.currentTarget.dataset.from,
			message: "rejectAddFriend",
		});

		this.data.friendList.forEach((item) => {
			if (item.from == event.currentTarget.dataset.from) {
				item.type = 'unsubscribed';
				item.typeText = '已拒绝';
				wx.setStorageSync("friendNotiData", this.data.friendList)
				//getApp().globalData.saveFriendList = this.data.friendList;
				this.setData({
					friendList: this.data.friendList
				})
			}
		})
		this.removeAndRefresh(event.currentTarget.dataset.from)
	}
});
