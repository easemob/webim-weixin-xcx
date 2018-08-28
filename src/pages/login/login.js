let WebIM = require("../../utils/WebIM")["default"];

Page({
	data: {
		name: "",
		psd: "",
		grant_type: "password"
	},
	bindUsername: function(e){
		this.setData({
			name: e.detail.value
		});
	},
	bindPassword: function(e){
		this.setData({
			psd: e.detail.value
		});
	},
	onLoad: function(){
		// this.login()
	},
	login: function(){
		if(this.data.name == ""){
			wx.showModal({
				title: "请输入用户名！",
				confirmText: "OK",
				showCancel: false
			});
		}
		else if(this.data.psd == ""){
			wx.showModal({
				title: "请输入密码！",
				confirmText: "OK",
				showCancel: false
			});
		}
		else{
			wx.setStorage({
				key: "myUsername",
				data: this.data.name
			});
			// console.log('open')
			WebIM.conn.open({
				apiUrl: WebIM.config.apiURL,
				user: this.data.name,
				pwd: this.data.psd,
				grant_type: this.data.grant_type,
				appKey: WebIM.config.appkey
			});
		}
	}
});
