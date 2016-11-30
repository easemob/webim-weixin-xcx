Page({
	data: {
		search_btn: true,
		search_friend: false,
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
			search_friend: true
		})
	},
	cancel: function() {
		this.setData({
			search_btn: true,
			search_friend: false
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
	}

})