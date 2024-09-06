import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { store } from '../../store/index';
import { EMClient } from '../../EaseIM/index';
import getMessageKey from '../../utils/setMessageKey';
import emMessages from '../../EaseIM/emApis/emMessages';
const { fetchHistoryMessagesFromServer } = emMessages();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    chatType: 'singleChat',
    targetId: '',
    conversationParams: {},
    messageList: [],
    processedMessageCache: {},
    histroyMessageCursor: null,
    loadingHistoryMessage: false,
    noMore: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('chat page', options);
    const { conversationId, conversationType, conversationParams } = options;
    console.log(
      'JSON.parse(conversationParams)',
      JSON.parse(conversationParams)
    );
    this.setData({
      chatType: conversationType,
      targetId: conversationId,
      conversationParams: JSON.parse(conversationParams),
    });
    this.store = createStoreBindings(this, {
      store,
      fields: ['chatingConversationId', 'loginUserInfosData'],
      actions: ['setChatingConversationId', 'updateConversationLastMessage'],
    });
    this.mountEMPageListenner();
    this.getHistoryMessageData();
    this.setChatingConversationId &&
      this.setChatingConversationId(conversationId);
  },
  mountEMPageListenner() {
    EMClient.addEventHandler('CHAT_PAGE_MESSAGE', {
      // 当前用户收到文本消息。
      onTextMessage: (message) => {
        //根据消息from to 获取当前消息的会话id
        const conversationId = getMessageKey(message);
        if (conversationId !== this.data.targetId) return;
        this.updateMessageList({
          ...message,
        });
      },
      // 当前用户收到图片消息。
      onImageMessage: (message) => {
        //根据消息from to 获取当前消息的会话id
        const conversationId = getMessageKey(message);
        if (conversationId !== this.data.targetId) return;
        this.updateMessageList({
          ...message,
        });
      },
      // 当前用户收到透传消息。
      onCmdMessage: (message) => {
        //根据消息from to 获取当前消息的会话id
        // const conversationId = getMessageKey(message)
        // if (conversationId !== this.data.targetId) return;
        // this.updateMessageList({
        //   ...message
        // })
      },
      // 当前用户收到语音消息。
      onAudioMessage: (message) => {
        //根据消息from to 获取当前消息的会话id
        const conversationId = getMessageKey(message);
        if (conversationId !== this.data.targetId) return;
        this.updateMessageList({
          ...message,
        });
      },
      // 当前用户收到位置消息。
      onLocationMessage: (message) => {
        //根据消息from to 获取当前消息的会话id
        const conversationId = getMessageKey(message);
        if (conversationId !== this.data.targetId) return;
        this.updateMessageList({
          ...message,
        });
      },
      // 当前用户收到文件消息。
      onFileMessage: (message) => {
        //根据消息from to 获取当前消息的会话id
        const conversationId = getMessageKey(message);
        if (conversationId !== this.data.targetId) return;
        this.updateMessageList({
          ...message,
        });
      },
      // 当前用户收到自定义消息。
      onCustomMessage: (message) => {
        //根据消息from to 获取当前消息的会话id
        const conversationId = getMessageKey(message);
        if (conversationId !== this.data.targetId) return;
        this.updateMessageList({
          ...message,
        });
      },
      // 当前用户收到视频消息。
      onVideoMessage: (message) => {
        //根据消息from to 获取当前消息的会话id
        const conversationId = getMessageKey(message);
        if (conversationId !== this.data.targetId) return;
        this.updateMessageList({
          ...message,
        });
      },
      //监听撤回消息
      onRecallMessage: (message) => {
        console.log('>>>>监听撤回消息', message);
        //根据消息from to 获取当前消息的会话id
        const { from, to, mid } = message;
        //from或to与当前对话中id相同则处理撤回逻辑，否则忽略
        if (from === this.data.targetId || to === this.data.targetId) {
          this.handleRecallMessage(mid);
        }
      },
    });
  },
  //更新当前消息列表，两个触发位置（消息监听、发送方调用发送）
  updateMessageList(data) {
    console.log('更新消息列表', data);
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
    this.setData({
      messageList: [...this.data.messageList, message],
    });
    //处理作为消息发送方更新会话列表（接收方会话列表的更新已经在app.js中的消息监听做了处理。）
    if (message.from === EMClient.user) {
      this.updateConversationLastMessage({ ...message });
    }
    this.processGroupMessageList();
    this.callScrollToBottom();
  },
  async getHistoryMessageData() {
    const targetId = this.data.targetId;
    const chatType = this.data.chatType;
    const cursor = this.data.histroyMessageCursor;
    console.log('>>>>>getHistoryMessageData', cursor);
    this.setData({
      loadingHistoryMessage: true,
    });
    try {
      const res = await fetchHistoryMessagesFromServer({
        targetId,
        chatType,
        cursor,
      });
      console.log('>>>>>漫游获取成功', res);
      if (res?.messages.length > 0) {
        let histroyMessageList = res.messages.reverse();
        this.setData({
          histroyMessageCursor: res.cursor,
          messageList: [...histroyMessageList, ...this.data.messageList],
          noMore: res.isLast,
          loadingHistoryMessage: false,
        });
        this.processGroupMessageList();
      }
    } catch (error) {
      console.error(error);
      wx.showToast({
        title: '漫游获取失败',
      });
    }
  },
  onLoadMoreHistoryMessageData() {
    console.log('>>>>>>>加载更多历史消息', this.data.histroyMessageCursor);
    if (this.data.noMore) {
      wx.showToast({
        title: '暂无更多',
      });
      return;
    }
    if (!this.data.loadingHistoryMessage && !this.data.noMore) {
      console.log('>>>>>条件满足加载更多历史记录');
      this.getHistoryMessageData();
    }
  },
  processGroupMessageList() {
    const lastSeenInfo = {};
    const messageList = this.data.messageList;
    // 遍历消息列表，更新lastSeenInfo
    messageList.forEach((message) => {
      lastSeenInfo[message.from] = {
        avatarurl: message.ext?.ease_chat_uikit_user_info?.avatarURL || '',
        nickname: message.ext?.ease_chat_uikit_user_info?.nickname || '',
      };
    });
    // 使用lastSeenInfo来更新消息列表中的avatarurl和nickname
    const updatedMessageList = messageList.map((message) => ({
      ...message,
      avatarurl: lastSeenInfo[message.from].avatarurl,
      nickname: lastSeenInfo[message.from].nickname,
      formattedTimestamp: this.formatTimestamp(message.time),
    }));
    console.log('updatedMessageList', updatedMessageList);
    // 更新页面数据
    this.setData({
      messageList: updatedMessageList,
    });
  },
  // 转换时间戳为日期时间格式
  formatTimestamp: function (timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      // 如果是今天，只显示时间
      return `${date.getHours().toString().padStart(2, '0')}:${date
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
    } else {
      // 如果不是今天，显示完整日期和时间
      return `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date
        .getHours()
        .toString()
        .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
  },
  callScrollToBottom() {
    const chatMessageContainerComp = this.selectComponent(
      '#chatMessageContainerComp'
    );
    chatMessageContainerComp?.scrollToBottom();
  },
  //执行撤回消息
  handleRecallMessage(data) {
    console.log('mid', data);
    let recallId = '';
    let _index = -1;
    if (data.detail) {
      recallId = data.detail.mid;
    } else {
      recallId = data;
    }
    if (this.data.messageList.length && recallId) {
      _index = this.data.messageList.findIndex(
        (message) => message.id === recallId
      );
    }
    if (_index > -1) {
      let updateMessageList = this.data.messageList;
      updateMessageList[_index].isRecall = true;
      console.log('updateMessageList', updateMessageList);
      this.setData({
        messageList: updateMessageList,
      });
    }
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    this.setChatingConversationId && this.setChatingConversationId('');
    this.store.destroyStoreBindings();
  },

  //监听聊天页面点击
  onMessagePageTap() {
    console.log('>>>>>>>聊天页面点击');
    const chatInputbar = this.selectComponent('#chatInputbarComp');
    chatInputbar.onCloseEmojiPickerContainer();
  },
});
