let disp = require("../../utils/broadcast");
var WebIM = require("../../utils/WebIM")["default"];
let isfirstTime = true
Page({
	data: {
		search_btn: true,
		search_chats: false,
		show_mask: false,
		yourname: "",
		unReadSpotNum: 0,
		unReadNoticeNum: 0,
		messageNum: 0,
		unReadTotalNotNum: 0,
		arr: [],
		show_clear: false,
		groupName: {}
	},

	onLoad(options){
		let me = this;
		//监听加好友申请
		disp.on("em.xmpp.subscribe", function(){
			me.setData({
				messageNum: getApp().globalData.saveFriendList.length,
				unReadTotalNotNum: getApp().globalData.saveFriendList.length + getApp().globalData.saveGroupInvitedList.length
			});
		});

		//监听解散群
		disp.on("em.xmpp.invite.deleteGroup", function(){
			me.listGroups();
			me.getRoster();
			me.getChatList()
			me.setData({
				// arr: me.getChatList(),
				messageNum: getApp().globalData.saveFriendList.length
			});
		});

		//监听未读消息数
		disp.on("em.xmpp.unreadspot", function(message){
			me.getChatList()
			me.setData({
				// arr: me.getChatList(),
				unReadSpotNum: getApp().globalData.unReadMessageNum > 99 ? '99+' : getApp().globalData.unReadMessageNum,
			});
		});

		//监听未读加群“通知”
		disp.on("em.xmpp.invite.joingroup", function(){
			me.setData({
				unReadNoticeNum: getApp().globalData.saveGroupInvitedList.length,
				unReadTotalNotNum: getApp().globalData.saveFriendList.length + getApp().globalData.saveGroupInvitedList.length
			});
		});

		disp.on("em.xmpp.contacts.remove", function(){
			me.getChatList()
			me.getRoster();
			// me.setData({
			// 	arr: me.getChatList(),
			// 	unReadSpotNum: getApp().globalData.unReadMessageNum > 99 ? '99+' : getApp().globalData.unReadMessageNum,
			// });
		});

		// 监听被移出群
		disp.on("em.xmpp.group.leaveGroup", function(msg){
			console.log('msg ++++', msg)
			let key = msg.gid + msg.to
			wx.removeStorageSync(key)
			wx.removeStorageSync('rendered_'+key)
			me.getChatList()
			disp.fire("em.chat.session.remove");
		});

		// 监听加群成
		disp.on("em.xmpp.group.joingroup", function(msg){
			me.listGroups();
			me.getChatList()
		});


		this.getRoster();

		if (wx.canIUse('hideHomeButton')) {
			wx.hideHomeButton()
		}
	},

	listGroups(){
		var me = this;
		return WebIM.conn.getGroup({
			limit: 50,
			success: function(res){
				let groupName = {}
				let listGroup = res.data || []
				listGroup.forEach((item) => {
					groupName[item.groupid] = item.groupname
				})

				me.setData({
					groupName
				})
				wx.setStorage({
					key: "listGroup",
					data: res.data
				});
				me.getChatList()
			},
			error: function(err){
				console.log(err)
			}
		});
	},

	getRoster(){
		let me = this;
		let rosters = {
			success(roster){
				var member = [];
				for(let i = 0; i < roster.length; i++){
					if(roster[i].subscription == "both"){
						member.push(roster[i]);
					}
				}
				wx.setStorage({
					key: "member",
					data: member
				});
				me.setData({member: member});
				me.listGroups()
				//if(!systemReady){
					disp.fire("em.main.ready");
					//systemReady = true;
				//}
				me.setData({
					arr: me.getChatList(),
					unReadSpotNum: getApp().globalData.unReadMessageNum > 99 ? '99+' : getApp().globalData.unReadMessageNum,
				});
			},
			error(err){
				console.log(err);
			}
		};
		WebIM.conn.getContacts(rosters);
	},
	// 包含陌生人版本
	getChatList(){
		var myName = wx.getStorageSync("myUsername");
		var array = [];
		const me = this
		wx.getStorageInfo({
			success: function(res){
				let storageKeys = res.keys
				let newChatMsgKeys = [];
				let historyChatMsgKeys = [];
				let len = myName.length
				storageKeys.forEach((item) => {
					if (item.slice(-len) == myName && item.indexOf('rendered_') == -1) {
						newChatMsgKeys.push(item)
					}else if(item.slice(-len) == myName && item.indexOf('rendered_') > -1){
						historyChatMsgKeys.push(item)
					}
				})

				cul.call(me, newChatMsgKeys, historyChatMsgKeys)
			}
		})

		function cul(newChatMsgKeys, historyChatMsgKeys){
			let array = []
			let lastChatMsg;
			for(let i = 0; i < historyChatMsgKeys.length; i++){
				let index = newChatMsgKeys.indexOf(historyChatMsgKeys[i].slice(9))
				if ( index > -1 ) {
					let newChatMsgs = wx.getStorageSync(newChatMsgKeys[index]) || [];
					if (newChatMsgKeys.includes()) {}
					if(newChatMsgs.length){
						lastChatMsg = newChatMsgs[newChatMsgs.length - 1];
						lastChatMsg.unReadCount = newChatMsgs.length;
						if(lastChatMsg.unReadCount > 99) {
							lastChatMsg.unReadCount = "99+";
						}
						let dateArr = lastChatMsg.time.split(' ')[0].split('-')
						let timeArr = lastChatMsg.time.split(' ')[1].split(':')
						let month = dateArr[2] < 10 ? '0' + dateArr[2] : dateArr[2]
						lastChatMsg.dateTimeNum = `${dateArr[1]}${month}${timeArr[0]}${timeArr[1]}${timeArr[2]}`
						lastChatMsg.time = `${dateArr[1]}月${dateArr[2]}日 ${timeArr[0]}时${timeArr[1]}分`
						newChatMsgKeys.splice(index, 1)
					}else{
						let historyChatMsgs = wx.getStorageSync(historyChatMsgKeys[i]);
						if (historyChatMsgs.length) {
							lastChatMsg = historyChatMsgs[historyChatMsgs.length - 1];
							let dateArr = lastChatMsg.time.split(' ')[0].split('-')
							let timeArr = lastChatMsg.time.split(' ')[1].split(':')
							let month = dateArr[2] < 10 ? '0' + dateArr[2] : dateArr[2]
							lastChatMsg.dateTimeNum = `${dateArr[1]}${month}${timeArr[0]}${timeArr[1]}${timeArr[2]}`
							lastChatMsg.time = `${dateArr[1]}月${dateArr[2]}日 ${timeArr[0]}时${timeArr[1]}分`
						}
					}
				}else{
					let historyChatMsgs = wx.getStorageSync(historyChatMsgKeys[i]);
					if (historyChatMsgs.length) {
						lastChatMsg = historyChatMsgs[historyChatMsgs.length - 1];
						let dateArr = lastChatMsg.time.split(' ')[0].split('-')
						let timeArr = lastChatMsg.time.split(' ')[1].split(':')
						let month = dateArr[2] < 10 ? '0' + dateArr[2] : dateArr[2]
						lastChatMsg.dateTimeNum = `${dateArr[1]}${month}${timeArr[0]}${timeArr[1]}${timeArr[2]}`
						lastChatMsg.time = `${dateArr[1]}月${dateArr[2]}日 ${timeArr[0]}时${timeArr[1]}分`
					}
					
				}
				if (lastChatMsg && (lastChatMsg.chatType == 'groupchat' || lastChatMsg.chatType == 'chatRoom')) {
					lastChatMsg.groupName = me.data.groupName[lastChatMsg.info.to]
				}
				lastChatMsg && lastChatMsg.username != myName && array.push(lastChatMsg)
			}

			for(let i = 0; i < newChatMsgKeys.length; i++){
				let newChatMsgs = wx.getStorageSync(newChatMsgKeys[i]) || [];
				if(newChatMsgs.length){
					lastChatMsg = newChatMsgs[newChatMsgs.length - 1];
					lastChatMsg.unReadCount = newChatMsgs.length;
					if(lastChatMsg.unReadCount > 99) {
						lastChatMsg.unReadCount = "99+";
					}
					let dateArr = lastChatMsg.time.split(' ')[0].split('-')
					let timeArr = lastChatMsg.time.split(' ')[1].split(':')
					let month = dateArr[2] < 10 ? '0' + dateArr[2] : dateArr[2]
					lastChatMsg.dateTimeNum = `${dateArr[1]}${month}${timeArr[0]}${timeArr[1]}${timeArr[2]}`
					lastChatMsg.time = `${dateArr[1]}月${dateArr[2]}日 ${timeArr[0]}时${timeArr[1]}分`
					if (lastChatMsg.chatType == 'groupchat' || lastChatMsg.chatType == 'chatRoom') {
						lastChatMsg.groupName = me.data.groupName[lastChatMsg.info.to]
					}
					lastChatMsg.username != myName && array.push(lastChatMsg)
				}
			}

			array.sort((a, b) => {
				return b.dateTimeNum - a.dateTimeNum
			})
			this.setData({
				arr: array
			})
		}
	},
	// 	不包含陌生人版本
	// getChatList(){
	// 	var array = [];
	// 	var member = wx.getStorageSync("member");
	// 	var myName = wx.getStorageSync("myUsername");
	// 	var listGroups = wx.getStorageSync('listGroup')|| [];
	// 	for(let i = 0; i < member.length; i++){
	// 		let newChatMsgs = wx.getStorageSync(member[i].name + myName) || [];
	// 		let historyChatMsgs = wx.getStorageSync("rendered_" + member[i].name + myName) || [];
	// 		let curChatMsgs = historyChatMsgs.concat(newChatMsgs);

	// 		if(curChatMsgs.length){
	// 			console.log('newChatMsgs', newChatMsgs)
	// 			console.log('historyChatMsgs', historyChatMsgs)
	// 			let lastChatMsg = curChatMsgs[curChatMsgs.length - 1];
	// 			lastChatMsg.unReadCount = newChatMsgs.length;
	// 			if(lastChatMsg.unReadCount > 99) {
	// 				lastChatMsg.unReadCount = "99+";
	// 			}
	// 			let dateArr = lastChatMsg.time.split(' ')[0].split('-')
	// 			let timeArr = lastChatMsg.time.split(' ')[1].split(':')
	// 			let month = dateArr[2] < 10 ? '0' + dateArr[2] : dateArr[2]
	// 			lastChatMsg.dateTimeNum = `${dateArr[1]}${month}${timeArr[0]}${timeArr[1]}${timeArr[2]}`
	// 			lastChatMsg.time = `${dateArr[1]}月${dateArr[2]}日 ${timeArr[0]}时${timeArr[1]}分`
	// 			array.push(lastChatMsg);
	// 		}
	// 	}
	// 	for(let i = 0; i < listGroups.length; i++){
	// 		let newChatMsgs = wx.getStorageSync(listGroups[i].groupid + myName) || [];
	// 		let historyChatMsgs = wx.getStorageSync("rendered_" + listGroups[i].groupid + myName) || [];
	// 		let curChatMsgs = historyChatMsgs.concat(newChatMsgs);
	// 		if(curChatMsgs.length){
	// 			let lastChatMsg = curChatMsgs[curChatMsgs.length - 1];
	// 			lastChatMsg.unReadCount = newChatMsgs.length;
	// 			if(lastChatMsg.unReadCount > 99) {
	// 				lastChatMsg.unReadCount = "99+";
	// 			}
	// 			let dateArr = lastChatMsg.time.split(' ')[0].split('-')
	// 			let timeArr = lastChatMsg.time.split(' ')[1].split(':')
	// 			let month = dateArr[2] < 10 ? '0' + dateArr[2] : dateArr[2]
	// 			lastChatMsg.time = `${dateArr[1]}月${dateArr[2]}日 ${timeArr[0]}时${timeArr[1]}分`
	// 			lastChatMsg.dateTimeNum = `${dateArr[1]}${month}${timeArr[0]}${timeArr[1]}${timeArr[2]}`
	// 			lastChatMsg.groupName = listGroups[i].groupname
	// 			array.push(lastChatMsg);
	// 		}
	// 	}
	// 	//	测试列表

	// 	// for (let i = 0; i < 12; i++) {
	// 	// 	let newSESSION = {
	// 	// 		info: {from: "zdtest", to: "zdtest2"},
	// 	// 		mid: "txtWEBIM_427ab8b10c",
	// 	// 		msg: {type: "txt", data: [{data: "丢晚高峰阿精高峰阿精神焕高峰阿精神焕高峰阿精神焕神焕发丢完", type: "txt"}]},
	// 	// 		style: "self",
	// 	// 		time: "2019-2-18 16:59:25",
	// 	// 		username: "zdtest" + i,
	// 	// 		yourname: "zdtest"
	// 	// 	}
	// 	// 	let dateArr = newSESSION.time.split(' ')[0].split('-')
	// 	// 	let timeArr = newSESSION.time.split(' ')[1].split(':')
	// 	// 	newSESSION.time = `${dateArr[1]}月${dateArr[2]}日 ${timeArr[0]}时${timeArr[1]}分`
	// 	// 	array.push(newSESSION)
	// 	// }
		
	// 	array.sort((a, b) => {
	// 		return b.dateTimeNum - a.dateTimeNum
	// 	})
	// 	return array;
	// },

	onShow: function(){
		this.getChatList()
		this.setData({
			//arr: this.getChatList(),
			unReadSpotNum: getApp().globalData.unReadMessageNum > 99 ? '99+' : getApp().globalData.unReadMessageNum,
			messageNum: getApp().globalData.saveFriendList.length,
			unReadNoticeNum: getApp().globalData.saveGroupInvitedList.length,
			unReadTotalNotNum: getApp().globalData.saveFriendList.length + getApp().globalData.saveGroupInvitedList.length
		});

		if (getApp().globalData.isIPX) {
			this.setData({
				isIPX: true
			})
		}
	},

	openSearch: function(){
		this.setData({
			search_btn: false,
			search_chats: true,
			gotop: true
		});
	},

	onSearch: function(val){
		var myName = wx.getStorageSync("myUsername");
		const me = this
		let searchValue = val.detail.value
		let chartList = this.data.arr;
		let serchList = [];
		console.log('arr',me.data.arr)
		chartList.forEach((item, index)=>{
			if(String(item.username).indexOf(searchValue) != -1 || (item.groupName && item.groupName.indexOf(searchValue) != -1)){
				serchList.push(item)
			}
		})
		this.setData({
			arr: serchList,
		})
	},

	cancel: function(){
		this.getChatList()
		this.setData({
			search_btn: true,
			search_chats: false,
			//arr: this.getChatList(),
			unReadSpotNum: getApp().globalData.unReadMessageNum > 99 ? '99+' : getApp().globalData.unReadMessageNum,
			gotop: false
		});
	},

	clearInput: function(){
		this.setData({
			input_code: '',
			show_clear: false
		})
	},

	onInput: function(e){
		let inputValue = e.detail.value
		if (inputValue) {
			this.setData({
				show_clear: true
			})
		} else {
			this.setData({
				show_clear: false
			})
		}
	},

	tab_contacts: function(){
		wx.redirectTo({
			url: "../main/main?myName=" + wx.getStorageSync("myUsername")
		});
	},

	close_mask: function(){
		this.setData({
			search_btn: true,
			search_chats: false,
			show_mask: false
		});
	},

	tab_setting: function(){
		wx.redirectTo({
			url: "../setting/setting"
		});
	},

	tab_notification: function(){
		wx.redirectTo({
			url: "../notification/notification"
		});
	},

	into_chatRoom: function(event){
		let detail = event.currentTarget.dataset.item;
		//群聊的chatType居然是singlechat？脏数据？ 等sdk重写后整理一下字段
		if (detail.chatType == 'groupchat' || detail.chatType == 'chatRoom' || detail.groupName) {
			this.into_groupChatRoom(detail)
		} else {
			this.into_singleChatRoom(detail)
		}
	},

	//	单聊
	into_singleChatRoom: function(detail){
		var my = wx.getStorageSync("myUsername");
		var nameList = {
			myName: my,
			your: detail.username
		};
		wx.navigateTo({
			url: "../chatroom/chatroom?username=" + JSON.stringify(nameList)
		});
	},

	//	群聊 和 聊天室 （两个概念）
	into_groupChatRoom: function(detail){
		var my = wx.getStorageSync("myUsername");
		var nameList = {
			myName: my,
			your: detail.groupName,
			groupId: detail.info.to
		};
		wx.navigateTo({
			url: "../groupChatRoom/groupChatRoom?username=" + JSON.stringify(nameList)
		});
	},


	del_chat: function(event){
		let detail = event.currentTarget.dataset.item;
		let nameList;
		let me = this;
		if (detail.chatType == 'groupchat' || detail.chatType == 'chatRoom') {
			nameList = {
				your: detail.info.to
			};
		} else {
			nameList = {
				your: detail.username
			};
		}

		var myName = wx.getStorageSync("myUsername");
		var currentPage = getCurrentPages();
		
		wx.showModal({
			title: "删除该聊天记录",
			confirmText: "删除",
			success: function(res){
				if(res.confirm){
					wx.removeStorageSync(nameList.your + myName);
					wx.removeStorageSync("rendered_" + nameList.your + myName);
					if(currentPage[0]){
						currentPage[0].onShow();
					}
					me.getChatList()
					disp.fire("em.chat.session.remove");
				}
			},
			fail: function(err){
			}
		});
	},

});
