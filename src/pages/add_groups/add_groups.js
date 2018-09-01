var WebIM = require("../../utils/WebIM")["default"];

Page({
	data: {
		friendList: [],			// 好友列表
		groupName: "",			// 群名称
		groupDec: "",			// 群简介
		allowJoin: false,		// 是否允许任何人加入
		allowApprove: false,	// 加入需要审批
		noAllowJoin: false,		// 不允许任何人加入
		allowInvite: false,		// 允许群人员邀请
		inviteFriend: []		// 需要加好友ID
	},

	onShow: function(){
		var me = this;
		// 获取当前用户的好友信息
		WebIM.conn.getRoster({
			success: function(roster){
				var member = [];
				for(let i = 0; i < roster.length; i++){
					if(roster[i].subscription == "both"){
						member.push(roster[i]);
					}
				}
				me.setData({
					friendList: member
				});
			}
		});
	},

	getGroupName: function(e){
		this.setData({
			groupName: e.detail.value
		});
	},

	getGroupDec: function(e){
		this.setData({
			groupDec: e.detail.value
		});
	},

	allowJoin: function(e){
		this.setData({
			allowJoin: Boolean(e.detail.value) || false
		});
	},

	allowApprove: function(e){
		this.setData({
			allowApprove: Boolean(e.detail.value) || false
		});
	},

	noAllowJoin: function(e){
		this.setData({
			noAllowJoin: Boolean(e.detail.value) || false
		});
	},

	allowInvite: function(e){
		this.setData({
			allowInvite: Boolean(e.detail.value) || false
		});
	},

	inviteFriend: function(e){
		this.setData({
			inviteFriend: e.detail.value
		});
	},

	// 创建群组
	createGroup: function(){
		// 建立一个群组
		var option = {
			subject: this.data.groupName,				// 群名称
			description: this.data.groupDec,			// 群简介
			members: this.data.inviteFriend,			// 以数组的形式存储需要加群的好友ID
			optionsPublic: this.data.allowJoin,			// 允许任何人加入
			optionsModerate: this.data.allowApprove,	// 加入需审批
			optionsMembersOnly: this.data.noAllowJoin,	// 不允许任何人主动加入
			optionsAllowInvites: this.data.allowInvite	// 允许群人员邀请
		};
		WebIM.conn.createGroup(option);
	},

});
