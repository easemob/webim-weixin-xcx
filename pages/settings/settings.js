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
		var myUsername = wx.getStorageSync('myUsername')
		wx.navigateTo({
			url: '../friend_info/friend_info?yourname=' + myUsername
		})
	}
})