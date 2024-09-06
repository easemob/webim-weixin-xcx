import { createStoreBindings } from 'mobx-miniprogram-bindings';
import { store } from '../../store/index';
import emContacts from '../../EaseIM/emApis/emContacts';
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchContactsValue: '',
    searchStatus: false,
    searchSourceData: [],
    tabbarPlaceholderHeight: app.globalData.tabbarHeight,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.store = createStoreBindings(this, {
      store,
      fields: [
        'contactsList',
        'contactsUserInfos',
        'enrichedContactsList',
        'notificationsList',
        'loginUserInfosData',
      ],
      actions: ['initContactsListFromServer'],
    });

    setTimeout(() => {
      if (!this.data.contactsList.length) {
        console.log('<<<<<发起远端联系人请求');
        this.fetchContactsListData();
      }
    }, 500);
  },
  async fetchContactsListData() {
    try {
      this.initContactsListFromServer();
      console.log('联系人列表获取成功');
    } catch (error) {
      console.log('>>>>联系人请求成功', error);
    }
  },
  /* Search */
  onSearchFocus() {
    console.log('>>>>>搜索框聚焦');
    this.setData({
      searchStatus: true,
    });
    this.setData({
      searchSourceData: this.data.enrichedContactsList,
    });
  },
  onSearchBlur() {
    this.setData({
      searchStatus: false,
    });
  },
  onSearchCancel() {
    this.setData({
      searchStatus: false,
    });
  },
  onActionSearchInputValue() {
    const searchResult = this.data.enrichedContactsList.filter((contacts) => {
      const { userId, remark } = contacts;
      const searchValue = this.data.searchContactsValue;
      const matchesId = userId?.includes(searchValue);
      const matchesRemark = remark?.includes(searchValue);
      if (
        matchesId ||
        contacts?.nickname?.includes(searchValue) ||
        matchesRemark
      ) {
        return true;
      } else {
        return false;
      }
    });
    this.setData({
      searchSourceData: searchResult,
    });
  },
  entryContactDetailPage(event) {
    console.log('entryContactDetailPage', event);
    const {
      currentTarget: { dataset },
    } = event;
    const { avatarurl, remark, userid, nickname } = dataset;
    console.log(
      ' avatarurl,remark,userid',
      avatarurl,
      remark,
      userid,
      nickname
    );

    wx.navigateTo({
      url: `/pages/contactsDetail/index?avatarurl=${avatarurl || ''}&remark=${
        remark || ''
      }&userId=${userid || ''}&nickname=${nickname || ''}`,
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getTabBar().init();
    console.log(this.data);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    this.store.destroyStoreBindings();
  },
});
