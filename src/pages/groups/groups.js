var WebIM = require("../../utils/WebIM")["default"];

Page({
	data: {
		search_btn: true,
		search_friend: false,
		show_mask: false,
		groupList: [],		// 群聊列表
		myName: ""
	},

	onLoad: function(option){
		this.setData({
			myName: option.myName
		});
	},

	onShow: function(){
		var me = this;
		// 列出所有群组 (调用 listRooms 函数获取当前登录用户加入的群组列表)
		var listGroups = function(){
			var option = {
				success: function(rooms){
					console.log(rooms);
					me.setData({
						groupList: rooms
					});
				},
				error: function(){
					console.log("List groups error");
				}
			};
			WebIM.conn.listRooms(option);
		};
		listGroups();
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
			your: event.target.dataset.username
		};
		wx.navigateTo({
			url: "../groupChatRoom/groupChatRoom?username=" + JSON.stringify(nameList)
		});
	},

	build_group: function(){
		wx.navigateTo({
			url: "../add_groups/add_groups"
		});
	},

	edit_group: function(event){
		var nameList = {
			myName: this.data.myName,
			groupName: event.target.dataset.username,
			roomId: event.currentTarget.dataset.roomid
		};
		wx.navigateTo({
			url: "../groupSetting/groupSetting?groupInfo=" + JSON.stringify(nameList)
		});
	}
});
