import {
  EMClient
} from '../../../EaseIM/index'
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

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.store = createStoreBindings(this, {
      store,
      fields: ['loginUserInfosData', 'loginEMUserId'],
      actions: ['getLoginUserInfos'],
    });
  },
  onClickLeft() {
    wx.navigateBack()
  },
  onChooseAvatarImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      camera: 'back',
      success: (res) => {
        console.log(res.tempFiles[0].tempFilePath)
        console.log(res.tempFiles[0].size)
        const tempFilePath = res.tempFiles[0].tempFilePath;
        this.updateAvatarUrl(tempFilePath)
      },
      fail: () => {
        wx.showToast({
          title: '选择失败',
        })
      }
    })
  },
  updateAvatarUrl(filePath) {
    const userId = EMClient.user
    wx.uploadFile({
      filePath: filePath,
      name: 'file',
      url: this.getInsideUploadUrl(userId),
      header: {
        Authorization: "Bearer " + EMClient.token
      },
      success: (res) => {
        console.log('>>>>>上传成功', res);
        const dt = JSON.parse(res.data);
        if (dt.code !== 200) {
          wx.showToast({
            title: `上传失败:${dt.code}`,
          })
        } else {
          wx.showToast({
            title: '头像已上传',
          })
          updateLoginUserInfos({
            avatarurl: dt.avatarUrl
          }).then(() => {
            setTimeout(() => {
              this.fetchLoginUserInfosData()
            }, 500)
          }).catch(e => {
            wx.showToast({
              title: '头像更新失败',
            })
          })

        }
      },
      fail: (error) => {
        console.error(error);
        wx.showToast({
          title: '头像上传失败',
        })
      }
    })
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
   * 
   * @param {*} userId 
   * 该地址接口仅供环信内部使用，如果你要实现同样效果请找自己的服务端提供。
   */
  getInsideUploadUrl(userId) {
    return `https://a1-appserver.easemob.com/inside/app/user/${userId}/avatar/upload`
  },
  entryNicknameEditPage(){
    wx.navigateTo({
      url: `/pages/profileEdit/nicknameEdit/index?nickname=${this.data.loginUserInfosData?.nickname || ''}`,
    })
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