let WebIM = require("../../utils/WebIM")["default"];

Page({
	data: {
		username: "",
		password: ""
	},
	onLoad: function(){
		let app = getApp();
		new app.ToastPannel.ToastPannel();
	},
	bindUsername: function(e){
		this.setData({
			username: e.detail.value
		});
	},
	bindPassword: function(e){
		this.setData({
			password: e.detail.value
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
	register: function(){
		const that = this;
		if(that.data.username == ""){
			return this.toastFilled('请输入用户名！')
		}
		else if(that.data.password == ""){
			return this.toastFilled('请输入密码！')
		}
		else{
			var options = {
				apiUrl: WebIM.config.apiURL,
				username: that.data.username.toLowerCase(),
				password: that.data.password,
				nickname: "",
				appKey: WebIM.config.appkey,
				success: function(res){
					console.log('注册成功', res)	
					that.toastSuccess('注册成功');
					var data = {
						apiUrl: WebIM.config.apiURL,
						user: that.data.username.toLowerCase(),
						pwd: that.data.password,
						grant_type: "password",
						appKey: WebIM.config.appkey
					};
					wx.setStorage({
						key: "myUsername",
						data: that.data.username
					});
					wx.redirectTo({
						url: "../login/login?username="+that.data.username+"&password="+that.data.password
					});
				},
				error: function(res){
					console.log('注册失败', res)	
					if (res.statusCode == '400' && res.data.error == 'illegal_argument') {
						return that.toastFilled('用户名非法!')
					}
					that.toastFilled('用户名已被占用!')
				}
			};
			WebIM.conn.registerUser(options);
		}
	}
});
