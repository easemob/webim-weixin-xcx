/** 
								** 呼叫流程 **
    caller            --------------------------------------             callee
	    	----------inviting--------------->
										<-------------alerting-------
			----------confirmRing------------>
										<-------------answerCall-----
			----------confirmCallee---------->
*/
let disp = require("../../../utils/broadcast");
const CALLSTATUS = {
	idle: 0,
	inviting: 1,
	alerting: 2,
	confirmRing: 3, // caller
	receivedConfirmRing: 4, // callee
	answerCall: 5,
	receivedAnswerCall: 6,
	confirmCallee: 7
}
wx.WebIM.rtc = {
    // 用来放置本地客户端。
    client: null,
    // 用来放置本地音视频频轨道对象。
    localAudioTrack: null,
    localVideoTrack: null,
    timer: null
}

let emediaState = {
	callStatus: CALLSTATUS.idle,
    callDuration: '00:00',
    minisize: false,
    confr: {
    	channel: '',
    	token: '',
    	type: null,
    	callId: null,
    	callerDevId: null,
    	calleeDevId: null,
    	confrName: '',
    	callerIMName: '',
    	calleeIMName: ''
    },
    gid: '',
    inviteModal: false,
    joinedMembers: [],
    invitedMembers: [],

	onMessage: function (message) {
		let me = emediaState
		console.log('msg', message)
		let msg = message
		// text invite message
		if (message.ext.action == 'invite') {
		  	console.log('收到邀请消息', message)
            message.calleeIMName = message.to
            message.callerIMName = message.from

            if (message.from == wx.WebIM.conn.context.jid.name) {
                return // 自己在另一端发出的邀请
            }
            if (emediaState.callStatus > CALLSTATUS.idle) { // 正忙
                if (message.ext.callId == emediaState.confr.callId) { // 多人会议中邀请别人
                	emediaState.callStatus = CALLSTATUS.alerting
                   	emediaState.sendAlerting(message.from, message.ext.callerDevId, message.ext.callId) // 回复alerting消息
                }else{
                    emediaState.answerCall.call(emediaState, 'busy', {callId: message.ext.callId, callerDevId:message.ext.callerDevId, to: message.from})
                }
            }

            emediaState.updateConfr(message)
            emediaState.sendAlerting(message.from, message.ext.callerDevId, message.ext.callId) // 回复alerting消息
            emediaState.callStatus = CALLSTATUS.alerting // 更改为alerting状态
		}
		// CMD sessage
		if (msg.action === "rtcCall") {
            if (msg.from === wx.WebIM.conn.context.jid.name) {
                return // 多端情况， 另一端自己发的消息
            }
            let msgInfo = msg.ext
            let deviceId = '';
            let callerDevId = ''
            let callId = '';

            switch(msgInfo.action){
                case "alert":
                    deviceId = msgInfo.calleeDevId
                    callerDevId = msgInfo.callerDevId
                    callId = msgInfo.callId
                    console.log('收到回复的alert', msg)
                   	emediaState.confirmRing.call(emediaState,msg.from, deviceId, callerDevId, callId)
                    break;
                case "confirmRing":
                    console.log('收到confirmRing', msg)
                    if (msgInfo.calleeDevId != wx.WebIM.conn.context.jid.clientResource) {
                        console.log('不是自己设备的confirmRing', msg)
                        return // 多端情况另一端的消息
                    }
                    if (!msgInfo.status && emediaState.callStatus < CALLSTATUS.receivedConfirmRing) {
                        console.warn('邀请已失效')
                        wx.showToast({
							title: "邀请已失效",
							duration: 1000
						});
                        emediaState.callStatus = CALLSTATUS.idle
                        emediaState.hangup()
                        return
                    }
                    deviceId = msgInfo.calleeDevId
                    emediaState.callStatus = CALLSTATUS.receivedConfirmRing
                    console.log('清除定时器2')
                    wx.WebIM.rtc.timer && clearTimeout(wx.WebIM.rtc.timer)
                    // disp.fire('emedia.confirmRing');

                    wx.showModal({
					  title: '提示',
					  content: '邀请你加入视频会议',
					  success (res) {
					  	if (res.confirm) {
					  		console.log('emediaState ---', emediaState)
					  		if (emediaState.callStatus == 0) {
					  			return
					  		}
					  		me.answerCall.call(me,'accept', msgInfo)
						    let pages = getCurrentPages();
	  						let curPage = pages[pages.length - 1];
	  						if (curPage.route !== "pages/chatroom/chatroom") {

	  							var nameList = {
									myName: wx.WebIM.conn.context.jid.name,
									your: msg.from,
									action: 'join',
									data: msg
								};

								if (msgInfo.ext&&msgInfo.ext.groupId) {
	  								nameList.groupId = msgInfo.ext.groupId
	  							}
								wx.navigateTo({
									url: "../chatroom/chatroom?username=" + JSON.stringify(nameList)
								});
	  						}else{
	  							disp.fire('emedia.confirmRing', msg);
	  						}
					  	}else{
					  		me.answerCall.call(me,'refuse', msgInfo)
					  	}
					    
					  },
					  fail(){
					  	me.answerCall.call(me,'refuse', msgInfo)
					  }
					})
                    break;
                case "answerCall":
                    console.log('收到回复的answerCall', msg)
                    console.log('清除定时器1')
                    wx.WebIM.rtc.timer && clearTimeout(wx.WebIM.rtc.timer)
                    
                    deviceId = msgInfo.calleeDevId

                    if (msgInfo.callerDevId != wx.WebIM.conn.context.jid.clientResource) {
                        console.log('不是自己设备的answerCall', msg)
                        return // 多端情况另一端的消息
                    }

                    emediaState.confirmCallee(msg.from, deviceId, msgInfo.result)

                    if (msgInfo.result !== 'accept') {
                        if (msgInfo.result === 'busy') {
                            console.error('对方正忙')
                            wx.showToast({
								title: "对方正忙",
								duration: 1000
							});
                        }else if(msgInfo.result === 'refuse'){
                            console.error('对方已拒绝')
                            wx.showToast({
								title: "对方已拒绝",
								duration: 1000
							});
                        }
                        
                        if (emediaState.confr.type !== 2) { // 单人情况挂断，多人不挂断
                        	emediaState.hangup()
                        	disp.fire('hangup')
                        	emediaState.callStatus = CALLSTATUS.idle
                        }
                    }
                    break;
                case "confirmCallee":
                    console.log('收到confirmCallee', msg)
                    if ( msgInfo.calleeDevId != wx.WebIM.conn.context.jid.clientResource) {
                        if (msg.to == wx.WebIM.conn.context.jid.name) {
                        	emediaState.hangup()
                        	emediaState.callStatus = CALLSTATUS.idle
                        	// disp.fire('hangup')
                        	wx.showToast({
								title: "已在其他设备处理",
								duration: 2000
							});
                            return console.error('已在其他设备处理')
                        }
                    }
                    else if (msg.ext.result != 'accept' && emediaState.callStatus != 7) {
                        // 不在通话中收到 busy refuse时挂断
                        emediaState.hangup()
                        disp.fire('hangup')

                        emediaState.callStatus = CALLSTATUS.idle
                        return
                    }
                    emediaState.callStatus = CALLSTATUS.confirmCallee
                    break;
                case "cancelCall":
                    console.log('收到cancelCall', msg)

                    if (msg.from == wx.WebIM.conn.context.jid.name) {
                        return // 多端情况另一端的消息
                    }
                    if (msg.from == emediaState.confr.callerIMName) {
                        emediaState.hangup()
                        disp.fire('hangup')
                        emediaState.callStatus = CALLSTATUS.idle
                    }
                    break;
                default:
                    console.log('unexpected action')
                    break;
            }
        }
	},

	 // callee
	sendAlerting: (to, calleeDevId, callId) => {
        var id = wx.WebIM.conn.getUniqueId();            //生成本地消息id
		var msg = new wx.WebIM.message('cmd', id); //创建命令消息
		msg.set({
			to: to,
			action : 'rtcCall', 
			ext: {
				action: 'alert',
				calleeDevId: wx.WebIM.conn.context.jid.clientResource,
				callerDevId: calleeDevId,
				callId: callId,
				ts: Date.now(),
				msgType: 'rtcCallWithAgora'
			}, 
			success: function ( id,serverMsgId ) {
				emediaState.callStatus = CALLSTATUS.alerting
			},
			fail: function(e){
			    console.log("Fail");
			}
		});

		console.log('被叫发出的alert: ', msg.body)
		wx.WebIM.conn.send(msg.body);
		wx.WebIM.rtc.timer = setTimeout(() => {
			console.log('定时器到期')
			emediaState.hangup()
			disp.fire('hangup')
			emediaState.callStatus = CALLSTATUS.idle
		}, 30000)
		console.log('设置定时器')
	},

	// caller
	confirmRing: function(to, calleeDevId, callerDevId, callId){
		let me = emediaState;
		let confr = emediaState.confr
		let currentCallId = confr.callId
		let status = true
		console.log('confirmRing confr', confr)
		if (callerDevId !== wx.WebIM.conn.context.jid.clientResource) {
			console.warn('callerDevId 设备不相同')
			return
		}
		if (callId !== currentCallId) {
			console.warn('callId 不相同', callId)
			status = false
		}
		else if (emediaState.callStatus > 4 && confr.type != 2) { //已经在通话中
			status = false
		}

		var id = wx.WebIM.conn.getUniqueId();            //生成本地消息id
		var msg = new wx.WebIM.message('cmd', id); //创建命令消息
		msg.set({
			to: to,
			action : 'rtcCall', 
			ext: {
				action: 'confirmRing',
				status: status, // TRUE为有效，FALSE为无效（miss）
				callerDevId: wx.WebIM.conn.context.jid.clientResource,
				calleeDevId: calleeDevId,
				callId: callId,
				ts: Date.now(),
				msgType: 'rtcCallWithAgora'
			}, 
			success: function ( id,serverMsgId ) {
				if (status) {
					me.callStatus = CALLSTATUS.confirmRing;
				}
			},
			fail: function(e){
			    console.log("Fail");
			}
		});
		console.log('发送confirmRing', msg)
		wx.WebIM.conn.send(msg.body);
	},

	// callee
	answerCall: (result, info ) => {
		info = info || {}
		var id = wx.WebIM.conn.getUniqueId();            //生成本地消息id
		var msg = new wx.WebIM.message('cmd', id); //创建命令消息
		let currentCallId = info.currentCallId || info.callId
		let callerDevId = info.callerDevId || emediaState.confr.callerDevId
		let to = info.to || emediaState.confr.callerIMName
		msg.set({
			to: to,
			action : 'rtcCall', 
			ext: {
				action: 'answerCall',
				result: result, // busy/accept/refuse
				callerDevId: callerDevId,
				calleeDevId: wx.WebIM.conn.context.jid.clientResource,
				callId: currentCallId,
				ts: Date.now(),
				msgType: 'rtcCallWithAgora'
			}, 
			success: function ( id, serverMsgId ) {

			},
			fail: function(e){
			    console.log("Fail"); //如禁言、拉黑后发送消息会失败
			}
		});
		console.log('发送answerCall', msg )
		wx.WebIM.conn.send(msg.body);
	},

	// caller
	confirmCallee: function(to, calleeDevId, result){
		let me = emediaState
		var id = wx.WebIM.conn.getUniqueId();
		var msg = new wx.WebIM.message('cmd', id);

		let confr = emediaState.confr
		let currentCallId = confr.callId

		if (!confr.calleeDevId && confr.type !=2 ) {
			emediaState.updateConfr({
				to: confr.confrName,
				ext: {
					channelName: confr.channel,
					token: confr.token,
					type: confr.type,
					callerDevId: confr.callerDevId,
					calleeDevId: calleeDevId,
	                callId: confr.callId,
	                members: [{name:'name1',uid: 12345}]
				},
				calleeIMName: confr.calleeIMName,
				callerIMName: confr.callerIMName
			})
		}else if(confr.calleeDevId != calleeDevId && confr.type !=2){
			result = 'refuse'
		}

		msg.set({
			to: to,
			action : 'rtcCall', 
			ext: {
				action: 'confirmCallee',
				result: result || 'accept', // busy/accept/refuse
				callerDevId: wx.WebIM.conn.context.jid.clientResource,
				calleeDevId: calleeDevId,
				callId: currentCallId,
				ts: Date.now(),
				msgType: 'rtcCallWithAgora'
			}, 
			success: function ( id,serverMsgId ) {
				me.callStatus = CALLSTATUS.confirmCallee
			},
			fail: function(e){
			    console.log("Fail")
			}
		}); 
		console.log('发送confirmCallee', msg)
		wx.WebIM.conn.send(msg.body);
	},

	cancelCall: function(to){
		let me = emediaState
		var id = wx.WebIM.conn.getUniqueId();
		var msg = new wx.WebIM.message('cmd', id);
		let callerDevId = emediaState.confr.callerDevId
		let user = to || emediaState.confr.calleeIMName
		let currentCallId = emediaState.confr.callId
		if (!user) {
			console.log('-- to is undefined --')
			return
		}
		msg.set({
			to: user,
			action : 'rtcCall', 
			ext: {
				action: 'cancelCall',
				callerDevId: callerDevId,
				callId: currentCallId,
				ts: Date.now(),
				msgType: 'rtcCallWithAgora'
			}, 
			success: function ( id,serverMsgId ) {
				me.callStatus = CALLSTATUS.idle
			},
			fail: function(e){
			    console.log("Fail");
			}
		});
		console.log('发送取消消息',msg)
		wx.WebIM.conn.send(msg.body);
	},

	hangup: () => {
        emediaState.callStatus = CALLSTATUS.idle
        emediaState.cancelCall()
		// dispatch(Creators.setCallDuration('00:00'))
		// dispatch(Creators.setMinisize(false))
		// dispatch(Creators.resetAll())
		// dispatch(Creators.setJoinedMembers([]))
		// dispatch(Creators.setInvitedMembers([]))
		// dispatch(Creators.updateConfr({
		// 	to: '',
		// 	ext: {}
		// }))
		emediaState.updateConfr({})
	},

	updateConfr: function(msg){
		let confrInfo = msg.ext || {}
		let groupId
		let confr = {
			channel: confrInfo.channelName,
			token: confrInfo.token,
			type: confrInfo.type,
			callId: confrInfo.callId,
			callerDevId: confrInfo.callerDevId,
			calleeDevId: confrInfo.calleeDevId
		}
		if (confrInfo.type === 2) {
			confr.confrName = msg.to
		}else{
			confr.confrName = msg.from
		}

		if (msg.calleeIMName) {
			confr.calleeIMName = msg.calleeIMName
		}

		if (msg.callerIMName) {
			confr.callerIMName = msg.callerIMName
		}
		if (confrInfo.ext) {
			groupId = confrInfo.ext.groupId
			confr.gid = groupId
		}

		emediaState.confr = confr
		//return confrInfo.ext ? emediaState.confr.gid = groupId : emediaState.confr = confr
	},

	setConf: function(prop, value){
		if (typeof prop == 'object') {
			for(let key in prop){
				emediaState.confr[key] = prop[key]
			}
			return
		}
		emediaState.confr[prop] = value
	}
}

module.exports = emediaState


