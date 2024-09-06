// pages/chat/chatNavbar/index.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    chatType:{
      type: String,
      value: ''
    },
    targetId:{
      type:String,
      value:''
    },
    conversationParams:{
      type:Object,
      value:()=>({})
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onBackPage(){
     wx.navigateBack()
    }
  }
})