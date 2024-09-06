import {
  createStoreBindings
} from 'mobx-miniprogram-bindings';
import {
  store
} from '../../../store/index';
import emUserInfos from '../../../EaseIM/emApis/emUserInfos'
const {
  fetchUserInfoWithLoginId,
  updateLoginUserInfos
} = emUserInfos()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    this.store = createStoreBindings(this, {
      store,
      fields: ['loginUserInfosData'],
      actions: ['getLoginUserInfos'],
    });
    this.setData({
      inputValue: options?.nickname
    })
  },
  onClickLeft() {
    wx.navigateBack()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  async handleSaveNicknameEditValue() {
    try {
      await updateLoginUserInfos({
        nickname: this.data.inputValue
      })
      setTimeout(() => {
        this.fetchLoginUserInfosData()
      }, 500)
      wx.showToast({
        title: '昵称修改成功',
      })
    } catch (error) {
      wx.showToast({
        title: '昵称保存失败',
      })
    }
  },
  async fetchLoginUserInfosData() {
    try {
      const res = await fetchUserInfoWithLoginId()
      console.log('>>>>>登录用户获取成功', res);
      this.getLoginUserInfos(res)
    } catch (error) {
      console.log(error);
      wx.showToast({
        title: '登录用户属性获取失败',
      })
    }
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