var WebIM = require("../../utils/WebIM")["default"];

Page({
	data: {
		roomId: "", // 群id
		groupName: "", // 群名称
		currentName: "",  // 当前用户
		groupMember: [], // 群成员
		curOwner: "", // 当前群管理员
		groupDec: "", // 群描述
		addFriendName: [],
		isOwner: false
	},
	onLoad: function(options){
		var that = this;
		// console.log(options)
		this.setData({
			roomId: JSON.parse(options.groupInfo).roomId,
			groupName: JSON.parse(options.groupInfo).groupName,
			currentName: JSON.parse(options.groupInfo).myName
		});
		console.log(this.data.roomId, this.data.groupName, this.data.currentName);

		// 获取群成员
		that.getGroupMember();
		// 获取群信息
		that.getGroupInfo();
	},
	getGroupMember: function(){
		var that = this;
		// 获取群成员
		var pageNum = 1,
			pageSize = 1000;
		var options = {
			pageNum: pageNum,
			pageSize: pageSize,
			groupId: this.data.roomId,
			success: function(resp){
				if(resp && resp.data && resp.data.data){
					that.setData({
						groupMember: resp.data.data
					});
				}
				console.log(that.data.groupMember);
			},
			error: function(e){}
		};
		WebIM.conn.listGroupMember(options);
	},
	getGroupInfo: function(){
		var that = this;
		// 获取群信息
		var options = {
			groupId: this.data.roomId,
			success: function(resp){
				if(resp && resp.data && resp.data.data){
					that.setData({
						curOwner: resp.data.data[0].owner,
						groupDec: resp.data.data[0].description
					});

					if(that.data.currentName == resp.data.data[0].owner){
						that.setData({
							isOwner: true
						});
					}
				}
			},
			error: function(){}
		};
		WebIM.conn.getGroupInfo(options);
	},
	addFriendName: function(e){
		var that = this;
		var firendArr = [];
		firendArr.push(e.detail.value);
		this.setData({
			addFriendName: firendArr
		});
	},
	addGroupMembers: function(){
		var that = this;
		// 加好友入群
		var option = {
			list: that.data.addFriendName,
			roomId: that.data.roomId
		};
		WebIM.conn.addGroupMembers(option);
	},
	leaveGroup: function(){
		var that = this;
		var option = {
			to: that.data.currentName,
			roomId: that.data.roomId,
			success: function(){
				console.log("You leave room succeed!");
			},
			error: function(){
				console.log("Leave room faild");
			}
		};
		WebIM.conn.leaveGroupBySelf(option);
	},
	dissolveGroup: function(){
		var that = this;
		// 解散一个群组
		var option = {
			groupId: that.data.roomId,
			success: function(){
				console.log("Destroy group success!");
			}
		};
		WebIM.conn.dissolveGroup(option);
	}
});
