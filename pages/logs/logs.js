//logs.js

var util = require('../../utils/util.js')

// console.log(wx)
var strophe = require('../../utils/strophe.js')
var WebIM = require('../../utils/WebIM.js')
//console.log(WebIM)
Page({
  data: {
    logs: []
  },
  bindViewTap: function() {
    wx.navigateTo({
      url: '../demo/demo'
    })
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(function (log) {
        return util.formatTime(new Date(log))
      })
    })
  }
})
