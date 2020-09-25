let WebIM = require("../../utils/WebIM")["default"];
let disp = require("../../utils/broadcast");

Page({
	data: {
        rec: '',
        recMerge: ''
	},
	onLoad: function(){
        let rec = wx.getStorageSync("rec");
        let recMerge = wx.getStorageSync("recMerge");
		this.setData({
            rec,
            recMerge
		});
	},
	
	onShow(){
        let rec = wx.getStorageSync("rec");
        let recMerge = wx.getStorageSync("recMerge");
		this.setData({
            rec,
            recMerge
		});
	},

	openRec(event){
        wx.setStorage({
			key: "rec",
			data: event.detail.value || false
		});
    },
    openRecMerge(event){
        wx.setStorage({
			key: "recMerge",
			data: event.detail.value || false
		});
    }

});