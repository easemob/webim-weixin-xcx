Page({
	data: {
		username:'wjy'
	},
	tab_contact: function() {
		wx.redirectTo({
			url: '../main/main'
		})
	},
	tab_chat: function() {
		wx.redirectTo({
			url: '../chat/chat'
		})
	},
	person: function() {
		wx.navigateTo({
			url: '../chat/chat'
		})
	}
})