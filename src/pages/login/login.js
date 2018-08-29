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
				appKey: WebIM.config.appkey,
				success: (data) => this.onLoginSuccess(data),
				failure: (data) => this.onLoginFailure(data),
			});
		}
	},

	onLoginSuccess: function(data){
		var me = this;
		wx.showToast({
			title: "登录成功",
			icon: "success",
			duration: 1000
		});
		setTimeout(function(){
			wx.redirectTo({
				url: "../main/main?myName=" + me.data.name
			});
		}, 1000);
	},

	onLoginFailure: function(data){
		wx.showModal({
			title: "用户名或密码错误!",
			showCancel: false,
			confirmText: "OK"
		});
	},

});
