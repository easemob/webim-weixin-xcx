import emGroups from '../../EaseIM/emApis/emGroups'
const {
  fetchJoinedGroupListFromServer
} = emGroups()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    joinGroupListLoading: false,
    joinedGroupList: [],
    isLast: false,
    pageNum: 0,
    pageSize: 20,
    searchStatus: false,
    searchGroupListValue: '',
    searchSourceData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.callFetchJoinGroupListData()
    console.log('groupList onload');
  },
  onClickLeft() {
    wx.navigateBack()
  },
  async callFetchJoinGroupListData() {
    this.setData({
      loading: false,
      joinGroupListLoading: true
    })

    const pageSize = this.data.pageSize
    const pageNum = this.data.pageNum
    try {
      const res = await fetchJoinedGroupListFromServer(pageNum, pageSize)
      if (res?.entities?.length) {
        this.setData({
          joinGroupListLoading: false,
          joinedGroupList: [...this.data.joinedGroupList, ...res?.entities],
          pageNum: pageNum + 1
        })
      } else {
        console.log('>>>>已拉取至最后一页');
        this.setData({
          joinGroupListLoading: false,
          isLast: true
        })
        return
      }
    } catch (error) {
      console.error(error);
      wx.showToast({
        title: '群组列表请求失败',
      })
    }
  },
  onJoinGroupListScrolltolower() {
    if (this.data.joinGroupListLoading || this.data.isLast) return;
    console.log('>>>>>执行加载更多群组');
    this.callFetchJoinGroupListData()
  },
  /* Search */
  onSearch() {
    console.log('>>>>>搜索群组');
  },
  onSearchFocus() {
    console.log('>>>>>搜索框聚焦');
    this.setData({
      searchStatus: true,
      searchSourceData: this.data.joinedGroupList
    })
  },
  onSearchCancel() {
    this.setData({
      searchStatus: false
    })
  },
  onActionSearchInputValue() {
    const searchResult = this.data.joinedGroupList.filter(groupItem => {
      const {
        groupId,
        groupName
      } = groupItem;
      const searchValue = this.data.searchGroupListValue;
      const matchesId = groupId?.includes(searchValue);
      const matchesGroupName = groupName.includes(searchValue);
      if (matchesId || matchesGroupName) {
        return true
      } else {
        return false;
      }
    });
    this.setData({
      searchSourceData: searchResult
    })
  },
  entryCreateGroupPage(){
    wx.navigateTo({
      url: '/pages/createGroup/index',
    })
  },
  entryGroupDetailPage(event){
    const {currentTarget:{dataset}} = event 
    const { groupid,grouprole } = dataset
    console.log('event',event);
    wx.navigateTo({
      url: `/pages/groupDetail/index?groupId=${groupid}&groupRole=${grouprole}`,
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },
})