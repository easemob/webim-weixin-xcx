import { EaseSDK, EMClient } from '../../../EaseIM/index';
import { store } from '../../../store/index';
console.log('store', store.loginUserInfos);
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    chatType: {
      type: String,
      value: '',
    },
    targetId: {
      type: String,
      value: '',
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    messageContent: '',
    cursorPosition: 0,
    sageAreaBottomHeight: app.globalData.safeAreaBottomHeight,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onOpenRecordAudioPopup() {
      this.onCloseEmojiPickerContainer();
      this.selectComponent('#inputAudioComp').showPopup();
    },
    onHandleEomjiPickerContainer() {
      this.selectComponent('#inputEmojiComp').handleShowEmojiContainer();
    },
    onCloseEmojiPickerContainer() {
      const isShowEomjiContainerStatus =
        this.selectComponent('#inputEmojiComp').data.showEomjiContainer;
      if (!isShowEomjiContainerStatus) return;
      this.onHandleEomjiPickerContainer();
    },
    onOpenMoreComponent() {
      this.onCloseEmojiPickerContainer();
      this.selectComponent('#inputMoreComp').showPopup();
    },
    handleInput(e) {
      this.setData({
        cursorPosition: e.detail.cursor,
      });
    },
    handleFocus(e) {
      this.setData({
        cursorPosition: e.detail.cursor,
      });
    },
    handleBlur(e) {
      this.setData({
        cursorPosition: e.detail.cursor,
      });
    },
    insertAtCursor(event) {
      const { messageContent, cursorPosition } = this.data;
      console.log('event', event);
      const { detail } = event;
      let newText = '';
      detail && (newText = detail);
      // 分割当前内容，将新内容插入光标位置
      const updatedContent =
        messageContent.slice(0, cursorPosition) +
        newText +
        messageContent.slice(cursorPosition);
      // 更新 textarea 的内容和光标位置
      this.setData({
        messageContent: updatedContent,
        cursorPosition: cursorPosition + newText.length,
      });
    },
    async sendTextMessage() {
      const { avatarurl, nickname } = store.loginUserInfos;
      if (this.data.messageContent.trim() === '') {
        wx.showToast({
          title: '内容不可为空',
        });
        return;
      }
      let option = {
        // 消息类型。
        type: 'txt',
        // 消息内容。
        msg: this.data.messageContent,
        from: EMClient.user,
        // 消息接收方：单聊为对方用户 ID，群聊和聊天室分别为群组 ID 和聊天室 ID。
        to: this.data.targetId,
        // 会话类型：单聊、群聊和聊天室分别为 `singleChat`、`groupChat` 和 `chatRoom`，默认为单聊。
        chatType: this.data.chatType,
        ext: {
          ease_chat_uikit_user_info: {
            avatarURL: avatarurl,
            nickname: nickname,
          },
        },
      };
      const msg = EaseSDK.message.create(option);
      try {
        const { message } = await EMClient.send(msg);
        console.log('>>>>>文本发送成功', message);
        // this.triggerEvent('updateMessageList', message)
        this.callUpdateMessageList(message);
        this.setData({
          messageContent: '',
        });
      } catch (error) {
        console.error(error);
        wx.showToast({
          title: `发送失败${error.type}`,
        });
      } finally {
        this.onCloseEmojiPickerContainer();
      }
    },
    callUpdateMessageList(data) {
      let message = {};
      if (data?.detail) {
        message = {
          ...data.detail,
        };
      } else {
        message = {
          ...data,
        };
      }
      console.log('message', message);
      this.triggerEvent('updateMessageList', message);
    },
  },
});
