import {
  EMClient
} from '../../EaseIM/index'
import emContacts from '../../EaseIM/emApis/emContacts'
import emUserInfos from '../../EaseIM/emApis/emUserInfos'
const {
  addContactFromServer,
  fetchContactsListFromServer
} = emContacts()
const {
  fetchOtherInfoFromServer
} = emUserInfos()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchContactValue: '',
    searchResultData: {},
    ownContactsList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  onShow() {
    fetchContactsListFromServer().then(res => {
      console.log(res);
      this.setData({
        ownContactsList: [...res]
      })
      this.data.ownContactsList = [...res]
    }).catch(err => {
      console.error('>>>好友列表请求失败', err);
    })
  },
  onClickLeft() {
    wx.navigateBack()
  },
  onSearchCancel() {
    this.setData({
      searchResultData: {}
    })
  },
  onSearchClear() {
    this.setData({
      searchResultData: {}
    })
  },
  onSearchChange(event) {
    console.log(event);
    if (!this.data.searchContactValue) {
      this.setData({
        searchResultData: {}
      })
    }
  },
  async onActionSearchContact() {
    console.log('this.data.searchContactValue', this.data.searchContactValue);
    if (!this.data.searchContactValue.trim()) return;
    console.log('this.data.ownContactsList', this.data.ownContactsList);
    const isInContactList = this.data.ownContactsList.some(item => item.userId === this.data.searchContactValue)
    if (isInContactList) {
      wx.showToast({
        title: '已经是你的好友！',
      })
      this.setData({
        searchContactValue:''
      })
      return
    }
    if (EMClient.user === this.data.searchContactValue) {
      wx.showToast({
        title: '不可添加自己',
      })
      this.setData({
        searchContactValue:''
      })
      return
    }
    try {
      const res = await fetchOtherInfoFromServer([this.data.searchContactValue])
      console.log('res', res);
      this.setData({
        searchResultData: {
          userId: this.data.searchContactValue,
          ...res[this.data.searchContactValue]
        }
      })
      console.log(this.data.searchResultData);
    } catch (error) {
      wx.showToast({
        title: '搜索用户属性获取失败',
      })
      console.error(error);
    }

  },
  async onAddContact() {
    const userId = this.data.searchResultData.userId
    try {
      await addContactFromServer(userId)
      wx.showToast({
        title: '好友申请已发出！',
      })
    } catch (error) {
      console.error(error);
      wx.showToast({
        title: '添加失败',
      })
    } finally {
      this.setData({
        searchContactValue:"",
        searchResultData:{}
      })
    }
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  }
})