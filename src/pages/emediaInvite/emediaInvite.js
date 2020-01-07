var WebIM = wx.WebIM;
Page({
	data: {
		search_btn: true,
		search_friend: false,
		groupMember: [
			{member: 'zdtest', id: '1'},
			{member: 'zdtest2', id: '12'},
			{member: 'zdtest3', id: '13'},
			{member: 'zdtest4', id: '14'},
			{member: 'zdtest', id: '1'},
			{member: 'zdtest2', id: '12'},
			{member: 'zdtest3', id: '13'},
			{member: 'zdtest4', id: '14'},
			{member: 'zdtest', id: '1'},
			{member: 'zdtest2', id: '12'},
			{member: 'zdtest3', id: '13'},
			{owner: 'zdtest4', id: '14'},
		],
		serchList: [],

		checkedValue: [],
		renderList: [],
		buttonText: '发起邀请',
		second_height: 550,
		show_clear: false,
	},

	onLoad: function(options){
		var that = this
	    // 获取系统信息
	    wx.getSystemInfo({
		    success: function (res) {
		        console.log('height=' + res.windowHeight);
		        console.log('width=' + res.windowWidth);
		        // 计算主体部分高度,单位为px
		        that.setData({
		          // second部分高度 = 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
		          second_height: res.windowHeight - res.windowWidth / 750 * 300
		        })
		    }
	    })

	    var roomId = '93734273351681' //options.groupInfo&&JSON.parse(options.groupInfo).roomId
	    roomId&&this.getGroupMember(roomId)
	},

	methods: {
		
	},

	checkboxChange: function (e) {
    	console.log('checkbox发生change事件，携带value值为：', e)
    	if(this.data.checkedValue.indexOf(e.detail.value) == -1 && e.detail.value[0]){
    		this.data.checkedValue.push(e.detail.value[0])
    		console.log(this.data.checkedValue)
    	}else{
    		let value = e.target.dataset.item.name
    		this.data.checkedValue.splice(this.data.checkedValue.indexOf(value), 1)
    		console.log(this.data.checkedValue)
    	}
  	},

  	openSearch: function(){
		this.setData({
			search_btn: false,
			search_friend: true,
			show_mask: true,
			gotop: true
		});
	},

	cancel: function(){
		this.setData({
			search_btn: true,
			search_friend: false,
			gotop: false
			//show_mask: false
		});
		//this.getBrands(this.data.member)
	},

	getGroupMember: function(roomId){
		var me = this;
		// 获取群成员
		var pageNum = 1,
			pageSize = 1000;
		var options = {
			pageNum: pageNum,
			pageSize: pageSize,
			groupId: roomId,
			success: function(resp){
				console.log('获取群成员', resp)
				if(resp && resp.data && resp.data.data){
					me.setData({
						groupMember: resp.data.data
					});
					me.getRenderList(resp.data.data)
				}
				// console.log(me.data.groupMember);
			},
			error: function(err){

			}
		};
		WebIM.conn.listGroupMember(options);
	},

	onInput(e){

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

	clearInput: function(){
		this.setData({
			input_code: '',
			show_clear: false
		})
	},

	cancel: function(){
		this.setData({
			search_btn: true,
			search_friend: false,
		});

		this.getGroupMember('93734273351681')
	},

	onSearch: function(val){
		let searchValue = val.detail.value
		let member = this.data.groupMember;
		let serchList = [];
		member.forEach((item, index)=>{
			if(String(item.member).indexOf(searchValue) != -1 || String(item.owner).indexOf(searchValue) != -1){
				serchList.push(item)
			}
		})
		// this.setData({
		// 	groupMember: serchList
		// })

		this.getRenderList(serchList)
	},

	getRenderList(list){
		console.log('this.data.checkedValue', this.data.checkedValue)
		let serchList = list.map((item) => {
			for (var i = 0; i < this.data.checkedValue.length; i++) {
				if((item.member&&item.member.indexOf(this.data.checkedValue[i]) != -1) || (item.owner&&item.owner.indexOf(this.data.checkedValue[i]) != -1)){
					item.checked = true
					return item
					break;
				}else{
					item.checked = false
				}
			}
			return item
		})

		this.setData({
			renderList: serchList
		})
		console.log('serchList >>>>', serchList)

	},



})