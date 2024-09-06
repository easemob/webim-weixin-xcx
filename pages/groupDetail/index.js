import emGroups from '../../EaseIM/emApis/emGroups'
const {
  getGroupInfosFromServer,
  destroyGroupFromServer,
  leaveGroupFromServer
} = emGroups()
import Dialog from '@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupId: "",
    groupRole: "",
    groupInfos: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const {
      groupId,
      groupRole
    } = options
    console.log('groupId', groupId);
    this.setData({
      groupId,
      groupRole
    })
  },
  onShow(){
    if (this.data.groupId) {
      this.fetchGroupInfosData(this.data.groupId)
    }
  },
  onClickLeft() {
    const pages = getCurrentPages(); // 获取页面栈
    const prevPage = pages[pages.length - 2]; // 获取上一页面的实例对象
    console.log('prevPage', prevPage.data.joinedGroupList);
    // 如果上一页存在加入的群组列表，且群名不一致修改群组列表中的群组名称。
    if (prevPage.data.joinedGroupList.length && prevPage.data.joinedGroupList.some(item => item.groupId === this.data.groupId)) {
      let joinedGroupList = prevPage.data.joinedGroupList
      const _index = joinedGroupList.findIndex(item => item.groupId === this.data.groupId)
      if (joinedGroupList[_index].groupName != this.data.groupInfos.name) {
        joinedGroupList[_index].groupName = this.data.groupInfos.name
        prevPage.setData({
          joinedGroupList
        })
      }
    }
    wx.navigateBack()
  },
  copyGroupId() {
    wx.setClipboardData({
      data: this.data.groupId,
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
  async fetchGroupInfosData(groupId) {
    try {
      const res = await getGroupInfosFromServer(groupId)
      console.log('res', res);
      if (res?.length) {
        this.setData({
          groupInfos: {
            ...res[0]
          }
        })
      }
    } catch (error) {
      wx.showToast({
        title: '群组详情获取失败',
      })
    }
  },
  onEntryChatPage() {
    const {
      groupId,
      groupInfos
    } = this.data
    const conversationParams = {
      title: '',
      avatarurl: ''
    }
    conversationParams.title = groupInfos.name || groupId
    wx.navigateTo({
      url: `/pages/chat/index?conversationId=${groupId}&conversationType=groupChat&conversationParams=${JSON.stringify(conversationParams)}`,
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  entryGroupMemberListPage() {
    wx.navigateTo({
      url: `/pages/groupMemberList/index?groupId=${this.data.groupId}&groupRole=${this.data.groupRole}&groupMemberCount=${this.data.groupInfos?.affiliations_count}`,
    })
  },
  entryGroupEditGroupInfosPage(event) {
    console.log('event', event);
    const {
      currentTarget: {
        dataset
      }
    } = event
    const {
      editGroupinfosType
    } = dataset
    if (this.data.groupRole !== 'owner') return
    let defaultValue = ''
    if (editGroupinfosType === 'groupName') {
      defaultValue = this.data.groupInfos?.name
    }
    if (editGroupinfosType === 'groupDesc') {
      defaultValue = this.data.groupInfos?.description
    }
    wx.navigateTo({
      url: `/pages/editGroupInfos/index?groupId=${this.data.groupId}&editGroupinfosType=${editGroupinfosType || 'groupName'}&defaultValue=${defaultValue || ''}`,
    })
  },
  onAleartGroupDialog(event) {
    console.log('event', event);
    const {
      currentTarget: {
        dataset
      }
    } = event
    const {
      handleType
    } = dataset
    let messageContent = ''
    if (handleType === 'destroygroup') {
      messageContent = `确定解散“${this.data.groupInfos?.name}”该群？`
    }
    if (handleType === 'quitgroup') {
      messageContent = `确定退出“${this.data.groupInfos?.name}”该群？`
    }
    Dialog.confirm({
        title: '群组操作',
        message: messageContent,
      })
      .then(() => {
        // on confirm
        if (handleType === 'destroygroup') {
          this.handleDestroyGroup()
        }
        if (handleType === 'quitgroup') {
          this.handleQuitGroup()
        }
      })
      .catch(() => {
        // on cancel
      });
  },
  async handleDestroyGroup() {
    try {
      await destroyGroupFromServer(this.data.groupId)
      wx.showToast({
        title: '群组已解散',
      })
      this.updatePrePageGroupList(this.data.groupId)
      setTimeout(() => {
        wx.navigateBack()
      }, 1000)
    } catch (error) {
      wx.showToast({
        title: '群组解散失败',
      })
    }
  },
  async handleQuitGroup() {
    try {
      await leaveGroupFromServer(this.data.groupId)
      wx.showToast({
        title: '已离开群组',
      })
      this.updatePrePageGroupList(this.data.groupId)
      setTimeout(() => {
        wx.navigateBack()
      }, 1000)
    } catch (error) {
      wx.showToast({
        title: '离开失败',
      })
    }
  },
  updatePrePageGroupList(groupId) {
    const pages = getCurrentPages(); // 获取页面栈
    const prevPage = pages[pages.length - 2]; // 获取上一页面的实例对象
    console.log('prevPage', prevPage.data.joinedGroupList);
    //此处逻辑为执行了退出或者删除群组后，直接本地更新群组列表页面的数据。
    if (prevPage?.data?.joinedGroupList?.length) {
      const newJoinedGroupList = prevPage.data.joinedGroupList.filter(groupItem => groupItem.groupId !== groupId)
      prevPage.setData({
        joinedGroupList: newJoinedGroupList
      })
    }

  }
})