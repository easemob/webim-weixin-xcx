import {
  createStoreBindings
} from 'mobx-miniprogram-bindings';
import {
  store
} from '../../store/index';
import emContacts from '../../EaseIM/emApis/emContacts'
import emGroups from '../../EaseIM/emApis/emGroups'
import {
  EMClient
} from '../../EaseIM/index'
const {
  fetchContactsListFromServer,
  declineContactInvite,
  acceptContactInvite
} = emContacts()
const {
  rejectGroupInvite,
  acceptGroupInvite
} = emGroups()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.store = createStoreBindings(this, {
      store,
      fields: ['notificationsList'],
      actions: ['initContactsListFromServer', 'deleteNotificationList'],
    });
  },
  onClickLeft() {
    wx.navigateBack()
  },
  async onDeclineContactsApply(event) {
    console.log('event', event);
    const {
      currentTarget: {
        dataset
      }
    } = event
    const userId = dataset.key
    console.log(userId);
    try {
      await declineContactInvite(userId)
      this.deleteNotificationList(userId)
      this.fetchContactsListData()
    } catch (error) {
      console.log('error', error);
      wx.showToast({
        title: '拒绝失败',
      })
    }
  },
  async onAcceptContactApply(event) {
    const {
      currentTarget: {
        dataset
      }
    } = event
    const userId = dataset.key
    try {
      await acceptContactInvite(userId)
      this.deleteNotificationList(userId)
      this.fetchContactsListData()
    } catch (error) {
      wx.showToast({
        title: '添加失败',
      })
    }
  },
  async fetchContactsListData() {
    try {
      const res = await fetchContactsListFromServer();
      this.initContactsListFromServer(res);
    } catch (error) {
      console.log('>>>>联系人请求成功', error);
    }
  },
  async onDeclineGroupInvite(event) {
    console.log(event);
    const {
      currentTarget: {
        dataset
      }
    } = event
    const groupId = dataset.key
    try {
      await rejectGroupInvite(EMClient.user, groupId)
      this.deleteNotificationList(groupId)
    } catch (error) {
      console.error(error);
      wx.showToast({
        title: '群组忽略失败',
      })
    }
  },
  async onAcceptGroupInvite(event) {
    const {
      currentTarget: {
        dataset
      }
    } = event
    const groupId = dataset.key
    try {
      await acceptGroupInvite(EMClient.user, groupId)
      this.deleteNotificationList(groupId)
    } catch (error) {
      console.error(error);
      wx.showToast({
        title: '同意入群失败',
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

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
})