import {
  EMClient
} from '../../../EaseIM/index'
import emAboutAck from '../../../EaseIM/emApis/emAboutAck'
const {
  sendRecallAckMsg
} = emAboutAck()
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    messageList: {
      type: Array,
      value: []
    },
    conversationParams: {
      type: Object,
      value: () => ({})
    },
    loginUserInfosData: {
      type: Object,
      value: () => ({})
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    loginUserId: '',
    scrollHeight: 0, // 初始滚动位置
    currentPlayingId: null, // 用于追踪当前正在播放的音频
    selectedMessageItem: {} //长按选中的消息体
    // mockMessageList: new Array(100).fill(1).map((_, i) => `user${i + 1}`)
  },
  lifetimes: {
    ready() {
      this.setData({
        loginUserId: EMClient.user
      })
      this.scrollToBottom()
    },
    attached() {
      this.audioContext = wx.createInnerAudioContext();
      this.audioContext.onEnded(() => {
        this.setData({
          currentPlayingId: null // 音频播放结束时重置状态
        });
      });
    },
    detached() {
      if (this.audioContext) {
        this.audioContext.destroy(); // 组件销毁时销毁音频上下文
      }
      console.log('>>>>>>组件销毁');
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //长按消息
    onLongPressMessageItem(event) {
      console.log('>>>>>长按消息', event);
      const {
        dataset
      } = event.currentTarget
      const {
        messageItem
      } = dataset
      if (messageItem) {
        this.setData({
          selectedMessageItem: messageItem
        })
      }
      this.setData({
        show: true
      })
    },
    onClose() {
      this.setData({
        show: false
      });
    },
    //消息列表滚动置顶。
    onMessageScrolltoupper() {
      console.log('>>>>>列表滚动置顶。。。')
      //滚动置顶加载更多会话。
      this.triggerEvent('onLoadMoreHistoryMessageData')
    },
    //滚动置底
    scrollToBottom() {
      console.log('>>>>执行滚动置底');
      setTimeout(() => {
        this.setData({
          scrollHeight: 10000000
        })
      }, 500)
    },
    //获取当前消息列表的所有图片URL
    getAllMessageListImgUrl() {
      const urls = this.data.messageList
        .filter(message => message.type === 'img')
        .map(message => message.url);
      return urls;
    },
    //预览图片
    onPreviewImage(event) {
      console.log(event);
      const {
        currentTarget: {
          dataset
        }
      } = event
      const {
        imageUrl
      } = dataset
      const urls = this.getAllMessageListImgUrl()
      console.log('urls', urls);
      if (urls.length) {
        wx.previewImage({
          current: imageUrl, // 当前显示图片的http链接
          urls, // 需要预览的图片http链接列表
          success: () => {
            console.log('>>>>进入预览');
          },
          fail: (e) => {
            console.log('>>>>预览失败', e);
          }
        })
      } else {
        wx.previewImage({
          current: imageUrl, // 当前显示图片的http链接
          urls: [imageUrl], // 需要预览的图片http链接列表
          success: () => {
            console.log('>>>>进入预览');
          },
          fail: (e) => {
            console.log('>>>>预览失败', e);
          }
        })
      }
      // wx.previewImage({
      //   current: '', // 当前显示图片的http链接
      //   urls: [] // 需要预览的图片http链接列表
      // })
    },
    //预览视频
    onPreviewVideo(event) {
      console.log(event);
      const {
        currentTarget: {
          dataset
        }
      } = event
      const {
        videoUrl,
        videoPosterUrl
      } = dataset
      wx.previewMedia({
        sources: [{
          url: videoUrl, // 视频 URL
          type: 'video',
          poster: videoPosterUrl // 视频封面图片
        }],
      })
    },
    //播放语音片段
    async playAudio(e) {
      const {
        id,
        url
      } = e.currentTarget.dataset;
      // this.setData({
      //   currentPlayingId: id
      // })
      console.log('id,url', id,
        url);
      const audioUrl = await this.convertToMp3(url)
      console.log(this.data.currentPlayingId === id);
      if (this.data.currentPlayingId === id) {
        // 如果点击的是当前正在播放的音频，暂停播放
        this.audioContext.pause();
        this.setData({
          currentPlayingId: null
        });
      } else {
        console.log('>>>>>开始播放');
        // 否则，播放新的音频
        this.audioContext.src = audioUrl;
        this.audioContext.play();
        this.setData({
          currentPlayingId: id
        });
      }
    },
    //转换语音为MP3
    convertToMp3(inputFilePath) {
      return new Promise((resolve, reject) => {
        wx.downloadFile({
          url: inputFilePath,
          header: {
            "X-Requested-With": "XMLHttpRequest",
            Accept: "audio/mp3",
            Authorization: "Bearer " + EMClient.token
          },
          success(res) {
            console.log('>>>>>音频地址转换完成', res);
            resolve(res.tempFilePath)
          },
          fail(e) {
            console.log("downloadFile failed", e);
            reject(e)
            wx.showToast({
              title: "下载失败",
              duration: 1000
            });
          }
        })
      })

    },
    //撤回消息
    async actionRecallMessage() {
      try {
        await sendRecallAckMsg(this.data.selectedMessageItem)
        this.callHandleRecallMessage()
      } catch (error) {
        console.log('>>>>>>撤回失败', error);
        if (error?.type === 504) {
          wx.showToast({
            title: '超出可撤回时间',
          })
        } else {
          wx.showToast({
            title: '撤回失败',
          })
        }
      } finally {
        this.setData({
          show: false
        })
      }
    },
    //更新消息列表撤回状态
    callHandleRecallMessage() {
      const {
        id
      } = this.data.selectedMessageItem
      console.log('>>>>调用父组件撤回', id);
      if (id) {
        this.triggerEvent('handleRecallMessage', {
          mid: id
        })
      }

    },
    //复制文本消息
    copyTextMessageItem() {
      wx.setClipboardData({
        data: this.data.selectedMessageItem.msg,
        success: () => {
          wx.showToast({
            title: '复制成功',
            icon: 'success',
            duration: 2000
          });
        },
        fail: (err) => {
          wx.showToast({
            title: '复制失败',
            icon: 'none',
            duration: 2000
          });
        }
      });
      this.setData({
        show:false
      })
    }
  }
})