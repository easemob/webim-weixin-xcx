import {
  observable,
  action,
  runInAction,
  set,
  toJS,
  computed
} from 'mobx-miniprogram';
import formaterDate from '../utils/formaterDate'
import emUserInfos from '../EaseIM/emApis/emUserInfos'
import emGroups from '../EaseIM/emApis/emGroups'
import emContacts from '../EaseIM/emApis/emContacts';
import {
  EMClient
} from '../EaseIM/index'
import getMessageKey from '../utils/setMessageKey'
const {
  fetchOtherInfoFromServer,
} = emUserInfos()
const {
  fetchContactsListFromServer
} = emContacts();
const {
  getGroupInfosFromServer
} = emGroups()
export const store = observable({
  /* 会话列表相关 */
  conversationList: [], // 会话列表
  conversationCursor: '', //会话列表分页游标
  chatingConversationId: '', //对话中的会话ID（进入聊天页面的会话）
  /* 联系人相关 */
  contactsList: [], //联系人列表
  contactsUserInfos: new Map(),
  groupInfos: new Map(), // 添加一个 Map 用于存储群组信息
  /* 黑名单 */
  blackList: [], //黑名单列表
  /* 我的相关 */
  loginEMUserId: EMClient.user,
  loginUserInfos: {}, //登录用户属性
  /* 新通知 */
  notificationsList: [],

  /* actions methods */
  /* 会话列表相关 */
  //获取会话列表数据
  initConversationListFromServer: action(function (data) {
    if (data?.conversations?.length) {
      // 先将会话列表转换为 observable 对象
      const observableConversations = data.conversations.map(conversationItem => {
        const observableConversationItem = observable(conversationItem);
        observableConversationItem.lastMessage.time = formaterDate('MM/DD/HH:mm', observableConversationItem.lastMessage.time);
        return observableConversationItem;
      });

      // 筛选出 singleChat 和 groupChat 类型的会话 ID
      const singleChatIds = observableConversations
        .filter(conversation => conversation.conversationType === 'singleChat')
        .map(conversation => conversation.conversationId);

      const groupChatIds = observableConversations
        .filter(conversation => conversation.conversationType === 'groupChat')
        .map(conversation => conversation.conversationId);

      // 获取 singleChat 用户信息
      const fetchSingleChatInfos = singleChatIds.length > 0 ?
        this.geContactsUserInfos(singleChatIds) :
        Promise.resolve({});

      // 获取 groupChat 群组信息
      const fetchGroupChatInfos = groupChatIds.length > 0 ?
        this.geGroupInfos(groupChatIds) :
        Promise.resolve({});

      // 批量获取用户和群组信息
      Promise.all([fetchSingleChatInfos, fetchGroupChatInfos]).then(([userInfos, groupInfos]) => {
        runInAction(() => {
          // 合并 singleChat 用户属性到对应的会话
          // observableConversations.forEach(conversation => {
          //   if (conversation.conversationType === 'singleChat' && userInfos[conversation.conversationId]) {
          //     set(conversation, userInfos[conversation.conversationId]);
          //     // 更新 contactsUserInfos
          //     // this.contactsUserInfos.set(conversation.conversationId, userInfos[conversation.conversationId]);
          //   }
          //   // 合并 groupChat 群组属性到对应的会话
          //   // if (conversation.conversationType === 'groupChat') {
          //   //   const groupInfo = groupInfos.find(group => group.id === conversation.conversationId);
          //   //   if (groupInfo) {
          //   //     set(conversation, groupInfo);
          //   //     // 更新 groupInfos
          //   //     // this.groupInfos.set(conversation.conversationId, groupInfo);
          //   //   }
          //   // }
          // });
          this.conversationList = observableConversations;
        });
      }).catch(err => {
        console.log('>>>>>会话列表对应的用户属性或群组详情获取失败', err);
      });
    }
    this.conversationCursor = data?.cursor;
  }),
  // 更新会话的 lastMessage
  updateConversationLastMessage: action(function (message) {
    const conversationId = getMessageKey(message)
    console.log('updateConversationLastMessage 更新会话');
    let conversationIndex = this.conversationList.findIndex(conv => conv.conversationId === conversationId);
    let conversation;
    if (conversationIndex !== -1) {
      // 如果会话存在，更新 lastMessage 并将其移动到数组最前面
      runInAction(() => {
        conversation = this.conversationList[conversationIndex];
        if (this.chatingConversationId !== conversation.conversationId) {
          conversation.unReadCount = conversation.unReadCount + 1
        }
        conversation.lastMessage = {
          ...message,
          time: formaterDate('MM/DD/HH:mm', message.time)
        };
        this.conversationList.splice(conversationIndex, 1);
        this.conversationList.unshift(conversation);
        this.conversationList = [...this.conversationList]
      });
    } else {
      // 如果会话不存在，新建会话并移动到数组最前面
      if (message.chatType === 'singleChat') {
        this.geContactsUserInfos([conversationId])
      }
      if (message.chatType === 'groupChat') {
        this.geGroupInfos([conversationId])
      }
      runInAction(() => {
        conversation = observable({
          conversationId: conversationId,
          conversationType: message.chatType,
          lastMessage: {
            ...message,
            time: formaterDate('MM/DD/HH:mm', message.time)
          },
          unReadCount: message.from !== EMClient.user ? 1 : 0
        });
        this.conversationList.unshift(conversation);
        this.conversationList = [...this.conversationList]
        console.log('创建新的会话', this.conversationList);
      });
    }
  }),
  // 清空会话列表的未读数
  clearConversationItemUnReadCount: action(function (conversationId) {
    let conversationIndex = this.conversationList.findIndex(conv => conv.conversationId === conversationId);
    if (conversationIndex !== -1) {
      runInAction(() => {
        // 重新创建一个新的会话对象
        let conversation = this.conversationList[conversationIndex]
        conversation.unReadCount = 0
        this.conversationList.splice(conversationIndex, 1, conversation);
        this.conversationList = [...this.conversationList];
      });
    }
  }),
  // 删除会话列表中的指定会话
  removeConversation: action(function (conversationId) {
    const index = this.conversationList.findIndex(conversation => conversation.conversationId === conversationId);
    if (index !== -1) {
      // 删除指定的会话并引起响应式更新
      runInAction(() => {
        // 删除指定的会话并引起响应式更新
        this.conversationList.splice(index, 1);
        // 重新赋值数组以确保 MobX 能够检测到变化
        this.conversationList = [...this.conversationList];
        console.log('>>>>>mobx执行删除', this.conversationList);
      });

    }
  }),
  //设置对话中会话id
  setChatingConversationId: action(function (conversationId) {
    this.chatingConversationId = conversationId
  }),
  /* 联系人相关 */
  //获取全部联系人
  initContactsListFromServer: action(function () {
    console.log('initContactsListFromServer');
    fetchContactsListFromServer().then(res => {
      console.log('>>>>>接口返回成功',res);
      this.contactsList = [...res]
      if (res.length > 0) {
        const userIds = res.map((item) => item.userId);
        console.log('userIds',userIds);
        this.geContactsUserInfos(userIds);
      }
    })

  }),
  //删除本地store中的ContactList
  deleteContactsListFromStore: action(function (userId) {
    const index = this.contactsList.findIndex(contact => contact.userId === userId);
    if (index !== -1) {
      runInAction(() => {
        this.contactsList.splice(index, 1);
        // 重新赋值数组以确保 MobX 能够检测到变化
        this.contactsList = [...this.contactsList];
      })
    }
  }),
  //修改用户备注
  updateContactsRemark: action(function (data) {
    const {
      userId,
      remark
    } = data;
    const contactIndex = this.contactsList.findIndex(contact => contact.userId === userId);
    if (contactIndex !== -1) {
      runInAction(() => {
        const updatedContact = {
          ...this.contactsList[contactIndex],
          remark: remark,
        };
        // 更新整个对象
        this.contactsList[contactIndex] = updatedContact;
      });
    }
    console.log('this.contactsList', this.contactsList);
  }),
  //获取用户属性
  geContactsUserInfos: action(function (userIds) {
    if (userIds.length) {
      // 截取批量获取用户属性一次做多传入100个userId，因此需要进行截取。
      const chunkArray = (array, chunkSize) => {
        const results = [];
        for (let i = 0; i < array.length; i += chunkSize) {
          results.push(array.slice(i, i + chunkSize));
        }
        return results;
      };
      const userIdChunks = chunkArray(userIds, 100);
      const fetchPromises = userIdChunks.map(chunk => fetchOtherInfoFromServer(chunk));
      return new Promise((resolve, reject) => {
        Promise.all(fetchPromises).then(results => {
          const allResults = results.reduce((acc, curr) => {
            return {
              ...acc,
              ...curr
            }; // Merge all results into a single object
          }, {});
          Object.keys(allResults).forEach(userId => {
            this.contactsUserInfos.set(userId, allResults[userId]);
          });
          resolve(allResults);
        }).catch(error => reject(error));
      });
    }
  }),
  /* 黑名单 */
  initBlackListFromServer: action(function (data) {
    this.blackList = [...data]
    console.log('>>>>>初始化黑名单', this.blackList);
  }),
  /* 群组相关 */
  // 获取群组详情
  geGroupInfos: action(function (groupIds) {
    if (groupIds.length) {
      return new Promise((resolve, reject) => {
        getGroupInfosFromServer(groupIds).then(res => {
          console.log('>>>>>群组详情获取成功', res);
          if (res?.length) {
            res.forEach(groupItem => {
              // 更新 groupInfos
              this.groupInfos.set(groupItem.id, groupItem);
            })
          }
          resolve(res);
        }).catch(error =>
          reject(error))
      })
    }
  }),
  /* 我的相关 */
  getLoginUserInfos: action(function (userInfos) {
    console.log('userInfos', userInfos, );
    this.loginEMUserId = EMClient.user
    this.loginUserInfos = {
      ...userInfos[this.loginEMUserId]
    }
  }),
  /* 新请求相关 */
  updateNotificationsList: action(function (data) {
    console.log('updateNotificationsList', data);
    if (!this.notificationsList.some(item => item.key === data.key)) {
      let result = []
      result.unshift(data)
      this.notificationsList = [...result, ...this.notificationsList]
    }

  }),
  deleteNotificationList: action(function (userId) {
    this.notificationsList = this.notificationsList.filter((item) =>
      item.key !== userId
    )
  }),
  /* 计算属性 */
  // 计算未读消息总数的计算属性
  get totalUnreadCount() {
    return this.conversationList.reduce((sum, conversation) => sum + (conversation.unReadCount || 0), 0);
  },
  //会话列表内容包含单人好友属性，群组群组详情。
  get enrichedConversationList() {
    return this.conversationList.map(conversation => {
      if (conversation.conversationType === 'singleChat') {
        const contactsItem = this.contactsList.find(contant => contant.userId === conversation.conversationId) || {}
        console.log('contactsItem', contactsItem);
        const userInfo = this.contactsUserInfos.get(conversation.conversationId);
        if (userInfo) {
          return toJS({
            ...contactsItem, // 如果 contactsItem 存在，它会覆盖 conversation 中相同的字段
            ...conversation,
            ...(userInfo || {}), // 如果 userInfo 存在，它也会覆盖之前的字段
            // ...contactsItem,
            // ...conversation,
            // ...userInfo,
          });
        } else {
          return toJS(conversation); // 转换为普通对象
        }
      }
      if (conversation.conversationType === 'groupChat') {
        const groupInfo = this.groupInfos.get(conversation.conversationId);
        if (groupInfo) {
          return toJS({
            ...conversation,
            ...groupInfo,
          });
        } else {
          return toJS(conversation); // 转换为普通对象
        }
      }
    })
  },
  // 计算联系人列表中包含用户属性的联系人
  get enrichedContactsList() {
    return this.contactsList.map(contact => {
      const userInfo = this.contactsUserInfos.get(contact.userId);
      /**
       * 在返回对象时，使用 MobX 的 toJS 方法来避免循环引用或深度观察。toJS 会将 observable 对象转换为普，
       * JavaScript 对象。
       * 在 MobX 的计算属性中，如果返回的对象是 observable 的，并且其依赖项没有发生明显变化，MobX 可能不会触发更新。使用 toJS 会创建并返回一个全新的普通对象，MobX 会认为这是一个新对象，从而触发视图更新。
       */
      if (userInfo) {
        return toJS({
          ...contact,
          ...userInfo,
        });
      } else {
        return toJS(contact); // 转换为普通对象
      }
    });
  },
  //计算获取登录用户的用户属性
  get loginUserInfosData() {
    return this.loginUserInfos
  },
  //计算属性获取黑名单列表的用户
  get enrichedBlackList() {
    return this.blackList.map(user => {
      const userInfo = this.contactsUserInfos.get(user);
      if (userInfo) {
        return {
          userId: user,
          ...userInfo
        };
      }
      return {
        userId: user
      };
    })
  },
});