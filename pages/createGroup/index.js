import {
  createStoreBindings
} from 'mobx-miniprogram-bindings';
import {
  store
} from '../../store/index';
import emGroups from '../../EaseIM/emApis/emGroups'
import { EMClient } from '../../EaseIM/index';
const {
  createNewGroup
} = emGroups()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkedValues: [], // 存储选中的复选框值
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.store = createStoreBindings(this, {
      store,
      fields: ['loginUserInfos','contactsList', 'contactsUserInfos', 'enrichedContactsList'],
    });
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
  cancelCreateNewGroup() {
    this.setData({
      checkedValues: []
    })
  },
  async actionCreateNewGroup() {
    console.log(this.data.checkedValues);
    const createGroupParams = {
      groupname: "群聊", //群组名称。
      desc: "这是一个私有群", //群组描述。
      members: [], //群成员的用户 ID 组成的数组，不包含群主的用户 ID。
      public: false, //是否为公开群
      allowinvites: false, //是否允许普通群成员邀请人入群
      inviteNeedConfirm: false, //邀请加群时是否需要受邀用户确认
      maxusers: 200, //群组最大成员数，默认为 200。
    }
    if(this.data.checkedValues.length){
      createGroupParams.members = this.data.checkedValues
      createGroupParams.groupname =  this.buildGroupName(this.data.checkedValues)
    }
    console.log('>>>>>群组构建参数已完成',createGroupParams);
    try {
     const res =  await createNewGroup(createGroupParams)
      wx.showToast({
        title: `群组已创建`,
      })
      wx.redirectTo({
        url: `/pages/groupDetail/index?groupId=${res.groupid}&groupRole=owner`,  // 跳转到新的页面
      });
    } catch (error) {
      console.error(error);
     wx.showToast({
       title: '群组创建失败',
     })
    }
  },
  buildGroupName(memberList){
    let result = '';
    // if (memberList.length >= 2) {
    //   // 取前3个元素
    //   const topValues = memberList.slice(0, 3);
    //   // 以“，”拼接成字符串
    //   result = `群聊（${topValues.join(', ')}）`;
    // }else{
    //   result = '群聊'
    // }
    if(this.data.loginUserInfos.nickname){
      result = `【${this.data.loginUserInfos.nickname}】的群聊`
    }else{
      result = `【${EMClient.user}】的群聊`
    }
    console.log('result',result);
    return result
  },
})