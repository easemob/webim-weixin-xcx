import {
  createStoreBindings
} from 'mobx-miniprogram-bindings';
import {
  store
} from '../../store/index';
import emContacts from '../../EaseIM/emApis/emContacts'
const {
  setContactRemarkFromServer
} = emContacts()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId:'',
    remarkValue: '',
    savedRemark:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.store = createStoreBindings(this, {
      store,
      actions: ['updateContactsRemark']
    });
    const {
      userId,
      remark
    } = options
    console.log('修改remark', remark);
    this.setData({
      userId
    })
    if (remark) {
      this.setData({
        remarkValue: remark
      })
    }
  },
  onClickLeft() {
    const pages = getCurrentPages(); // 获取页面栈
    const prevPage = pages[pages.length - 2]; // 获取上一页面的实例对象
    console.log('prevPage',prevPage);
    // 设置上一页面的数据
    if(this.data.savedRemark){
      prevPage.setData({
        remark: this.data.savedRemark
      });
    }

    wx.navigateBack()
  },
  async handleSaveRemarkValue() {
    const userId = this.data.userId
    const remark = this.data.remarkValue
    console.log(remark.length);
    if(!remark.length)return 
    try {
      await setContactRemarkFromServer(userId,remark)
      this.updateContactsRemark({userId,remark})
      this.setData({
        savedRemark:remark
      })
      wx.showToast({
        title: '修改成功',
      })
    } catch (error) {
      console.error(error);
      wx.showToast({
        title: '修改失败',
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