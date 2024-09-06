import {
  createStoreBindings
} from 'mobx-miniprogram-bindings';
import {
  store
} from '../../../store/index';
import emGroups from '../../../EaseIM/emApis/emGroups'
const {
  inviteUsersToGroup
} = emGroups()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupId: '',
    checkedValues: [], // 存储选中的复选框值
    defaultMemberList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.store = createStoreBindings(this, {
      store,
      fields: ['contactsList', 'contactsUserInfos', 'enrichedContactsList'],
    });
    const memberList = JSON.parse(options.memberList)
    setTimeout(() => {
      //给enrichedContactsList追加禁用值，该值的意义为首次进入页面把已有的在群内的用户禁用checkbox。
      const enrichedContactsList = this.data.enrichedContactsList.map(item => ({
        ...item,
        disabled: this.data.defaultMemberList.includes(item.userId),
      }));
      this.setData({
        enrichedContactsList,
      });
    }, 500)
    this.setData({
      groupId: options.groupId,
      checkedValues: memberList,
      defaultMemberList: memberList
    })
  },
  onClickLeft() {
    wx.navigateBack()
  },
  onCheckboxChange(event) {
    console.log(event);
    this.setData({
      checkedValues: event.detail,
    });
  },
  difference(arr1, arr2) {
    return arr1.filter(item => !arr2.includes(item)).concat(arr2.filter(item => !arr1.includes(item)));
  },
  cannelAddUserToGroup() {
    const defalutUserIds = this.data.defaultMemberList
    let checkUserIds = this.data.checkedValues
    const diffArray = this.difference(checkUserIds, defalutUserIds);
    console.log('diffArray', diffArray);
    checkUserIds = checkUserIds.filter(userId => !diffArray.includes(userId));
    this.setData({
      checkedValues: checkUserIds
    });
  },
  async handleInviteUserToGroup() {
    const checkUserIds = this.data.checkedValues
    const defalutUserIds = this.data.defaultMemberList
    const diffArray = this.difference(checkUserIds, defalutUserIds);
    console.log(diffArray);
    try {
      await inviteUsersToGroup(this.data.groupId, diffArray)
      wx.showToast({
        title: '邀请已发出',
        icon: "none"
      })
      //更新群组员页面的数据
      const pages = getCurrentPages(); // 获取页面栈
      const prevPage = pages[pages.length - 2]; // 获取上一页面的实例对象
      console.log('inviteUsersToGroup prevPage', prevPage);
      if (prevPage) {
        prevPage?.initFetchGroupMemberListData()
      }
      setTimeout(() => {
        wx.navigateBack()
      }, 300)
    } catch (error) {
      console.log(error);
      wx.showToast({
        title: '邀请失败',
        icon: "none"
      })
    }
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    this.store.destroyStoreBindings();
  },

})