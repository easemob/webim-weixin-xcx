
import websdk from "../sdk/Easemob-chat-4.13.0";
import config from "./WebIMConfig";

console.group = console.group || {};
console.groupEnd = console.groupEnd || {};

var window = {};
let WebIM = window.WebIM = websdk;
WebIM.message = websdk.message
window.WebIM.config = config;
//var DOMParser = window.DOMParser = xmldom.DOMParser;
//let document = window.document = new DOMParser().parseFromString("<?xml version='1.0'?>\n", "text/xml");

WebIM.isDebug = function (option) {
	if (option) {
		WebIM.config.isDebug = option.isDebug
		openDebug(WebIM.config.isDebug)
	}

	function openDebug(value) {
		function ts() {
			var d = new Date();
			var Hours = d.getHours(); // 获取当前小时数(0-23)
			var Minutes = d.getMinutes(); // 获取当前分钟数(0-59)
			var Seconds = d.getSeconds(); // 获取当前秒数(0-59)
			return (Hours < 10 ? "0" + Hours : Hours) + ":" + (Minutes < 10 ? "0" + Minutes : Minutes) + ":" + (Seconds < 10 ? "0" + Seconds : Seconds) + " ";
		}


		// if (value) {
		// 	Strophe.Strophe.Connection.prototype.rawOutput = function(data){
		// 		try{
		// 			console.group("%csend # " + ts(), "color: blue; font-size: large");
		// 			console.log("%c" + data, "color: blue");
		// 			console.groupEnd();
		// 		}
		// 		catch(e){
		// 			console.log(e);
		// 		}
		// 	};
		// }else{
		// 	Strophe.Strophe.Connection.prototype.rawOutput = function(){};
		// }

	}
}

/**
 * Set autoSignIn as true (autoSignInName and autoSignInPwd are configured below),
 * You can auto signed in each time when you refresh the page in dev model.
 */
WebIM.config.autoSignIn = false;
if (WebIM.config.autoSignIn) {
	WebIM.config.autoSignInName = "lwz2";
	WebIM.config.autoSignInPwd = "1";
}


// var stropheConn = new window.Strophe.Connection("ws://im-api.easemob.com/ws/", {
//                 inactivity: 30,
//                 maxRetries: 5,
//                 pollingTime: 4500
//             });
//
// stropheConn.connect(
//   '$t$' + 'YWMtmbQEBKKIEeaGmMtXyg5n1wAAAVlkQvGO2WOJGlMCEJKM4VV9GCMnb_XLCXU',
//   function() {
//     console.log(arguments, 'ggogogo');
//   }, stropheConn.wait, stropheConn.hold);
WebIM.parseEmoji = function (msg) {
	if (typeof WebIM.Emoji === "undefined" || typeof WebIM.Emoji.map === "undefined") {
		return msg;
	}
	var emoji = WebIM.Emoji,
		reg = null;
	var msgList = [];
	var objList = [];
	for (var face in emoji.map) {
		if (emoji.map.hasOwnProperty(face)) {
			while (msg.indexOf(face) > -1) {
				msg = msg.replace(face, "^" + emoji.map[face] + "^");
			}
		}
	}
	var ary = msg.split("^");
	var reg = /^e.*g$/;
	for (var i = 0; i < ary.length; i++) {
		if (ary[i] != "") {
			msgList.push(ary[i]);
		}
	}
	for (var i = 0; i < msgList.length; i++) {
		if (reg.test(msgList[i])) {
			var obj = {};
			obj.data = msgList[i];
			obj.type = "emoji";
			objList.push(obj);
		}
		else {
			var obj = {};
			obj.data = msgList[i];
			obj.type = "txt";
			objList.push(obj);
		}
	}
	return objList;
};

WebIM.time = function () {
	var date = new Date();
	var Hours = date.getHours();
	var Minutes = date.getMinutes();
	var Seconds = date.getSeconds();
	var time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " "
		+ (Hours < 10 ? "0" + Hours : Hours) + ":" + (Minutes < 10 ? "0" + Minutes : Minutes) + ":" + (Seconds < 10 ? "0" + Seconds : Seconds);
	return time;
};

