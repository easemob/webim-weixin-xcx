import {
	EaseSDK,
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
const emPresence = () => {
	// 发布自定义在线状态
	const publishPresence = (presenceMsg) => {
		return new Promise((resolve, reject) => {
			EMClient.publishPresence({
					description: presenceMsg,

				})
				.then((res) => {
					resolve(res)
				})
				.catch((error) => {
					reject(error);
				});
		});
	};
	// 订阅用户的在线状态
	const subscribePresence = (userList) => {
		let friendList = [];
		friendList = Object.assign([], userList);
		return new Promise((resolve, reject) => {
			if (friendList.length && friendList.length < 99) {
				EMClient.subscribePresence({
						usernames: friendList,
						expiry: 7 * 24 * 3600
					})
					.then((res) => {
						const {
							data
						} = res;
						resolve(data.result);
					})
					.catch((error) => {
						reject(error);
					});
			} else {
				let newArr = _chunkArr(friendList, 99);
				for (let i = 0; i < newArr.length; i++) {
					EMClient.subscribePresence({
						usernames: newArr[i],
						expiry: 7 * 24 * 3600
					} )
						.then((res) => {
							const {
								data
							} = res;
							resolve(data.result);
						})
						.catch((error) => {
							reject(error);
						});
				}
			}
		});
	};
	// 获取用户的当前在线状态
	const getPresenceStatus = (userList) => {
		let friendList = [];
		friendList = Object.assign([], userList);
		return new Promise((resolve, reject) => {
			if (friendList.length && friendList.length < 99) {
				EMClient.getPresenceStatus({
						usernames: friendList
					})
					.then((res) => {
						const {
							data
						} = res;
						resolve(data.result);
					})
					.catch((error) => {
						reject(error);
					});
			} else {
				let newArr = _chunkArr(friendList, 99);
				for (let i = 0; i < newArr.length; i++) {
					EMClient.getPresenceStatus({
							usernames: newArr[i]
						})
						.then((res) => {
							const {
								data
							} = res;
							resolve(data.result);
						})
						.catch((error) => {
							reject(error);
						});
				}
			}
		});
	};
	// 取消订阅
	const unsubscribePresence = (userName) => {
		return new Promise((resolve, reject) => {
			EMClient.unsubscribePresence({
					usernames: [userName]
	
				})
				.then((res) => {
					console.log("取消订阅成功")
					resolve(res)
				})
				.catch((error) => {
					reject(error);
				});
		});
	};
	return {
		publishPresence,
		subscribePresence,
		getPresenceStatus,
		unsubscribePresence
	};
};

export default emPresence;