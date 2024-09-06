import emGroups from '../../../EaseIM/emApis/emGroups'
import emUserInfos from '../../../EaseIM/emApis/emUserInfos'
const {
  removeGroupMembers
} = emGroups()
const {
  fetchOtherInfoFromServer
} = emUserInfos()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupId: '',
    checkedValues: [], // 存储选中的复选框值
    groupMemberList: [],
    defaultMemberList: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const memberList = JSON.parse(options.memberList)
    this.setData({
      groupId: options.groupId,
      defaultMemberList: memberList
    })
    this.fetchGroupMemberUserInfos(memberList)
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
  async fetchGroupMemberUserInfos(userIds) {
    if (userIds.length === 0) return;
    let memberList = []
    try {
      console.log('>>>>>执行请求用户属性接口', userIds);
      const res = await fetchOtherInfoFromServer(userIds);
      console.log('>>>>>用户属性获取完毕', res);
      userIds.forEach(member => {
        const userId = member;
        const userInfo = res[userId];
        // if (userInfo) {
        //   console.log('>>>>往实际数据中插入用户属性');
        //   userInfo = userInfo;
        // }
        memberList.push({
          userId,
          ...userInfo
        })
      });

      console.log('memberList', memberList);
      this.setData({
        groupMemberList: memberList
      })
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  },
  difference(arr1, arr2) {
    return arr1.filter(item => !arr2.includes(item)).concat(arr2.filter(item => !arr1.includes(item)));
  },
  cancelRemoveGroupMember() {
    this.setData({
      checkedValues: []
    })
  },
  async handleRemoveUserFromGroup() {
    if (this.data.checkedValues.length<=0) {
      wx.showToast({
        title: '暂未选中用户成员',
        icon: "none"
      })
      return
    }
    try {
      await removeGroupMembers(this.data.groupId, this.data.checkedValues)
      wx.showToast({
        title: '成员已移除',
        icon: "none"
      })
      //更新群组员页面的数据
      const pages = getCurrentPages(); // 获取页面栈
      const prevPage = pages[pages.length - 2]; // 获取上一页面的实例对象
      if (prevPage) {
        prevPage?.initFetchGroupMemberListData()
      }
      setTimeout(() => {
        wx.navigateBack()
      }, 300)
    } catch (error) {
      wx.showToast({
        title: '移除失败',
        icon: "none"
      })
    }
  }
})