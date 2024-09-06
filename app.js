import {
  EMClient
} from "./EaseIM/index"
import {
  store
} from './store/index'
App({
  globalData: {
    globalActiveTab: 0,
    tabbarHeight: 50,
    safeAreaBottomHeight: 0
  },
  onLaunch() {
    wx.getSystemInfo({
      success: (res) => {
        const tabbarHeight = (res.screenHeight - res.safeArea.bottom) + 50
        const safeAreaInsetBottom = res.screenHeight - res.safeArea.bottom
        console.log('tabbarHeigth', tabbarHeight)
        console.log('safeAreaBottomHeigth', safeAreaInsetBottom);
        this.globalData.safeAreaBottomHeight = safeAreaInsetBottom
        this.globalData.tabbarHeight = tabbarHeight
      }
    })
    this.mountEaseIMListener()
  },
  mountEaseIMListener() {
    console.log('>>>>>>EaseIM Listener');
    /* 连接监听 */
    EMClient.addEventHandler("CONNECT", {
      onConnected: () => {
        console.log("onConnected");
      },
      // 自 4.8.0 版本，`onDisconnected` 事件新增断开原因回调参数, 告知用户触发 `onDisconnected` 的原因。
      onDisconnected: () => {
        console.log("onDisconnected");
      },
      onTokenWillExpire: () => {
        console.log("onTokenWillExpire");
      },
      onTokenExpired: () => {
        console.log("onTokenExpired");
      },
    });
    /* 消息监听 */
    EMClient.addEventHandler('MESSAGE', {
      // 当前用户收到文本消息。
      onTextMessage: (message) => {
        store.updateConversationLastMessage({...message})
      },
      // 当前用户收到图片消息。
      onImageMessage: (message) => {
        store.updateConversationLastMessage({...message})
      },
      // 当前用户收到透传消息。
      onCmdMessage: (message) => {
        // store.updateConversationLastMessage({...message})
      },
      // 当前用户收到语音消息。
      onAudioMessage: (message) => {
        store.updateConversationLastMessage({...message})
      },
      // 当前用户收到位置消息。
      onLocationMessage: (message) => {
        store.updateConversationLastMessage({...message})
      },
      // 当前用户收到文件消息。
      onFileMessage: (message) => {
        store.updateConversationLastMessage({...message})
      },
      // 当前用户收到自定义消息。
      onCustomMessage: (message) => {
        store.updateConversationLastMessage({...message})
      },
      // 当前用户收到视频消息。
      onVideoMessage: (message) => {
        store.updateConversationLastMessage({...message})
      },
    })
    /* 好友关系监听 */
    EMClient.addEventHandler("CONTACTS", {
      // 当前用户收到好友邀请。
      onContactInvited: function (msg) {
        console.log('收到好友申请事件', msg);
        msg.key = msg.from
        msg.chatType = 'singleChat'
        store.updateNotificationsList({
          ...msg
        })
      },
      // 联系人被删除。
      onContactDeleted: function (msg) {
        store.initContactsListFromServer()
      },
      // 新增联系人。
      onContactAdded: function (msg) {},
      // 当前用户发送的好友请求被拒绝。
      onContactRefuse: function (msg) {},
      // 当前用户发送的好友请求被同意。
      onContactAgreed: function (msg) {
        store.initContactsListFromServer()
      },
    })
    /* 群组相关监听 */
    EMClient.addEventHandler("GROUPS", {
      onGroupEvent: (event) => {
        console.log('GROUP EVETN', event);
        switch (event.operation) {
          // 有新群组创建。群主的其他设备会收到该回调。
          case "create":
            break;
            // 关闭群组一键禁言。群组所有成员（除操作者外）会收到该回调。
          case "unmuteAllMembers":
            break;
            // 开启群组一键禁言。群组所有成员（除操作者外）会收到该回调。
          case "muteAllMembers":
            break;
            // 有成员从群白名单中移出。被移出的成员及群主和群管理员（除操作者外）会收到该回调。
          case "removeAllowlistMember":
            break;
            // 有成员添加至群白名单。被添加的成员及群主和群管理员（除操作者外）会收到该回调。
          case "addUserToAllowlist":
            break;
            // 删除群共享文件。群组所有成员会收到该回调。
          case "deleteFile":
            break;
            // 上传群共享文件。群组所有成员会收到该回调。
          case "uploadFile":
            break;
            // 删除群公告。群组所有成员会收到该回调。
          case "deleteAnnouncement":
            break;
            // 更新群公告。群组所有成员会收到该回调。
          case "updateAnnouncement":
            break;
            // 更新群组信息，如群组名称和群组描述。群组所有成员会收到该回调。
          case "updateInfo":
            break;
            // 有成员被移出禁言列表。被解除禁言的成员及群主和群管理员（除操作者外）会收到该回调。
          case "unmuteMember":
            break;
            // 有群组成员被加入禁言列表。被禁言的成员及群主和群管理员（除操作者外）会收到该回调。
          case "muteMember":
            break;
            // 有管理员被移出管理员列表。群主、被移除的管理员和其他管理员会收到该回调。
          case "removeAdmin":
            break;
            // 设置管理员。群主、新管理员和其他管理员会收到该回调。
          case "setAdmin":
            break;
            // 转让群组。新群主会收到该回调。
          case "changeOwner":
            break;
            // 群组所有者和管理员拉用户进群时，无需用户确认时会触发该回调。被拉进群的用户会收到该回调。
          case "directJoined":
            break;
            // 群成员主动退出群组。除了退群的成员，其他群成员会收到该回调。
          case "memberAbsence":
            break;
            // 有用户加入群组。除了新成员，其他群成员会收到该回调。
          case "memberPresence":
            break;
            // 用户被移出群组。被踢出群组的成员会收到该回调。
          case "removeMember":
            break;
            // 当前用户的入群邀请被拒绝。邀请人会收到该回调。例如，用户 B 拒绝了用户 A 的入群邀请，用户 A 会收到该回调。
          case "rejectInvite":
            break;
            // 当前用户的入群邀请被接受。邀请人会收到该回调。例如，用户 B 接受了用户 A 的入群邀请，则用户 A 会收到该回调。
          case "acceptInvite":
            break;
            // 当前用户收到了入群邀请。受邀用户会收到该回调。例如，用户 B 邀请用户 A 入群，则用户 A 会收到该回调。
          case "inviteToJoin": {
            event.chatType = 'groupChat'
            event.key = event.id
            store.updateNotificationsList({
              ...event
            })
          }
          break;
          // 当前用户的入群申请被拒绝。申请人会收到该回调。例如，用户 B 拒绝用户 A 的入群申请后，用户 A 会收到该回调。
        case "joinPublicGroupDeclined":
          break;
          // 当前用户的入群申请被接受。申请人会收到该回调。例如，用户 B 接受用户 A 的入群申请后，用户 A 会收到该回调。
        case "acceptRequest":
          break;
          // 当前用户发送入群申请。群主和群管理员会收到该回调。
        case "requestToJoin":
          break;
          // 群组被解散。群主解散群组时，所有群成员均会收到该回调。
        case "destroy":
          break;
          // 设置群成员的自定义属性。群组内其他成员均会收到该回调。
        case "memberAttributesUpdate":
          break;
        default:
          break;
        }
      }
    })
  },

  onUnload() {},

});