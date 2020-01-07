let WebIM = require("../../utils/WebIM")["default"];
let __test_account__, __test_psword__;
let disp = require("../../utils/broadcast");
// __test_account__ = "easezy";
// __test_psword__ = "111111";
 let runAnimation = true
Page({
	data: {
		name: "",
		psd: "",
		grant_type: "password",
		rtcUrl: ''
	},

	statechange(e) {
	    console.log('live-player code:', e.detail.code)
	},

	error(e) {
	    console.error('live-player error:', e.detail.errMsg)
	},

	onLoad: function(){
		const me = this;
		const app = getApp();
		new app.ToastPannel.ToastPannel();
		
		disp.on("em.xmpp.error.passwordErr", function(){
			me.toastFilled('用户名或密码错误');
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
		runAnimation = !runAnimation
		if(!__test_account__ && this.data.name == ""){
			this.toastFilled('请输入用户名！')
			return;
		}
		else if(!__test_account__ && this.data.psd == ""){
			this.toastFilled('请输入密码！')
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
			grant_type: this.data.grant_type,
			appKey: WebIM.config.appkey
		});
	}

});
