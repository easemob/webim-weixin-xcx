/* read ack、channel ack、recall ack*/
import { EaseSDK, EMClient } from '../index';
const emSendReadAck = () => {
  // 处理未读消息回执
  const sendReadAckMsg = (receivemsg) => {
    const { chatType, from, id } = receivemsg;
    let option = {
      type: 'read', // 消息是否已读。
      chatType: chatType, // 会话类型，这里为单聊。
      to: from, // 消息接收方的用户 ID。
      id: id, // 需要发送已读回执的消息 ID。
    };
    let msg = EaseSDK.message.create(option);
    EMClient.send(msg);
  };
  //发送撤回ack
  const sendRecallAckMsg = (recallSourceMsg) => {
    const { chatType, to, id } = recallSourceMsg;
    let option = {
      // 要撤回消息的消息 ID。
      mid: id,
      // 消息接收方：单聊为对方用户 ID，群聊和聊天室分别为群组 ID 和聊天室 ID。
      to: to,
      // 会话类型：单聊、群聊和聊天室分别为 `singleChat`、`groupChat` 和 `chatRoom`。
      chatType: chatType,
    };
    return new Promise((resolve, reject) => {
      EMClient.recallMessage(option)
        .then((res) => {
          console.log('recall success', res);
          resolve(res);
        })
        .catch((error) => {
          // 消息撤回失败，原因可能是超过了撤销时限(超过 2 分钟)。
          console.log('fail', error);
          reject(error);
        });
    });
  };
  return {
    sendReadAckMsg,
    sendRecallAckMsg,
  };
};

export default emSendReadAck;
