let WebIM = require("../../utils/WebIM")["default"];

Page({
	data: {
		username: "",
		password: ""
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
	register: function(){
		var that = this;
		if(that.data.username == ""){
			wx.showModal({
				title: "请输入用户名！",
				confirmText: "OK",
				showCancel: false
			});
		}
		else if(that.data.password == ""){
			wx.showModal({
				title: "请输入密码！",
				confirmText: "OK",
				showCancel: false
			});
		}
		else{
			var options = {
				apiUrl: WebIM.config.apiURL,
				username: that.data.username,
				password: that.data.password,
				nickname: "",
				appKey: WebIM.config.appkey,
				success: function(res){
					if(res.statusCode == "200"){
						wx.showToast({
							title: "注册成功",
							icon: "success",
							duration: 1500,
							success: function(){
								var data = {
									apiUrl: WebIM.config.apiURL,
									user: that.data.username,
									pwd: that.data.password,
									grant_type: "password",
									appKey: WebIM.config.appkey
								};
								// console.log('data',data)
								wx.setStorage({
									key: "myUsername",
									data: that.data.username
								});
								// setTimeout(function(){
								// 	// WebIM.conn.open(data);
								// }, 1000);

							}
						});
					}
				},
				error: function(res){
					if(res.statusCode !== "200"){
						wx.showModal({
							title: "用户名已被占用",
							showCancel: false,
							confirmText: "OK"
						});
					}
				}
			};
			WebIM.utils.registerUser(options);
		}

	}
});
