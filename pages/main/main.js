Page({
	data: {
		search_btn: true,
		search_friend: false,
		show_mask: false,
		array: [{
			word: 'A',
			username: 'zzf'
		},{
			word: 'B',
			username: 'wjy',
		},{
			word: 'C',
			username: 'lwz'
		}]
	},
	openSearch: function() {
		this.setData({
			search_btn: false,
			search_friend: true,
			show_mask: true
		})
	},
	cancel: function() {
		this.setData({
			search_btn: true,
			search_friend: false,
			show_mask: false
		})
	},
	add_new: function() {
		wx.navigateTo({
	      url: '../add_new/add_new'
	    })
	},
	tab_chat: function() {
		wx.redirectTo({
		  url: '../chat/chat'
		})
	},
	close_mask: function() {
		this.setData({
			search_btn: true,
			search_friend: false,
			show_mask: false
		})
	},
	tab_setting: function() {
		wx.redirectTo({
			url: '../settings/settings'
		})
	},
	into_inform: function() {
		wx.navigateTo({
			url: '../inform/inform'
		})
	},
	into_groups: function() {
		wx.navigateTo({
			url: '../groups/groups'
		})
	},
	into_room: function() {
		wx.navigateTo({
			url: '../chatroom/chatroom'
		})
	}

})