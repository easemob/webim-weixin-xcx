import {
  createStoreBindings
} from 'mobx-miniprogram-bindings';
import {
  store
} from '../../store/index';
import emGroups from '../../EaseIM/emApis/emGroups'
const {
  modifyGroupInfo,
  destroyGroupFromServer
} = emGroups()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    editType: 'groupName', //groupName编辑群名、groupDesc编辑群组详情
    groupId: "",
    inputValue: "",
    savedGroupInfosValue: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('options', options);
    this.store = createStoreBindings(this, {
      store,
      // fields: ['enrichedConversationList', 'loginUserInfosData'],
      actions: [
        'geGroupInfos'
      ],
    });
    const {
      groupId,
      editGroupinfosType,
      defaultValue
    } = options
    this.setData({
      groupId,
      inputValue: defaultValue,
      editType: editGroupinfosType,
    })
  },
  onClickLeft() {
    const pages = getCurrentPages(); // 获取页面栈
    const prevPage = pages[pages.length - 2]; // 获取上一页面的实例对象
    console.log('prevPage', prevPage);
    // 设置上一页面的数据
    if (this.data.savedGroupInfosValue) {
      if (this.data.editType === 'groupName') {
        prevPage.setData({
          'groupInfos.name': this.data.savedGroupInfosValue
        });
      }
      if (this.data.editType === 'groupDesc') {
        prevPage.setData({
          'groupInfos.description': this.data.savedGroupInfosValue
        });
      }
    }
    wx.navigateBack()
  },
  async handleSaveEditGroupInfos() {
    if (!this.data.groupId || !this.data.inputValue) return
    try {
      let params = {}
      if (this.data.editType === 'groupName') {
        params.groupName = this.data.inputValue
      }
      if (this.data.editType === 'groupDesc') {
        params.description = this.data.inputValue
      }
      await modifyGroupInfo(this.data.groupId, params)
      await this.geGroupInfos(this.data.groupId)
      this.setData({
        savedGroupInfosValue: this.data.inputValue
      })
      wx.showToast({
        title: '修改成功',
      })
    } catch (error) {
      wx.showToast({
        title: '修改失败',
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