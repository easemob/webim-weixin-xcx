Page({
	data: {
		roomId: "",
		groupName: "",
		currentName: ""
	},
	
	onLoad: function(options){
		this.setData({
			roomId: JSON.parse(options.groupInfo).roomId,
			groupName: JSON.parse(options.groupInfo).groupName,
			currentName: JSON.parse(options.groupInfo).myName
		});
	},

	onShow: function(){

	}
});
