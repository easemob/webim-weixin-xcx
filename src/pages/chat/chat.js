let disp = require("../../utils/broadcast");

Page({
	data: {
		search_btn: true,
		search_chats: false,
		show_mask: false,
		yourname: "",
		unReadSpot: false,
		arr: []
	},

	onLoad(){
		let me = this;
		disp.on("em.xmpp.unreadspot", function(count){
			me.setData({
				arr: me.getChatList(),
				unReadSpot: count > 0
			});
		});
	},

	getChatList(){
		var array = [];
		var member = wx.getStorageSync("member");
		var myName = wx.getStorageSync("myUsername");
		for(let i = 0; i < member.length; i++){
			let newChatMsgs = wx.getStorageSync(member[i].name + myName) || [];
			let historyChatMsgs = wx.getStorageSync("rendered_" + member[i].name + myName) || [];
			let curChatMsgs = historyChatMsgs.concat(newChatMsgs);
			if(curChatMsgs.length){
				let lastChatMsg = curChatMsgs[curChatMsgs.length - 1];
				lastChatMsg.unReadCount = newChatMsgs.length;
				if(lastChatMsg.unReadCount > 99) {
					lastChatMsg.unReadCount = "...";
				}
				array.push(lastChatMsg);
			}
		}
		return array;
	},

	onShow: function(){
		this.setData({
			arr: this.getChatList(),
			unReadSpot: getApp().globalData.unReadSpot,
		});
	},

	openSearch: function(){
		this.setData({
			search_btn: false,
			search_chats: true,
			show_mask: true
		});
	},

	cancel: function(){
		this.setData({
			search_btn: true,
			search_chats: false,
			show_mask: false
		});
	},

	tab_contacts: function(){
		wx.redirectTo({
			url: "../main/main?myName=" + wx.getStorageSync("myUsername")
		});
	},

	close_mask: function(){
		this.setData({
			search_btn: true,
			search_chats: false,
			show_mask: false
		});
	},

	tab_setting: function(){
		wx.redirectTo({
			url: "../settings/settings"
		});
	},

	into_chatRoom: function(event){
		var my = wx.getStorageSync("myUsername");
		var nameList = {
			myName: my,
			your: event.currentTarget.dataset.username
		};
		wx.navigateTo({
			url: "../chatroom/chatroom?username=" + JSON.stringify(nameList)
		});
	},

	del_chat: function(event){
		var nameList = {
			your: event.currentTarget.dataset.username
		};
		var myName = wx.getStorageSync("myUsername");
		var currentPage = getCurrentPages();
		wx.showModal({
			title: "删除该聊天记录",
			confirmText: "删除",
			success: function(res){
				if(res.confirm){
					wx.setStorageSync(nameList.your + myName, "");
					wx.setStorageSync("rendered_" + nameList.your + myName, "");
					if(currentPage[0]){
						currentPage[0].onShow();
					}
					disp.fire("em.chat.session.remove");
				}
			},
			fail: function(err){
			}
		});
	},

});