WebIM.Emoji = {
	path: "../../../../../images/faces/",
	map: {
		"[):]": "ee_1.png",
		"[:D]": "ee_2.png",
		"[;)]": "ee_3.png",
		"[:-o]": "ee_4.png",
		"[:p]": "ee_5.png",
		"[(H)]": "ee_6.png",
		"[:@]": "ee_7.png",
		"[:s]": "ee_8.png",
		"[:$]": "ee_9.png",
		"[:(]": "ee_10.png",
		"[:'(]": "ee_11.png",
		"[<o)]": "ee_12.png",
		"[(a)]": "ee_13.png",
		"[8o|]": "ee_14.png",
		"[8-|]": "ee_15.png",
		"[+o(]": "ee_16.png",
		"[|-)]": "ee_17.png",
		"[:|]": "ee_18.png",
		"[*-)]": "ee_19.png",
		"[:-#]": "ee_20.png",
		"[^o)]": "ee_21.png",
		"[:-*]": "ee_22.png",
		"[8-)]": "ee_23.png",
		"[del]": "btn_del.png",
		"[(|)]": "ee_24.png",
		"[(u)]": "ee_25.png",
		"[(S)]": "ee_26.png",
		"[(*)]": "ee_27.png",
		"[(#)]": "ee_28.png",
		"[(R)]": "ee_29.png",
		"[({)]": "ee_30.png",
		"[(})]": "ee_31.png",
		"[(k)]": "ee_32.png",
		"[(F)]": "ee_33.png",
		"[(W)]": "ee_34.png",
		"[(D)]": "ee_35.png"
	}
};

WebIM.EmojiObj = {
	// 相对 emoji.js 路径
	path: "../../../../../images/faces/",
	map1: {
		"[):]": "ee_1.png",
		"[:D]": "ee_2.png",
		"[;)]": "ee_3.png",
		"[:-o]": "ee_4.png",
		"[:p]": "ee_5.png",
		"[(H)]": "ee_6.png",
		"[:@]": "ee_7.png"
	},
	map2: {
		"[:s]": "ee_8.png",
		"[:$]": "ee_9.png",
		"[:(]": "ee_10.png",
		"[:'(]": "ee_11.png",
		"[<o)]": "ee_12.png",
		"[(a)]": "ee_13.png",
		"[8o|]": "ee_14.png"
	},
	map3: {
		"[8-|]": "ee_15.png",
		"[+o(]": "ee_16.png",
		"[|-)]": "ee_17.png",
		"[:|]": "ee_18.png",
		"[*-)]": "ee_19.png",
		"[:-#]": "ee_20.png",
		"[del]": "del.png"
	},
	map4: {
		"[^o)]": "ee_21.png",
		"[:-*]": "ee_22.png",
		"[8-)]": "ee_23.png",
		"[(|)]": "ee_24.png",
		"[(u)]": "ee_25.png",
		"[(S)]": "ee_26.png",
		"[(*)]": "ee_27.png"
	},
	map5: {
		"[(#)]": "ee_28.png",
		"[(R)]": "ee_29.png",
		"[({)]": "ee_30.png",
		"[(})]": "ee_31.png",
		"[(k)]": "ee_32.png",
		"[(F)]": "ee_33.png",
		"[(W)]": "ee_34.png",
		"[(D)]": "ee_35.png"
	},
	map6: {
		"[del]": "del.png"
	}
};


WebIM.conn = new WebIM.connection({
	appKey: WebIM.config.appkey,
	isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
	https: true, //typeof WebIM.config.https === "boolean" ? WebIM.config.https : location.protocol === "https:",
	url: WebIM.config.socketServer,
	apiUrl: WebIM.config.apiURL,
	isAutoLogin: false,
	heartBeatWait: 30000, //WebIM.config.heartBeatWait,
	autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
	autoReconnectInterval: WebIM.config.autoReconnectInterval,
	isDebug: WebIM.config.isDebug,
	deviceId: WebIM.config.deviceId,
	enableReportLogs: true
});

// async response
// WebIM.conn.listen({
//   onOpened: () => dispatch({type: Types.ON_OPEND})
// })
Math.uuid = function (len, radix) {
	var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
	var chars = CHARS, uuid = [], i;
	radix = radix || chars.length;

	if (len) {
		// Compact form
		for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
	} else {
		// rfc4122, version 4 form
		var r;

		// rfc4122 requires these characters
		uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
		uuid[14] = '4';

		// Fill in random data. At i==19 set the high bits of clock sequence
		// as
		// per rfc4122, sec. 4.1.5
		for (i = 0; i < 36; i++) {
			if (!uuid[i]) {
				r = 0 | Math.random() * 16;
				uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
			}
		}
	}

	return uuid.join('');
};
// export default WebIM;
module.exports = {
	"default": WebIM
};
