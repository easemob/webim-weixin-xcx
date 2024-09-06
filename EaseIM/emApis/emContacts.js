import { EMClient } from '../index';
const emContacts = () => {
  const fetchContactsListFromServer = () => {
    return new Promise((resolve, reject) => {
      EMClient.getAllContacts()
        .then((res) => {
          const { data } = res;
          console.log('>>>>>获取全部好友列表');
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  const removeContactFromServer = (contactId) => {
    if (contactId) {
      return new Promise((resolve, reject) => {
        EMClient.deleteContact(contactId)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    }
  };
  const addContactFromServer = (contactId, applyMsg = '加个好友吧') => {
    if (contactId) {
      return new Promise((resolve, reject) => {
        EMClient.addContact(contactId, applyMsg)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    }
  };

  const acceptContactInvite = (contactId) => {
    if (contactId) {
      return new Promise((resolve, reject) => {
        EMClient.acceptContactInvite(contactId)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
      //   EMClient.acceptContactInvite(contactId);
    }
  };
  const declineContactInvite = (contactId) => {
    if (contactId) {
      return new Promise((resolve,reject)=>{
        EMClient.declineContactInvite(contactId).then(res=>{
          resolve(res)
        }).catch(error=>{
          reject(error)
        })
      })

    }
  };
  const getBlocklistFromServer = () => {
    return new Promise((resolve, reject) => {
      EMClient.getBlocklist()
        .then((res) => {
          const { data } = res;
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  const addUsersToBlocklist = (userList) => {
    return new Promise((resolve, reject) => {
      EMClient.addUsersToBlocklist({ name: [...userList] })
        .then((res) => {
          const { data } = res;
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  const removeUsersFromBlocklist = (userList) => {
    return new Promise((resolve, reject) => {
      EMClient.removeUserFromBlocklist({ name: [...userList] })
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  const setContactRemarkFromServer = (contactId, remark) => {
    return new Promise((resolve, reject) => {
      EMClient.setContactRemark({
        userId: contactId,
        remark,
      })
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  return {
    fetchContactsListFromServer,
    removeContactFromServer,
    addContactFromServer,
    acceptContactInvite,
    declineContactInvite,
    getBlocklistFromServer,
    addUsersToBlocklist,
    removeUsersFromBlocklist,
    setContactRemarkFromServer,
  };
};
export default emContacts;
