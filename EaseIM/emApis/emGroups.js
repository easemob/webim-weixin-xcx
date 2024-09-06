import { EMClient } from '../index';
const emGroups = () => {
  const fetchJoinedGroupListFromServer = (pageNum = 0, pageSize = 20) => {
    return new Promise((resolve, reject) => {
      console.log('>>>>开始获取加入的群组列表');
      EMClient.getJoinedGroups({
        pageNum,
        pageSize,
        needAffiliations: true,
        needRole: true,
      })
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  const createNewGroup = (params) => {
    return new Promise((resolve, reject) => {
      console.log('>>>>开始创建群组');
      EMClient.createGroup({ data: { ...params } })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  const getGroupInfosFromServer = (groupId) => {
    return new Promise((resolve, reject) => {
      EMClient.getGroupInfo({
        groupId,
      })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  const getGroupMembersFromServer = (groupId,pageNum=1,pageSize=100) => {
    //暂且仅取前100个群成员
    // const pageNum = 1,
    //   pageSize = 100;
    return new Promise((resolve, reject) => {
      EMClient.listGroupMembers({
        pageNum: pageNum,
        pageSize: pageSize,
        groupId,
      })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  const inviteUsersToGroup = (groupId, memberIdList) => {
    return new Promise((resolve, reject) => {
      EMClient.inviteUsersToGroup({
        groupId: groupId,
        users: memberIdList,
      })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  const leaveGroupFromServer = (groupId) => {
    return new Promise((resolve, reject) => {
      EMClient.leaveGroup({ groupId })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  const destroyGroupFromServer = (groupId) => {
    return new Promise((resolve, reject) => {
      EMClient.destroyGroup({ groupId })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  const acceptGroupInvite = (invitee, groupId) => {
    return new Promise((resolve, reject) => {
      EMClient.acceptGroupInvite({
        groupId: groupId,
        invitee: invitee,
      })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  const rejectGroupInvite = (invitee, groupId) => {
    return new Promise((resolve, reject) => {
      EMClient.rejectGroupInvite({
        groupId: groupId,
        invitee: invitee,
      })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  const joinPublicGroup = (groupId) => {
    return new Promise((resolve, reject) => {
      EMClient.joinGroup({ groupId, message: 'I want to join the group' })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  const modifyGroupInfo = (groupId, params) => {
    return new Promise((resolve, reject) => {
      EMClient.modifyGroup({
        groupId,
        ...params,
      })
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  const removeGroupMembers = (groupId, users) => {
    return new Promise((resolve, reject) => {
      EMClient.removeGroupMembers({
        groupId,
        users,
      })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  const changeGroupOwner = (groupId, newOwner) => {
    return new Promise((resolve, reject) => {
      EMClient.changeGroupOwner({ groupId, newOwner })
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  //分页获取群组列表
  const listGroupMembersFromServer = (params) => {
    const { pageNum = 1, pageSize = 100, groupId } = params;
    return new Promise((resolve, reject) => {
      EMClient.listGroupMembers({
        ...params,
      })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  /* 群组属性相关 */
  //获取单个用户属性
  const getSingleGroupAttributesFromServer = (groupId, userId) => {
    let options = {
      groupId,
      userId,
    };
    return new Promise((resolve, reject) => {
      EMClient.getGroupMemberAttributes({ ...options })
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  //设置单个群组属性
  const setSingleGroupAttributesFromServer = (params) => {
    const { groupId, userId, memberAttributes } = params;
    return new Promise((resolve, reject) => {
      EMClient.setGroupMemberAttributes({
        groupId,
        userId,
        memberAttributes: { ...memberAttributes },
      })
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  //根据key获取多个群组成员自定义属性
  const getMultiGroupAttributesFromServer = (params) => {
    const { groupId, userIds, keys } = params;
    return new Promise((resolve, reject) => {
      EMClient.getGroupMembersAttributes({
        groupId,
        userIds,
        keys,
      })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  return {
    fetchJoinedGroupListFromServer,
    createNewGroup,
    getGroupInfosFromServer,
    getGroupMembersFromServer,
    inviteUsersToGroup,
    leaveGroupFromServer,
    destroyGroupFromServer,
    acceptGroupInvite,
    rejectGroupInvite,
    joinPublicGroup,
    modifyGroupInfo,
    changeGroupOwner,
    removeGroupMembers,
    listGroupMembersFromServer,
    getSingleGroupAttributesFromServer,
    getMultiGroupAttributesFromServer,
    setSingleGroupAttributesFromServer,
  };
};

export default emGroups;
