####小程序webIM数据结构：
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
	
缓存：
   myUsername: ''    //缓存登录用户名	   
   yourname + myName:''  //以用户名跟好友名为key来缓存聊天记录


```