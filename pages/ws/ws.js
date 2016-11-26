// Page({
//     onLoad: function() {
//         wx.connectSocket({
//             url: 'wss://im-api.sandbox.easemob.com/ws/',
//             method: "GET"
//         })
//         wx.onSocketOpen(function(res) {
//             console.log('WebSocket连接已打开！')
//             wx.sendSocketMessage({
//                 data: "Hello,World:" 
//             })
//         })
//         wx.onSocketMessage(function(msg) {
//             console.log(msg)
//         })
//         wx.onSocketClose(function() {
//           console.log('WebSocket连接已经关闭!')
//         })
//     }
// })