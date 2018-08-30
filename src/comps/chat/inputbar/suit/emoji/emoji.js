let WebIM = require("../../../../../utils/WebIM")["default"];

Component({
	data: {
		show: "emoji_list",
		emojiStr: "",
		interval: 5000,
		duration: 1000,
		autoplay: false,
		indicatorDots: true,
		emoji: WebIM.Emoji,
		emojiObj: WebIM.EmojiObj,
	},
	method: {
		openEmoji: function(){
			this.setData({
				show: "showEmoji",
				view: "scroll_view_change"
			});
		},

		cancelEmoji: function(){
			this.setData({
				show: "emoji_list",
				view: "scroll_view"
			});
		},

		// 输出 emoji
		sendEmoji: function(event){
			var str;
			var emoji = event.target.dataset.emoji;
			var msglen = this.data.userMessage.length - 1;
			if(emoji && emoji != "[del]"){
				str = this.data.userMessage + emoji;
			}
			else if(emoji == "[del]"){
				let start = this.data.userMessage.lastIndexOf("[");
				let end = this.data.userMessage.lastIndexOf("]");
				let len = end - start;
				if(end != -1 && end == msglen && len >= 3 && len <= 4){
					str = this.data.userMessage.slice(0, start);
				}
				else{
					str = this.data.userMessage.slice(0, msglen);
				}
			}
			this.setData({
				userMessage: str,
				inputMessage: str
			});
		},
	},

	lifetimes: {
		created: function(){},
		attached: function(){},
		moved: function(){},
		detached: function(){},
		ready: function(){},
	},

	pageLifetimes: {
		// 组件所在页面的生命周期函数
		show: function(){},
		hide: function(){},
	},
});
