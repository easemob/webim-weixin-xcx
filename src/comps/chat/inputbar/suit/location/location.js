let WebIM = require("../../../../../utils/WebIM")["default"];
let msgType = require("../../../msgtype");

Component({
	properties: {
		username: {
			type: Object,
			value: {},
		}
	},
	data: {

	},
	methods: {
		sendLocation(){
			var me = this;
			wx.authorize({
				scope: "scope.userLocation",
				fail(){
					wx.showToast({
						title: "已拒绝",
						icon: "none",
					});
				},
				success(){
					wx.chooseLocation({
						fail(){
							console.log(arguments);
						},
						complete(){
							console.log(arguments);
						},
						success(respData){
							var id = WebIM.conn.getUniqueId();
							var msg = new WebIM.message(msgType.LOCATION, id);
							msg.set({
								// location 需要消息值吗？写死不行？
								msg: "",
								from: me.data.username.myName,
								to: me.data.username.your,
								roomType: false,
								lng: respData.longitude,
								lat: respData.latitude,
								addr: respData.address,
								success(id, serverMsgId){

								}
							});
							msg.body.chatType = "singleChat";
							WebIM.conn.send(msg.body);
							me.triggerEvent(
								"newLocationMsg",
								{
									msg: msg,
									type: msgType.LOCATION
								},
								{
									bubbles: true,
									composed: true
								}
							);
						}
					});
				}
			});
		},
	},
});
