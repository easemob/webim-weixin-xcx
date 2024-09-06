import { EaseSDK, EMClient } from '../index';
import { MESSAGE_TYPE } from '../constant/index';
const emMessages = () => {
  const reportMessages = (params) => {
    const { reportType, reportReason, messageId } = params;
    return new Promise((resolve, reject) => {
      EMClient.reportMessage({
        reportType: reportType, // 举报类型
        reportReason: reportReason, // 举报原因。
        messageId: messageId, // 上报消息id
      })
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  const fetchHistoryMessagesFromServer = (params) => {
    const { targetId, cursor, chatType } = params;
    return new Promise((resolve, reject) => {
      let options = {
        // 对方的用户 ID 或者群组 ID 或聊天室 ID。
        targetId: targetId,
        // 每页期望获取的消息条数。取值范围为 [1,50]，默认值为 20。
        pageSize: 50,
        // 查询的起始消息 ID。若该参数设置为 `-1`、`null` 或空字符串，从最新消息开始。
        cursor: cursor || -1,
        // 会话类型：（默认） `singleChat`：单聊；`groupChat`：群聊。
        chatType: chatType,
        // 消息搜索方向：（默认）`up`：按服务器收到消息的时间的逆序获取；`down`：按服务器收到消息的时间的正序获取。
        searchDirection: 'up',
      };
      EMClient.getHistoryMessages(options)
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          // 获取失败。
          reject(e);
        });
    });
  };
  const sendCommandMessages = (messageBody) => {
    return new Promise((resolve, reject) => {
      console.log('messageBody', messageBody);
      const message = EaseSDK.message.create(messageBody);
      console.log('>>>>构建的命令消息msg', message);
      EMClient.send(message)
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    });
  };
  //修改展示类消息【暂只支持文本消息】
  const modifyDisplayMessages = (messageBody) => {
    const { msg, to, id, chatType } = messageBody;
    const textMessage = EaseSDK.message.create({
      type: MESSAGE_TYPE.TEXT,
      msg: msg,
      to: to,
      chatType: chatType,
    });
    return new Promise((resolve, reject) => {
      EMClient.modifyMessage({ messageId: id, modifiedMessage: textMessage })
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          console.log(e);
          reject(e);
        });
    });
  };
  return {
    reportMessages,
    fetchHistoryMessagesFromServer,
    sendCommandMessages,
    modifyDisplayMessages,
  };
};
export default emMessages;
