var strophe = require('../../utils/strophe.js')
var WebIM = require('../../utils/WebIM.js')
var WebIM = WebIM.default

Page({
	data: {
		search_btn: true,
		search_friend: false,
		show_mask: false,
		myName:'',
		member: []
	},
	onLoad: function(option) {
		console.log(option)
	},
	onShow: function() {
		console.log(WebIM.conn)
		var that = this
		var rosters = {
			success: function(roster) {
				console.log(roster)
				var member = []
				for(var i = 0; i < roster.length; i++){
					if(roster[i].subscription == "both") {
						member.push(roster[i])
					}
				}
				that.setData({
					member: member
				})
			}
		}
		WebIM.conn.setPresence()
		WebIM.conn.getRoster(rosters)
	},
	deleteFriend: function(message) {
		var that = this
		var rosters = {
			success: function(roster) {
				var member = []
				for(var i = 0; i < roster.length; i++){
					if(roster[i].subscription == "both") {
						member.push(roster[i])
					}
				}
				that.setData({
					member: member
				})
			}
		}
		if(message.type == 'unsubscribe' || message.type == 'unsubscribed') {
		 	WebIM.conn.removeRoster({
		        to: message.from,
		        success: function () {
		            WebIM.conn.unsubscribed({
		                to: message.from
		            });
		            WebIM.conn.getRoster(rosters)
		        }
	    	})
		}
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
	into_room: function(event) {
		var that = this
		console.log(event)
		var nameList = {
			your: event.target.dataset.username
		}
		wx.navigateTo({
			url: '../chatroom/chatroom?username=' + JSON.stringify(nameList)
		})
	}

})