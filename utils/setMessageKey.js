/* 用作根据消息类型处理对象中的key */
import { EMClient } from '../EaseIM/index'
import { CHAT_TYPE } from '../EaseIM/constant/index'
export default function (msgBody) {
    const loginUserId = EMClient.user
    const listKey =
        msgBody.chatType === CHAT_TYPE.SINGLE_CHAT
            ? msgBody.to === loginUserId
                ? msgBody.from
                : msgBody.to
            : msgBody.to

    return listKey
}
