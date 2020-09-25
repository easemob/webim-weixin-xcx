var WebIM = require("../../utils/WebIM")["default"];
let disp = require("../../utils/broadcast");

Page({
	data: {
		search_btn: true,
		search_friend: false,
		show_mask: false,
		groupList: [],		// 群聊列表
		myName: ""
	},

	onLoad: function(option){
		let me = this;
		disp.on("em.xmpp.invite.joingroup", function(){
			var pageStack = getCurrentPages();
			// 判断是否当前路由是本页
			if(pageStack[pageStack.length - 1].route === me.route){
				me.listGroups();
			}
		});

		disp.on("em.xmpp.invite.deleteGroup", function(){
			var pageStack = getCurrentPages();
			// 判断是否当前路由是本页
			if(pageStack[pageStack.length - 1].route === me.route){
				me.listGroups();
			}
		});
		
		this.setData({
			myName: option.myName
		});
	},

	onShow: function(){
		console.log(111)
		this.listGroups();
	},

	// 列出所有群组 (调用 listRooms 函数获取当前登录用户加入的群组列表)
	listGroups(){
		var me = this;
		wx.WebIM.conn.getGroup({
			limit: 50,
			success: function(res){
				me.setData({
					groupList: res.data
				});
				// 好像也没有别的官方通道共享数据啊
				getApp().globalData.groupList = res.data || [];
			},
			error: function(){

			}
		});
		console.log(this.data.groupList)
	},

	openSearch: function(){
		this.setData({
			search_btn: false,
			search_friend: true,
			show_mask: true
		});
	},

	cancel: function(){
		this.setData({
			search_btn: true,
			search_friend: false,
			show_mask: false
		});
	},

	close_mask: function(){
		this.setData({
			search_btn: true,
			search_friend: false,
			show_mask: false
		});
	},

	into_room: function(event){
		var nameList = {
			myName: this.data.myName,
			your: event.currentTarget.dataset.username,
			groupId: event.currentTarget.dataset.roomid
		};
		wx.navigateTo({
			url: "../groupChatRoom/groupChatRoom?username=" + JSON.stringify(nameList)
		});
	},

	build_group: function(){
		var me = this;
		var nameList = {
			myName: me.data.myName
		};
		wx.navigateTo({
			url: "../add_groups/add_groups?owner=" + JSON.stringify(nameList)
		});
	},

	edit_group: function(event){
		var nameList = {
			myName: this.data.myName,
			groupName: event.currentTarget.dataset.username,
			roomId: event.currentTarget.dataset.roomid
		};
		wx.navigateTo({
			url: "../groupSetting/groupSetting?groupInfo=" + JSON.stringify(nameList)
		});
	}
});
