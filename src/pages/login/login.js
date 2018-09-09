let WebIM = require("../../utils/WebIM")["default"];
let __test_account__, __test_psword__;
// __test_account__ = "easezy";
// __test_psword__ = "111111";

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
		if(!__test_account__ && this.data.name == ""){
			wx.showModal({
				title: "请输入用户名！",
				confirmText: "OK",
				showCancel: false
			});
			return;
		}
		else if(!__test_account__ && this.data.psd == ""){
			wx.showModal({
				title: "请输入密码！",
				confirmText: "OK",
				showCancel: false
			});
			return;
		}
		wx.setStorage({
			key: "myUsername",
			data: __test_account__ || this.data.name
		});
		WebIM.conn.open({
			apiUrl: WebIM.config.apiURL,
			user: __test_account__ || this.data.name,
			pwd: __test_psword__ || this.data.psd,
			grant_type: this.data.grant_type,
			appKey: WebIM.config.appkey
		});
	}
});
