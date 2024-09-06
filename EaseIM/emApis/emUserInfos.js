import {
  EMClient
} from '../index';
const _chunkArr = (oldArr, num) => {
  oldArr.sort((a, b) => {
    return a - b;
  });
  if (oldArr.length <= 0) return oldArr;
  let newArr = [];
  if (Math.ceil(oldArr.length / num) <= 1) {
    newArr.push(oldArr);
    return newArr;
  }
  for (let i = 0; i < oldArr.length; i = i + num) {
    newArr.push(oldArr.slice(i, i + num));
  }
  return newArr;
};

const emUserInofs = () => {
  const fetchUserInfoWithLoginId = () => {
    const userId = EMClient.user;
    return new Promise((resolve, reject) => {
      if (userId) {
        EMClient.fetchUserInfoById(userId)
          .then((res) => {
            const {
              data
            } = res;
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      }
    });
  };
  const fetchOtherInfoFromServer = (userList) => {
    let friendList = [];
    friendList = Object.assign([], userList);
    return new Promise((resolve, reject) => {
      if (friendList.length && friendList.length < 99) {
        EMClient.fetchUserInfoById(friendList)
          .then((res) => {
            const {
              data
            } = res;
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        let newArr = _chunkArr(friendList, 99);
        for (let i = 0; i < newArr.length; i++) {
          EMClient.fetchUserInfoById(newArr[i])
            .then((res) => {
              const {
                data
              } = res;
              resolve(data);
            })
            .catch((error) => {
              reject(error);
            });
        }
      }
    });
  };
  const updateUserInfosFromServer = (params) => {
    return new Promise((resolve, reject) => {
      EMClient.updateUserInfo({
          ...params
        })
        .then((res) => {
          const {
            data
          } = res;
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  const updateLoginUserInfos = (params) => {
    return new Promise((resolve, reject) => {
      EMClient.updateUserInfo({
        ...params
      }).then((res) => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
  return {
    fetchUserInfoWithLoginId,
    fetchOtherInfoFromServer,
    updateUserInfosFromServer,
    updateLoginUserInfos
  };
};
export default emUserInofs;