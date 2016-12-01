Page({
	data: {
		search_btn: true,
		search_chats: false,
		show_mask: false,
		array: [{
			username:'wjy1',
			date: '2016-11-12',
			time: '10:03',
			contain: 'hello'
		},{
			username:'wjy2',
			date: '2016-11-21',
			time: '16:03',
			contain: 'lalala'
		},{
			username:'wjy3',
			date: '2016-11-26',
			time: '20:03',
			contain: '在干吗？'
		}]
	},
	openSearch: function() {
		this.setData({
			search_btn: false,
			search_chats: true,
			show_mask: true
		})
	},
	cancel: function() {
		this.setData({
			search_btn: true,
			search_chats: false,
			show_mask: false
		})
	},
	tab_contacts: function() {
		wx.redirectTo({
	      url: '../main/main'
	    })
	},
	close_mask: function() {
		this.setData({
			search_btn: true,
			search_chats: false,
			show_mask: false
		})
	},
	tab_setting: function() {
		wx.redirectTo({
	      url: '../settings/settings'
	    })
	}

})