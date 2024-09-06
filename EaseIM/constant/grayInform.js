/**
 * 此常量非SDK内置，而是基于SDK回调事件演化而来，
 * 用于在聊天界面能够展示灰色小字通知
 * 如不需要，可以不做引入。
 * */
//灰色通知好友类型
export const GRAY_INFORM_TEMPLATE_NAME = {
  USER: '[XXX]',
  GROUP_USER_FROM: '[AXX]',
  GROUP_USER_TO: '[BXX]',
  GROUP_ID: '[X_GROUP_ID_X]',
};
export const GRAY_INFORM_TYPE_SINGLE = {
  CONTACT_ADDED: 'contactAdded',
  CONTACT_AGREED: 'contactAgreed',
};
//灰色通知对应好友文本展示，[XXX]用于替换为实际用户ID或昵称
export const GRAY_INFORM_MAP_SINGLE_TEXT = {
  [GRAY_INFORM_TYPE_SINGLE.CONTACT_ADDED]: `你已添加了${GRAY_INFORM_TEMPLATE_NAME.USER}，打个招呼吧！`,
  [GRAY_INFORM_TYPE_SINGLE.CONTACT_AGREED]: `${GRAY_INFORM_TEMPLATE_NAME.USER}通过了你的好友申请，打个招呼吧！`,
};
//灰色通知群聊
export const GRAY_INFORM_TYPE_GROUP = {
  MEMBER_PRESENCE: 'memberPresence', // 有用户加入群组。除了新成员，其他群成员会收到该回调。
  MEMBER_ABSENCE: 'memberAbsence', //群成员主动退出群组
  CHANGE_OWNER: 'changeOwner', // 转让群组。原群主和新群主会收到该回调。
  MEMBER_REMOVE: 'removeMember', // 用户被移出群组。被踢出群组的成员会收到该回调。
};

export const GRAY_INFORM_MAP_GROUP_TEXT = {
  [GRAY_INFORM_TYPE_GROUP.MEMBER_PRESENCE]: `${GRAY_INFORM_TEMPLATE_NAME.GROUP_USER_FROM}加入了群组`,
  [GRAY_INFORM_TYPE_GROUP.MEMBER_ABSENCE]: `${GRAY_INFORM_TEMPLATE_NAME.GROUP_USER_FROM}退出了群组`,
  //   [GRAY_INFORM_TYPE_GROUP.CHANGE_OWNER]: `${GRAY_INFORM_TEMPLATE_NAME.GROUP_USER_FROM}移交群主至${GRAY_INFORM_TEMPLATE_NAME.GROUP_USER_TO}`,
  [GRAY_INFORM_TYPE_GROUP.CHANGE_OWNER]: `${GRAY_INFORM_TEMPLATE_NAME.GROUP_USER_FROM}将群主移交`,
  [GRAY_INFORM_TYPE_GROUP.MEMBER_REMOVE]: `您已被移出${GRAY_INFORM_TEMPLATE_NAME.GROUP_ID}该群组！`,
};
