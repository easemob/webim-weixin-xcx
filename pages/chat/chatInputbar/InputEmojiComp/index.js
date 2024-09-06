// pages/chat/chatInputbar/InputEmojiComp/index.js
import {
  emojis
} from '../../../../constants/index'
console.log('emojis', emojis);
Component({

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    emojis: emojis,
    showEomjiContainer: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleShowEmojiContainer() {
      this.setData({
        showEomjiContainer: !this.data.showEomjiContainer
      })
    },
    onCickEmojiItem(event) {
      console.log(event);
      const {
        emojiItem
      } = event.currentTarget.dataset
      this.triggerEvent('insertAtCursor', emojiItem)
    }
  }
})