Page({
	data: {
		yourname: ""
	},

	onLoad: function(option){
		this.setData({
			yourname: option.yourname
		});
	}
});
