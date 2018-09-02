var WebIM = require("../../utils/WebIM")["default"];

Page({
	data: {
		roomId: "",			// 群id
		groupName: "",		// 群名称
		currentName: "",	// 当前用户
		groupMember: [],	// 群成员
		curOwner: "",		// 当前群管理员
		groupDec: "",		// 群描述
		addFriendName: [],
		isOwner: false
	},

	onLoad: function(options){
		this.setData({
			roomId: JSON.parse(options.groupInfo).roomId,
			groupName: JSON.parse(options.groupInfo).groupName,
			currentName: JSON.parse(options.groupInfo).myName
		});
		// console.log(this.data.roomId, this.data.groupName, this.data.currentName);
		// 获取群成员
		this.getGroupMember();
		// 获取群信息
		this.getGroupInfo();
	},

	getGroupMember: function(){
		var me = this;
		// 获取群成员
		var pageNum = 1,
			pageSize = 1000;
		var options = {
			pageNum: pageNum,
			pageSize: pageSize,
			groupId: this.data.roomId,
			success: function(resp){
				if(resp && resp.data && resp.data.data){
					me.setData({
						groupMember: resp.data.data
					});
				}
				// console.log(me.data.groupMember);
			},
			error: function(err){

			}
		};
		WebIM.conn.listGroupMember(options);
	},

	getGroupInfo: function(){
		var me = this;
		// 获取群信息
		var options = {
			groupId: this.data.roomId,
			success: function(resp){
				if(resp && resp.data && resp.data.data){
					me.setData({
						curOwner: resp.data.data[0].owner,
						groupDec: resp.data.data[0].description
					});

					if(me.data.currentName == resp.data.data[0].owner){
						me.setData({
							isOwner: true
						});
					}
				}
			},
			error: function(){

			}
		};
		WebIM.conn.getGroupInfo(options);
	},

	addFriendName: function(e){
		var firendArr = [];
		firendArr.push(e.detail.value);
		this.setData({
			addFriendName: firendArr
		});
	},

	// 加好友入群
	addGroupMembers: function(){
		var me = this;
		var option = {
			list: this.data.addFriendName,
			roomId: this.data.roomId,
			success: function(){
				wx.showToast({
					title: "邀请已发出",
					duration: 2000,
				});
				me.getGroupMember();
			},
			error: function(err){
				wx.showToast({
					title: err.data.error_description,
				});
			}
		};
		WebIM.conn.addGroupMembers(option);
	},

	leaveGroup: function(){
		var me = this;
		WebIM.conn.leaveGroupBySelf({
			to: this.data.currentName,
			roomId: this.data.roomId,
			success: function(){
				wx.showToast({
					title: "已退",
					duration: 2000,
					success: function(res){
						setTimeout(() => wx.navigateTo({
							url: "../groups/groups?myName=" + me.data.currentName
						}), 2000);
					},
				});
			},
			error: function(err){
				wx.showToast({
					title: err.data.error_description,
				});
			}
		});
	},

	dissolveGroup: function(){
		var me = this;
		// 解散一个群组
		WebIM.conn.dissolveGroup({
			groupId: this.data.roomId,
			success: function(){
				wx.showToast({
					title: "已解散",
					duration: 2000,
					success: function(res){
						setTimeout(() => wx.navigateTo({
							url: "../groups/groups?myName=" + me.data.currentName
						}), 2000);
					},
				});
			},
			error: function(err){
				wx.showToast({
					title: err.data.error_description,
				});
			},
		});
	}
});
