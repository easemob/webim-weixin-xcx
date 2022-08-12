let WebIM = require("../../utils/WebIM")["default"];
let times = 50;
let timer
Page({
	data: {
		username: "",
		password: "",
		imageUrl: '',
		imageId: '',
		imageCode: '',
		smsCode: '',
		phoneNumber: '',
		btnText: '获取验证码'
	},
	onLoad: function(){
		let app = getApp();
		new app.ToastPannel.ToastPannel();
		this.getImageCode()
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
	bindPhone: function(e){
		this.setData({
			phoneNumber: e.detail.value
		});
	},
	bindImageCode: function(e){
		this.setData({
			imageCode: e.detail.value
		});
	},
	bindSmsCode: function(e){
		this.setData({
			smsCode:  e.detail.value
		});
	},
	countDown: function(){
		timer && clearTimeout(timer)
		timer = setTimeout(() => {
			times--
			this.setData({
				btnText: times
			})
			if (times === 0) {
				times = 50
				this.setData({
					btnText: '获取验证码'
				})
				return clearTimeout(timer)
			}
			this.countDown()
		}, 1000)
	},
	getImageCode: function(){
		const self = this;
		// 获取图片验证码
		wx.request({
		  url: 'https://a1.easemob.com/inside/app/image',
		  header: {
		    'content-type': 'application/json'
		  },
		  success (res) {
		    const url = 'https://a1.easemob.com/inside/app/image/' + res.data.data.image_id
		    self.setData({
		    	imageUrl: url,
		    	imageId: res.data.data.image_id
		    })
		  },
		  fail(){
		  	console.log('获取验证码失败')
		  }
		})
	},
	getSmsCode: function(){
		const self = this
		if(this.data.phoneNumber == ''){
			return this.toastFilled('请输入手机号！')
		}else if(this.data.imageCode == ''){
			return this.toastFilled('请输入图片验证码！')
		}

		if(this.data.btnText != '获取验证码') return
		// 发送短信验证码
		wx.request({
			url: 'https://a1.easemob.com/inside/app/sms/send',
			header: {
			    'content-type': 'application/json'
			},
			method: 'POST',
			data: {
				phoneNumber: this.data.phoneNumber,
                imageId: this.data.imageId,
                imageCode: this.data.imageCode
			},
			success (res) {
				if(res.statusCode == 200){
					self.toastSuccess('短信发送成功！')
				}else if(res.statusCode == 400){
					if(res.data.errorInfo == 'phone number illegal'){
						self.toastFilled('请输入正确的手机号！')
					}else if(res.data.errorInfo == 'Please wait a moment while trying to send.'){
						self.toastFilled('你的操作过于频繁，请守候再试！')
					}else if(res.data.errorInfo == 'Image verification code error.'){
						self.toastFilled('图片验证码错误！')
						self.getImageCode()
					}
				}
			},
		  	fail(error){
		  		self.toastFilled('短信发送失败！')
		  	}
		})

		this.countDown()
	},
	register: function(){
		const that = this;
		if(that.data.username == ""){
			return this.toastFilled('请输入用户名！')
		}
		else if(that.data.password == ""){
			return this.toastFilled('请输入密码！')
		} else if (that.data.phoneNumber == "") {
			return this.toastFilled('请输入手机号码！')
		} else if(that.data.imageCode == ""){
			return this.toastFilled('请输入图片验证码！')
		} else if(that.data.smsCode == ""){
			return this.toastFilled('请输入短信验证码！')
		} else {
			const {username,password,phoneNumber, imageId, imageCode, smsCode} = that.data
			// 在 appserver 注册用户
			wx.request({
				url: 'https://a1.easemob.com/inside/app/user/register',
				header: {
				    'content-type': 'application/json'
				},
				method: 'POST',
				data: {
					userId: username,
	                userPassword: password,
	                phoneNumber,
	                smsCode,
	                imageId,
	                imageCode
				},
				success (res) {
					if(res.statusCode == 200){
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
					}else if(res.statusCode == 400){
						if(res.data.errorInfo){
							that.toastFilled(res.data.errorInfo)
						}
					}else{
						that.toastFilled('注册失败！')
					}
				},
			  	fail(error){
			  		that.toastFilled('注册失败！')
			  	}
			})

		}
	}
});

// 倒计时。点击刷新图片验证码