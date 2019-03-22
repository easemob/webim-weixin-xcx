#介绍
******
环信小程序demo是基于环信im SDK开发的一款即时通讯的小程序。这个demo可以帮助开发者们更轻松的集成环信SDK。可扫码体验：
![huanxinIM](./src/images/huanxindemo.jpg)
demo 包含以下功能
  - 最近通话
  - 通讯录
  - 通知（加好友、加群）
  - 设置
#在本地跑起来
拉取代码，导入开发者工具即可运行起来。

#数据结构
```
登录页：
		login: {
			name:'',
			psd: '',
			grant_type: 'password',
		}
		
注册页：
		register: {
			username: '',
			password: ''
		}
		
通讯录页：
	   member:[],   //好友列表
	   
聊天页：
	   chatMsg:[{
			info:{
		        to:''         
			},
			username:'',      //用户名
			yourname:'',      //好友名
			msg: {
				type:'',    
				data:''
			},
			style:'',       //样式
			time:'',
			mid:''        //message ID
	   }]
	   
globalData: 
	userInfo: '',  //用户微信授权信息
	chatMsg: []   //用于存储离线消息
	unReadMessageNum: 0, //未读消息数
	saveFriendList: [],//加好友申请
	saveGroupInvitedList: [], //加群邀请
	isIPX: false //是否为iphone X //是否为iphoneX
	
缓存：
   myUsername: ''    //缓存登录用户名	   
   yourname + myName:''  //以用户名跟好友名为key来缓存聊天记录
```
#项目结构
```shell
|- comps 自定义组件目录
    |- addfriend 添加好友页
    |-chat 聊天页面
    |-swipedelete 测滑删除
    |-toast toast
|-images demo中用到的图片 还有表情
|-pages 功能页面
    |-register 注册页
    |-login 登录页
    |-login_token token登录页
    |-chat 最近联系人页（通话）
        |-chatroom 聊天室页
    |-main 联系人页
        |-add_new 加好友页
        |-group 群组页
            |-groupSetting 群组设置页
    |-notificaton 通知页
        |-notificaton_friendDetail 加好友通知页
        |-notificaton_groupDetail 加群组通知页
    |-setting 设置页
        |-setting_general 通用设置页
|-utils 工具类和sdk的一些配置
|-sdk 环信sdk
|-app.js 小程序根实例，存放一些全局变量，注册监听事件
|-app.json 注册页面以及全局的一些配置
|-app.wxss 一些全局样式
|-project.config.json工程的一些配置，和开发者工具 “详情” 中的设置一样
```
#可以复用的代码
如果想快速搭建起一个有im能力的小程序，可以选择复用demo中的代码，其中utils以帮助快速集成sdk，comps > chat是聊天页。当然其他部分需要复用的，如常见的测滑删除、联系人按字母分类、通知的订阅模式也可以去具体文件去找。

#遇到的一些坑
- 聊天页面布局，input focus时页面滑动，光标会错位，官方的说法是，input focus时不能使用动画。
- 在scroll-view中无法触发onPullDownRefresh。
- margin-bottom 只有在下面还有元素时才生效。
- 使用enablePullDownRefresh看不见下拉动画，需要将backgroundTextStyle设为dark。
- 播放语音 onTimeUpdate在开发者工具上不能稳定触发。
- background-image只能用网络地址。
- 适配iphone X 使用wx.getSystemInfo() 返回的model在工具上是'iPhone X' 在真机上后面还会有其他字符，不要精确匹配。

坑还有很多，大家慢慢趟吧
# 写在最后
这期小程序demo只完善了单聊部分，后面还要优化群组的一些功能，关于图片消息缓存的问题，目前图片都是压缩过的，大约在200k左右，如果要做缓存自己可以使用storage去实现，但是要注意小程序只有10M的存储空间，还有一些功能demo没有去实现但是sdk是支持的，要用到的话大家可以去查[文档](https://webim.easemob.com/sdk/jsdoc/out/connection.html)