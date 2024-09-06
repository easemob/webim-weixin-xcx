import { EaseSDK, EMClient } from '../../../../EaseIM/index';
import { store } from '../../../../store/index';
console.log('store', store.loginUserInfos);
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
    show: false,
    inputMoreFunctionAction: [
      {
        icon: '/static/input/img.png',
        title: '相册',
        type: 'album',
      },
      {
        icon: '/static/input/camera_fill.png',
        title: '相机',
        type: 'camera',
      },
      // {icon:'/static/input/person_single_fill.png',title:'个人名片'}
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showPopup() {
      this.setData({
        show: true,
      });
    },
    onClose() {
      this.setData({
        show: false,
      });
    },
    //点击更多功能
    onClickMoreFuncItem(event) {
      const { funcType } = event.currentTarget.dataset;
      console.log(funcType);
      if (funcType === 'album' || funcType === 'camera') {
        this.handleChooseMedia(funcType);
      }
    },
    //处理打开媒体选择器
    handleChooseMedia(funcType) {
      wx.chooseMedia({
        count: 1,
        mediaType: ['mix'],
        sourceType: [funcType],
        maxDuration: 30,
        camera: 'back',
        success: (res) => {
          console.log(res);
          console.log(res.tempFiles[0].tempFilePath);
          console.log(res.tempFiles[0].size);
          this.uploadMediaToservicer(res.tempFiles[0]);
        },
        fail: (e) => {
          console.error(e);
          if (e.errMsg === 'chooseMedia:fail cancel') {
            wx.showToast({
              title: '取消选择',
            });
          } else {
            wx.showToast({
              title: '选择失败',
            });
          }
        },
      });
    },
    //处理上传附件至环信服务
    uploadMediaToservicer(tempFiles) {
      const { tempFilePath } = tempFiles;
      const url = `${EMClient.apiUrl}/${EMClient.orgName}/${EMClient.appName}/chatfiles`;
      const accessToken = EMClient.token;
      wx.showLoading({
        title: '文件上传中',
      });
      wx.uploadFile({
        filePath: tempFilePath,
        name: 'file',
        url: url,
        header: {
          Authorization: 'Bearer ' + accessToken,
        },
        success: (res) => {
          console.log('>>>>>>>文件已上传', res);
          if (res?.data) {
            const updateFileInfo = JSON.parse(res.data);
            if (tempFiles.fileType === 'image') {
              this.sendImageMessage(tempFiles, updateFileInfo);
            }
            if (tempFiles.fileType === 'video') {
              this.sendVideoMessage(tempFiles, updateFileInfo);
            }
          }
        },
        fail: (e) => {
          console.log('>>>>>>文件上传失败', e);
          wx.showToast({
            title: '上传失败',
          });
        },
        complete: () => {
          wx.hideLoading();
          this.setData({
            show: false,
          });
        },
      });
    },
    //发送图片消息
    sendImageMessage(tempFiles, updateFileInfo) {
      const { avatarurl, nickname } = store.loginUserInfos;
      let option = {
        type: 'img',
        from: EMClient.user,
        chatType: this.data.chatType,
        to: this.data.targetId,
        url: updateFileInfo.uri + '/' + updateFileInfo.entities[0].uuid,
        ext: {
          ease_chat_uikit_user_info: {
            avatarURL: avatarurl,
            nickname: nickname,
          },
        },
      };
      const actionSendMessage = async () => {
        try {
          console.log('>>>>构建消息', option);
          const msg = EaseSDK.message.create(option);
          const { message } = await EMClient.send(msg);
          this.triggerEvent('callUpdateMessageList', message);
          console.log('>>>>>>图片消息发送成功', message);
        } catch (error) {
          console.error(error);
          wx.showToast({
            title: `发送失败${error.type}`,
          });
        }
      };
      wx.getImageInfo({
        src: tempFiles.tempFilePath,
        success: (res) => {
          console.log('>>>>图片信息读取完成', res);
          option.width = res.width;
          option.height = res.height;
          actionSendMessage();
        },
        fail: (e) => {
          console.error(e);
          wx.showToast({
            title: '图片信息读取失败',
          });
        },
      });
    },
    //发送视频消息
    async sendVideoMessage(tempFiles, updateFileInfo) {
      const option = {
        // 消息类型。
        type: 'video',
        // 会话类型：单聊、群聊和聊天室分别为 `singleChat`、`groupChat` 和 `chatRoom`。
        from: EMClient.user,
        chatType: this.data.chatType,
        to: this.data.targetId,
        // 文件名。
        filename: 'filename',
        body: {
          //文件 URL。
          url: updateFileInfo.uri + '/' + updateFileInfo.entities[0].uuid,
        },
        file_length: tempFiles.duration,
        length: tempFiles.duration,
      };

      try {
        const msg = EaseSDK.message.create(option);
        const { message } = await EMClient.send(msg);
        console.log('>>>>>视频消息发送成功', message);
        this.triggerEvent('callUpdateMessageList', message);
      } catch (error) {
        console.error('视频发送失败', error);
        wx.showToast({
          title: `发送失败${error.type}`,
        });
      }
    },
  },
});
