let Disp = require("../../utils/Dispatcher");
let msgPackager = require("msgpackager");
let msgType = require("msgtype");
let msgStorage = new Disp();
msgStorage.saveReceiveMsg = function(receiveMsg, type){
	let sendableMsg;
	if(type == msgType.IMAGE){
		sendableMsg = {
			id: receiveMsg.id,
			type: type,
			body: {
				id: receiveMsg.id,
				from: receiveMsg.from,
				to: receiveMsg.to,
				type: type,
				ext: receiveMsg.ext,
				// chatType: "singleChat",
				toJid: "",
				body: {
					type: type,
					url: receiveMsg.url,
					filename: receiveMsg.filename,
					filetype: receiveMsg.filetype,
					size: {
						width: receiveMsg.width,
						height: receiveMsg.height
					},
				},
			},
		};
	}
	else if(type == msgType.TEXT || type == msgType.EMOJI){
		sendableMsg = {
			id: receiveMsg.id,
			type: type,
			body: {
				id: receiveMsg.id,
				from: receiveMsg.from,
				to: receiveMsg.to,
				type: type,
				ext: receiveMsg.ext,
				// chatType: "singleChat",
				toJid: "",
				body: {
					type: type,
					msg: receiveMsg.data,
				},
			},
			value: receiveMsg.data
		};
	}
	else if(type == msgType.AUDIO){
		sendableMsg = {
			id: receiveMsg.id,
			type: type,
			body: {
				id: receiveMsg.id,
				from: receiveMsg.from,
				to: receiveMsg.to,
				type: type,
				ext: receiveMsg.ext,
				// chatType: "singleChat",
				toJid: "",
				body: {
					type: type,
					url: receiveMsg.url,
					filename: receiveMsg.filename,
					filetype: receiveMsg.filetype,
				},
			},
		};
	}
	else{
		return;
	}
	this.saveMsg(sendableMsg, type);
};
msgStorage.saveMsg = function(sendableMsg, type){
	var me = this;
	var myName = wx.getStorageSync("myUsername");
	var sessionKey = sendableMsg.body.from == myName
		? sendableMsg.body.to + myName
		: sendableMsg.body.from + myName;
	var curChatMsg = wx.getStorageSync(sessionKey) || [];
	var renderableMsg = msgPackager(sendableMsg, type, myName);
	curChatMsg.push(renderableMsg);
	if(type == msgType.AUDIO){
		// 如果是音频则请求服务器转码
		wx.downloadFile({
			url: sendableMsg.body.body.url,
			header: {
				"X-Requested-With": "XMLHttpRequest",
				Accept: "audio/mp3",
				Authorization: "Bearer " + sendableMsg.accessToken
			},
			success(res){
				// wx.playVoice({
				// 	filePath: res.tempFilePath
				// });
				renderableMsg.msg.url = res.tempFilePath;
				save();
			},
			fail(e){
				console.log("downloadFile failed", e);
			}
		});
	}
	else{
		save();
	}
	function save(){
		wx.setStorage({
			key: sessionKey,
			data: curChatMsg,
			success(){
				me.fire("newChatMsg", renderableMsg, type, curChatMsg);
			}
		});
	}
};

module.exports = msgStorage;
