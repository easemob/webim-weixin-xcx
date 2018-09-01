var WebIM = require("../../utils/WebIM")["default"];

Page({
    data: {
        friendList: []
    },
	onLoad: function(options) {
        var me = this;
        console.log("进入申请与通知...")
        this.setData({
            friendList: getApp().globalData.saveFriendList
        })
        WebIM.conn.getRoster({
            success: function(roster){
                console.log(roster)
            }
        })

    },
    agree:function(event){
        console.log(event.target.id)
        WebIM.conn.subscribed({
            to: event.target.id,
            message: "[resp:true]"
        })
        WebIM.conn.subscribe({
            to: event.target.id,
            message: "[resp:true]"
        })
    },
    reject: function(event){
        WebIM.conn.unsubscribed({
            to: event.target.id,
            message: "rejectAddFriend"
        })
    }
});
