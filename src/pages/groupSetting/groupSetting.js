var WebIM = require("../../utils/WebIM")["default"];

Page({
    data:{
        roomId: '',
        groupName: '',
        currentName: ''
    },
    onLoad: function(options){
        var that = this
        // console.log(options)
        this.setData({
            roomId: JSON.parse(options.groupInfo).roomId,
            groupName: JSON.parse(options.groupInfo).groupName,
            currentName: JSON.parse(options.groupInfo).myName
        })
        console.log(this.data.roomId,this.data.groupName,this.data.currentName)
    },
    onShow: function(){
        
    }
})