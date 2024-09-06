import { EaseSDK, EMClient } from '../../../../EaseIM/index';
import { store } from '../../../../store/index';
const RECORD_STATE = {
  NOT_START: 0,
  RECORDING: 1,
  RECORD_END: 2,
  PLAY_RECORD: 3,
};
const RECORD_STATE_TEXT = {
  [RECORD_STATE.NOT_START]: '录音',
  [RECORD_STATE.RECORDING]: '正在录音',
  [RECORD_STATE.RECORD_END]: '播放',
  [RECORD_STATE.PLAY_RECORD]: '正在播放',
};
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
  lifetimes: {
    attached() {
      // 创建音频上下文
      this.innerAudioContext = wx.createInnerAudioContext();
    },
    detached() {
      // 页面卸载时销毁音频上下文
      if (this.innerAudioContext) {
        this.innerAudioContext.destroy();
      }
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    recordState: RECORD_STATE.NOT_START,
    recordStateText: RECORD_STATE_TEXT[RECORD_STATE.NOT_START],
    recordingTime: '0s', // 录音时长，默认0秒
    tempFilePath: '', // 保存录音文件的临时路径
    duration: 0, //音频录制时长
  },
  timer: null, // 用于记录定时器
  innerAudioContext: null, // 用于播放录音的音频上下文
  /**
   * 组件的方法列表
   */
  methods: {
    //展开popup
    showPopup() {
      this.setData({
        show: true,
      });
      this.requestRecordAuth();
    },
    //关闭popup
    onClose() {
      this.setData({
        show: false,
      });
    },
    //处理开始录音
    handleStartRecordAudio() {
      const recorderManager = wx.getRecorderManager();
      const options = {
        duration: 60000, // 最长录音时间，单位ms
        sampleRate: 44100,
        numberOfChannels: 1,
        encodeBitRate: 96000,
        format: 'mp3',
        frameSize: 50,
      };
      recorderManager.start(options);
      this.setData({
        recordState: RECORD_STATE.RECORDING,
        recordStateText: RECORD_STATE_TEXT[RECORD_STATE.RECORDING],
      });
      let seconds = 0;
      // 启动计时器，每秒更新录音时长
      this.timer = setInterval(() => {
        seconds++;
        this.setData({
          recordingTime: `${seconds}s`,
        });
        // 如果录音达到 60 秒，自动停止录音
        if (seconds >= 60) {
          this.stopRecording();
        }
      }, 1000);
      recorderManager.onStart(() => {
        console.log('录音开始');
        // this.setData({
        //   recordingStatus: '录音开始'
        // });
      });

      recorderManager.onStop((res) => {
        console.log('录音停止', res);
        clearInterval(this.timer); // 停止计时器
        this.setData({
          tempFilePath: res.tempFilePath,
          duration: res.duration,
        });
      });
      recorderManager.onError((err) => {
        console.error('录音错误', err);
        clearInterval(this.timer); // 停止计时器
        this.setData({
          recordingTime: '0s',
        });
      });
    },
    //处理录音结束
    handleRecordAudioEnd() {
      this.setData({
        recordState: RECORD_STATE.RECORD_END,
        recordStateText: RECORD_STATE_TEXT[RECORD_STATE.RECORD_END],
      });
      this.stopRecording();
    },
    //处理播放录音
    handleRecordAudioPlay() {
      const { tempFilePath } = this.data;

      if (!tempFilePath) {
        wx.showToast({
          title: '没有可播放的录音',
          icon: 'none',
        });
        return;
      }

      this.innerAudioContext.src = tempFilePath; // 设置播放的音频文件路径
      this.innerAudioContext.play(); // 开始播放

      this.innerAudioContext.onPlay(() => {
        console.log('录音播放开始');
        this.setData({
          recordState: RECORD_STATE.PLAY_RECORD,
          recordStateText: RECORD_STATE_TEXT[RECORD_STATE.PLAY_RECORD],
        });
      });

      this.innerAudioContext.onEnded(() => {
        console.log('录音播放结束');
        this.setData({
          recordState: RECORD_STATE.RECORD_END,
          recordStateText: RECORD_STATE_TEXT[RECORD_STATE.RECORD_END],
        });
      });
      this.innerAudioContext.onError((err) => {
        console.error('播放错误', err);
        wx.showToast({
          title: '播放错误',
        });
      });
    },
    //处理取消录音
    handleDeleteRecordAudioData() {
      this.setData({
        recordState: RECORD_STATE.NOT_START,
        recordStateText: RECORD_STATE_TEXT[RECORD_STATE.NOT_START],
        tempFilePath: '',
        duration: 0,
        recordingTime: '0s',
      });
      this.stopRecording();
    },
    //处理发送录音
    handleSendRecordAudio() {
      this.updateRecordAudioData();
    },
    // 停止录音
    stopRecording() {
      const recorderManager = wx.getRecorderManager();
      recorderManager.stop();
      clearInterval(this.timer); // 停止计时器
    },
    // 申请录音权限
    requestRecordAuth() {
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.record']) {
            wx.authorize({
              scope: 'scope.record',
              success() {
                // 用户已经同意小程序使用录音功能
                console.log('录音权限授权成功');
                // 可以开始录音了
              },
              fail() {
                // 用户拒绝授权，需要引导用户到设置页面开启权限
                console.log('录音权限授权失败');
                wx.showModal({
                  title: '提示',
                  content: '需要您的录音权限，请到设置页面开启',
                  success(modalRes) {
                    if (modalRes.confirm) {
                      wx.openSetting({
                        success(settingData) {
                          if (settingData.authSetting['scope.record']) {
                            console.log('录音权限开启成功');
                            // 可以开始录音了
                          } else {
                            console.log('录音权限开启失败');
                          }
                        },
                      });
                    }
                  },
                });
              },
            });
          } else {
            // 用户已经授权
            console.log('录音权限已授权');
            // 可以开始录音了
          }
        },
      });
    },
    //上传录音文件
    updateRecordAudioData() {
      const url = `${EMClient.apiUrl}/${EMClient.orgName}/${EMClient.appName}/chatfiles`;
      const accessToken = EMClient.token;
      const { tempFilePath } = this.data;
      if (!tempFilePath) {
        wx.showToast({
          title: '请先录制音频',
          icon: 'none',
        });
        return;
      }
      wx.uploadFile({
        url: url, // 环信附件地址
        filePath: tempFilePath,
        name: 'file',
        header: {
          Authorization: 'Bearer ' + accessToken,
        },
        success: (res) => {
          console.log('上传成功', res);
          const { data } = res;
          this.sendAudioMessage(JSON.parse(data));
        },
        fail: (err) => {
          console.error('上传失败', err);
          this.setData({
            recordingStatus: '音频上传失败',
          });
        },
      });
    },
    //发送音频消息
    async sendAudioMessage(uploadFileData) {
      console.log('>>>>>执行发送', uploadFileData);
      const { avatarurl, nickname } = store.loginUserInfos;
      const { duration } = this.data;
      var option = {
        type: 'audio',
        filename: Date.now() + '.mp3',
        // 消息接收方：单聊为对端用户 ID，群聊和聊天室分别为群组 ID 和聊天室 ID。
        body: {
          //文件 URL。
          url: uploadFileData.uri + '/' + uploadFileData.entities[0].uuid,
          //文件类型。
          type: 'audio',
          //文件名。
          filename: Date.now() + '.mp3',
          // 音频文件时长，单位为秒。
          length: Math.ceil(duration / 1000),
        },
        from: EMClient.user,
        chatType: this.data.chatType,
        to: this.data.targetId,
        ext: {
          ease_chat_uikit_user_info: {
            avatarURL: avatarurl,
            nickname: nickname,
          },
        },
      };
      try {
        let msg = EaseSDK.message.create(option);
        // 调用 `send` 方法发送该语音消息。
        const { message } = await EMClient.send(msg);
        console.log('>>>>>>发送语音消息成功', message);
        this.handleDeleteRecordAudioData();
        this.onClose();
        this.triggerEvent('callUpdateMessageList', message);
      } catch (error) {
        console.error(error);
        wx.showToast({
          title: `发送失败${error.type}`,
        });
      }
    },
  },
});
