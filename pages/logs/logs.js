//logs.js
console.log(this, window, document)

var util = require('../../utils/util.js')

// console.log(wx)
var readme = require('../../utils/strophe.js')
console.log(readme)
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
