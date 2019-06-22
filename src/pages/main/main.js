let WebIM = require("../../utils/WebIM")["default"];
let disp = require("../../utils/broadcast");
let systemReady = false;
let canPullDownreffesh = true;
let oHeight = [];
Page({
	data: {
		search_btn: true,
		search_friend: false,
		show_mask: false,
		myName: "",
		member: [],
		messageNum: "", //加好友申请数
		unReadSpotNum: 0, //未读消息数
		unReadNoticeNum: 0, //加群通知数
		unReadTotalNotNum: 0, //总通知数：加好友申请数 + 加群通知数

		isActive:null,   
	    listMain:[],
	    listTitles: [],
	    fixedTitle:null,    
	    toView: 'inToView0',
	    oHeight:[],
	    scroolHeight:0,
		show_clear: false,
		isHideLoadMore: true
	},

	onLoad(option){
		const me = this;
		const app = getApp();
		new app.ToastPannel.ToastPannel();
		//监听加好友申请
		disp.on("em.xmpp.subscribe", function(){
			me.setData({
				messageNum: getApp().globalData.saveFriendList.length,
				unReadTotalNotNum: getApp().globalData.saveFriendList.length + getApp().globalData.saveGroupInvitedList.length
			});
		});

		disp.on("em.xmpp.contacts.remove", function(message){
			var pageStack = getCurrentPages();
			if(pageStack[pageStack.length - 1].route === me.route){
				me.getRoster();
			}
		});
		
		//监听未读“聊天”
		disp.on("em.xmpp.unreadspot", function(){
			me.setData({
				unReadSpotNum: getApp().globalData.unReadMessageNum > 99 ? '99+' : getApp().globalData.unReadMessageNum,
			});
		});
		//监听未读加群“通知”数
		disp.on("em.xmpp.invite.joingroup", function(){
			me.setData({
				unReadNoticeNum: getApp().globalData.saveGroupInvitedList.length,
				unReadTotalNotNum: getApp().globalData.saveFriendList.length + getApp().globalData.saveGroupInvitedList.length
			});
		});
		disp.on("em.xmpp.subscribed", function(){
			var pageStack = getCurrentPages();
			if(pageStack[pageStack.length - 1].route === me.route){
				me.getRoster();
			}
		});
		
		this.setData({
			myName: option.myName
		});
	},

	onShow(){
		this.setData({
			messageNum: getApp().globalData.saveFriendList.length,
			unReadSpotNum: getApp().globalData.unReadMessageNum > 99 ? '99+' : getApp().globalData.unReadMessageNum,
			unReadNoticeNum: getApp().globalData.saveGroupInvitedList.length,
			unReadTotalNotNum: getApp().globalData.saveFriendList.length + getApp().globalData.saveGroupInvitedList.length
		});
		if (getApp().globalData.isIPX) {
			this.setData({
				isIPX: true
			})
		}
		this.getRoster();
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
				if(!systemReady){
					disp.fire("em.main.ready");
					systemReady = true;
				}
				me.getBrands(member);
			},
			error(err){
				console.log("[main:getRoster]", err);
			}
		};
		// WebIM.conn.setPresence()
		WebIM.conn.getRoster(rosters);

	},

	moveFriend: function(message){
		let me = this;
		let rosters = {
			success: function(roster){
				var member = [];
				for(let i = 0; i < roster.length; i++){
					if(roster[i].subscription == "both"){
						member.push(roster[i]);
					}
				}
				me.setData({
					member: member
				});
			}
		};
		if(message.type == "unsubscribe" || message.type == "unsubscribed"){
			WebIM.conn.removeRoster({
				to: message.from,
				success: function(){
					WebIM.conn.unsubscribed({
						to: message.from
					});
					WebIM.conn.getRoster(rosters);
				}
			});
		}
	},

	handleFriendMsg: function(message){
		wx.showModal({
			title: "添加好友请求",
			content: message.from + "请求加为好友",
			success: function(res){
				if(res.confirm == true){
					WebIM.conn.subscribed({
						to: message.from,
						message: "[resp:true]"
					});
					WebIM.conn.subscribe({
						to: message.from,
						message: "[resp:true]"
					});
				}
				else{
					WebIM.conn.unsubscribed({
						to: message.from,
						message: "rejectAddFriend"
					});
				}
			},
			fail: function(err){
			}
		});
	},

	delete_friend: function(event){
		const me = this;
		var delName = event.currentTarget.dataset.username;
		var myName = wx.getStorageSync("myUsername");// 获取当前用户名
		wx.showModal({
			title: "确认删除好友" + delName,
			cancelText: "取消",
			confirmText: "删除",
			success(res){
				if(res.confirm == true){
					WebIM.conn.removeRoster({
						to: delName,
						success: function(){
							WebIM.conn.unsubscribed({
								to: delName
							});
							// wx.showToast({
							// 	title: "删除成功",
							// });
							me.toastSuccess('删除成功');
							// 删除好友后 同时清空会话
							wx.setStorageSync(delName + myName, "");
							wx.setStorageSync("rendered_" + delName + myName, "");
							me.getRoster();
							disp.fire('em.main.deleteFriend')
						},
						error: function(error){
							me.toastSuccess('删除失败');
						}
					});
				}
			}
		});
	},

	openSearch: function(){
		this.setData({
			search_btn: false,
			search_friend: true,
			show_mask: true,
			gotop: true
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

	cancel: function(){
		this.setData({
			search_btn: true,
			search_friend: false,
			gotop: false
			//show_mask: false
		});
		this.getBrands(this.data.member)
	},

	onSearch: function(val){
		let searchValue = val.detail.value
		let member = this.data.member;
		let serchList = [];
		member.forEach((item, index)=>{
			if(String(item.name).indexOf(searchValue) != -1){
				serchList.push(item)
			}
		})
		this.getBrands(serchList)
	},

	add_new: function(){
		wx.navigateTo({
			url: "../add_new/add_new"
		});
	},

	tab_chat: function(){
		wx.redirectTo({
			url: "../chat/chat"
		});
	},

	close_mask: function(){
		this.setData({
			search_btn: true,
			search_friend: false,
			//show_mask: false
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

	into_inform: function(){
		wx.navigateTo({
			url: "../inform/inform?myName=" + this.data.myName //wx.getStorageSync("myUsername")
		});
	},

	into_groups: function(){
		wx.navigateTo({
			url: "../groups/groups?myName=" + this.data.myName
		});
	},

	into_room: function(event){
		var nameList = {
			myName: this.data.myName,
			your: event.target.dataset.username
		};
		wx.navigateTo({
			url: "../chatroom/chatroom?username=" + JSON.stringify(nameList)
		});
	},

	into_info: function(event){
		wx.navigateTo({
			url: "../friend_info/friend_info?yourname=" + event.target.dataset.username
		});
	},

	//点击右侧字母导航定位触发
	scrollToViewFn: function (e) {
	    let that = this;
	    let _id = e.target.dataset.id;
	    for (let i = 0; i < that.data.listMain.length; ++i) {
		    if (that.data.listMain[i].id === _id) {
		        that.setData({
		          	isActive: _id,
		          	toView: 'inToView' + _id
		        })
		        break
		    }
	    }
	},

	// 页面滑动时触发
	onPageScroll: function(e){
	  	if (e.detail){
		    // this.setData({
		    //   scroolHeight: e.detail.scrollTop
		    // });
		    if (e.detail.scrollTop > 149) {
		    	this.setData({
			      	showFixedTitile: true
			    });
		    }else{
		    	this.setData({
			      	showFixedTitile: false
			    });
		    }
		    for (let i in oHeight){
		      	if (e.detail.scrollTop - 149 < oHeight[i].height){
			        this.setData({
			          	isActive: oHeight[i].key,
			          	fixedTitle: oHeight[i].name
			        });
			        return false;
		      	}
		    }
	    }
	},

	// 处理数据格式，及获取分组高度
  	getBrands:function(member){
    	const that = this;
    	const reg = /[a-z]/i;
    		// member = [
	    	// 	{
	    	// 		groups: [],
	    	// 		jid: "easemob-demo#chatdemoui_zdtest2@easemob.com",
	    	// 		name: "adtest2",
	    	// 		subscription:"both"
    		// 	}
    		// ]

    		member.forEach((item) => {
    			if (reg.test(item.name.substring(0, 1))) {
    				item.initial = item.name.substring(0, 1).toUpperCase();
    			}else{
    				item.initial = '#'
    			}
    		})
    		member.sort((a, b) => a.initial.charCodeAt(0) - b.initial.charCodeAt(0))
          	var someTtitle = null;
          	var someArr=[];

          	for(var i=0; i< member.length; i++){
            	var newBrands = { brandId: member[i].jid, name: member[i].name };

            	if (member[i].initial == '#') {
            		if (!lastObj) {
            			var lastObj = {
			                id: i,
			                region: '#',
			                brands: []
			            };
            		}
		            lastObj.brands.push(newBrands);
            	} else {
            		if (member[i].initial != someTtitle){
	              		someTtitle = member[i].initial
			            var newObj = {
			                id: i,
			                region: someTtitle,
			                brands: []
			            };
	              		someArr.push(newObj)
	            	}
	            	newObj.brands.push(newBrands);
	            }
          	};
          	someArr.sort((a, b) => a.region.charCodeAt(0) - b.region.charCodeAt(0))
          	if (lastObj) {someArr.push(lastObj)}
		//  someArr = [
		// 	{
		//         id: "1", region: "A",
		//         brands: [
		//           	{ brandId: "..", name: "阿明" },
		//           	{ brandId: "..", name: "奥特曼" },
		//           	{ brandId: "..", name: "安庆" },
		//           	{ brandId: "..", name: "阿曼" }
		//         ]
		//     },
		// ]

         //赋值给列表值
        that.setData({
            listMain:someArr
        });
         //赋值给当前高亮的isActive
        that.setData({
            isActive: someArr[0].id,
            fixedTitle: someArr[0].region
        });
 
          //计算分组高度,wx.createSelectotQuery()获取节点信息
        let number = 0;
          	for (let j = 0; j < someArr.length; ++j) {
            wx.createSelectorQuery().select('#inToView' + someArr[j].id).boundingClientRect(function (rect) {
              	number = rect.height + number;
              	var newArry = [{ 'height': number, 'key': rect.dataset.id, "name": someArr[j].region}]
              	//that.setData({
                	oHeight = oHeight.concat(newArry)
              	//})
            }).exec();
        };
    },
});
