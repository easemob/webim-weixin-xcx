let WebIM = require("../../../../../utils/WebIM")["default"];

Component({
	data: {
		yourname: "",
	},
	method: {
		sendLocation: function(){
			var me = this;
			wx.chooseLocation({
				success: function(respData){
					var id = WebIM.conn.getUniqueId();
					var msg = new WebIM.message("location", id);
					msg.set({
						// location 需要消息值吗？写死不行？
						msg: "",
						to: me.data.yourname,
						roomType: false,
						lng: respData.longitude,
						lat: respData.latitude,
						addr: respData.address,
						success: function(id, serverMsgId){

						}
					});
					msg.body.chatType = "singleChat";
					WebIM.conn.send(msg.body);
					// 不用进缓存？
					this.triggerEvent(
						"newLocationMsg",
						{
							msg: msg,
							type: "location"
						},
						{ bubbles: true }
					);
				}
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
