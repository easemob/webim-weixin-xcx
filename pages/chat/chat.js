Page({
    data: {
        search_btn: true,
        search_chats: false,
        show_mask: false,
        yourname: '',
        arr: []
    },
    onShow: function () {
        var that = this
        var member = wx.getStorageSync('member')
        //console.log(member)
        var array = []
        for (var i = 0; i < member.length; i++) {
            if (wx.getStorageSync(member[i].name) != '') {
                array.push(wx.getStorageSync(member[i].name)[wx.getStorageSync(member[i].name).length - 1])
            }
        }
        //console.log(array，'1')
        this.setData({
            arr: array
        })
    },
    openSearch: function () {
        this.setData({
            search_btn: false,
            search_chats: true,
            show_mask: true
        })
    },
    cancel: function () {
        this.setData({
            search_btn: true,
            search_chats: false,
            show_mask: false
        })
    },
    tab_contacts: function () {
        wx.redirectTo({
            url: '../main/main'
        })
    },
    close_mask: function () {
        this.setData({
            search_btn: true,
            search_chats: false,
            show_mask: false
        })
    },
    tab_setting: function () {
        wx.redirectTo({
            url: '../settings/settings'
        })
    },
    into_chatRoom: function (event) {
        var that = this
        //console.log(event)
        var my = wx.getStorageSync('myUsername')
        var nameList = {
            myName: my,
            your: event.currentTarget.dataset.username
        }
        wx.navigateTo({
            url: '../chatroom/chatroom?username=' + JSON.stringify(nameList)
        })
    },
    del_chat: function (event) {
        var nameList = {
            your: event.currentTarget.dataset.username
        }
        var currentPage = getCurrentPages()
        wx.showModal({
            title: '删除该聊天记录',
            confirmText: '删除',
            success: function (res) {
                if (res.confirm) {
                    wx.setStorage({
                        key: nameList.your,
                        data: '',
                        success: function () {
                            if (currentPage[1]) {
                                currentPage[1].onShow()
                            }
                        }
                    })
                }
            },
            fail: function (error) {
                //console.log(error)
            }
        })
    }

})



