var strophe = require('../../utils/strophe.js')
var WebIM = require('../../utils/WebIM.js')
var WebIM = WebIM.default

//WebIM.conn  实例化的connection  
Page({
	data: {

	},
	onLoad: function() {
		var options = {
		    apiUrl: WebIM.config.apiURL,
		    user: "lwz2",
		    pwd: "1",
		    appKey: WebIM.config.appkey
		};
		WebIM.conn.open(options);
		WebIM.conn.listen({
	 		onError: function(err) {
	 			console.log(err)
	 		},
	 		onRoster: function(msg) {
	 			console.log(msg)
	 		},
	 		onPresence: function(msg) {
	 			console.log(msg)
	 		}
 		})

		WebIM.conn.setPresence()     //出席
		WebIM.conn.getRoster()
	},
	add_friend: function() {
	    var id = WebIM.conn.getUniqueId()
	    var msg = new WebIM.message('txt', id)
	    // console.log(msg)
	    msg.set({
	        msg: 'hello, world',                       // 消息内容
	        to: 'wjy666',                          // 接收消息对象
	        roomType: false,
	        success: function (id, serverMsgId) {
	            console.log("send private text Success")
	        },
	        fail: function(error) {
	        	console.log('send error')
	        }
	    });
	    msg.body.chatType = 'singleChat';
	    WebIM.conn.send(msg.body)
	}
})