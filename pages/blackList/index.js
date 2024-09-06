// pages/blackList/index.js
import {
  createStoreBindings
} from 'mobx-miniprogram-bindings';
import {
  store
} from '../../store/index';
import emContacts from '../../EaseIM/emApis/emContacts'
const { getBlocklistFromServer } = emContacts()
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
      fields: ['enrichedBlackList'],
      actions: ['initBlackListFromServer'],
    });
    this.fetchAllBlockListData()
  },
  onClickLeft(){
    wx.navigateBack()
  },
  async fetchAllBlockListData(){
    try {
      const res =  await getBlocklistFromServer()
      this.initBlackListFromServer(res)
    } catch (error) {
        wx.showToast({
          title: '黑名单拉取失败',
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