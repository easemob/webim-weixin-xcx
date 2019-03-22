let WebIM = require("../../utils/WebIM")["default"];

Page({
	data: {
		friend_name: "",
		search_btn: true,
		search_chats: false
	},

	onLoad: function(){
		let app = getApp();
		new app.ToastPannel.ToastPannel();
	},

	openSearch: function(){
		this.setData({
			search_btn: false,
			search_chats: true,
		});
	},

	onInput: function(e){
		let inputValue = e.detail.value
		if (inputValue) {
			this.setData({
				show_clear: true,
				friend_name: inputValue,
				isdisable: false
			})
		} else {
			this.setData({
				show_clear: false
			})
		}
	},

	clearInput: function(){
		this.setData({
			input_code: '',
			show_clear: false
		})
	},

	cancel: function(){
		this.setData({
			search_btn: true,
			search_chats: false,
			show_clear: false
		});
	},

	add_friend: function(){
		let me = this;
		console.log(me.data.friend_name)
		if(me.data.friend_name == ""){
			me.toastFilled('添加失败')
			return;
		}
		WebIM.conn.subscribe({
			to: me.data.friend_name
		});

		// 判断当前是否存在该好友
		let rosters = {
			success: function(roster){
				console.log('success')
				var member = [];
				for(let i = 0; i < roster.length; i++){
					if(roster[i].subscription == "both"){
						member.push(roster[i]);
					}
				}
				if(me.isExistFriend(me.data.friend_name, member)){
					me.toastFilled('已经是你的好友')
				}
				else{
					me.toastSuccess('已经发出好友申请')
				}
				me.setData({isdisable: true})
				// console.log(member)
			}
		};
		WebIM.conn.getRoster(rosters);
	},

	isExistFriend: function(name, list){
		for(let index = 0; index < list.length; index++){
			if(name == list[index].name){
				return true
			}
		}
		return false
	}
});
