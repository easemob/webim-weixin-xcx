import {
  EMClient
} from '../../EaseIM/index'
import emGroups from '../../EaseIM/emApis/emGroups'
import emUserInfos from '../../EaseIM/emApis/emUserInfos'
const {
  getGroupMembersFromServer
} = emGroups()
const {
  fetchOtherInfoFromServer
} = emUserInfos()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mockGroupMember: new Array(500).fill(1).map((_, i) => `user${i + 1}`),
    groupId: "",
    groupRole: "",
    groupMemberCount: 1,
    groupMemberList: [],
    isLast: false,
    pageNum: 1,
    pageSize: 100,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const {
      groupId,
      groupRole,
      groupMemberCount
    } = options
    if (groupId) {
      this.setData({
        groupId,
        groupRole,
        groupMemberCount
      })
      this.fetchGroupMemberListData(groupId)
    }
  },
  onClickLeft() {
    wx.navigateBack()
  },
  async fetchGroupMemberListData(groupId) {
    const pageNum = this.data.pageNum
    const pageSize = this.data.pageSize
    try {
      const res = await getGroupMembersFromServer(groupId || this.data.groupId, pageNum, pageSize)
      if (res?.length) {
        this.setData({
          groupMemberList: [...this.data.groupMemberList, ...res],
          pageNum: pageNum + 1
        })
        this.fetchGroupMemberUserInfos(res)
      } else {
        console.log('>>>>已拉取至最后一页');
        this.setData({
          isLast: true
        })
        return
      }
      console.log(res);
    } catch (error) {
      wx.showToast({
        title: '群组成员获取失败',
      })
    }
  },
  async fetchGroupMemberUserInfos(data) {
    const userIds = data.flatMap(item => item.member || item.owner);
    if (userIds.length === 0) return;
    let memberList = this.data.groupMemberList
    try {
      console.log('>>>>>执行请求用户属性接口', userIds);
      const res = await fetchOtherInfoFromServer(userIds);
      console.log('>>>>>用户属性获取完毕', res);
      memberList.forEach(member => {
        const userId = member.member || member.owner;
        const userInfo = res[userId];
        if (userInfo) {
          console.log('>>>>往实际数据中插入用户属性');
          member.userInfo = userInfo;
        }
      });

      console.log('memberList', memberList);
      this.setData({
        groupMemberList: memberList
      })
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  },
  initFetchGroupMemberListData() {
    console.log('initFetchGroupMemberListData');
    const pageNum = 1
    const pageSize = 100
    getGroupMembersFromServer(this.data.groupId, pageNum, pageSize).then(res => {
      console.log('>>>>>接口请求完成', res);
      if (res?.length) {
        this.setData({
          groupMemberList: [...res]
        })
        this.fetchGroupMemberUserInfos(res)
      }
    }).catch(error => {
      console.log('>>>>请求失败', error);
    })
  },
  onGroupMemberListScrolltolower() {
    console.log('>>>>>滚动置底');
    if (this.data.isLast) return;
    console.log('执行加载更多成员列表');
    this.fetchGroupMemberListData()
  },
  entryAddGroupMemberPage() {
    const userIds = this.data.groupMemberList.flatMap(item => item.member || item.owner);
    wx.navigateTo({
      url: `./addGroupMember/index?groupId=${this.data.groupId}&memberList=${JSON.stringify(userIds)}`,
    })
  },
  entryDeleteGroupMemberPage() {
    const userIds = this.data.groupMemberList.flatMap(item => item.member || item.owner).filter(userId => userId !== EMClient.user);
    wx.navigateTo({
      url: `./deleteGroupMember/index?groupId=${this.data.groupId}&memberList=${JSON.stringify(userIds)}`,
    })
  }
})