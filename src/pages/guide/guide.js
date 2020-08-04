// 获取应用实例
var app = getApp();
Page({
	data: {
		height:0,
		chatDisplay: 'block',
		contactDisplay: 'none',
		noticeDisplay: 'none',
		settingDisplay: 'none',
	},

	onLoad: function(){
		const me = this
		wx.getSystemInfo({
		    success: function (res) {
		        // console.log('height=' + res.windowHeight);
		        // console.log('width=' + res.windowWidth);
		        // 计算主体部分高度,单位为px
		        me.setData({
		          height: res.windowHeight
		        })
		    }
	    })
	},
	changeItem(e){
		const itemKey = e.target.dataset.item
		this.setData({
			chatDisplay: e.target.dataset.item == 'chat' ? 'block': 'none',
			contactDisplay: e.target.dataset.item == 'contact' ? 'block': 'none',
			noticeDisplay: e.target.dataset.item == 'notice' ? 'block': 'none',
			settingDisplay: e.target.dataset.item == 'setting' ? 'block': 'none'
		})
	},
	login(){
		wx.redirectTo({
			url: "../login/login"
		});
	}
});
