let WebIM = require("../../utils/WebIM")["default"];
let __test_account__, __test_psword__;
let disp = require("../../utils/broadcast");
// __test_account__ = "easezy";
// __test_psword__ = "111111";

Page({
	data: {
		name: "",
		psd: "",
		grant_type: "password"
	},

	onLoad: function(){
		const me = this;
		let app = getApp();
		new app.ToastPannel.ToastPannel();
		disp.on("em.xmpp.error.tokenErr", function(){
			me.toastFilled('token错误、token过期或者未授权');
		});
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
	onFocusPsd: function(){
		this.setData({
			psdFocus: 'psdFocus'
		})
	},
	onBlurPsd: function(){
		this.setData({
			psdFocus: ''
		})
	},
	onFocusName: function(){
		this.setData({
			nameFocus: 'nameFocus'
		})
	},
	onBlurName: function(){
		this.setData({
			nameFocus: ''
		})
	},

	login: function(){
		if(!__test_account__ && this.data.name == ""){
			this.toastFilled('请输入用户名！')
			return;
		}
		else if(!__test_account__ && this.data.psd == ""){
			this.toastFilled('请输入token！')
			return;
		}
		wx.setStorage({
			key: "myUsername",
			data: __test_account__ || this.data.name.toLowerCase()
		});

		getApp().conn.open({
			apiUrl: WebIM.config.apiURL,
			user: __test_account__ || this.data.name.toLowerCase(),
			pwd: __test_psword__ || this.data.psd,
			accessToken: __test_psword__ || this.data.psd,
			//grant_type: this.data.grant_type,
			appKey: WebIM.config.appkey
		});
	}
});
