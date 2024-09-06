import {
  createStoreBindings
} from 'mobx-miniprogram-bindings';
import {
  store
} from '../../store/index';
import emContacts from '../../EaseIM/emApis/emContacts'
const {
  removeContactFromServer,
  getBlocklistFromServer,
  addUsersToBlocklist,
  removeUsersFromBlocklist

} = emContacts()
import Dialog from '@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarurl: '',
    remark: '',
    userId: '',
    nickname: '',
    blackchecked: false,
    switchLoading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.store = createStoreBindings(this, {
      store,
      fields: ['blackList'],
      actions: ['initBlackListFromServer', 'deleteContactsListFromStore']
    });
    console.log('load contact detail', options);
    const {
      avatarurl,
      remark,
      userId,
      nickname
    } = options
    this.setData({
      avatarurl,
      remark,
      userId,
      nickname
    })

  },
  onClickLeft() {
    wx.navigateBack()
  },
  copyUserId() {
    wx.setClipboardData({
      data: this.data.userId,
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
  },
  onChange(event) {
    Dialog.confirm({
        title: '拉黑联系人',
        message: `${event.detail?'确认要拉黑联系人':'确认要解除拉黑'}“${this.data.remark||this.data.nickname ||this.data.userId}”`,
      })
      .then(() => {
        // on confirm
        if (event.detail) {
          this.handlAddUsersToBlocklist()
        } else {
          this.handleRemoveUsersFromBlocklist()
        }
      })
      .catch(() => {
        // on cancel
      });
  },
  async fetchAllBlockListData() {
    try {
      const res = await getBlocklistFromServer()
      if (res?.length && res.includes(this.data.userId)) {
        this.setData({
          blackchecked: true
        })
      }
      this.initBlackListFromServer(res)
    } catch (error) {
      wx.showToast({
        title: '黑名单拉取失败',
      })
    }
  },
  async handlAddUsersToBlocklist() {
    try {
      await addUsersToBlocklist([this.data.userId])
      this.setData({
        blackchecked: true
      })
    } catch (error) {
      console.error(error);
      wx.showToast({
        title: '黑名单添加失败',
      })
    }
  },
  async handleRemoveUsersFromBlocklist() {
    try {
      await removeUsersFromBlocklist([this.data.userId])
      this.setData({
        blackchecked: false
      })
    } catch (error) {
      console.error(error);
      wx.showToast({
        title: '黑名单移除失败',
      })
    }
  },
  entryContactsRemarkPage() {
    wx.navigateTo({
      url: `/pages/contactsRemark/index?userId=${this.data.userId}&remark=${this.data.remark || ''}`,
    })
  },
  onDeleteContacts() {
    Dialog.confirm({
        title: '删除好友',
        message: `确认要删除'“${this.data.remark||this.data.nickname ||this.data.userId}”`,
      })
      .then(() => {
        // on confirm
        this.handleDeleteContacts()
      })
      .catch(() => {
        // on cancel
      });
  },
  async handleDeleteContacts() {
    if (!this.data.userId) return console.log('>>>>添加好友userId为空');
    try {
      await removeContactFromServer(this.data.userId)
      this.deleteContactsListFromStore(this.data.userId)
      wx.navigateBack()
    } catch (error) {
      console.error(error);
      wx.showToast({
        title: '好友删除失败',
      })
    }
  },
  onEntryChatPage() {
    const {
      userId,
      avatarurl,
      nickname,
      remark
    } = this.data
    console.log('userId,avatarurl,nickname', userId, avatarurl, nickname);
    const conversationParams = {
      title: '',
      avatarurl: ''
    }
    conversationParams.title = remark || nickname || ""
    conversationParams.avatarurl = avatarurl ? avatarurl : ""
    wx.navigateTo({
      url: `/pages/chat/index?conversationId=${userId}&conversationType=singleChat&conversationParams=${JSON.stringify(conversationParams)}`,
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.fetchAllBlockListData()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    this.store.destroyStoreBindings();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})