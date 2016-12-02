Page({
	data: {
		search_btn: true,
		search_friend: false,
		show_mask: false
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
	close_mask: function() {
		this.setData({
			search_btn: true,
			search_friend: false,
			show_mask: false
		})
	}
})