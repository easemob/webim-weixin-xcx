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
		rtcUrl: '',
		show_config: false, //默认不显示配置按钮
		isSandBox: false //默认线上环境
	},

	statechange(e) {
	    console.log('live-player code:', e.detail.code)
	},

	error(e) {
	    console.error('live-player error:', e.detail.errMsg)
	},

	onLoad: function(option){
		const me = this;
		const app = getApp();
		new app.ToastPannel.ToastPannel();
		
		disp.on("em.xmpp.error.passwordErr", function(){
			me.toastFilled('用户名或密码错误');
		});

		wx.getStorage({
			key: 'isSandBox',
			success (res) {
			    console.log(res.data)
			    me.setData({
			    	isSandBox: !!res.data
			    })
			}
		})

		if (option.username && option.password != '') {
			this.setData({
				name: option.username,
				psd: option.password
			})
		}
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

		// 此处为测试用来切换沙箱环境，请忽略
		if(this.data.isSandBox){
			WebIM.config.apiURL = "https://a1-hsb.easemob.com"
			WebIM.conn.apiUrl = "https://a1-hsb.easemob.com"
			WebIM.conn.url = 'wss://im-api-new-hsb.easemob.com/websocket'
			wx.emedia.mgr.setHost("https://a1-hsb.easemob.com")
		}

		getApp().conn.open({
			apiUrl: WebIM.config.apiURL,
			user: __test_account__ || this.data.name.toLowerCase(),
			pwd: __test_psword__ || this.data.psd,
			grant_type: this.data.grant_type,
			appKey: WebIM.config.appkey
		});
	},

	longpress: function(){
		console.log('长按')
		this.setData({
			show_config: !this.data.show_config
		})
	},

	changeConfig: function(){
		this.setData({
			isSandBox: !this.data.isSandBox
		}, ()=>{
			wx.setStorage({
				key: "isSandBox",
				data: this.data.isSandBox
			});
		})
		
	}

});
