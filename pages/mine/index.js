import {
  createStoreBindings
} from 'mobx-miniprogram-bindings';
import {
  store
} from '../../store/index';
import { EMClient } from '../../EaseIM/index'
import emUserInfos from '../../EaseIM/emApis/emUserInfos'
import Dialog from '@vant/weapp/dialog/dialog';
const {
  fetchUserInfoWithLoginId
} = emUserInfos()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sdkVersation:'',
    tabbarPlaceholderHeight: app.globalData.tabbarHeight
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.store = createStoreBindings(this, {
      store,
      fields: ['loginUserInfosData','loginEMUserId'],
      actions: ['getLoginUserInfos'],
    });
    setTimeout(()=>{
      if(!Object.keys(this.data.loginUserInfosData).length){
       this.fetchLoginUserInfosData()
      }
    },500)
    console.log(EMClient);
    this.setData({
      sdkVersion:EMClient.version
    })
  },
  async fetchLoginUserInfosData() {
    try {
      const res = await fetchUserInfoWithLoginId()
      console.log('>>>>>登录用户获取成功',res);
      
      this.getLoginUserInfos(res)
    } catch (error) {
      console.log(error);
      wx.showToast({
        title: '登录用户属性获取失败',
      })
    }
  },
  copyUserId(){
    wx.setClipboardData({
      data: this.data.loginEMUserId,
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
        title: '退出登录',
        message: `确定要退出“${this.data.loginUserInfosData?.nickname || this.data.loginEMUserId}”该账号？`,
      })
      .then(() => {
        // on confirm
        this.handleEMLogout()
      })
      .catch(() => {
        // on cancel
      });
  },
  handleEMLogout(){
    EMClient.close()
    wx.reLaunch({
      url: '/pages/login/index',
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
    this.getTabBar().init();
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
  }

})