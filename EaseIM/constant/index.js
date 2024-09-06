import {
  GRAY_INFORM_TYPE_SINGLE,
  GRAY_INFORM_MAP_SINGLE_TEXT,
  GRAY_INFORM_TYPE_GROUP,
  GRAY_INFORM_MAP_GROUP_TEXT,
  GRAY_INFORM_TEMPLATE_NAME,
} from './grayInform';
/* 灰色通知类型 */
export {
  GRAY_INFORM_TYPE_SINGLE,
  GRAY_INFORM_MAP_SINGLE_TEXT,
  GRAY_INFORM_TYPE_GROUP,
  GRAY_INFORM_MAP_GROUP_TEXT,
  GRAY_INFORM_TEMPLATE_NAME,
};
export const CHAT_TYPE = {
  SINGLE_CHAT: 'singleChat',
  GROUP_CHAT: 'groupChat',
};
export const INFORM_TYPE = {
  CONTACTS: 'contacts',
  GROUPS: 'groups',
};
export const HANDLER_EVENT_NAME = {
  CONNECT_EVENT: 'connectEvent',
  MESSAGES_EVENT: 'messagesEvent',
  CONTACTS_EVENT: 'contactsEvent',
  GROUP_EVENT: 'groupEvent',
  ERROR_EVENT: 'errorEvent',
  PRESENCE_EVENT: 'presenceEvent',
};

export const CONNECT_CALLBACK_TYPE = {
  CONNECT_CALLBACK: 'connected',
  DISCONNECT_CALLBACK: 'disconnected',
  RECONNECTING_CALLBACK: 'reconnecting',
  ERROR_CALLBACK: 'onerror',
};
//定义消息状态
export const MESSAGE_STATUS = {
  READ: 'read',
  UNREAD: 'unread',
  DELETE: 'deleted',
  PENDING: 'pending',
  RECALL: 'recalled',
  FAIL: 'fail',
};
export const MESSAGE_TYPE = {
  IMAGE: 'img',
  TEXT: 'txt',
  LOCATION: 'loc',
  VIDEO: 'video',
  AUDIO: 'audio',
  EMOJI: 'emoji',
  FILE: 'file',
  CUSTOM: 'custom',
  CMD: 'cmd',
  GRAY_INFORM: 'gray_inform', //此类型非SDK正式类型，此类型为自定义的本地插入用于灰色通知类型。
};
export const SESSION_MESSAGE_TYPE = {
  [MESSAGE_TYPE.IMAGE]: '[图片]',
  [MESSAGE_TYPE.FILE]: '[文件]',
  [MESSAGE_TYPE.AUDIO]: '[语音]',
  [MESSAGE_TYPE.LOCATION]: '[位置]',
  [MESSAGE_TYPE.VIDEO]: '[视频]',
};
export const CUSTOM_EVENT_NAME = {
  USER_CARD: 'userCard',
};
export const CUSTOM_TYPE = {
  [CUSTOM_EVENT_NAME.USER_CARD]: '个人名片',
};

export const EMOJI = {
  path: '@/static/images/faces',
  map: {
    '[):]': 'ee_1.png',
    '[:D]': 'ee_2.png',
    '[;)]': 'ee_3.png',
    '[:-o]': 'ee_4.png',
    '[:p]': 'ee_5.png',
    '[(H)]': 'ee_6.png',
    '[:@]': 'ee_7.png',
    '[:s]': 'ee_8.png',
    '[:$]': 'ee_9.png',
    '[:(]': 'ee_10.png',
    "[:'(]": 'ee_11.png',
    '[<o)]': 'ee_12.png',
    '[(a)]': 'ee_13.png',
    '[8o|]': 'ee_14.png',
    '[8-|]': 'ee_15.png',
    '[+o(]': 'ee_16.png',
    '[|-)]': 'ee_17.png',
    '[:|]': 'ee_18.png',
    '[*-)]': 'ee_19.png',
    '[:-#]': 'ee_20.png',
    '[^o)]': 'ee_21.png',
    '[:-*]': 'ee_22.png',
    '[8-)]': 'ee_23.png',
    '[del]': 'btn_del.png',
    '[(|)]': 'ee_24.png',
    '[(u)]': 'ee_25.png',
    '[(S)]': 'ee_26.png',
    '[(*)]': 'ee_27.png',
    '[(#)]': 'ee_28.png',
    '[(R)]': 'ee_29.png',
    '[({)]': 'ee_30.png',
    '[(})]': 'ee_31.png',
    '[(k)]': 'ee_32.png',
    '[(F)]': 'ee_33.png',
    '[(W)]': 'ee_34.png',
    '[(D)]': 'ee_35.png',
  },
};
export const EMOJIOBJ = {
  // 相对 emoji.js 路径
  path: '/static/images/faces',
  map1: {
    '[):]': 'ee_1.png',
    '[:D]': 'ee_2.png',
    '[;)]': 'ee_3.png',
    '[:-o]': 'ee_4.png',
    '[:p]': 'ee_5.png',
    '[(H)]': 'ee_6.png',
    '[:@]': 'ee_7.png',
  },
  map2: {
    '[:s]': 'ee_8.png',
    '[:$]': 'ee_9.png',
    '[:(]': 'ee_10.png',
    "[:'(]": 'ee_11.png',
    '[<o)]': 'ee_12.png',
    '[(a)]': 'ee_13.png',
    '[8o|]': 'ee_14.png',
  },
  map3: {
    '[8-|]': 'ee_15.png',
    '[+o(]': 'ee_16.png',
    '[|-)]': 'ee_17.png',
    '[:|]': 'ee_18.png',
    '[*-)]': 'ee_19.png',
    '[:-#]': 'ee_20.png',
    '[del]': 'del.png',
  },
  map4: {
    '[^o)]': 'ee_21.png',
    '[:-*]': 'ee_22.png',
    '[8-)]': 'ee_23.png',
    '[(|)]': 'ee_24.png',
    '[(u)]': 'ee_25.png',
    '[(S)]': 'ee_26.png',
    '[(*)]': 'ee_27.png',
  },
  map5: {
    '[(#)]': 'ee_28.png',
    '[(R)]': 'ee_29.png',
    '[({)]': 'ee_30.png',
    '[(})]': 'ee_31.png',
    '[(k)]': 'ee_32.png',
    '[(F)]': 'ee_33.png',
    '[(W)]': 'ee_34.png',
    '[(D)]': 'ee_35.png',
  },
  map6: {
    '[del]': 'del.png',
  },
};
export const GROUP_ROLE_TYPE_NAME = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member',
};
export const GROUP_ROLE_TYPE = {
  [GROUP_ROLE_TYPE_NAME.OWNER]: 0,
  [GROUP_ROLE_TYPE_NAME.ADMIN]: 1,
  [GROUP_ROLE_TYPE_NAME.MEMBER]: 2,
};
