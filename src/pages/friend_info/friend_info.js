Page({
	data: {
		yourname:''
	},
	onLoad: function(option) {
		console.log(option)
		this.setData({
			yourname: option.yourname
		})
	}
})