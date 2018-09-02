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
		inviteFriend: [],		// 需要加好友ID
		owner: "",				// = myName
	},

	onLoad: function(options){
		this.setData({
			owner: JSON.parse(options.owner).myName,
		});
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
		var me = this;
		var options = {
			data: {
				groupname: this.data.groupName,
				desc: this.data.groupDec,
				members: this.data.inviteFriend,
				"public": this.data.allowJoin,
				approval: this.data.allowApprove,
				allowinvites: this.data.allowInvite,
				owner: this.data.owner
			},
			success: function(respData){
				wx.showToast({
					title: "添加成功",
					duration: 2000,
					success: function(res){
						setTimeout(() => wx.navigateTo({
							url: "../groups/groups?myName=" + me.data.owner
						}), 2000);
					},
				});
			},
			error: function(err){
				wx.showToast({
					title: err.data.error_description,
				});
			},
		};
		WebIM.conn.createGroupNew(options);
	},

});