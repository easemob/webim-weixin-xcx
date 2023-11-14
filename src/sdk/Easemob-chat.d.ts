export interface EasemobChatStatic {
	connection: typeof EasemobChat.Connection;
	message: typeof EasemobChat.Message;
	utils: EasemobChat.Utils;
	logger: EasemobChat.Logger;
	statusCode: EasemobChat.Code;
}
declare const easemobChat: EasemobChatStatic;
export default easemobChat;
export declare namespace EasemobChat {
	interface AsyncResult<T = any> {
		/** Status of the request. */
		type: Code;
		/** Data returned by successful request. */
		data?: T;
		/** Data returned by successful request. */
		entities?: T;
		/** The error message. */
		message?: string;
		[key: string]: any;
	}

	/** The user ID.  */
	type UserId = string;

	/** The group ID.  */
	type GroupId = string;

	interface CommonRequestResult {
		/** The result of request. */
		result: boolean;
		/** Action. */
		action: string;
		/** The reason of failure. */
		reason?: string;
		/** The user ID. */
		user: string;
		/** The group/chat room ID. */
		id: string;
	}

	interface Jid {
		appKey: string;
		clientResource: string;
		domain: string;
		name: string;
	}

	interface KVString {
		[key: string]: string;
	}

	/** @deprecated */
	interface RosterData {
		name: string;
		subscription: 'both';
		jid: Jid;
	}

	interface SendMsgResult {
		/** The message local ID. */
		localMsgId: string;
		/** The ID of the message on the server. */
		serverMsgId: string;
	}

	/** The modified message. */
	type ModifiedMsg = TextMsgBody;

	interface ModifyMsgResult extends SendMsgResult {
		/** The modified message. */
		message: ModifiedMsg;
	}

	interface ModifiedMsgInfo {
		/** Gets the user ID of the operator that modified the message last time. */
		operatorId: string;
		/** Gets the number of times a message is modified. A message can be modified at most five times.*/
		operationCount: number;
		/** Gets the UNIX timestamp of the last message modification, in milliseconds. */
		operationTime: number;
	}

	// eventHandle types
	type OnPresenceMsgType =
		| 'rmChatRoomMute'
		| 'rmGroupMute'
		| 'muteChatRoom'
		| 'muteGroup'
		| 'rmUserFromChatRoomWhiteList'
		| 'rmUserFromGroupWhiteList'
		| 'addUserToChatRoomWhiteList'
		| 'addUserToGroupWhiteList'
		| 'deleteFile'
		| 'uploadFile'
		| 'deleteAnnouncement'
		| 'updateAnnouncement'
		| 'removeMute'
		| 'addMute'
		| 'removeAdmin'
		| 'addAdmin'
		| 'changeOwner'
		| 'direct_joined'
		| 'leaveChatRoom'
		| 'leaveGroup'
		| 'memberJoinChatRoomSuccess'
		| 'memberJoinPublicGroupSuccess'
		| 'unblock'
		| 'block'
		| 'update'
		| 'allow'
		| 'ban'
		| 'getBlackList'
		| 'removedFromGroup'
		| 'invite_decline'
		| 'invite_accept'
		| 'invite'
		| 'joinPublicGroupDeclined'
		| 'joinPublicGroupSuccess'
		| 'joinGroupNotifications'
		| 'leave'
		| 'join'
		| 'deleteGroupChat'
		| 'subscribe'
		| 'unsubscribed'
		| 'subscribed'
		| 'onPresenceStatusChange';

	/** @deprecated */
	interface OnPresenceMsg {
		type: OnPresenceMsgType;
		to: string;
		from: string;
		status: string;
		chatroom?: boolean;
		toJid?: string;
		fromJid?: string;
		gid?: string;
		owner?: string;
	}

	type multiDeviceEventType =
		| 'chatThreadCreate'
		| 'chatThreadDestroy'
		| 'chatThreadJoin'
		| 'chatThreadLeave'
		| 'chatThreadNameUpdate';

	interface ThreadMultiDeviceInfo {
		/** Event name of thread multi device event. */
		operation: multiDeviceEventType;
		/** The message thread ID. */
		chatThreadId?: string;
		/** The message thread name. */
		chatThreadName?: string;
		/** The ID of the parent message in the message thread. */
		parentId?: string;
	}

	interface RoamingDeleteMultiDeviceInfo {
		/** Event name of multi device event. */
		operation: 'deleteRoaming';
		/** The target user ID or group ID. */
		conversationId: string;
		/** The chat type. */
		chatType: 'singleChat' | 'groupChat';
		/** The client resource. */
		resource: string;
	}

	interface GroupMemberAttributesUpdateMultiDeviceInfo {
		/**
		 * Custom attributes of a group member.
		 */
		attributes: MemberAttributes;
		/** The user ID of the message sender. */
		from: UserId;
		/** The group ID. */
		id: GroupId;
		/** The name of the multi-device event. */
		operation: 'memberAttributesUpdate';
		/** The user ID of the group member whose custom attributes are set.   */
		userId: UserId;
	}

	interface ConversationChangedInfo {
		/** The multi-device conversation event. */
		operation:
			| 'pinnedConversation'
			| 'unpinnedConversation'
			| 'deleteConversation';
		/** The conversation ID. */
		conversationId: string;
		/** The conversation type. */
		conversationType: 'singleChat' | 'groupChat';
		/** The UNIX timestamp of the current operation. The unit is millisecond.*/
		timestamp: number;
	}

	type MultiDeviceEvent =
		| ThreadMultiDeviceInfo
		| ConversationChangedInfo
		| RoamingDeleteMultiDeviceInfo
		| GroupMemberAttributesUpdateMultiDeviceInfo;

	interface ConnectionParameters {
		/** The unique application key registered in console. */
		appKey: string;
		/** Whether to enable the delivery receipt function. - `true`: Enable; - (Default)`false`: Do not enable. */
		delivery?: boolean;
		/** Heartbeat interval, in milliseconds. */
		heartBeatWait?: number;
		/** The unique ID of the login device is random by default and can be set by yourself. This parameter is required for multiple terminals and multiple devices. */
		deviceId?: string;
		/** Whether to use your own upload function, for example, when uploading images and files to your server. - `true`: Use your own upload function; - (Default)`false`: Do not use your own upload function. */
		useOwnUploadFun?: boolean;
		/** The maximum number of reconnection. */
		autoReconnectNumMax?: number;
		/** Whether DNS is enabled or not. It is enabled by default. The private cloud should be turned off */
		isHttpDNS?: boolean;
		/** The URL of the specified REST server. This command is used when DNS is not enabled. Usually this API is used for specific customers and need to contact account manager to get it. */
		apiUrl?: string;
		/** The URL of the specified message server. This command is used when DNS is not enabled. Usually this API is used for specific customers and need to contact account manager to get it. */
		url?: string;
		/** Whether to use HTTPS only. By default, the browser determines whether to use HTTPS only according to the domain name. */
		https?: boolean;
	}

	interface RegisterUserResult extends AsyncResult {
		entities: BaseUserInfo[];
	}

	// chat room api result start
	interface ChatRoomBaseInfo {
		/** The total number of existing members. */
		affiliations_count: number;
		/** The chart room ID. */
		id: string;
		/** The chat room name. */
		name: string;
		/** The chat room owner. */
		owner: string;
	}
	type GetChatRoomsResult = ChatRoomBaseInfo[];

	type BaseMembers = { member: string } | { owner: string };

	interface GetChatRoomDetailsResult {
		/** A list of existing members. */
		affiliations: BaseMembers[];
		/** The total number of existing members. */
		affiliations_count: number;
		/** Whether to allow members of a chat room to invite others to join the group. (Use only in group) */
		allowinvites: boolean;
		/** The Timestamp when the chat room was created. */
		created: number;
		/** The custom information. */
		custom: string;
		/** The chat room description. */
		description: string;
		/** The chat room ID. */
		id: string;
		/** The upper limit of chat room members. */
		maxusers: number;
		/** Whether need to join the chat room requires the approval of the group owner or group administrator. (Use only in group). */
		membersonly: boolean;
		/** Whether to open the forbidden speech of all members. */
		mute: boolean;
		/** The chat room name. */
		name: string;
		/** The chat room  owner. */
		owner: string;
		/** Whether it a public group. (Use only in group) */
		public: boolean;
		/** Whether on the blacklist. */
		shieldgroup: boolean;
	}

	interface ModifyChatRoomResult {
		/** Whether to change the description successfully. */
		description: boolean;
		/** Whether to change the maxusers successfully. */
		maxusers: boolean;
		/** Whether to change the groupname successfully. */
		groupname: boolean;
	}

	interface CommonRequestResult {
		/** The result of request. */
		result: boolean;
		/** Action. */
		action: string;
		/** The reason of failure. */
		reason?: string;
		/** The user ID. */
		user: string;
		/** The chat room ID. */
		id: string;
	}

	interface AddUsersToChatRoomResult {
		/** The newly added members. */
		newmembers: string[];
		/** Action. */
		action: 'add_member';
		/** The chat room ID */
		id: string;
	}

	type GetChatRoomAdminResult = UserId[];

	interface SetChatRoomAdminResult {
		/** The result of request. */
		result: boolean;
		/** The new admin. */
		newadmin: string;
	}

	interface RemoveChatRoomAdminResult {
		/** The result of request. */
		result: boolean;
		/** The admin was removed. */
		oldadmin: string;
	}

	interface MuteChatRoomMemberResult {
		/** The result of request. */
		result: boolean;
		/** The time stamp of forbidden speech expiration. */
		expire: number;
		/** The ID of the forbidden user. */
		user: string;
	}

	interface UnmuteChatRoomMemberResult {
		/** The result of request. */
		result: boolean;
		/** The ID of the unblocked user. */
		user: string;
	}

	interface GetChatRoomMuteListResult {
		/** The time stamp of forbidden speech expiration. */
		expire: number;
		/** The ID of the forbidden user. */
		user: string;
	}

	interface WhetherAbleSendChatRoomMsgResult {
		/** The mute state. */
		mute: boolean;
	}

	interface IsChatRoomWhiteUserResult {
		/** The member */
		member: string;
		/** Whether the member is on the whitelist */
		white: boolean;
	}

	interface FetchChatRoomAnnouncementResult {
		/** The announcement content. */
		announcement: string;
	}

	interface UpdateChatRoomAnnouncementResult {
		/** The chat room ID. */
		id: string;
		/** The result of request. */
		result: boolean;
	}

	interface FetchChatRoomSharedFileListResult {
		/** The file ID. */
		file_id: string;
		/** The file name. */
		file_name: string;
		/** The file owner. */
		file_owner: string;
		/** The file size. */
		file_size: number;
		/** The time stamp of file upload. */
		created: number;
	}

	interface DeleteChatRoomSharedFileResult {
		/** The chat room ID. */
		id: string;
		/** The file ID. */
		file_id: string;
		/** The operation result. */
		result: boolean;
	}

	interface CreateDeleteChatRoomResult {
		/** The chat room ID */
		id: string;
	}
	// The chat room api result end.

	// The group api result start.
	interface BaseGroupInfo {
		/** The group ID. */
		groupid: string;
		/** The group name. */
		groupname: string;
	}

	type GroupAffiliation =
		| {
				/** The group owner. */
				owner: UserId;
				/** Time to join the group. */
				joined_time: number;
		  }
		| {
				/** The group member. */
				member: UserId;
				/** Time to join the group. */
				joined_time: number;
		  };

	interface CreateGroupResult {
		/** The group ID. */
		groupid: string;
	}

	interface BlockGroupResult {
		/** Whether the current user is enabled. */
		activated: boolean;
		/** The time stamp when the current user was created. */
		created: number;
		/** The time when Finally edit the user information. */
		modified: number;
		/** User nickname for push. */
		nickname: string;
		/** The user type. */
		type: string;
		/** The user ID. */
		username: string;
		/** The user uuid. */
		uuid: string;
	}

	interface ChangeGroupOwnerResult {
		/** The result of changing group owner. */
		newowner: boolean;
	}

	interface GroupDetailInfo {
		/** The list of existing members. */
		affiliations: GroupAffiliation[];
		/** The total number of existing members. */
		affiliations_count: number;
		/** Whether to allow group members to invite others to join the group. */
		allowinvites: boolean;
		/** The time when the group was created. */
		created: number;
		/** The custom information. */
		custom: string;
		/** The group description. */
		description: string;
		/** The group ID. */
		id: string;
		/** The maximum number of group members */
		maxusers: number;
		/** Whether to join a group requires the approval of the group owner or group administrator. True: yes, false: no. */
		membersonly: boolean;
		/** Whether to open the forbidden speech of all members. */
		mute: boolean;
		/** The group name. */
		name: string;
		/** The group owner. */
		owner: UserId;
		/** Whether it is a public group. */
		public: boolean;
		/** Whether on the blacklist. */
		shieldgroup: boolean;
	}

	interface ModifyGroupResult {
		/** Whether the group description is modified successfully. */
		description?: boolean;
		/** Whether the upper limit of group members is changed successfully. */
		maxusers?: boolean;
		/** Whether the group name is changed successfully. */
		groupname?: boolean;
		/** Whether needing approve is changed successfully. */
		membersonly?: boolean;
		/** Whether the permission invitation is modified successfully. */
		allowinvites?: boolean;
	}

	type GroupMember = { owner: UserId } | { member: UserId };

	interface SetGroupAdminResult {
		/** The new admin user ID. */
		newadmin: UserId;
		/** The Result of setting. */
		result: 'success';
	}

	interface RemoveGroupAdminResult {
		/** The user ID of removed administrator. */
		oldadmin: UserId;
		/** The Result of setting. */
		result: 'success';
	}

	interface DestroyGroupResult {
		/** The group Id. */
		id: string;
		/** The operation result. */
		success: boolean;
	}

	interface InviteUsersToGroupResult {
		/** Action. */
		action: 'invite';
		/** The group ID. */
		id: string;
		/** The reason for failure. */
		reason?: string;
		/** The result of the invitation. */
		result: boolean;
		/** The ID of the invited user. */
		user: UserId;
	}

	interface JoinGroupResult {
		/** Action. */
		action: string;
		/** The group ID. */
		id: string;
		/** The result of the invitation. */
		result: boolean;
		/** The ID of the user that applies for adding to a group. */
		user: UserId;
	}

	interface RemoveGroupMemberResult {
		/** Action. */
		action: 'remove_member';
		/** The group ID. */
		groupid: string;
		/** The result of the invitation. */
		result: boolean;
		/** The user ID. */
		user: UserId;
	}

	interface MuteGroupMemberResult {
		/** The timestamp when the mute expires. */
		expire: number;
		/** The operation result. */
		result: boolean;
		/** The muted user ID . */
		user: UserId;
	}

	interface UnmuteGroupMemberResult {
		/** The operation result. */
		result: boolean;
		/** The unbanned group member ID. */
		user: UserId;
	}

	interface GetGroupMuteListResult {
		/** The timestamp when the mute expires. */
		expire: number;
		/** The muted user ID . */
		user: UserId;
	}

	interface GroupRequestResult {
		/** Action. */
		action: string;
		/** The group ID. */
		groupid: string;
		/** The result of the invitation. */
		result: boolean;
		/** The user ID. */
		user: UserId;
	}
	interface IsInGroupWhiteListResult {
		/** The User ID to query. */
		member: UserId;
		/** Whether the user is on the white list. */
		white: boolean;
	}

	interface GetGroupMsgReadUserResult {
		/** The message ID of to query. */
		ackmid: string;
		/** Is it the last one. */
		is_last: boolean;
		/** The cursor for the next paging query. */
		next_key: string;
		/** The time of the current query. */
		timestamp: number;
		/** The number of people read. */
		total: number;
		/** The list of people who have read this message. */
		userlist: UserId[];
	}

	interface UpdateGroupAnnouncementResult {
		/** The group ID. */
		id: string;
		/** The operation result. */
		result: boolean;
	}

	interface DeleteGroupSharedFileResult {
		/** The group ID. */
		group_id: string;
		/** The file ID. */
		file_id: string;
		/** The operation result. */
		result: boolean;
	}

	interface FetchGroupSharedFileListResult {
		/** The file ID. */
		file_id: string;
		/** The file name. */
		file_name: string;
		/** The file owner. */
		file_owner: string;
		/** The file size. */
		file_size: number;
		/** The time stamp of file upload. */
		created: number;
	}

	interface GroupInfo {
		/** The number of existing members. */
		affiliationsCount?: number;
		/** The group name. */
		groupName: string;
		/** The group ID. */
		groupId: string;
		/** The current user role in the group. */
		role?: 'member' | 'admin' | 'owner';
		/** Whether the group disabled. */
		disabled: boolean;
		/** Whether a user requires the approval from the group owner or admin to join the group. -`true`: Yes; -`false`: No. */
		approval: boolean;
		/** Whether to allow group members to invite others to join the group. */
		allowInvites: boolean;
		/** The group description. */
		description: string;
		/** The maximum number of group members. */
		maxUsers: number;
		/** Whether it is a public group. */
		public: boolean;
	}
	type MemberAttributes = Record<string, string>;

	type GetGroupMembersAttributesResult = Record<UserId, MemberAttributes>;

	interface GroupModifyInfo {
		/** The name of a group.  */
		name?: string;
		/** The description of a group.  */
		description?: string;
		/** Whether it is a public group. -`true`: Yes; -`false`: No. Public group: the group that others can query by calling `listgroups`. */
		public?: boolean;
		/** Whether a user requires the approval from the group owner or admin to join the group. -`true`: Yes; -`false`: No. */
		approval?: boolean;
		/** Whether to allow group members to invite others to join the group. */
		allowInvites?: boolean;
		/** The maximum number of group members */
		maxUsers?: number;
		/** Whether the invitee needs to accept the invitation before joining the group. 
					- `true`: The invitee's consent is required. The default value is `true`.
					- `false`: The invitee will be directly added to the group without confirmation.  
					*/
		inviteNeedConfirm?: boolean;
		/** Group detail extensions. */
		ext?: string;
		/** Last Modified Timestamp.  */
		lastModified?: number;
	}

	// The group api result end.

	// The contact api start.
	interface UpdateOwnUserInfoParams {
		/** The nickname. */
		nickname?: string;
		/** The avatar URL. */
		avatarurl?: string;
		/** The email address. */
		mail?: string;
		/** The phone number. */
		phone?: string;
		/** Gender. You can define it with the following type: string, number, boolean. */
		gender?: string | number | boolean;
		/** Signature. */
		sign?: string;
		/** Birthday. */
		birth?: string;
		/** Extension. You can define it with the following type: string, number, boolean. */
		ext?: string;
	}

	/** Configurable field. */
	type ConfigurableKey =
		| 'nickname'
		| 'avatarurl'
		| 'mail'
		| 'phone'
		| 'gender'
		| 'sign'
		| 'birth'
		| 'ext';

	interface RosterData {
		name: string;
		subscription: 'both';
		jid: Jid;
	}

	interface BaseUserInfo {
		/** Whether the current user is enabled. - `true`: Yes; - `false`: No.*/
		activated: boolean;
		/** The timestamp when the current user is created. */
		created: number;
		/** The time when the user information is last modified. */
		modified: number;
		/** The display name in the message push notification. */
		nickname: string;
		/** The user type. */
		type: string;
		/** The user ID. */
		username: string;
		/** The user uuid on the server. */
		uuid: string;
	}

	interface PushInfo {
		/** The device ID, used to identify a device, which can be customized.*/
		device_id: string;
		/** The push token, which can be defined by yourself, is generally used to identify the same device. */
		device_token: string;
		/** The Push service appId, senderID for FCM, "appId+#+AppKey" for Vivo */
		notifier_name: string;
	}

	interface UploadTokenResult extends BaseUserInfo {
		/** The push information. */
		pushInfo: PushInfo[];
	}

	interface SessionInfo {
		/** The conversation ID. */
		channel_id: string;
		/** The content of the last message.*/
		meta: {
			/** The message sender. */
			from: string;
			/** The message ID. */
			id: string;
			/** The message content. */
			payload: string;
			/** The time when the message is received. */
			timestamp: number;
			/** The message recipient. */
			to: string;
		};
		/** The number of unread messages. */
		unread_num: number;
	}

	interface ConversationList {
		/** The conversation ID. */
		channel_id: string;
		/** Overview of the latest news. */
		lastMessage: MessageBody | Record<string, never>;
		/** The number of unread messages. */
		unread_num: number;
	}
	interface ConversationInfo {
		/** The conversation list. */
		channel_infos: ConversationList[];
	}
	interface DeleteSessionResult {
		/** The result of request. */
		result: 'ok';
	}

	interface SendMsgResult {
		/** The local ID of the message. */
		localMsgId: string;
		/** The message ID on the server. */
		serverMsgId: string;
	}

	interface HistoryMessages {
		/** The starting message ID for the next query. If the number of messages returned by the SDK is smaller than the requested number, the cursor will be `undefined`. */
		cursor?: string;
		/** The historical messages. */
		messages: MessagesType[];
		/** Whether it is the last page of data.
		 *  - `true`: Yes;
		 *  - `false`: No.
		 * If the number of data entries is smaller than the message count set in the request, `false` is returned; otherwise, `true` is returned.
		 */
		isLast: boolean;
	}

	interface ServerConversations {
		/** The conversation list. */
		conversations: ConversationItem[];
		/** The position from which to start getting data for the next query. If the number of returned data entries is smaller than that specified in the request, the cursor is `'undefined'`, which indicates that the current page is the last page; otherwise, the SDK returns the specific cursor position which indicates where to start getting data for the next query.*/
		cursor: string;
	}
	interface ConversationItem {
		/** The conversation ID. */
		conversationId: string;
		/** The conversation type. */
		conversationType: 'singleChat' | 'groupChat';
		/** Whether the conversation is pinned. `true`: pinned; `false`: unpinned. */
		isPinned: boolean;
		/** The UNIX timestamp when the conversation is pinned. The unit is millisecond. This value is `0` when conversation is not pinned. */
		pinnedTime: number;
		/** Overview of the latest message. */
		lastMessage: MessageBody | Record<string, never> | null;
		/** The number of unread messages. */
		unReadCount: number;
	}
	interface PinConversation {
		/** Whether the conversation is pinned. `true`: pinned; `false`: unpinned.*/
		isPinned: boolean;
		/** The UNIX timestamp when the conversation is pinned. The unit is millisecond. This value is `0` when the conversation is not pinned. */
		pinnedTime: number;
	}
	interface ContactItem {
		/** The user ID. */
		userId: UserId;
		/** The user remark. */
		remark: string;
	}
	interface CursorContactsResult {
		/** The position from which to start getting data for the next query. If the number of returned data entries is smaller than that specified in the request, the cursor is an empty string (''), which indicates that the current page is the last page; otherwise, the SDK returns the specific cursor position which indicates where to start getting data for the next query.*/
		cursor?: string;
		/** The contact list. */
		contacts: ContactItem[];
	}

	interface OperateResult {
		/** The userIds of the operation successfully. */
		userIds: UserId[];
	}

	// The contact api result end.

	interface LoginResult {
		/** The connection token. */
		accessToken: string;
		/** Expiration timestamp. */
		expireTimestamp?: number;
		/** Valid duration of token. */
		duration?: number;
	}

	interface SupportLanguage {
		/** language code. */
		code: string;
		/** language (English). */
		name: string;
		/** language (native language). */
		nativeName: string;
	}

	interface TranslationResult {
		/** Translation results. */
		translations: {
			/** Translated text. */
			text: string;
			/** The target language of translation. */
			to: string;
		}[];
		/** Original text language detection result. */
		detectedLanguage: {
			/** Original text language. */
			language: string;
			/** Test results score (0-1). */
			score: number;
		};
	}
	interface SubscribePresence {
		/** The expiration time of the presence subscription. */
		expiry: number;
		/** The presence extension information. */
		ext: string;
		/** The presence update time, which is generated by the server. */
		last_time: number;
		/** The details of the current presence state. */
		status: object;
		/** The user ID of the presence publisher. */
		uid: string;
	}

	interface SubscribePresenceResult {
		/** The subscribe result. */
		result: SubscribePresence[];
	}

	interface SubscribeUserListType {
		/** The user ID of the presence publisher. */
		uid: string;
		/** The expiration time of the presence subscription. */
		expiry: number;
	}

	interface GetSubscribedType {
		/** subscribe users list */
		sublist: SubscribeUserListType[];
		/** The total number of subscribe users  */
		totalnum: number;
	}

	interface GetSubscribedPresenceListResult {
		/** Fetch all subscribe result. */
		result: GetSubscribedType;
	}

	interface StatusDetailsType {
		device: string;
		status: number;
	}
	interface PresenceType {
		/** The user ID of the presence publisher. */
		userId: string;
		/** The details of the current presence state. */
		statusDetails: StatusDetailsType[];
		/** The presence extension information. */
		ext: string;
		/** The presence update time, which is generated by the server. */
		lastTime: number;
		/** The expiration time of the presence subscription. */
		expire: number;
	}
	interface ChatThread {
		/** The Message ID for creating thread. */
		messageId: string;
		/** Generally refers to the group ID. */
		parentId: string;
		/** The chatThread name. */
		chatThreadName: SVGStringList;
	}
	interface ChatThreadOverview {
		/** The thread ID. */
		id: string;
		/** Generally refers to the group ID. */
		parentId: string; //parent
		/** The thread name. */
		name: string;
		/** Overview of the latest news. */
		lastMessage: LastMessage;
		/** The thread create timestamp. */
		createTimestamp: number;
		/** The timestamp to update the thread overview. */
		updateTimestamp: number;
		/** The thread message count. */
		messageCount: number;
	}
	interface LastMessage {
		/** The message id. */
		id: string;
		/** The sender id. */
		from: string;
		/** The receiver id. */
		to: string;
		/** The time stamp. */
		timestamp: number;
		/** The message content. */
		payload: any;
	}
	type Operation = 'create' | 'update' | 'delete' | 'update_msg';
	interface ThreadNotifyServerMsg {
		/** The event type. */
		operation: Operation;
		/** The message ID for creating thread. */
		msg_parent_id?: string;
		/** The thread ID. */
		id: string;
		/** The group ID of the thread. */
		muc_parent_id: string;
		/** The Thread Name. */
		name: string;
		/** The action occurrence time. */
		timestamp: number;
		/** The operator. */
		from?: string;
		/** The last message of Thread. */
		last_message?: LastMessage;
		/** The Thread message count. */
		message_count?: number;
	}
	interface CreateChatThreadResult {
		/** The Thread ID. */
		chatThreadId: string;
	}
	interface ChangeChatThreadName {
		/** The thread name. */
		name: string;
	}

	interface ChatThreadMembers {
		/** The list of thread members. */
		affiliations: string[];
	}

	type RemoveMemberResult = {
		/** The operation results. */
		result: boolean;
		/** The ID of thread member. */
		user: UserId;
	};

	interface ChatThreadDetail {
		/** The thread ID. */
		id: string;
		/** The thread name. */
		name: string;
		/** The thread owner. */
		owner: string;
		/** The creation time of the thread. */
		created: number;
		/** The number of thread members. */
		affiliationsCount?: number;
		//** Generally refers to the group ID. */
		parentId: string;
		/** The parent message ID. */
		messageId: string;
	}
	interface JoinChatThreadResult {
		/** Operation results. */
		status: 'ok';
		/** The chatThread detail. */
		detail: ChatThreadDetail;
	}
	interface ChatThreadLastMessage {
		/** The chatThread ID. */
		chatThreadId: string;
		/** The last message. */
		lastMessage: MessageBody;
	}

	type onChatThreadChangeType =
		| 'create'
		| 'update'
		| 'destroy'
		| 'userRemove';
	interface ThreadChangeInfo {
		/** The thread ID. */
		id: string;
		/** The thread name. */
		name: string;
		/** The operator. */
		operator: string;
		/** The type of operation. */
		operation: onChatThreadChangeType;
		/** Generally refers to the group ID. */
		parentId: string;
		/** The parent message ID. */
		messageId?: string;
		/** The thread message count. */
		messageCount?: number;
		/** Overview of the latest news. */
		// eslint-disable-next-line @typescript-eslint/ban-types
		lastMessage?: MessageBody | {};
		/** The operated object. */
		userName?: string;
		/** Operation time. */
		timestamp?: number;
		/** The creation time. */
		createTimestamp?: number;
	}

	interface SilentModeConversationType {
		/** Silent mode type. */
		type: string;
		/** Silent mode duration, duration of Unix timestamp. */
		ignoreDuration: number;
		/** Silent mode interval. */
		ignoreInterval: string;
	}

	interface ConversationSilentModeType {
		/** User push map. */
		user: {
			[propname: string]: SilentModeConversationType;
		};
		/** Group push map. */
		group: {
			[propname: string]: SilentModeConversationType;
		};
	}

	interface TranslationLanguageType {
		/** Translation language. */
		language: string;
	}

	enum SILENTMODETYPE {
		/** All message. */
		ALL = 'ALL',
		/** @ message of myself. */
		AT = 'AT',
		/** None. */
		NONE = 'NONE',
	}

	enum CONVERSATIONTYPE {
		/** Single chat. */
		SINGLECHAT = 'singleChat',
		/** Group chat. */
		GROUPCHAT = 'groupChat',
		/** Chat room. */
		CHATROOM = 'chatRoom',
	}

	type ConversationListType = {
		/** Conversation id. */
		id: string;
		/** Conversation type. */
		type: string;
	};

	interface SilentModeRemindType {
		/** Silent mode type. */
		paramType: 0;
		/** Silent mode type. */
		remindType: SILENTMODETYPE;
	}

	interface SilentModeDuration {
		/** Silent mode type. */
		paramType: 1;
		/** Silent mode duration, duration of Unix timestamp. */
		duration: number;
	}

	interface SilentModeInterval {
		/** Silent mode type. */
		paramType: 2;
		/** Start time interval. */
		startTime: Interval;
		/** End time interval. */
		endTime: Interval;
	}

	type Interval = {
		/** Hours. */
		hours: number;
		/** Minutes. */
		minutes: number;
	};

	type SilentModeParamType =
		| SilentModeRemindType
		| SilentModeDuration
		| SilentModeInterval;

	interface GetReactionDetailResult {
		/** The reaction to be added to the message. The length is limited to 128 characters. */
		reaction: string;
		/** Whether the current user added this reaction.
		 * - `true`: Yes;
		 * - `false`: No.
		 */
		isAddedBySelf: boolean;
		/** The number of users that added this reaction. */
		userCount: number;
		/** The IDs of the users who added the reaction. */
		userList: UserId[];
		/** The cursor that specifies where to start to get data. If there is data on the next page, this method will return the cursor to indicate where to start to get data for the next query. If it is `null`, the data of the first page will be returned.*/
		cursor: string;
	}

	interface ReactionListItem {
		/** The reaction added to the message. It cannot exceed 128 characters. */
		reaction: string;
		/** Whether the current user added this reaction.
		 * - `true`: Yes;
		 * - `false`: No.
		 */
		isAddedBySelf: boolean;
		/** The number of users that added this reaction. */
		userCount: number;
		/** The IDs of the users who added the reaction. */
		userList: UserId[];
	}

	interface GetReactionListResult {
		/** The ID of the message to which this reaction was added. */
		msgId: string;
		/** The reaction list of this message. */
		reactionList: ReactionListItem[];
	}

	interface DownloadCombineMessagesParams {
		/** The file url. */
		url: string;
		/** The file secret. */
		secret: string;
	}

	/**
	 * The error code defined by SDK.
	 * @module Code
	 */
	enum Code {
		/** No error. */
		REQUEST_SUCCESS = 0,
		/** The server response times out. */
		REQUEST_TIMEOUT = -1,
		/** A general error.  */
		REQUEST_UNKNOWN = -2,
		/** The parameter is invalid. */
		REQUEST_PARAMETER_ERROR = -3,
		/** The request is canceled. */
		REQUEST_ABORT = -4, // 取消请求
		/** Login failed.  */
		WEBIM_CONNCTION_OPEN_ERROR = 1,
		/** The user authentication fails. The reasons are as follows. The SDK is not initiated. The user is not login. */
		WEBIM_CONNCTION_AUTH_ERROR = 2,

		/** Fails to get the token. */
		WEBIM_CONNCTION_GETROSTER_ERROR = 12,
		/** Websocket is disconnected */
		WEBIM_CONNCTION_DISCONNECTED = 16,
		/** A general error.  */
		WEBIM_CONNCTION_AJAX_ERROR = 17,
		/** The App Key is invalid. */
		WEBIM_CONNCTION_APPKEY_NOT_ASSIGN_ERROR = 27,
		/** The token is invalid. */
		WEBIM_CONNCTION_TOKEN_NOT_ASSIGN_ERROR = 28,
		/** The callback inner error code while the message is successfully sent. */
		WEBIM_CONNCTION_CALLBACK_INNER_ERROR = 31,
		/** The current user is offline. */
		WEBIM_CONNCTION_CLIENT_OFFLINE = 32, //32 = client offline
		/** The user is not logged in.*/
		WEBIM_CONNECTION_CLOSED = 39,
		/** The user authentication fails. */
		WEBIM_CONNECTION_ERROR = 40,

		/** The upper limit is reached. */
		MAX_LIMIT = 50,
		/** The message is not found. */
		MESSAGE_NOT_FOUND = 51,
		/** Unauthorized operation. */
		NO_PERMISSION = 52,
		/** Unsupported Operation. */
		OPERATION_UNSUPPORTED = 53,
		/** An operation that is not allowed. */
		OPERATION_NOT_ALLOWED = 54,
		/** A local database operation failed. */
		LOCAL_DB_OPERATION_FAILED = 55,
		/** The uploading of the file failed. */
		WEBIM_UPLOADFILE_ERROR = 101,
		/** The current user is not logged in when uploading the file. */
		WEBIM_UPLOADFILE_NO_LOGIN = 102,
		/** File-downloading failed. */
		WEBIM_DOWNLOADFILE_ERROR = 200,
		/** Parse file failed. */
		PARSE_FILE_ERROR = 203,
		/** User does not found. */
		USER_NOT_FOUND = 204,
		/** The user is logged in on another device. */
		WEBIM_CONNCTION_USER_LOGIN_ANOTHER_DEVICE = 206,
		/** The user was removed. */
		WEBIM_CONNCTION_USER_REMOVED = 207,
		/** The password is renewed. */
		WEBIM_CONNCTION_USER_KICKED_BY_CHANGE_PASSWORD = 216,
		/** The user was kicked off from another device. */
		WEBIM_CONNCTION_USER_KICKED_BY_OTHER_DEVICE = 217,
		/** Global muted. */
		USER_MUTED_BY_ADMIN = 219,
		/**
		 * The user is not on your contact list, and you cannot send messages to him or her.
		 * Note: You can send messages to strangers by default. This error occurs only when you enable the function of allowing to send messages only to your contacts.
		 */
		USER_NOT_FRIEND = 221,

		/** The server is busy. */
		SERVER_BUSY = 500,
		/** The message content contains illegal or sensitive words. */
		MESSAGE_INCLUDE_ILLEGAL_CONTENT = 501,
		/** The message was blocked. */
		MESSAGE_EXTERNAL_LOGIC_BLOCKED = 502,
		/** Unknown error. */
		SERVER_UNKNOWN_ERROR = 503,
		/** The message recall has exceeded the time limit.*/
		MESSAGE_RECALL_TIME_LIMIT = 504,
		/** The service is not enabled. */
		SERVICE_NOT_ENABLED = 505,
		/** The message fails to be delivered because the user is not on the allow list.*/
		SERVICE_NOT_ALLOW_MESSAGING = 506,
		/** The current user is muted. */
		SERVICE_NOT_ALLOW_MESSAGING_MUTE = 507,
		/** The message is blocked by the Moderation service. */
		MESSAGE_MODERATION_BLOCKED = 508,
		/** Group chat ID current limiting. */
		MESSAGE_CURRENT_LIMITING = 509,
		/** The network is disconnected, causing message sending failure. */
		MESSAGE_WEBSOCKET_DISCONNECTED = 510,
		/** You have exceeded the maximum allowed size of a message body.*/
		MESSAGE_SIZE_LIMIT = 511,
		/** The group is not found. */
		GROUP_NOT_EXIST = 605,
		/** The user being operated is not in the group. */
		GROUP_NOT_JOINED = 602,
		/** The number of members in the group reaches the limit. */
		GROUP_MEMBERS_FULL = 606,
		/** Permission denied. */
		PERMISSION_DENIED = 603,
		/** Internal error. */
		WEBIM_LOAD_MSG_ERROR = 604,
		/** The current user is already in the group. */
		GROUP_ALREADY_JOINED = 601,
		/** The maximum number of group members exceeds the limit during group creation. */
		GROUP_MEMBERS_LIMIT = 607,
		/** Group disabled */
		GROUP_IS_DISABLED = 608,
		/** Failed to set the custom attributes of a group member. */
		GROUP_MEMBER_ATTRIBUTES_SET_FAILED = 609,
		/** Invalid token or App Key. */
		REST_PARAMS_STATUS = 700,
		/** The user being operated is not in the chatroom. */
		CHATROOM_NOT_JOINED = 702,
		/** The number of chatroom members reaches the limit.*/
		CHATROOM_MEMBERS_FULL = 704,
		/** The chatroom is not found. */
		CHATROOM_NOT_EXIST = 705,
		/** Websocket error. */
		SDK_RUNTIME_ERROR = 999,
		/** The parameter length exceeds the limit when posting custom presence status. */
		PRESENCE_PARAM_EXCEED = 1100,
		/** The Reaction already exists. */
		REACTION_ALREADY_ADDED = 1101,
		/** A Reaction is being created by multiple users at the same time. */
		REACTION_CREATING = 1102,
		/** The user does not have the permission for the Reaction operation. For example, the user who does not add the reaction attempts to delete it, or the user that is neither the sender nor recipient of the one-to-one message attempts to add the Reaction. */
		REACTION_OPERATION_IS_ILLEGAL = 1103,
		/** Invalid language code. */
		TRANSLATION_NOT_VALID = 1200,
		/** The translated text is too long. */
		TRANSLATION_TEXT_TOO_LONG = 1201,
		/** Failed to obtain the translation service. */
		TRANSLATION_FAILED = 1204,
		/** The chatThread is not found. */
		THREAD_NOT_EXIST = 1300,
		/** Chat thread already exists. */
		THREAD_ALREADY_EXIST = 1301,
		/** The current conversation not exist . */
		CONVERSATION_NOT_EXIST = 1400,
	}

	/**
	 * The connection module is the module where the SDK creates long link, And all about links, friends, groups, and chat apis are all in this module
	 *
	 * @module connection
	 */
	class Connection {
		/** @deprecated */
		isDebug: boolean;
		/** Whether to enable DNS to prevent DNS hijacking. - (Default)`true`: Enable; - `false`: Do not enable. */
		isHttpDNS: boolean;
		/** The heartbeat interval (in seconds). The default value is 30,000s. */
		heartBeatWait: number;
		/** The unique application key registered in console. */
		appKey: string;
		appName: string;
		orgName: string;
		token: string;
		/** The maximum number of reconnection. */
		autoReconnectNumMax: number;
		private autoReconnectNumTotal: number;
		/** SDK version number. */
		version: string;
		/** The unique web device ID. By default, it is a random number. */
		deviceId: string;
		private osType: number;
		/** Whether to use your own upload function, for example, when uploading images and files to your server. - `true`: Use your own upload function; - (Default)`false`: Do not use your own upload function. */
		useOwnUploadFun: boolean;
		/** The URL of the specified REST server. This command is used when DNS is not enabled. Usually this API is used for specific customers and need to contact account manager to get it. */
		apiUrl: string;
		/** The URL of the specified message server. This command is used when DNS is not enabled. Usually this API is used for specific customers and need to contact account manager to get it. */
		url: string;
		https: boolean;
		/** The way to log in. */
		grantType: 'password' | 'accessToken' | 'agoraToken' | '';
		context: {
			jid: {
				appKey: string;
				clientResource: string;
				domain: string;
				name: string;
			};
			userId: string;
			appKey: string;
			restTokenData: string;
			status: number;
			appName: string;
			orgName: string;
			root: any;
			accessToken: string;
		};

		_msgHash: {
			[key: string]: any;
		};

		eventHandler?: EventHandler;
		/**
		 * @deprecated
		 */
		onOpened?: () => void;
		/**
		 * @deprecated
		 */
		onPresence?: (msg: PresenceMsg) => void;
		onTextMessage?: (msg: TextMsgBody) => void;
		onPictureMessage?: (msg: ImgMsgBody) => void;
		onAudioMessage?: (msg: AudioMsgBody) => void;
		onVideoMessage?: (msg: VideoMsgBody) => void;
		onFileMessage?: (msg: FileMsgBody) => void;
		onLocationMessage?: (msg: LocationMsgBody) => void;
		onCmdMessage?: (msg: CmdMsgBody) => void;
		onCustomMessage?: (msg: CustomMsgBody) => void;
		onReceivedMessage?: (msg: ReceivedMsgBody) => void;
		onDeliveredMessage?: (msg: DeliveryMsgBody) => void;
		onReadMessage?: (msg: ReadMsgBody) => void;
		onRecallMessage?: (msg: RecallMsgBody) => void;
		onChannelMessage?: (msg: ChannelMsgBody) => void;
		onError?: (error: ErrorEvent) => void;
		onOffline?: () => void;
		onOnline?: () => void;
		onStatisticMessage?: (msg: any) => void;
		onContactAgreed?: (msg: ContactMsgBody) => void;
		onContactRefuse?: (msg: ContactMsgBody) => void;
		onContactDeleted?: (msg: ContactMsgBody) => void;
		onContactAdded?: (msg: ContactMsgBody) => void;
		onTokenWillExpire?: () => void;
		onTokenExpired?: () => void;
		// eslint-disable-next-line no-undef
		[key: string]: any;
		constructor(options: ConnectionParameters);
		/** Registers a user. */
		registerUser(
			this: Connection,
			params: {
				/** The User ID. */
				username: string;
				/** The password. */
				password: string;
				/** The display nickname. It is the display name in the iOS or Android notification. */
				nickname?: string;
				success?: (res: any) => void;
				error?: (err: ErrorEvent) => void;
				apiUrl?: string;
			}
		): Promise<RegisterUserResult>;
		/** Logs in. */
		open(parameters: {
			/** The User ID. */
			user: string;
			/** The password. */
			pwd?: string;
			/** Token required to connect to the message service. */
			accessToken?: string;
			/** @deprecated Use 'accessToken' instead. */
			agoraToken?: string;
			success?: (res: any) => void;
			error?: (res: any) => void;
		}): Promise<LoginResult>;
		/** Checks the connection status. - `true`: Connected; - (Default)`false`: Not connected.  */
		isOpened(): boolean;
		/** Closes the connection. */
		close(): void;
		private reconnect(): void;
		/** send message */
		send(params: MessageBody): Promise<SendMsgResult>;

		// ChatRoom API
		/**
		 * Gets chat room list (paging).
		 *
		 * ```typescript
		 * connection.getChatRooms({pagenum: 1, pagesize: 20})
		 * ```
		 */
		getChatRooms(
			this: Connection,
			params: {
				/** The page number, starting from 1. */
				pagenum: number;
				/** The number of records per page. The default value is 20. */
				pagesize: number;
				success?: (res: AsyncResult<GetChatRoomsResult>) => any;
				error?: (error: ErrorEvent) => any;
			}
		): Promise<AsyncResult<GetChatRoomsResult>>;

		/**
		 * Creates a chat room.
		 *
		 * ```typescript
		 * connection.createChatRoom({name: 'myChatRoom', description: 'this is my chatroom', maxusers: 200, members; ['user1']})
		 * ```
		 */
		createChatRoom(
			this: Connection,
			params: {
				/** The chat room name. */
				name: string;
				/** The description of the chat room. */
				description: string;
				/** The maximum number of members in the chat room, including the chat room creator. The value is of integer type, 200 by default, and can not exceed 5,000. */
				maxusers: number;
				/** (Optional) The members in the chat room. An array of user IDs. If you set this parameter, ensure that the array contains at least one user. */
				members?: UserId[];
				/** The super admin token. */
				token: string;
				success?: (res: AsyncResult<CreateDeleteChatRoomResult>) => any;
				error?: (error: ErrorEvent) => any;
			}
		): Promise<AsyncResult<CreateDeleteChatRoomResult>>;

		/**
		 * Deletes the chat room.
		 *
		 * ```typescript
		 * connection.destroyChatRoom({chatRoomId: 'chatRoomId'})
		 * ```
		 */
		destroyChatRoom(
			this: Connection,
			params: {
				/** The chat room ID */
				chatRoomId: string;
				/** The super admin token. */
				token: string;
				success?: (
					res: AsyncResult<CreateDeleteChatRoomResult>
				) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CreateDeleteChatRoomResult>>;

		/**
		 * Gets specifications of the chat room.
		 *
		 * ```typescript
		 * connection.getChatRoomDetails({chatRoomId: 'chatRoomId'})
		 * ```
		 */
		getChatRoomDetails(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				success?: (res: AsyncResult<GetChatRoomDetailsResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GetChatRoomDetailsResult>>;

		/**
		 * Modifies the specifications of the chat room.
		 *
		 * ```typescript
		 * connection.modifyChatRoom({chatRoomId: 'chatRoomId', chatRoomName: 'chatRoomName', description: 'description', maxusers: 5000})
		 * ```
		 */
		modifyChatRoom(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				/** The chat room name. */
				chatRoomName: string;
				/** The description of the chat room. */
				description: string;
				/** The maximum number of members in the chat room. */
				maxusers: number;
				success?: (res: AsyncResult<ModifyChatRoomResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<ModifyChatRoomResult>>;

		/**@deprecated*/
		removeSingleChatRoomMember(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				/** The member to be removed. */
				username: string;
				success?: (res: AsyncResult<CommonRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult>>;

		/**
		 * Removes a chat room member.
		 *
		 * ```typescript
		 * connection.removeChatRoomMember({chatRoomId: 'chatRoomId', username: 'username'})
		 * ```
		 */
		removeChatRoomMember(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				/** The member to be removed. */
				username: string;
				success?: (res: AsyncResult<CommonRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult>>;

		/**@deprecated*/
		removeMultiChatRoomMember(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				/** The members to be removed. */
				users: string[];
				success?: (res: AsyncResult<CommonRequestResult[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult[]>>;

		/**
		 * Removes multiple chat room members.
		 *
		 * ```typescript
		 * connection.removeChatRoomMembers({chatRoomId: 'chatRoomId', users: ['user1', 'user2']})
		 * ```
		 */
		removeChatRoomMembers(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				/** The members to be removed. */
				users: string[];
				success?: (res: AsyncResult<CommonRequestResult[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult[]>>;

		/**
		 * Adds chat room members.
		 *
		 * ```typescript
		 * connection.addUsersToChatRoom({chatRoomId: "chatRoomId", users:['user1', 'user2']})
		 * ```
		 */
		addUsersToChatRoom(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				/** The users to be added. */
				users: string[];
				success?: (res: AsyncResult<AddUsersToChatRoomResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<AddUsersToChatRoomResult>>;

		/**
		 * Joins the chat room.
		 *
		 * @note
		 * After a user joins successfully, other members in the chat room will receive operation: 'memberPresence' in the onChatroomEvent callback.
		 *
		 * ```typescript
		 * connection.joinChatRoom({roomId: 'roomId'})
		 * ```
		 */
		joinChatRoom(
			this: Connection,
			params: {
				/** The chat room ID. */
				roomId: string;
				/** The reason for joining the chat room. Not enabled. */
				message?: string;
				success?: (res: AsyncResult<CommonRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult>>;

		/**
		 * @deprecated Use {@link leaveChatRoom} instead.
		 * Exits the chat room.
		 *
		 * @note
		 * When a member exits the chat room, other members will receive "operation: 'memberAbsence'" in the callback of onChatroomEvent.
		 *
		 * ```typescript
		 * connection.leaveChatRoom({roomId: 'roomId'}
		 *
		 * ```typescript
		 * connection.quitChatRoom({roomId: 'roomId'})
		 * ```
		 */
		quitChatRoom(
			this: Connection,
			params: {
				/** The chat room ID. */
				roomId: string;
				success?: (res: AsyncResult<{ result: boolean }>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<{ result: boolean }>>;

		/**
		 * Exits the chat room.
		 *
		 * @note
		 * When a member exits the chat room, other members will receive "operation: 'memberAbsence'" in the callback of onChatroomEvent.
		 *
		 * ```typescript
		 * connection.leaveChatRoom({roomId: 'roomId'})
		 * ```
		 */
		leaveChatRoom(
			this: Connection,
			params: {
				/** The chat room ID. */
				roomId: string;
				success?: (res: AsyncResult<{ result: boolean }>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<{ result: boolean }>>;

		/** @deprecated */
		listChatRoomMember(
			this: Connection,
			params: {
				/** The page number, starting from 1. */
				pageNum: number;
				/** The number of members per page. The value cannot exceed 1,000. */
				pageSize: number;
				/** The chat room ID. */
				chatRoomId: string;
				success?: (res: AsyncResult<{ member: string }[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<{ member: string }[]>>;

		/**
		 * Lists all chat room members with pagination.
		 *
		 * ```typescript
		 * connection.listChatRoomMembers({pageNum: 1, pageSize: 20, chatRoomId: 'chatRoomId'})
		 * ```
		 */
		listChatRoomMembers(
			this: Connection,
			params: {
				/** The page number, starting from 1. */
				pageNum: number;
				/** The number of members per page. The value cannot exceed 1,000. */
				pageSize: number;
				/** The chat room ID. */
				chatRoomId: string;
				success?: (res: AsyncResult<{ member: string }[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<{ member: string }[]>>;

		/**
		 * Gets all admins of the chat room.
		 *
		 * ```typescript
		 * connection.getChatRoomAdmin({chatRoomId: 'chatRoomId'})
		 * ```
		 */
		getChatRoomAdmin(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				success?: (res: AsyncResult<GetChatRoomAdminResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GetChatRoomAdminResult>>;

		/**
		 * Sets a member as the chat room admin.
		 *
		 * @note
		 * Only the chat room owner can call this method. The new admin will receive "operation: 'setAdmin'" in the callback of `onChatroomEvent`.
		 *
		 * ```typescript
		 * connection.setChatRoomAdmin({chatRoomId: 'chatRoomId', username: 'user1'})
		 * ```
		 */
		setChatRoomAdmin(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				/** The members to be set as admin. */
				username: string;
				success?: (res: AsyncResult<SetChatRoomAdminResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<SetChatRoomAdminResult>>;

		/**
		 * Removes chat room admins.
		 *
		 * @note
		 * Only the chat room owner can call this method. The users whose admin privileges are removed will receive "operation: 'removeAdmin'" in the callback of `onChatroomEvent`.
		 *
		 * ```typescript
		 * connection.removeChatRoomAdmin({chatRoomId: 'chatRoomId', username: 'user1'})
		 * ```
		 */
		removeChatRoomAdmin(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				/** The admins to be removed. */
				username: string;
				success?: (res: AsyncResult<RemoveChatRoomAdminResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<RemoveChatRoomAdminResult>>;

		/**
		 * Mutes chat room member.
		 *
		 * @note
		 * Only the chat room owner or admins can call this method. The muted member and other admins will receive "operation:'muteMember'" in the callback of `onChatroomEvent`.
		 *
		 * ```typescript
		 * connection.muteChatRoomMember({username: 'user1', muteDuration: -1, chatRoomId: 'chatRoomId'})
		 * ```
		 */
		muteChatRoomMember(
			this: Connection,
			params: {
				/** The member to be muted in the chat room. */
				username: string;
				/** The mute duration in milliseconds. The value `-1` indicates that the member is muted permanently. */
				muteDuration: number;
				/** The chat room ID. */
				chatRoomId: string;
				success?: (res: AsyncResult<MuteChatRoomMemberResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<MuteChatRoomMemberResult>>;

		/**
		 * @deprecated Use {@link unmuteChatRoomMember} instead.
		 * Unmutes the chat room member.
		 *
		 * @note
		 * Only the chat room owner or admins can call this method. The members who are unmuted and other admins will receive "operation: 'unmuteMember'" in the callback of onChatroomEvent.
		 *
		 * ```typescript
		 * connection.removeMuteChatRoomMember({chatRoomId: 'chatRoomId', username: 'user1'})
		 * ```
		 */
		removeMuteChatRoomMember(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				/** The member to be unmuted. */
				username: string;
				success?: (
					res: AsyncResult<UnmuteChatRoomMemberResult[]>
				) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<UnmuteChatRoomMemberResult[]>>;

		/**
		 * Unmutes the chat room member.
		 *
		 * @note
		 * Only the chat room owner can call this method. The members who are unmuted and other admins will receive "operation: 'unmuteMember'" in the callback of onChatroomEvent.
		 *
		 * ```typescript
		 * connection.unmuteChatRoomMember({chatRoomId: 'chatRoomId', username: 'user1'})
		 * ```
		 */
		unmuteChatRoomMember(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				/** The member to be unmuted. */
				username: string;
				success?: (
					res: AsyncResult<UnmuteChatRoomMemberResult[]>
				) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<UnmuteChatRoomMemberResult[]>>;

		/** @deprecated */
		getChatRoomMuted(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				success?: (
					res: AsyncResult<GetChatRoomMuteListResult[]>
				) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GetChatRoomMuteListResult[]>>;

		/**
		 * @deprecated
		 * Gets all members who are muted in the chat room.
		 *
		 * ```typescript
		 * connection.getChatRoomMuteList({chatRoomId: 'chatRoomId'})
		 * ```
		 */
		getChatRoomMuteList(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				success?: (
					res: AsyncResult<GetChatRoomMuteListResult[]>
				) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GetChatRoomMuteListResult[]>>;

		/**
		 * Gets all members who are muted in the chat room.
		 *
		 * ```typescript
		 * connection.getChatRoomMutelist({chatRoomId: 'chatRoomId'})
		 * ```
		 */
		getChatRoomMutelist(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				success?: (
					res: AsyncResult<GetChatRoomMuteListResult[]>
				) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GetChatRoomMuteListResult[]>>;

		/**
		 * @deprecated Use {@link blockChatRoomMember} instead.
		 * Adds a member to the the block list of the chat room. Only the chat room owner or admin can call this method.
		 *
		 * ```typescript
		 * connection.chatRoomBlockSingle({chatRoomId: 'chatRoomId', username: 'user1'})
		 * ```
		 */
		chatRoomBlockSingle(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				/** The member to be added to the blocklist. */
				username: string;
				success?: (res: AsyncResult<CommonRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult>>;

		/**
		 * Adds a member to the the block list of the chat room. Only the chat room owner or admin can call this method.
		 *
		 * ```typescript
		 * connection.blockChatRoomMember({chatRoomId: 'chatRoomId', username: 'user1'})
		 * ```
		 */
		blockChatRoomMember(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				/** The member to be added to the blocklist. */
				username: string;
				success?: (res: AsyncResult<CommonRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult>>;

		/** @deprecated */
		chatRoomBlockMulti(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				/** The members to be added to the blocklist. */
				usernames: string[];
				success?: (res: AsyncResult<CommonRequestResult[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult[]>>;

		/**
		 * Adds members to the block list of the chat room. Only the chat room owner or admin can call this method.
		 *
		 * ```typescript
		 * connection.blockChatRoomMembers({usernames: ['user1', 'user2'], chatRoomId: 'chatRoomId'})
		 * ```
		 */
		blockChatRoomMembers(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				/** The members to be added to the blocklist. */
				usernames: string[];
				success?: (res: AsyncResult<CommonRequestResult[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult[]>>;

		/** @deprecated */
		removeChatRoomBlockSingle(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				/** The member to be removed from the blocklist. */
				username: string;
				success?: (res: AsyncResult<CommonRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult>>;

		/**
		 * Removes a member from the block list of the chat room. Only the chat room owner or admin can call this method.
		 *
		 * ```typescript
		 * connection.unblockChatRoomMember({chatRoomId: 'chatRoomId', username: 'user1'})
		 * ```
		 */
		unblockChatRoomMember(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				/** The member to be removed from the block list. */
				username: string;
				success?: (res: AsyncResult<CommonRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult>>;

		/** @deprecated */
		removeChatRoomBlockMulti(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				/** The array of members to be removed from the blocklist. */
				usernames: string[];
				success?: (res: AsyncResult<CommonRequestResult[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult[]>>;

		/**
		 * Removes a member from the the block list of the chat room.
		 *
		 * @note
		 * Only the chat room owner or admin can call this method.
		 *
		 * ```typescript
		 * connection.unblockChatRoomMembers({chatRoomId: 'chatRoomId', usernames: ['user1', 'user2']})
		 * ```
		 */
		unblockChatRoomMembers(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				/** The array of members to be removed from the blocklist. */
				usernames: string[];
				success?: (res: AsyncResult<CommonRequestResult[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult[]>>;

		/** @deprecated */
		getChatRoomBlacklistNew(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				success?: (res: AsyncResult<UserId[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<UserId[]>>;

		/**
		 * Gets the block list of the chat room.
		 *
		 * ```typescript
		 * connection.getChatRoomBlacklist({chatRoomId: 'chatRoomId'})
		 * ```
		 */
		getChatRoomBlacklist(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				success?: (res: AsyncResult<UserId[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<UserId[]>>;

		/**
		 * Mutes all the members in the chatroom. Only the chatroom owner or admin can call this method.
		 *
		 * ```typescript
		 * connection.disableSendChatRoomMsg({chatRoomId: 'chatRoomId'})
		 *
		 */
		disableSendChatRoomMsg(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				success?: (
					res: AsyncResult<WhetherAbleSendChatRoomMsgResult>
				) => void;
				error?: (errror: ErrorEvent) => void;
			}
		): Promise<AsyncResult<WhetherAbleSendChatRoomMsgResult>>;

		/**
		 * Unmute all the members in the chat room. Only the chatroom owner or admin can call this method.
		 *
		 * ```typescript
		 * connection.enableSendChatRoomMsg({chatRoomId: 'chatRoomId'})
		 * ```
		 */
		enableSendChatRoomMsg(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				success?: (
					res: AsyncResult<WhetherAbleSendChatRoomMsgResult>
				) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<WhetherAbleSendChatRoomMsgResult>>;

		/**
		 * @deprecated Use {@link addUsersToChatRoomAllowlist} instead.
		 * Adds members to the allowlist of the chat room. Users added to the allow list of the chat room will receive "operation: 'addUserToAllowlist'" in the callback of onChatroomEvent.
		 *
		 * ```typescript
		 * connection.addUsersToGroupWhitelist({groupId: 'groupId'})
		 * ```
		 */
		addUsersToChatRoomWhitelist(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				/** The members to be added to the allowlist. */
				users: string[];
				success?: (
					res: AsyncResult<
						CommonRequestResult | CommonRequestResult[]
					>
				) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult | CommonRequestResult[]>>;

		/**`
		 * Adds members to the allowlist of the chat room. Users added to the allow list of the chat room will receive "operation: 'addUserToAllowlist'" in the callback of onChatroomEvent.
		 *
		 * ```typescript
		 * connection.addUsersToChatRoomAllowlist({groupId: 'groupId'})
		 * ```
		 */
		addUsersToChatRoomAllowlist(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				/** The members to be added to the allowlist. */
				users: string[];
				success?: (
					res: AsyncResult<
						CommonRequestResult | CommonRequestResult[]
					>
				) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult | CommonRequestResult[]>>;

		/** @deprecated */
		rmUsersFromChatRoomWhitelist(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				/** The members to be removed from the allowlist. */
				userName: string;
				success?: (res: AsyncResult<CommonRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult>>;

		/**
		 * @deprecated Use {@link removeChatRoomAllowlistMember} instead.
		 * Removes members from the allowlist in the chatroom. Only the chatroom owner or admin can call this method. The users who are removed will receive "operation:'removeAllowlistMember'" in the callback of onChatroomEvent.
		 *
		 * ```typescript
		 * connection.removeChatRoomWhitelistMember({chatRoomId: 'chatRoomId', userName: 'user1'})
		 * `
		 */
		removeChatRoomWhitelistMember(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				/** The members to be removed from the allowlist. */
				userName: string;
				success?: (res: AsyncResult<CommonRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult>>;

		/**
		 * Removes members from the allowlist in the chatroom. Only the chatroom owner or admin can call this method. The users who are removed will receive "operation:'removeAllowlistMember'" in the callback of onChatroomEvent.
		 *
		 * ```typescript
		 * connection.removeChatRoomAllowlistMember({chatRoomId: 'chatRoomId', userName: 'user1'})
		 * `
		 */
		removeChatRoomAllowlistMember(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				/** The members to be removed from the allowlist. */
				userName: string;
				success?: (res: AsyncResult<CommonRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult>>;

		/**
		 * @deprecated Use {@link getChatRoomAllowlist} instead.
		 * Gets the allowlist of the chat room. Only the chat room owner or admin can call this method.
		 *
		 * ```typescript
		 * connection.getChatRoomWhitelist({chatRoomId: 'chatRoomId'})
		 * ```
		 */
		getChatRoomWhitelist(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				success: (res: AsyncResult<UserId[]>) => void;
				error: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<UserId[]>>;

		/**
		 * Gets the allowlist of the chat room. Only the chat room owner or admin can call this method.
		 *
		 * ```typescript
		 * connection.getChatRoomAllowlist({chatRoomId: 'chatRoomId'})
		 * ```
		 */
		getChatRoomAllowlist(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				success: (res: AsyncResult<UserId[]>) => void;
				error: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<UserId[]>>;

		/**
		 * @deprecated Use {@link isInChatRoomAllowlist} instead.
		 * Checks whether chat room members are on the allowlist. Only the chat room owner or admin can call this method. The chat room members can check themselves.
		 *
		 * ```typescript
		 * connection.isChatRoomWhiteUser({chatRoomId: 'chatRoomId', userName: 'user1'})
		 * `
		 */
		isChatRoomWhiteUser(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				/** The member ID. */
				userName: string;
				success?: (res: AsyncResult<IsChatRoomWhiteUserResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<IsChatRoomWhiteUserResult>>;

		/**
		 * Checks whether chat room members are on the allowlist. Only the chat room owner or admin can call this method. The chat room members can check themselves.
		 *
		 * ```typescript
		 * connection.isInChatRoomAllowlist({chatRoomId: 'chatRoomId', userName: 'user1'})
		 * `
		 */
		isInChatRoomAllowlist(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				/** The member ID. */
				userName: string;
				success?: (res: AsyncResult<IsChatRoomWhiteUserResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<IsChatRoomWhiteUserResult>>;

		/**
		 * Check whether you are on the chat room mute list.
		 *
		 * ```typescript
		 * connection.isInChatRoomMutelist({chatRoomId: 'chatRoomId'})
		 * ```
		 */
		isInChatRoomMutelist(
			this: any,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
			}
		): Promise<boolean>;

		/**
		 * Gets the announcement of the chat room.
		 *
		 * ```typescript
		 * connection.fetchChatRoomAnnouncement({roomId: 'roomId'})
		 * ```
		 */
		fetchChatRoomAnnouncement(
			this: Connection,
			params: {
				/** The chat room ID. */
				roomId: string;
				success?: (
					res: AsyncResult<FetchChatRoomAnnouncementResult>
				) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<FetchChatRoomAnnouncementResult>>;

		/**
		 * Updates the announcement of the chat room.
		 *
		 * ```typescript
		 * connection.updateChatRoomAnnouncement({roomId: 'roomId', announcement: 'hello'})
		 * `
		 */
		updateChatRoomAnnouncement(
			this: Connection,
			params: {
				/** The chat room ID. */
				roomId: string;
				/** The announcement content. */
				announcement: string;
				success: (
					res: AsyncResult<UpdateChatRoomAnnouncementResult>
				) => void;
				error: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<UpdateChatRoomAnnouncementResult>>;

		/**
		 * Uploads a shared file to the chat room.
		 *
		 * ```typescript
		 * connection.uploadChatRoomSharedFile({roomId: 'roomId', file: 'file object', onFileUploadProgress: onFileUploadProgress, onFileUploadComplete: onFileUploadComplete,onFileUploadError:onFileUploadError,onFileUploadCanceled:onFileUploadCanceled})
		 * ```
		 */
		uploadChatRoomSharedFile(
			this: Connection,
			params: {
				/** The chat room ID. */
				roomId: string;
				/** The shared file object to upload. */
				file: object;
				/** The upload progress callback. */
				onFileUploadProgress?: (data: any) => void;
				/** The upload completion callback. */
				onFileUploadComplete?: (data: any) => void;
				/** The upload failure callback. */
				onFileUploadError?: (data: any) => void;
				/** The upload cancellation callback. */
				onFileUploadCanceled?: (data: any) => void;
			}
		): void;

		/**
		 * Deletes a shared file of the chat room.
		 *
		 * ```typescript
		 * connection.deleteChatRoomSharedFile({roomId: 'roomId', fileId: 'fileId'})
		 *
		 */
		deleteChatRoomSharedFile(
			this: Connection,
			params: {
				/** The chat room ID. */
				roomId: string;
				/** The shared file ID. */
				fileId: string;
				success?: (
					res: AsyncResult<DeleteChatRoomSharedFileResult>
				) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<DeleteChatRoomSharedFileResult>>;

		/**
		 * @deprecated Use {@link getChatRoomSharedFilelist}
		 * Gets a list of shared files in the chat room.
		 *
		 * ```typescript
		 * connection.fetchChatRoomSharedFileList({roomId: 'roomId'})
		 * ```
		 */
		fetchChatRoomSharedFileList(
			this: Connection,
			params: {
				/** The chat room ID. */
				roomId: string;
				success?: (
					res: AsyncResult<FetchChatRoomSharedFileListResult[]>
				) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<FetchChatRoomSharedFileListResult[]>>;

		/**
		 * Gets a list of shared files in the chat room.
		 *
		 * ```typescript
		 * connection.getChatRoomSharedFilelist({roomId: 'roomId'})
		 * ```
		 */
		getChatRoomSharedFilelist(
			this: Connection,
			params: {
				/** The chat room ID. */
				roomId: string;
				success?: (
					res: AsyncResult<FetchChatRoomSharedFileListResult[]>
				) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<FetchChatRoomSharedFileListResult[]>>;

		// Group API
		/**  @deprecated User {@link createGroup instead.} */
		createGroupNew(
			this: Connection,
			params: {
				/** The group information. */
				data: {
					/** The group name. */
					groupname: string;
					/** The description of the group. */
					desc: string;
					/** The array of member IDs to add to the group. These users will be added directly into the group and receive "operation: 'directJoined'" in the callback of onGroupEvent. */
					members: UserId[];
					/** Whether it is a public group. -`true`: Yes; -`false`: No. Public group: the group that others can query by calling `listgroups`. */
					public: boolean;
					/** Whether a user requires the approval from the group admin to join the group. -`true`: Yes; -`false`: No.*/
					approval: boolean;
					/** Whether to allow group members to invite others to the group. `true`: Allow; `false`: Do not allow.*/
					allowinvites: boolean;
					/** Whether the invitee needs to accept the invitation before joining the group. 
					- `true`: The invitee's consent is required. The default value is `true`.
					- `false`: The invitee will be directly added to the group without confirmation.  
					*/
					inviteNeedConfirm: boolean;
					/** The group max users. */
					maxusers: number;
					/** Group detail extensions which can be in the JSON format to contain more group information. */
					ext?: string;
				};
				success?: (res: AsyncResult<CreateGroupResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CreateGroupResult>>;

		/**
         * Creates group
         * 
         * ```typescript
         * connection.createGroup({
            data: {
                groupname: 'groupname',
                desc: 'this is my group',
                members: ['user1', 'user2'],
                public: true,
                approval: false,
                allowinvites: true,
                inviteNeedConfirm: false
            }
        })
        * ```
        */
		createGroup(
			this: Connection,
			params: {
				/** The group information. */
				data: {
					/** The group name. */
					groupname: string;
					/** The description of the group. */
					desc: string;
					/** The array of member IDs to add to the group. These users will be added directly into the group and receive "operation: 'directJoined'" in the callback of onGroupEvent. */
					members: UserId[];
					/** Whether it is a public group. -`true`: Yes; -`false`: No. Public group: the group that others can query by calling `listgroups`. */
					public: boolean;
					/** Whether a user requires the approval from the group admin to join the group. -`true`: Yes; -`false`: No.*/
					approval: boolean;
					/** Whether to allow group members to invite others to the group. `true`: Allow; `false`: Do not allow.*/
					allowinvites: boolean;
					/** Whether the invitee needs to accept the invitation before joining the group. 
					- `true`: The invitee's consent is required. The default value is `true`.
					- `false`: The invitee will be directly added to the group without confirmation.  
					*/
					inviteNeedConfirm: boolean;
					/** The group max users. */
					maxusers: number;
					/** Group detail extensions which can be in the JSON format to contain more group information. */
					ext?: string;
				};
				success?: (res: AsyncResult<CreateGroupResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CreateGroupResult>>;

		/**  @deprecated Use {@link blockGroupMessages instead.} */
		blockGroup(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				success?: (res: AsyncResult<BlockGroupResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<BlockGroupResult>>;

		/**
		 * Blocks group messages. This method is only valid for mobile devices.
		 * ```typescript
		 * connection.blockGroupMessages({groupId: 'groupId'})
		 * ```
		 */
		blockGroupMessages(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				success?: (res: AsyncResult<BlockGroupResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<BlockGroupResult>>;

		/**
		 * @deprecated Use {@link getPublicGroups} instead.
		 * Gets public groups with pagination.
		 *
		 * ```typescript
		 * connection.listGroups({limit: 20, cursor: null})
		 * ```
		 */
		listGroups(
			this: Connection,
			params: {
				/** The number of records per page. */
				limit: number;
				/** The cursor that specifies where to start to get data. If there will be data on the next page, this method will return the value of this field to indicate the position to start to get data of the next page. If it is null, the data of the first page will be fetched. */
				cursor?: string;
				success?: (res: AsyncResult<BaseGroupInfo[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<BaseGroupInfo[]>>;

		/**
		 * Gets public groups with pagination.
		 *
		 * ```typescript
		 * connection.getPublicGroups({limit: 20, cursor: null})
		 * ```
		 */
		getPublicGroups(
			this: Connection,
			params: {
				/** The number of records per page. */
				limit: number;
				/** The cursor that specifies where to start to get data. If there will be data on the next page, this method will return the value of this field to indicate the position to start to get data of the next page. If it is null, the data of the first page will be fetched. */
				cursor?: string;
				success?: (res: AsyncResult<BaseGroupInfo[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<BaseGroupInfo[]>>;

		/**
		 * Lists all the groups a user has joined.
		 *
		 * ```typescript
		 * connection.getGroup()
		 * ```
		 * @deprecated Use {@link getJoinedGroups instead.}
		 */
		getGroup(
			this: Connection,
			params?: {
				success?: (res: AsyncResult<BaseGroupInfo[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<BaseGroupInfo[]>>;

		/**
		 * Lists all the groups a user has joined.
		 *
		 * @note
		 * If either `needAffiliations` or `needAffiliations` is set `true`, when you get data with pagination, the current page number (pageNum) starts from 0 and you can get a maximum of 20 groups (pageSize) on each page and
		 * the function return type is `Promise<AsyncResult<GroupTypes.GroupInfo[]>`
		 *
		 * If neither of the parameters is set, when you get data with pagination, the current page number (pageNum) starts from 1 and you can get a maximum of 500 groups (pageSize) on each page and and
		 * the function return type is `Promise<AsyncResult<GroupTypes.BaseGroupInfo[]>`
		 *
		 * ```typescript
		 * connection.getJoinedGroups({
		 * 		pageNum: 1,
		 * 		pageSize: 500,
		 * 		needAffiliations: false,
		 * 		needRole: false
		 * })
		 * ```
		 */
		getJoinedGroups(
			this: Connection,
			params: {
				/**
				 * If either `needAffiliations` or `needAffiliations` is set, when you get data with pagination, the current page number (pageNum) starts from 0.
				 *
				 * If neither of the parameters is set, when you get data with pagination, the current page number (pageNum) starts from 1.
				 * */
				pageNum: number;
				/**
				 * If either `needAffiliations` or `needAffiliations` is set, when you get data with pagination, you can get a maximum of 20 groups (pageSize) on each page.
				 *
				 * If neither of the parameters is set, when you get data with pagination, you can get a maximum of 500 groups (pageSize) on each page.
				 * */
				pageSize: number;
				/** Whether the number of group members is required.
				 * `true`: Yes;
				 * （Default）`false`: No.
				 */
				needAffiliations?: boolean;
				/** Whether the role of the current user in the group is required.
				 * `true`: Yes;
				 * （Default）`false`: No.
				 */
				needRole?: boolean;
				success?: (
					res: AsyncResult<BaseGroupInfo[] | GroupInfo[]>
				) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<BaseGroupInfo[] | GroupInfo[]>>;

		/**  @deprecated */
		changeOwner(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** The new group owner. */
				newOwner: UserId;
				success?: (res: AsyncResult<ChangeGroupOwnerResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<ChangeGroupOwnerResult>>;

		/**
		 * Transfers a group. Only the group owner can call this method. Group members will receive "operation: 'changeOwner'" in the callback of onGroupEvent.
		 *
		 * ```typescript
		 * connection.changeGroupOwner({groupId: 'groupId', newOwner: 'user1'})
		 * ```
		 */
		changeGroupOwner(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** The new group owner. */
				newOwner: UserId;
				success?: (res: AsyncResult<ChangeGroupOwnerResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<ChangeGroupOwnerResult>>;

		/**
		 * Gets specifications of the group.
		 * ```typescript
		 * connection.getGroupInfo({groupId: groupId})
		 * ```
		 */
		getGroupInfo(
			this: Connection,
			params: {
				/** The group ID or group ID list. */
				groupId: string | string[];
				success?: (res: AsyncResult<GroupDetailInfo[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GroupDetailInfo[]>>;

		/**
		 * Modifies group information. Only the group admin can call this method.
		 *
		 * ```typescript
		 * connection.modifyGroup({groupId: 'groupId', groupName: 'groupName', description:'description'})
		 * ```
		 */
		modifyGroup(
			this: Connection,
			params: {
				/** The Group ID. */
				groupId: string;
				/** The group name. */
				groupName?: string;
				/** The group description. */
				description?: string;
				/** Group detail extensions which can be in the JSON format to contain more group information. */
				ext?: string;
				success?: (res: AsyncResult<ModifyGroupResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<ModifyGroupResult>>;

		/**  @deprecated */
		listGroupMember(
			this: Connection,
			params: {
				/** The group ID。 */
				groupId: string;
				/** The page number, starting from 1. */
				pageNum: number;
				/** The number of members per page. The value cannot exceed 1000. */
				pageSize: number;
				success?: (res: AsyncResult<GroupMember[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GroupMember[]>>;

		/**
		 * Lists all members of the group with pagination.
		 *
		 * ```typescript
		 * connection.listGroupMembers({pageNum: 1, pageSize: 20, groupId: 'groupId'})
		 * ```
		 */
		listGroupMembers(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** The page number, starting from 1. */
				pageNum: number;
				/** The number of members per page. The value cannot exceed 1000. */
				pageSize: number;
				success?: (res: AsyncResult<GroupMember[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GroupMember[]>>;

		/**
		 * Gets all admins in the group.
		 * ```typescript
		 * connection.getGroupAdmin({groupId: 'groupId'})
		 * ```
		 */
		getGroupAdmin(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				success?: (res: AsyncResult<UserId[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<UserId[]>>;

		/**  @deprecated Use {@link setGroupAdmin instead.} */
		setAdmin(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** The ID of the user set as admin. */
				username: UserId;
				success?: (res: AsyncResult<SetGroupAdminResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<SetGroupAdminResult>>;

		/**
		 * Sets a group admin. Only the group owner can call this method. The user set as an admin will receive "operation: 'setAdmin'" in the callback of onGroupEvent.
		 *
		 * ```typescript
		 * connection.setGroupAdmin({groupId: 'groupId', username: 'user1'})
		 * ```
		 */
		setGroupAdmin(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** The ID of the user set as admin. */
				username: UserId;
				success?: (res: AsyncResult<SetGroupAdminResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<SetGroupAdminResult>>;

		/**
		 * @deprecated Use {@link removeGroupAdmin} instead.
		 * Removes a group admin. Only the group owner can call this method. The user whose admin permissions are revoked will receive "operation: 'removeAdmin'" in the callback of onGroupEvent.
		 *
		 * ```typescript
		 * connection.removeAdmin({groupId: 'groupId', username: 'user1'})
		 * ```
		 */
		removeAdmin(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** The ID of the user with admin privileges revoked. */
				username: string;
				success?: (res: AsyncResult<RemoveGroupAdminResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<RemoveGroupAdminResult>>;

		/**
		 * Removes a group admin. Only the group owner can call this method. The user whose admin permissions are revoked will receive "operation: 'removeAdmin'" in the callback of onGroupEvent.
		 *
		 * ```typescript
		 * connection.removeGroupAdmin({groupId: 'groupId', username: 'user1'})
		 * ```
		 */
		removeGroupAdmin(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** The ID of the user with admin privileges revoked. */
				username: string;
				success?: (res: AsyncResult<RemoveGroupAdminResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<RemoveGroupAdminResult>>;

		/**  @deprecated Use {@link destroyGroup instead.}*/
		dissolveGroup(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				success?: (res: AsyncResult<DestroyGroupResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<DestroyGroupResult>>;

		/**
		 * Destroys a group. Only the group owner can call this method. Group members will receive "operation: 'destroy'" in the callback of onGroupEvent.
		 *
		 * ```typescript
		 * connection.destroyGroup({groupId: 'groupId'})
		 * ```
		 */
		destroyGroup(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				success?: (res: AsyncResult<DestroyGroupResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<DestroyGroupResult>>;

		/**
		 * @deprecated Use {@link leaveGroup} instead.
		 * Leaves the group. Group members will receive "operation: 'memberAbsence'" in the callback of onGroupEvent.
		 *
		 * ```typescript
		 * connection.quitGroup({groupId: 'groupId'})
		 * ```
		 */
		quitGroup(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				success?: (res: AsyncResult<{ result: true }>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<{ result: true }>>;

		/**
		 * Leaves the group. Group members will receive "operation: 'memberAbsence'" in the callback of onGroupEvent.
		 *
		 * ```typescript
		 * connection.leaveGroup({groupId: 'groupId'})
		 * ```
		 */
		leaveGroup(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				success?: (res: AsyncResult<{ result: true }>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<{ result: true }>>;

		/** @deprecated Use {@link inviteUsersToGroup} instead.*/
		inviteToGroup(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** The array of invitee IDs. */
				users: UserId[];
				success?: (
					res: AsyncResult<InviteUsersToGroupResult[]>
				) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<InviteUsersToGroupResult[]>>;

		/**
		 * Invites users into a group.
		 * Creates a group instance "inviteNeedConfirm:true", the invited users will receive "operation: 'inviteToJoin'" in the callback of onGroupEvent.
		 * Creates a group instance "inviteNeedConfirm:false", the invited users will receive "operation: 'directJoined'" in the callback of onGroupEvent.
		 *
		 * ```typescript
		 * connection.inviteUsersToGroup({groupId: 'groupId', users: ['user1', 'user2']})
		 * ```
		 */
		inviteUsersToGroup(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** The array of invitee IDs. */
				users: UserId[];
				success?: (
					res: AsyncResult<InviteUsersToGroupResult[]>
				) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<InviteUsersToGroupResult[]>>;

		/**
		 * Applies to join the group. The group owner and admin will receive "operation: 'requestToJoin'" in the callback of onGroupEvent.
		 *
		 * ```typescript
		 * connection.joinGroup({groupId: 'groupId', message: 'I want to join the group'})
		 * ```
		 */
		joinGroup(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** The additional information of the request. */
				message: string;
				success?: (res: AsyncResult<CommonRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult>>;

		/**  @deprecated Use {@link acceptGroupJoinRequest} instead. */
		agreeJoinGroup(
			this: Connection,
			params: {
				/** The ID of the user requesting to join the group. */
				applicant: UserId;
				/** The group ID. */
				groupId: string;
				success?: (res: AsyncResult<CommonRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult>>;

		/**
		 * Accepts a group request. Only the group owner or admin can call this method. The user joining the group will receive "operation: 'acceptRequest'" in the callback of onGroupEvent.
		 *
		 * ```typescript
		 * connection.acceptGroupJoinRequest({applicant: 'user1', groupId: 'groupId'})
		 * ```
		 */
		acceptGroupJoinRequest(
			this: Connection,
			params: {
				/** The ID of the user requesting to join the group. */
				applicant: UserId;
				/** The group ID. */
				groupId: string;
				success?: (res: AsyncResult<CommonRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult>>;

		/**  @deprecated  Use {@link rejectGroupJoinRequest} instead. */
		rejectJoinGroup(
			this: Connection,
			params: {
				/** The ID of the user who sends the request to join the group. */
				applicant: UserId;
				/** The group ID. */
				groupId: string;
				/** The reason of declining. */
				reason: string;
				success?: (res: AsyncResult<CommonRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult>>;

		/**
		 * Declines a group request. Only the group owner or admin can call this method.
		 *
		 * ```typescript
		 * connection.rejectGroupJoinRequest({applicant: 'user1', groupId: 'groupId', reason: 'I do not like you'})
		 * ```
		 */
		rejectGroupJoinRequest(
			this: Connection,
			params: {
				/** The ID of the user who sends the request to join the group. */
				applicant: UserId;
				/** The group ID. */
				groupId: string;
				/** The reason of declining. */
				reason: string;
				success?: (res: AsyncResult<CommonRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult>>;

		/**  @deprecated  Use {@link acceptGroupInvite} instead. */
		agreeInviteIntoGroup(
			this: Connection,
			params: {
				/** The user ID of the invitee. */
				invitee: UserId;
				/** The group ID. */
				groupId: string;
				success?: (res: AsyncResult<CommonRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult>>;

		/**
		 * Accepts a group invitation. If a group member invites a user to join the group, the invitee can call this method to accept the invitation. The inviter will receive "operation: 'acceptInvite'" in the callback of onGroupEvent. The user who joins the group successfully will receive "operation: 'memberPresence'" in the callback of onGroupEvent.
		 *
		 * ```typescript
		 * connection.acceptGroupInvite({invitee: 'myUserId', groupId: 'groupId'})
		 * ```
		 */
		acceptGroupInvite(
			this: Connection,
			params: {
				/** The user ID of the invitee. */
				invitee: UserId;
				/** The group ID. */
				groupId: string;
				success?: (res: AsyncResult<CommonRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult>>;

		/**  @deprecated Use {@link rejectGroupInvite} instead. */
		rejectInviteIntoGroup(
			this: Connection,
			params: {
				/** The user ID of the invitee. */
				invitee: UserId;
				/** The group ID. */
				groupId: string;
				success?: (res: AsyncResult<CommonRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult>>;

		/**
		 * Declines a group invitation. If a group member invites a user to join a group, the invitee can call this method to decline the invitation.
		 *
		 * ```typescript
		 * connection.rejectGroupInvite({invitee: 'myUserId', groupId: 'groupId'})
		 * ```
		 */
		rejectGroupInvite(
			this: Connection,
			params: {
				/** The user ID of the invitee. */
				invitee: UserId;
				/** The group ID. */
				groupId: string;
				success?: (res: AsyncResult<CommonRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult>>;

		/**  @deprecated  Use {@link removeGroupMember} instead. */
		removeSingleGroupMember(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** The member ID to remove. */
				username: UserId;
				success?: (res: AsyncResult<RemoveGroupMemberResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<RemoveGroupMemberResult>>;

		/**
		 * Removes a member from the group. Only the group owner or admin can call this method. The removed member will receive "operation: 'removeMember' in the callback of onGroupEvent, and other group members will receive "operation: 'memberAbsence' in the callback of onGroupEvent.
		 *
		 * ```typescript
		 * connection.removeGroupMember({groupId: 'groupId', username: 'user1'})
		 * ```
		 */
		removeGroupMember(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** The member ID to remove. */
				username: UserId;
				success?: (res: AsyncResult<RemoveGroupMemberResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<RemoveGroupMemberResult>>;

		/**  @deprecated  Use {@link removeGroupMembers} instead. */
		removeMultiGroupMember(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** The array of member IDs to remove. */
				users: UserId[];
				success?: (res: AsyncResult<RemoveGroupMemberResult[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<RemoveGroupMemberResult[]>>;

		/**
		 * Removes members from the group. Only the group owner or admin can call this method. The removed members will receive "operation: 'removeMember'" in the callback of onGroupEvent, and other group members will receive "operation: 'memberAbsence' in the callback of onGroupEvent.
		 *
		 * ```typescript
		 * connection.removeGroupMembers({groupId: 'groupId', users: ['user1', 'user2']})
		 * ```
		 */
		removeGroupMembers(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** The array of member IDs to remove. */
				users: UserId[];
				success?: (res: AsyncResult<RemoveGroupMemberResult[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<RemoveGroupMemberResult[]>>;

		/**  @deprecated  Use {@link muteGroupMember} instead. */
		mute(
			this: Connection,
			params: {
				/** The ID of the group member to mute. */
				username: UserId | UserId[];
				/** The mute duration in milliseconds. The value `-1` indicates that the member is muted permanently.*/
				muteDuration: number;
				/** The group ID. */
				groupId: string;
				success?: (res: AsyncResult<MuteGroupMemberResult[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<MuteGroupMemberResult[]>>;

		/**
		 * Mutes a group member. Only the group owner or admin can call this method. The muted member and other members will receive "operation:'muteMember'" in the callback of onGroupEvent.
		 *
		 * ```typescript
		 * connection.muteGroupMember({username: 'user1', muteDuration: -1, groupId: 'groupId'})
		 * ```
		 */
		muteGroupMember(
			this: Connection,
			params: {
				/** The ID of the group member to mute. */
				username: UserId | UserId[];
				/** The mute duration in milliseconds. The value `-1` indicates that the member is muted permanently.*/
				muteDuration: number;
				/** The group ID. */
				groupId: string;
				success?: (res: AsyncResult<MuteGroupMemberResult[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<MuteGroupMemberResult[]>>;

		/**  @deprecated  Use {@link unmuteGroupMember} instead. */
		removeMute(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** The group member ID to unmute. */
				username: UserId | UserId[];
				success?: (res: AsyncResult<UnmuteGroupMemberResult[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<UnmuteGroupMemberResult[]>>;

		/**
		 * Unmute a group member. Only the group owner or admin can call this method. All members, including the muted, will receive "operation: 'unmuteMember'" in the callback of onGroupEvent.
		 *
		 * ```typescript
		 * connection.unmuteGroupMember({groupId: 'groupId', username: 'user1'})
		 * ```
		 */
		unmuteGroupMember(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** The group member ID to unmute. */
				username: UserId | UserId[];
				success?: (res: AsyncResult<UnmuteGroupMemberResult[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<UnmuteGroupMemberResult[]>>;

		/**  @deprecated  Use {@link getGroupMutelist} instead. */
		getMuted(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				success?: (res: AsyncResult<GetGroupMuteListResult[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GetGroupMuteListResult[]>>;

		/**
		 * Gets the mute list of the group.
		 *
		 * ```typescript
		 * connection.getGroupMuteList({groupId: 'groupId'})
		 * ```
		 */
		getGroupMuteList(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				success?: (res: AsyncResult<GetGroupMuteListResult[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GetGroupMuteListResult[]>>;

		/**  @deprecated  Use {@link blockGroupMember} instead. */
		groupBlockSingle(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** User ID to be added to the blocklist. */
				username: UserId;
				success?: (res: AsyncResult<GroupRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GroupRequestResult>>;

		/**
		 * Adds a member to the group blocklist. Only the group owner or admin can call this method. The member added to the blocklist will receive "operation: 'removeMember'" in the callback of onGroupEvent.
		 *
		 * ```typescript
		 * connection.blockGroupMember({groupId: 'groupId', username: 'user1'})
		 * ```
		 */
		blockGroupMember(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** User ID to be added to the blocklist. */
				username: UserId;
				success?: (res: AsyncResult<GroupRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GroupRequestResult>>;

		/**  @deprecated  Use {@link blockGroupMembers} instead. */
		groupBlockMulti(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** The array of member's user IDs to be added to the blocklist. */
				usernames: UserId[];
				success?: (res: AsyncResult<GroupRequestResult[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GroupRequestResult[]>>;

		/**
		 * Adds members to the group blocklist in bulk. Only the group admin can call this method. Members added to the blocklist will receive "operation: 'removeMember'" in the callback of onGroupEvent.
		 *
		 * ```typescript
		 * connection.blockGroupMembers({usernames: ['user1', 'user2'], groupId: 'groupId'})
		 * ```
		 */
		blockGroupMembers(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** The array of member's user IDs to be added to the blocklist. */
				usernames: UserId[];
				success?: (res: AsyncResult<GroupRequestResult[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GroupRequestResult[]>>;

		/**  @deprecated  Use {@link unblockGroupMember} instead. */
		removeGroupBlockSingle(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** The user ID of the member to be removed from the blocklist. */
				username: string;
				success?: (res: AsyncResult<GroupRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GroupRequestResult>>;

		/**
		 * Removes a member from the group blocklist. Only the group admin can call this method. Members who have been removed from the blocklist will receive "operation: 'unblockMember'" in the callback of onGroupEvent.
		 *
		 * ```typescript
		 * connection.unblockGroupMember({groupId: 'groupId'})
		 * ```
		 */
		unblockGroupMember(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** The user ID of the member to be removed from the blocklist. */
				username: string;
				success?: (res: AsyncResult<GroupRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GroupRequestResult>>;

		/**  @deprecated  Use {@link unblockGroupMembers} instead. */
		removeGroupBlockMulti(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** The array of members‘ user IDs to be removed from the group blocklist. */
				usernames: UserId[];
				success?: (res: AsyncResult<GroupRequestResult[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GroupRequestResult[]>>;

		/**
		 * Removes members from the group blocklist in bulk. Only the group owner or admin can call this method. Members who are removed from the blocklist will receive "operation: 'unblockMember'" in the callback of onGroupEvent.
		 *
		 * ```typescript
		 * connection.unblockGroupMembers({groupId: 'groupId', usernames: ['user1', 'user2']})
		 * ```
		 */
		unblockGroupMembers(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** The array of members‘ user IDs to be removed from the group blocklist. */
				usernames: UserId[];
				success?: (res: AsyncResult<GroupRequestResult[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GroupRequestResult[]>>;

		/**  @deprecated  Use {@link getGroupBlocklist} instead. */
		getGroupBlacklistNew(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				success?: (res: AsyncResult<UserId[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<UserId[]>>;

		/**
		 * @deprecated Use {@link getGroupBlocklist} instead.
		 */
		getGroupBlacklist(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				success?: (res: AsyncResult<UserId[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<UserId[]>>;

		/**
		 * Gets the group blocklist.
		 *
		 * ```typescript
		 * connection.getGroupBlocklist({groupId: 'groupId'})
		 * ```
		 */
		getGroupBlocklist(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				success?: (res: AsyncResult<UserId[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<UserId[]>>;

		/**
		 * Mutes all members. Only the group admin or above can call this method. Group members will receive "operation: 'muteAllMembers'" in the callback of onGroupEvent.
		 *
		 * ```typescript
		 *  connection.disableSendGroupMsg({groupId: 'groupId'})
		 * ```
		 */
		disableSendGroupMsg(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				success?: (res: AsyncResult<{ mute: true }>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<{ mute: true }>>;

		/**
		 * Unmute all members. Only the group admin or above can call this method. Group members will receive "operation: 'unmuteAllMembers'" in the callback of onGroupEvent.
		 *
		 * ```typescript
		 * connection.enableSendGroupMsg({groupId: 'groupId'})
		 * ```
		 */
		enableSendGroupMsg(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				success?: (res: AsyncResult<{ mute: false }>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<{ mute: false }>>;

		/**
		 * @deprecated Use {@link addUsersToGroupAllowlist} instead.
		 * Adds members to the group allowlist. Members on the allowlist can still post messages even if they are muted in the group. Only the group admin or above can call this method. Members added to the allowlist will receive "operation: 'addUserToAllowlist'" in the callback of onGroupEvent.
		 *
		 * ```typescript
		 * connection.addUsersToGroupWhitelist({groupId: 'groupId'})
		 * ```
		 */
		addUsersToGroupWhitelist(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** An array of member IDs to be added to the allowlist. */
				users: UserId[];
				success?: (res: AsyncResult<GroupRequestResult[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GroupRequestResult[]>>;

		/**
		 * Adds members to the group allowlist. Members on the allowlist can still post messages even if they are muted in the group. Only the group admin or above can call this method. Members added to the allowlist will receive "operation: 'addUserToAllowlist'" in the callback of onGroupEvent.
		 *
		 * ```typescript
		 * connection.addUsersToGroupAllowlist({groupId: 'groupId'})
		 * ```
		 */
		addUsersToGroupAllowlist(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** An array of member IDs to be added to the allowlist. */
				users: UserId[];
				success?: (res: AsyncResult<GroupRequestResult[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GroupRequestResult[]>>;

		/**  @deprecated  Use {@link removeGroupWhitelistMember} instead. */
		rmUsersFromGroupWhitelist(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** The ID of the member to be removed from the group allowlist. */
				userName: UserId;
				success?: (res: AsyncResult<GroupRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GroupRequestResult>>;

		/**
		 * @deprecated  Use {@link removeGroupAllowlistMember} instead.
		 * Removes a member from the group allowlist. Only the group admin or above can call this method. The user that is removed from the group allowlist will receive "operation:'removeAllowlistMember'" in the callback of onGroupEvent.
		 *
		 * ```typescript
		 * connection.removeGroupWhitelistMember({groupId: 'groupId', userName: 'user1'})
		 * ```
		 */
		removeGroupWhitelistMember(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** The ID of the member to be removed from the group allowlist. */
				userName: UserId;
				success?: (res: AsyncResult<GroupRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GroupRequestResult>>;

		/**
		 * Removes a member from the group allowlist. Only the group admin or above can call this method. The user that is removed from the group allowlist will receive "operation:'removeAllowlistMember'" in the callback of onGroupEvent.
		 *
		 * ```typescript
		 * connection.removeGroupAllowlistMember({groupId: 'groupId', userName: 'user1'})
		 * ```
		 */
		removeGroupAllowlistMember(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** The ID of the member to be removed from the group allowlist. */
				userName: UserId;
				success?: (res: AsyncResult<GroupRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GroupRequestResult>>;

		/**
		 * @deprecated Use {@link getGroupAllowlist} instead.
		 * Gets the group allowlist. Only the group admin or above can call this method.
		 *
		 * ```typescript
		 * connection.getGroupWhitelist({groupId: 'groupId'})
		 * ```
		 */
		getGroupWhitelist(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				success?: (res: AsyncResult<UserId[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<UserId[]>>;

		/**
		 * Gets the group allowlist. Only the group admin or above can call this method.
		 *
		 * ```typescript
		 * connection.getGroupAllowlist({groupId: 'groupId'})
		 * ```
		 */
		getGroupAllowlist(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				success?: (res: AsyncResult<UserId[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<UserId[]>>;

		/**  @deprecated  Use {@link isInGroupAllowlist} instead. */
		isGroupWhiteUser(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** The user ID to query. */
				userName: UserId;
				success?: (res: AsyncResult<IsInGroupWhiteListResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<IsInGroupWhiteListResult>>;

		/**
		 * @deprecated Use {@link isInGroupAllowlist} instead.
		 * Checks whether the current member is on the allowlist. The app admin can check all users; app users can only check themselves.
		 *
		 * ```typescript
		 * connection.isInGroupWhiteList({groupId: 'groupId', userName: 'user1'})
		 * ```
		 */
		isInGroupWhiteList(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** The user ID to query. */
				userName: UserId;
				success?: (res: AsyncResult<IsInGroupWhiteListResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<IsInGroupWhiteListResult>>;

		/**
		 * Checks whether the current member is on the allowlist. The app admin can check all users; app users can only check themselves.
		 *
		 * ```typescript
		 * connection.isInGroupAllowlist({groupId: 'groupId', userName: 'user1'})
		 * ```
		 */
		isInGroupAllowlist(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** The user ID to query. */
				userName: UserId;
				success?: (res: AsyncResult<IsInGroupWhiteListResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<IsInGroupWhiteListResult>>;

		/**
		 * Check whether you are on the group mute list.
		 *
		 * ```typescript
		 * connection.isInGroupMutelist({groupId: 'groupId'})
		 * ```
		 */
		isInGroupMutelist(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
			}
		): Promise<boolean>;

		/**
		 * Checks which members have read group message. This is a [value-added function] and .
		 *
		 * ```typescript
		 * connection.getGroupMsgReadUser({groupId: 'groupId', msgId: 'msgId'})
		 * ```
		 */
		getGroupMsgReadUser(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** The ID of message to query. */
				msgId: string;
				success?: (res: AsyncResult<GetGroupMsgReadUserResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GetGroupMsgReadUserResult>>;

		/**
		 * Gets the group announcement.
		 *
		 * ```typescript
		 * connection.fetchGroupAnnouncement({groupId: 'groupId'})
		 * ```
		 */
		fetchGroupAnnouncement(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				success?: (res: AsyncResult<{ announcement: string }>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<{ announcement: string }>>;

		/**
		 * Updates the group announcement.
		 *
		 * ```typescript
		 * connection.updateGroupAnnouncement({groupId: 'groupId', announcement: 'hello'})
		 * ```
		 */
		updateGroupAnnouncement(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** The group announcement. */
				announcement: string;
				success?: (
					res: AsyncResult<UpdateGroupAnnouncementResult>
				) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<UpdateGroupAnnouncementResult>>;

		/**
		 * Uploads shared files to the group.
		 *
		 * ```typescript
		 * connection.uploadGroupSharedFile({groupId: 'groupId', file: 'file object', onFileUploadProgress: onFileUploadProgress, onFileUploadComplete: onFileUploadComplete,onFileUploadError:onFileUploadError,onFileUploadCanceled:onFileUploadCanceled})
		 * ```
		 */
		uploadGroupSharedFile(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** The shared file object to upload. */
				file: object;
				/** The upload progress callback. */
				onFileUploadProgress?: (data: ProgressEvent) => void;
				/** The upload completion callback. */
				onFileUploadComplete?: (data: any) => void;
				/** The upload failure callback. */
				onFileUploadError?: (data: any) => void;
				/** The upload cancellation callback. */
				onFileUploadCanceled?: (data: any) => void;
			}
		): void;

		/**
		 * Deletes shared files of the group.
		 *
		 * ```typescript
		 * connection.deleteGroupSharedFile({groupId: 'groupId', fileId: 'fileId'})
		 * ```
		 */
		deleteGroupSharedFile(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** The shared file ID. */
				fileId: string;
				success?: (
					res: AsyncResult<DeleteGroupSharedFileResult>
				) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<DeleteGroupSharedFileResult>>;

		/**
		 *  @deprecated Use {@link getGroupSharedFilelist} instead.
		 * Gets a list of shared files in the group.
		 *
		 * ```typescript
		 * connection.fetchGroupSharedFileList({groupId: 'groupId'})
		 * ```
		 */
		fetchGroupSharedFileList(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** The page number, starting from 1. */
				pageNum: number;
				/** The number of members per page. The value cannot exceed 10. */
				pageSize: number;
				success?: (
					res: AsyncResult<FetchGroupSharedFileListResult>
				) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<FetchGroupSharedFileListResult>>;

		/**
		 * Gets a list of shared files in the group.
		 *
		 * ```typescript
		 * connection.getGroupSharedFilelist({groupId: 'groupId'})
		 * ```
		 */
		getGroupSharedFilelist(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** The page number, starting from 1. */
				pageNum: number;
				/** The number of members per page. The value cannot exceed 10. */
				pageSize: number;
				success?: (
					res: AsyncResult<FetchGroupSharedFileListResult>
				) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<FetchGroupSharedFileListResult>>;

		/**
		 * Down load group file.
		 *
		 * ```typescript
		 * connection.downloadGroupSharedFile({groupId: 'groupId', fileId: 'fileId', onFileDownloadComplete: (data)=>{console.log(data)}})
		 * ```
		 */
		downloadGroupSharedFile(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** The shared file ID. */
				fileId: string;
				/** The secret key required to download the file. */
				secret?: string;
				onFileDownloadComplete?: (data: Blob) => void;
				onFileDownloadError?: (err: ErrorEvent) => void;
			}
		): void;

		/**
		 * Sets custom attributes of a group member.
		 * After custom attributes of a group member are set, other members in the group receive the `operation: 'memberAttributesUpdate'`  in the `onGroupEvent` callback and the other devices of the group member receive the  the `operation: 'memberAttributesUpdate'`  in the `onMultiDeviceEvent` callback.
		 *
		 * ```typescript
		 * connection.setGroupMemberAttributes({groupId: 'groupId', userId: 'userId', memberAttributes: {key: 'value'}})
		 * ```
		 */
		setGroupMemberAttributes(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** The user ID of the group member. */
				userId: string;
				/**
				 * The custom attributes to set in key-value format. In a key-value pair, if the value is set to an empty string, the custom attribute will be deleted.
				 */
				memberAttributes: MemberAttributes;
			}
		): Promise<void>;

		/**
		 * Gets all custom attributes of a group member.
		 * ```typescript
		 * connection.getGroupMemberAttributes({groupId: 'groupId', userId: 'userId'})
		 * ```
		 */
		getGroupMemberAttributes(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** The user ID of the group member. */
				userId: string;
			}
		): Promise<AsyncResult<MemberAttributes>>;

		/**
		 * Gets custom attributes of multiple group members by attribute key.
		 * ```typescript
		 * connection.getGroupMembersAttributes({groupId: 'groupId', userIds: ['userId'], keys: ['avatar', 'nickname']})
		 * ```
		 */
		getGroupMembersAttributes(
			this: Connection,
			params: {
				/** The group ID. */
				groupId: string;
				/** The array of user IDs of group members whose custom attributes are retrieved. */
				userIds: UserId[];
				/** The array of keys of custom attributes to be retrieved. If you pass in an empty array or do not set this parameter, the SDK gets all custom attributes of these group members. */
				keys?: string[];
			}
		): Promise<AsyncResult<GetGroupMembersAttributesResult>>;

		// Contact API
		/**
		 * @deprecated Use {@link getBlocklist} instead.
		 * Gets the blocklist.
		 *
		 * ```typescript
		 * connection.getBlacklist()
		 * ```
		 */
		getBlacklist(
			this: Connection,
			params?: {
				success?: (res: AsyncResult<UserId[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<UserId[]>>;

		/**
		 * Gets the blocklist.
		 *
		 * ```typescript
		 * connection.getBlocklist()
		 * ```
		 */
		getBlocklist(
			this: Connection,
			params?: {
				success?: (res: AsyncResult<UserId[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<UserId[]>>;

		/**
		 * Gets the contact list.
		 *
		 * ```typescript
		 * connection.getContacts()
		 * ```
		 */
		getContacts(
			this: Connection,
			params?: {
				success?: (res: RosterData[]) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<UserId[]>>;

		/** @deprecated  Use {@link uploadPushToken} instead. */
		uploadToken(
			this: Connection,
			params: {
				/** The device ID that identifies the device. Custom device IDs are allowed. */
				deviceId: string;
				/** The push token, which identifies a device during message push. Custom push tokens are allowed.*/
				deviceToken: string;
				/** The app ID for the push service, which is the senderID for Firebase Cloud Messaging (FCM) and "appId+#+AppKey" for the vivo push service. */
				notifierName: string;
				success?: (res: AsyncResult<UploadTokenResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<UploadTokenResult>>;

		/**
		 * Uploads the token to the server. This method is used when the SDK is used on a native client on which a third-party push service is to be integrated.
		 *
		 * ```typescript
		 * connection.uploadPushToken({deviceId: 'deviceId', deviceToken: 'deviceToken', notifierName: 'notifierName'})
		 * ```
		 */
		uploadPushToken(
			this: Connection,
			params: {
				/** The device ID that identifies the device. Custom device IDs are allowed. */
				deviceId: string;
				/** The push token, which identifies a device during message push. Custom push tokens are allowed.*/
				deviceToken: string;
				/** The app ID for the push service, which is the senderID for Firebase Cloud Messaging (FCM) and "appId+#+AppKey" for the vivo push service. */
				notifierName: string;
				success?: (res: AsyncResult<UploadTokenResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<UploadTokenResult>>;

		/**
		 * @deprecated Use {@link getConversationlist} instead.
		 * Gets the conversation list.
		 *
		 * ```typescript
		 * connection.getSessionList()
		 * ```
		 */
		getSessionList(
			this: Connection,
			params?: {
				success?: (res: AsyncResult<SessionInfo[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<
			AsyncResult<{
				channel_infos: SessionInfo[];
			}>
		>;

		/**
		 * Gets the conversation list and the latest message in the conversation.
		 *
		 * ```typescript
		 * connection.getConversationlist()
		 * ```
		 */
		getConversationlist(
			this: Connection,
			params?: {
				/** The current page number, starting from 1. */
				pageNum?: number;
				/** The number of conversations that you expect to get on each page. The value cannot exceed 20. */
				pageSize?: number;
				success?: (res: AsyncResult<ConversationInfo>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<ConversationInfo>>;

		/**
		 * @deprecated Use Use {@link deleteConversation} instead.
		 * Delete the conversation.
		 *
		 * ```typescript
		 * connection.deleteSession()
		 * ```
		 */
		deleteSession(
			this: Connection,
			params: {
				/** The conversation ID: The user ID of the peer user or group ID. */
				channel: string;
				/** The conversation type.
				 * - `singleChat`: one-to-one chat;
				 * - `groupChat`: group chat.
				 */
				chatType: 'singleChat' | 'groupChat';
				/** Whether to delete historical messages on the server during conversation deletion.
				 * - `true`: Yes;
				 * - `false`: No.
				 */
				deleteRoam: boolean;
				success?: (res: AsyncResult<DeleteSessionResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<DeleteSessionResult>>;

		/**
		 * Deletes the conversation.
		 *
		 * ```typescript
		 * connection.deleteConversation()
		 * ```
		 */
		deleteConversation(
			this: Connection,
			params: {
				/** The conversation ID: The user ID of the peer user or group ID. */
				channel: string;
				/** The conversation type.
				 * - `singleChat`: one-to-one chat;
				 * - `groupChat`: group chat.
				 */
				chatType: 'singleChat' | 'groupChat';
				/** Whether to delete historical messages on the server during conversation deletion.
				 * - `true`: Yes;
				 * - `false`: No.
				 */
				deleteRoam: boolean;
				success?: (res: AsyncResult<DeleteSessionResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<DeleteSessionResult>>;

		/**
		 * @deprecated Use {@link updateUserInfo} instead.
		 * Updates own information.
		 *
		 * ```typescript
		 * connection.updateOwnUserInfo({nickname: 'Tom', avatarurl: 'avatarurl', mail: 'abc@gmail,com', ext: JSON.stringify({hobby: 'football'})})
		 *
		 * connection.updateOwnUserInfo('nickname', 'Tom')
		 * ```
		 */
		updateOwnUserInfo(
			this: Connection,
			params: UpdateOwnUserInfoParams | ConfigurableKey,
			value?: string
		): Promise<AsyncResult<UpdateOwnUserInfoParams>>;

		/**
		 * Modifies the user's attributes.
		 *
		 * ```typescript
		 * connection.updateOwnUserInfo({nickname: 'Tom', avatarurl: 'avatarurl', mail: 'abc@gmail,com', ext: JSON.stringify({hobby: 'football'})})
		 *
		 * connection.updateUserInfo('nickname', 'Tom')
		 * ```
		 */
		updateUserInfo(
			this: Connection,
			params: UpdateOwnUserInfoParams | ConfigurableKey,
			value?: string
		): Promise<AsyncResult<UpdateOwnUserInfoParams>>;

		/**
		 * Queries the user attributes.
		 *
		 * ```typescript
		 * connection.fetchUserInfoById('user1') | fetchUserInfoById(['user1', 'user2'])
		 * ```
		 */
		fetchUserInfoById(
			this: Connection,
			/** The array of IDs of users or user ID to query.  */
			userId: UserId | UserId[],
			/** User properties to query. If the parameter is blank, query all. */
			properties?: ConfigurableKey[] | ConfigurableKey
		): Promise<
			AsyncResult<{
				[key: string]: UpdateOwnUserInfoParams;
			}>
		>;

		/**
		 * Changes the nickname shown when the message push notification is received. This nickname is specified during user registration and it's not the same as the nickname attribute of the user.
		 *
		 * ```typescript
		 * connection.updateCurrentUserNick('Tom')
		 * ```
		 */
		updateCurrentUserNick(
			this: Connection,
			/** The nickname shown when a message push notification is received. */
			nick: string
		): Promise<AsyncResult<BaseUserInfo[]>>;

		/**
		 * @deprecated Use {@link getHistoryMessages} instead.
		 * Gets historical messages.
		 *
		 * ```typescript
		 * connection.fetchHistoryMessages({queue:'user1', count: 20})
		 * ```
		 */
		fetchHistoryMessages(
			this: Connection,
			options: {
				/** The user ID of the other party or the group ID. */
				queue: string;
				/** The starting message ID for this query. The default value is -1, which means to start retrieving from the latest message. */
				start?: number | string | null;
				/** The number of messages to retrieve each time. The default value is 20. */
				count?: number;
				/** Whether it is a group chat.
				 *  - `true`: Yes.
				 *  - (Default)`false`: No.
				 */
				isGroup?: boolean;
				/** Whether to format messages.
				 * - `true`: Yes.
				 * - (Default)`false`: No.
				 */
				format?: boolean;
				success?: (res: MessageBody[]) => void;
				fail?: (error: ErrorEvent) => void;
			}
		): Promise<MessageBody[]>;

		/**
		 * Gets the message history.
		 *
		 * ```typescript
		 * connection.getHistoryMessages({targetId:'targetId',chatType:'groupChat', pageSize: 20})
		 * ```
		 */
		getHistoryMessages(
			this: Connection,
			options: {
				/** The user ID of the other party or the group ID. */
				targetId: string;
				/** The starting message ID for this query. The default value is -1, which means to start retrieving from the latest message. */
				cursor?: number | string | null;
				/** The number of messages to retrieve each time. The default value is 20,The maximum value is 50. */
				pageSize?: number;
				/** The chat type for SDK:
				 * - `singleChat`: one-to-one chat;
				 * - `groupChat`: group chat;
				 * - (Default)`singleChat`: No.
				 */
				chatType?: 'singleChat' | 'groupChat';
				/** Whether to select pull history messages in positive order(Pull message from the oldest to the latest).
				 * - `up`: means searching from the newer messages to the older messages.
				 * - `down`: means searching from the older messages to the newer messages.
				 * - (Default)`up`.
				 */
				searchDirection?: 'down' | 'up';
				/** Query conditions. */
				searchOptions?: {
					/** The user ID of the message sender. This parameter is used only for group chat. */
					from?: UserId;
					/** An array of message types for query. If no value is passed in, all message types will be queried. */
					msgTypes?: Array<
						Exclude<MessageType, 'read' | 'delivery' | 'channel'>
					>;
					/** The start timestamp for query. The unit is millisecond. */
					startTime?: number;
					/** The end timestamp for query. The unit is millisecond. */
					endTime?: number;
				};
				success?: (res: MessageBody[]) => void;
				fail?: (error: ErrorEvent) => void;
			}
		): Promise<HistoryMessages>;

		/**
		 * Unidirectionally deletes historical messages from the server.
		 *
		 * ```typescript
		 * connection.removeHistoryMessages({targetId: 'userId', chatType: 'singleChat', time: Date.now()})
		 *
		 * connection.removeHistoryMessages({targetId: 'userId', chatType: 'singleChat', messageIds: ['messageId']})
		 * ```
		 */
		removeHistoryMessages(
			this: Connection,
			options: {
				/** The ID of the peer user or group. */
				targetId: string;
				/**
				 * conversation type:
				 * - `singleChat`: single chat;
				 * - `groupChat`: group chat.
				 */
				chatType: 'singleChat' | 'groupChat';
				/** The ID list of messages to be deleted. A maximum of 20 message IDs can be passed in. */
				messageIds?: Array<string>;
				/** The starting timestamp for message deletion. Messages with the timestamp before the specified one will be deleted. */
				beforeTimeStamp?: number;
			}
		): Promise<void>;

		/**
		 * Adds a friend.
		 *
		 * ```typescript
		 * connection.addContact('user1', 'I am Bob')
		 * ```
		 */
		addContact(
			this: Connection,
			to: string,
			message?: string
		): Promise<void>;

		/**
		 * Deletes the contact.
		 *
		 * ```typescript
		 * connection.deleteContact('user1')
		 * ```
		 */
		deleteContact(this: Connection, to: string): Promise<void>;

		/** @deprecated  Use {@link acceptContactInvite} instead. */
		acceptInvitation(this: Connection, to: string): Promise<void>;

		/**
		 * Accepts a friend request.
		 *
		 * ```typescript
		 * connection.acceptContactInvite('user1')
		 * ```
		 */
		acceptContactInvite(this: Connection, to: string): Promise<void>;

		/** @deprecated  Use {@link declineContactInvite} instead. */
		declineInvitation(this: Connection, to: string): Promise<void>;

		/**
		 * Declines a friend request.
		 *
		 * ```typescript
		 * connection.declineContactInvite('user1')
		 * ```
		 */
		declineContactInvite(this: Connection, to: string): Promise<void>;

		/** @deprecated  Use {@link addUsersToBlocklist} instead. */
		addToBlackList(
			this: Connection,
			options: {
				/** The user ID. You can type a specific user ID to add a single user to the blocklist or type an array of user IDs, like ["user1","user2"], to add multiple users. */
				name: UserId | UserId[];
			}
		): Promise<AsyncResult<OperateResult>>;

		/**
		 * @deprecated Use {@link addUsersToBlocklist} instead.
		 */
		addUsersToBlacklist(
			this: Connection,
			options: {
				/** The user ID. You can type a specific user ID to add a single user to the blocklist or type an array of user IDs, like ["user1","user2"], to add multiple users. */
				name: UserId | UserId[];
			}
		): Promise<AsyncResult<OperateResult>>;

		/**
		 * Adds a contact to the blocklist.
		 *
		 * ```typescript
		 * connection.addUsersToBlocklist({name: 'user1'})
		 * ```
		 */
		addUsersToBlocklist(
			this: Connection,
			options: {
				/** The user ID. You can type a specific user ID to add a single user to the blocklist or type an array of user IDs, like ["user1","user2"], to add multiple users. */
				name: UserId | UserId[];
			}
		): Promise<AsyncResult<OperateResult>>;

		/** @deprecated   Use {@link removeUserFromBlackList} instead. */
		removeFromBlackList(
			this: Connection,
			options: {
				/** The user ID. You can type a specific user ID to remove a single user from the blocklist or type an array of user IDs, like ["user1","user2"], to remove multiple users. */
				name: UserId | UserId[];
			}
		): Promise<void>;

		/**
		 * @deprecated  Use {@link removeUserFromBlackList} instead.
		 */
		removeUserFromBlackList(
			this: Connection,
			options: {
				/** The user ID. You can type a specific user ID to remove a single user from the blocklist or type an array of user IDs, like ["user1","user2"], to remove multiple users. */
				name: UserId | UserId[];
			}
		): Promise<void>;

		/**
		 * Removes contacts from the blocklist.
		 *
		 * ```typescript
		 * connection.removeUserFromBlocklist({name: 'user1'})
		 * ```
		 */
		removeUserFromBlocklist(
			this: Connection,
			options: {
				/** The user ID. You can type a specific user ID to remove a single user from the blocklist or type an array of user IDs, like ["user1","user2"], to remove multiple users. */
				name: UserId | UserId[];
			}
		): Promise<void>;

		/**
		 * Recalls a message.
		 *
		 * ```typescript
		 * connection.recallMessage({mid: 'messageId', to: 'user1', type: 'singleChat', isChatThread: false})
		 * ```
		 */
		recallMessage(
			this: Connection,
			option: {
				/** The ID of the message to be recalled. */
				mid: string;
				/** The recipient of the message. */
				to: UserId;
				/** The chat type for SDK old:
				 * - chat: one-to-one chat;
				 * - groupchat: group chat;
				 * - chatroom: chat room.
				 */
				type?: 'chat' | 'groupchat' | 'chatroom';
				/** The chat type for SDK new:
				 * - `singleChat`: one-to-one chat;
				 * - `groupChat`: group chat;
				 * - `chatroom`: chat room.
				 */
				chatType?: 'singleChat' | 'groupChat' | 'chatRoom';
				/** Whether the message is in the thread. */
				isChatThread?: boolean;
				success?: (res: number) => void;
				fail?: (error: ErrorEvent) => void;
			}
		): Promise<SendMsgResult>;

		/**
		 * Modifies a message on the server.
		 *
		 * This method can only modify a text message in one-to-one chats or group chats, but not in chat rooms.
		 *
		 * Upon a message modification, the callback `onModifiedMessage` will be received by the message recipient(s) and in multi-device login scenarios.
		 *
		 * ```typescript
		 *
		 * const textMessage = WebIM.message.create({
		 *   type: "txt",
		 *   msg: "message content",
		 *   to: "username",
		 *   chatType: "singleChat",
		 * });
		 *
		 * connection.modifyMessage({ messageId: 'messageId', message: textMessage })
		 * ```
		 */
		modifyMessage(
			this: Connection,
			option: {
				/** The ID of the message to modify.*/
				messageId: string;
				/** The modified message.*/
				modifiedMessage: ModifiedMsg;
			}
		): Promise<ModifyMsgResult>;

		// listen @deprecated
		listen(this: Connection, parameters: ListenParameters): void;

		/**
		 * Adds listening events.
		 *
		 * ```typescript
		 * connection.addEventHandler('customId', {
		 * 	onTextMessage: (message) => {
		 * 		console.log(message)
		 * 	}
		 * })
		 * ```
		 */
		addEventHandler(id: string, handler: EventHandlerType): void;

		/**
		 * Removes listening events.
		 *
		 * ```typescript
		 * connection.removeEventHandler('customId')
		 * ```
		 */
		removeEventHandler(id: string): void;

		/** Download combined message. */
		downloadAndParseCombineMessage(
			options: DownloadCombineMessagesParams
		): Promise<MessagesType[]>;

		/**
		 * Gets all languages what the translate service support.
		 *
		 * ```typescript
		 * connection.getSupportedLanguages()
		 * ```
		 */
		getSupportedLanguages(): Promise<AsyncResult<SupportLanguage[]>>;

		/**
		 * Translates message.
		 *
		 * ```typescript
		 * connection.translateMessage('hello', 'zh')
		 * ```
		 */
		translateMessage(params: {
			/** The text to be translated. */
			text: string;
			/** The target language to be translated into. */
			languages: string[];
		}): Promise<AsyncResult<TranslationResult>>;

		/**
		 * Publishes a custom presence state.
		 *
		 * ```typescript
		 * connection.publishPresence({presenceStatus: 1, ext: 'music'})
		 * ```
		 */
		publishPresence(params: {
			/** The extension description information of the presence state. It can be set as nil. */
			description: string;
			success?: () => void;
			error?: (error: ErrorEvent) => void;
		}): Promise<void>;

		/**
		 * Subscribes to a user's presence states. If the subscription succeeds, the subscriber will receive the callback when the user's presence state changes.
		 *
		 * ```typescript
		 * connection.subscribePresence({usernames: ['user1','user2'], expiry: 10000})
		 * ```
		 */
		subscribePresence(params: {
			/** The array of IDs of users whose presence states you want to subscribe to. */
			usernames: UserId[];
			/** The time of the presence subscription. */
			expiry: number;
			success?: (res: AsyncResult<SubscribePresenceResult>) => void;
			error?: (error: ErrorEvent) => void;
		}): Promise<AsyncResult<SubscribePresenceResult>>;

		/**
		 * Unsubscribes from a user's presence states.
		 *
		 * ```typescript
		 * connection.unsubscribePresence({usernames: ['user1','user2']})
		 * ```
		 */
		unsubscribePresence(params: {
			/** The array of IDs of users whose presence states you want to unsubscribe from. */
			usernames: UserId[];
			success?: () => void;
			error?: (error: ErrorEvent) => void;
		}): Promise<void>;

		/**
		 * @deprecated Use {@link getSubscribedPresencelist} instead.
		 * Uses pagination to get a list of users whose presence states you have subscribed to.
		 *
		 * ```typescript
		 * connection.getSubscribedPresenceList({usernames: ['user1','user2']})
		 * ```
		 */
		getSubscribedPresenceList(
			this: Connection,
			params: {
				/** The current page number, starting from 1. */
				pageNum: number;
				/** The number of subscribers per page. */
				pageSize: number;
				success?: (
					res: AsyncResult<GetSubscribedPresenceListResult>
				) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GetSubscribedPresenceListResult>>;

		/**
		 * Uses pagination to get a list of users whose presence states you have subscribed to.
		 *
		 * ```typescript
		 * connection.getSubscribedPresencelist({usernames: ['user1','user2']})
		 * ```
		 */
		getSubscribedPresencelist(
			this: Connection,
			params: {
				/** The current page number, starting from 1. */
				pageNum: number;
				/** The number of subscribers per page. */
				pageSize: number;
				success?: (
					res: AsyncResult<GetSubscribedPresenceListResult>
				) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GetSubscribedPresenceListResult>>;

		/**
		 * Gets the current presence state of users.
		 *
		 * ```typescript
		 * connection.getPresenceStatus({usernames: ['user1','user2']})
		 * ```
		 */
		getPresenceStatus(
			this: Connection,
			params: {
				/** The array of IDs of users whose current presence state you want to check. */
				usernames: UserId[];
				success?: (res: AsyncResult<SubscribePresenceResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<SubscribePresenceResult>>;

		/**
		 * Creates a chatThread.
		 *
		 * ```typescript
		 * connection.createChatThread({parentId: 'parentId',name: 'threadName',messageId: 'messageId'})
		 * ```
		 */
		createChatThread(
			this: Connection,
			params: {
				/** Generally refers to the group ID. */
				parentId: string;
				/** The chatThread name. */
				name: string;
				/** The parent message ID. */
				messageId: string;
			}
		): Promise<AsyncResult<CreateChatThreadResult>>;

		/**
		 * Joins the chatThread.
		 *
		 * ```typescript
		 * connection.joinChatThread({chatThreadId: 'chatThreadId'})
		 * ```
		 */
		joinChatThread(
			this: Connection,
			params: {
				/** The chatThread ID. */
				chatThreadId: string;
			}
		): Promise<AsyncResult<JoinChatThreadResult>>;

		/**
		 * Leaves the chatThread.
		 *
		 * ```typescript
		 * connection.leaveChatThread({chatThreadId: 'chatThreadId'})
		 * ```
		 */
		leaveChatThread(
			this: Connection,
			params: {
				/** The chatThread ID. */
				chatThreadId: string;
			}
		): Promise<void>;

		/**
		 * Deletes the chatThread,group leader and administrator have this permission.
		 *
		 * ```typescript
		 * connection.destroyChatThread({chatThreadId: 'chatThreadId'})
		 * ```
		 */
		destroyChatThread(
			this: Connection,
			params: {
				/** The chatThread ID. */
				chatThreadId: string;
			}
		): Promise<void>;

		/**
		 * Modifies the chatThread name.
		 *
		 * ```typescript
		 * connection.changeChatThreadName({chatThreadId: 'chatThreadId',name: 'name'})
		 * ```
		 */
		changeChatThreadName(
			this: Connection,
			params: {
				/** The chatThread ID. */
				chatThreadId: string;
				/** The chatThread name. */
				name: string;
			}
		): Promise<AsyncResult<ChangeChatThreadName>>;

		/**
		 * Lists all members of the chatThread with pagination.
		 *
		 * ```typescript
		 * connection.getChatThreadMembers({chatThreadId: 'chatThreadId',pageSize:20,cursor:'cursor'})
		 * ```
		 */
		getChatThreadMembers(
			this: Connection,
			params: {
				/** The Thread ID. */
				chatThreadId: string;
				/** The number of members per page. The default value is 20, and the maximum value is 50.*/
				pageSize?: number;
				/** The cursor that specifies where to start to get data. If there will be data on the next page, this method will return the value of this field to indicate the position to start to get data of the next page. If it is empty string, the data of the first page will be fetched.*/
				cursor?: string;
			}
		): Promise<AsyncResult<ChatThreadMembers>>;

		/**
		 * Removes a member from the chatThread.
		 *
		 * ```typescript
		 * connection.removeChatThreadMember({chatThreadId: 'chatThreadId',username:'username'})
		 * ```
		 */
		removeChatThreadMember(
			this: Connection,
			params: {
				/** The chatThread ID. */
				chatThreadId: string;
				/** The member ID to remove. */
				username: string;
			}
		): Promise<AsyncResult<RemoveMemberResult>>;

		/**
		 * Gets the list of joined chatThreads with pagination.When parentId is not null, get the list of chatThread under the specified group.
		 *
		 * ```typescript
		 * connection.getJoinedChatThreads({parentId: 'parentId',cursor: 'cursor',pageSize: 50})
		 * ```
		 */
		getJoinedChatThreads(
			this: Connection,
			params: {
				/** Generally refers to the group ID. */
				parentId?: string;
				/** The number of thread per page. The default value is 20, and the maximum value is 50. */
				pageSize?: number;
				/** The cursor that specifies where to start to get data. If there will be data on the next page, this method will return the value of this field to indicate the position to start to get data of the next page. If it is null, the data of the first page will be fetched.*/
				cursor?: string;
			}
		): Promise<AsyncResult<ChatThreadDetail[]>>;

		/**
		 * Gets the thread list of the specified group with pagination.
		 * ```typescript
		 * connection.getChatThreads({parentId: 'parentId, cursor:'cursor' ,pageSize: 50})
		 * ```
		 */
		getChatThreads(
			this: Connection,
			params: {
				/** Generally refers to the group ID. */
				parentId: string;
				/** The number of thread per page. The default value is 20, and the maximum value is 50. */
				pageSize?: number;
				/** The cursor that specifies where to start to get data. If there will be data on the next page, this method will return the value of this field to indicate the position to start to get data of the next page. If it is empty string, the data of the first page will be fetched.*/
				cursor?: string;
			}
		): Promise<AsyncResult<ChatThreadDetail[]>>;

		/**
		 * Gets the latest message content of the chatThread in batch,with a maximum of 20 messages.
		 *
		 * ```typescript
		 * connection.getChatThreadLastMessage({chatThreadIds: ['chatThreadId1','chatThreadId2']})
		 * ```
		 */
		getChatThreadLastMessage(
			this: Connection,
			params: {
				/** The array of chatThread IDs to query.*/
				chatThreadIds: string[];
			}
		): Promise<AsyncResult<ChatThreadLastMessage>>;

		/**
		 * Gets detail of the chatThread.
		 *
		 * ```typescript
		 * connection.getChatThreadDetail({chatThreadId: 'chatThreadId'})
		 * ```
		 */
		getChatThreadDetail(
			this: Connection,
			params: {
				/** The chatThread ID. */
				chatThreadId: string;
			}
		): Promise<AsyncResult<ChatThreadDetail>>;

		/**
		 * Reports an inappropriate message.
		 *
		 * ```typescript
		 * reportMessage({reportType: 'adult', reportReason: 'reason', messageId: 'id'})
		 * ```
		 */
		reportMessage(
			this: Connection,
			params: {
				/** The type of reporting. */
				reportType: string;
				/** The reason for reporting. You need to type a specific reason. */
				reportReason: string;
				/** The ID of the message to report. */
				messageId: string;
			}
		): Promise<void>;

		/**
		 * Gets the list of conversations from the server with pagination.
		 *
		 * The SDK returns the list of conversations in the reverse chronological order of their active time (the timestamp of the last message).
		 *
		 * If there is no message in the conversation, the SDK retrieves the list of conversations in the reverse chronological order of their creation time.
		 *
		 * ```typescript
		 * connection.getServerConversations({pageSize:50, cursor: ''})
		 * ```
		 */
		getServerConversations(
			this: Connection,
			params: {
				/** The number of conversations that you expect to get on each page. The value range is [1,50] and the default value is `20`. */
				pageSize?: number;
				/** The position from which to start getting data. If you set `cursor` to an empty string (''), the SDK retrieves conversations from the latest active one.*/
				cursor?: string;
			}
		): Promise<AsyncResult<ServerConversations>>;
		/**
		 * Get the list of pinned conversations from the server with pagination.
		 *
		 * The SDK returns the pinned conversations in the reverse chronological order of their pinning.
		 *
		 * ```typescript
		 * connection.getServerPinnedConversations({pageSize:50, cursor: ''})
		 * ```
		 */
		getServerPinnedConversations(
			this: Connection,
			params: {
				/** The number of conversations that you expect to get on each page. The value range is [1,50] and the default value is `20`. */
				pageSize?: number;
				/** The position from which to start getting data. If you pass in an empty string (''), the SDK retrieves conversations from the latest pinned one.*/
				cursor?: string;
			}
		): Promise<AsyncResult<ServerConversations>>;
		/**
		 * Sets whether to pin a conversation.
		 *
		 * ```typescript
		 * connection.pinConversation({conversationId:'conversationId',conversationType: 'singleChat', isPinned: boolean})
		 * ```
		 */
		pinConversation(
			this: Connection,
			params: {
				/** The conversation ID. */
				conversationId: string;
				/** The conversation type. */
				conversationType: 'singleChat' | 'groupChat';
				/** Whether to pin the conversation:
				 * - `true`: Yes.
				 * - `false`: No. The conversation is unpinned.
				 */
				isPinned: boolean;
			}
		): Promise<AsyncResult<PinConversation>>;

		/**
		 * Set contact remark.
		 *
		 * ```typescript
		 * setContactRemark({userId: 'userId', remark: 'remark'})
		 * ```
		 */
		setContactRemark(
			this: Connection,
			params: {
				/**
				 * The ID of the contact to set the remark for.
				 */
				userId: UserId;
				/**
				 * The remark to set.
				 */
				remark: string;
			}
		): Promise<void>;

		/**
		 * Gets the all contacts.
		 *
		 * ```typescript
		 * connection.getAllContacts()
		 * ```
		 */
		getAllContacts(this: Connection): Promise<AsyncResult<ContactItem[]>>;

		/**
		 * Gets the list of contacts with pagination.
		 *
		 * ```typescript
		 * connection.getContactsWithCursor({pageSize:50, cursor: ''})
		 * ```
		 */
		getContactsWithCursor(
			this: Connection,
			params: {
				/** The number of contacts that you expect to get on each page. The value range is [1,50] and the default value is `20`. */
				pageSize?: number;
				/** The position from which to start getting data. */
				cursor?: string;
			}
		): Promise<AsyncResult<CursorContactsResult>>;

		/**
		 * Set the DND Settings for the current login user.
		 *
		 * ```typescript
		 * connection.setSilentModeForAll({options: {paramType: 0, remindType: 'ALL'}})
		 * ```
		 */
		setSilentModeForAll(
			this: Connection,
			params: {
				/** Options object include paramType,remindType,duration,startTime,endTime. */
				options: SilentModeParamType;
				success?: (
					res: AsyncResult<SilentModeConversationType>
				) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<SilentModeConversationType>>;

		/**
		 * Get the DND Settings of the current user.
		 *
		 * ```typescript
		 * connection.getSilentModeForAll()
		 * ```
		 */
		getSilentModeForAll(
			this: Connection,
			params?: {
				success?: (
					res: AsyncResult<SilentModeConversationType>
				) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<SilentModeConversationType>>;

		/**
		 * Set the DND of the session.
		 *
		 * ```typescript
		 * connection.setSilentModeForConversation({conversationId: '100', type: 'singleChat', params: {paramType: 0, remindType: 'ALL'}})
		 * ```
		 */
		setSilentModeForConversation(
			this: Connection,
			params: {
				/** The Conversation id.
				 * For one-to-one chat, conversation ID is to chat user's name.
				 * For group chat, conversation ID is group ID, different with group name.
				 * For chat room, conversation ID is chat room ID, different with chat room name.
				 * For help desk, it is same with one-to-one chat, conversation ID is also chat user's name.
				 */
				conversationId: string;
				/** Conversation type. */
				type: CONVERSATIONTYPE;
				/** Options object include paramType,remindType,duration,startTime,endTime. */
				options: SilentModeParamType;
				success?: (
					res: AsyncResult<SilentModeConversationType>
				) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<SilentModeConversationType>>;

		/**
		 * Clear the setting of offline push notification type for the session.
		 *
		 * ```typescript
		 * connection.clearRemindTypeForConversation({conversationId: '123', type: 'singleChat'})
		 * ```
		 */
		clearRemindTypeForConversation(
			this: Connection,
			params: {
				/** Conversation id. */
				conversationId: string;
				/** Conversation type. */
				type: CONVERSATIONTYPE;
				success?: (
					res: AsyncResult<SilentModeConversationType>
				) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<SilentModeConversationType>>;

		/**
		 * Gets the DND setting of the session.
		 *
		 * ```typescript
		 * connection.getSilentModeForConversation({conversationId: '3333', type: 'singleChat'})
		 * ```
		 */
		getSilentModeForConversation(
			this: Connection,
			params: {
				/** Conversation id. */
				conversationId: string;
				/** Conversation type. */
				type: CONVERSATIONTYPE;
				success?: (
					res: AsyncResult<SilentModeConversationType>
				) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<SilentModeConversationType>>;

		/**
		 * Obtain the DND Settings of specified sessions in batches.
		 *
		 * ```typescript
		 * connection.getSilentModeForConversations({conversationList:[{id: 'test', type: 'singleChat'}, {id: '12345', type: 'groupChat'}]})
		 * ```
		 */
		getSilentModeForConversations(
			this: Connection,
			params: {
				/** Conversation list. */
				conversationList: ConversationListType[];
				success?: (
					res: AsyncResult<ConversationSilentModeType>
				) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<ConversationSilentModeType>>;

		/**
		 * Set user push translation language.
		 *
		 * ```typescript
		 * connection.setPushPerformLanguage({language: 'EU'})
		 * ```
		 */
		setPushPerformLanguage(
			this: Connection,
			params: {
				/** translation language */
				language: string;
				success?: (res: AsyncResult<TranslationLanguageType>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<TranslationLanguageType>>;

		/**
		 * Gets the push translation language set by the user.
		 *
		 * ```typescript
		 * connection.getPushPerformLanguage()
		 * ```
		 */
		getPushPerformLanguage(
			this: Connection,
			params?: {
				success?: (res: AsyncResult<TranslationLanguageType>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<TranslationLanguageType>>;

		/**
		 * Adds a reaction to the message.
		 *
		 * ```typescript
		 * connection.addReaction({messageId: 'messageId', action: 'action'})
		 * ```
		 */
		addReaction(
			this: Connection,
			params: {
				/** The message ID. */
				messageId: string;
				/** The reaction to be added to the message. The length is limited to 128 characters. */
				reaction: string;
			}
		): Promise<void>;

		/**
		 * Removes a reaction from a message.
		 *
		 * ```typescript
		 * connection.deleteReaction({reactionId: 'reactionId'})
		 * ```
		 */
		deleteReaction(
			this: Connection,
			params: {
				/** The message reaction to delete.  */
				reaction: string;
				/** The message ID. */
				messageId: string;
			}
		): Promise<void>;

		/**
		 * @deprecated Use { getReactionlist } instead.
		 * Gets the reaction list for the message.
		 *
		 * ```typescript
		 * connection.getReactionList({chatType: 'chatType', messageId: 'messageId'})
		 * ```
		 */
		getReactionList(
			this: Connection,
			params: {
				/** The conversation type:
				 * - singleChat;
				 * - groupChat;
				 */
				chatType: 'singleChat' | 'groupChat';
				/** The message ID. */
				messageId: string | Array<string>;
				/** The group ID. */
				groupId?: string;
			}
		): Promise<AsyncResult<GetReactionListResult[]>>;

		/**
		 * Gets the reaction list for the message.
		 *
		 * ```typescript
		 * connection.getReactionlist({chatType: 'chatType', messageId: 'messageId'})
		 * ```
		 */
		getReactionlist(
			this: Connection,
			params: {
				/** The conversation type:
				 * - singleChat;
				 * - groupChat;
				 */
				chatType: 'singleChat' | 'groupChat';
				/** The message ID. */
				messageId: string | Array<string>;
				/** The group ID. */
				groupId?: string;
			}
		): Promise<AsyncResult<GetReactionListResult[]>>;

		/**
		 * Gets the details of a reaction.
		 *
		 * ```typescript
		 * getReactionDetail({messageId: 'messageId', reaction: 'reaction', cursor: '', pageSize: 20})
		 * ```
		 */
		getReactionDetail(
			this: Connection,
			params: {
				/** The message ID. */
				messageId: string;
				/** The reactions to retrieve. */
				reaction: string;
				/** The cursor that specifies where to start to get data. If there will be data on the next page, this method will return the value of this field to indicate the position to start to get data of the next page. If it is null, the data of the first page will be retrieved.*/
				cursor?: string; // 默认为 null
				/** The number of reactions per page. The default value is 20, and the maximum value is 100. */
				pageSize?: number;
			}
		): Promise<AsyncResult<GetReactionDetailResult>>;

		/**
		 * Get the chat room all properties.
		 *
		 * ```typescript
		 * connection.getChatRoomAttributes({chatRoomId: 'roomId', attributeKeys:['attributeKey1'])
		 * ```
		 */
		getChatRoomAttributes(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				/** The custom attribute to get. If you pass the attribute key, the SDK returns the attribute value. If you set it as null, the SDK returns all the attributes value. */
				attributeKeys?: Array<string>;
			}
		): Promise<AsyncResult<GetChatroomAttributesResult>>;

		/**
		 * Set chat room properties in batches.
		 *
		 * ```typescript
		 * connection.setChatRoomAttributes({chatRoomId: 'roomId', attributes: {"key1": "value1","key2":"value2"}, autoDelete: true, isForced: false})
		 * ```
		 */
		setChatRoomAttributes(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				/** The map of custom chat room attributes. */
				attributes: {
					[key: string]: string;
				};
				/** Whether to delete chat room attributes set by the member when he or she exits the chat room.
				 * (Default)`true`: Yes.
				 * `false`: No. */
				autoDelete?: boolean;
				/** Whether to allow a member to overwrite the chat room attribute set by another member.
				 * `true`: Yes.
				 * （Default）`false`: No. */
				isForced?: boolean;
			}
		): Promise<AsyncResult<ChatroomAttributes>>;

		/**
		 * Sets a custom chat room attribute.
		 *
		 * ```typescript
		 * connection.setChatroomAttribute({chatRoomId: 'roomId', attributeKey:"key1", attributeValue:"value1", autoDelete: true, isForced: false})
		 * ```
		 */
		setChatRoomAttribute(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				/**
				 * The chat room attribute key. A single key cannot exceed 128 characters; the total number of keys in a chat room cannot exceed 100. The following character sets are supported:
				 * - 26 lowercase English letters (a-z)
				 * - 26 uppercase English letters (A-Z)
				 * - 10 numbers (0-9)
				 * - "_", "-", "."
				 */
				attributeKey: string;
				/** The chat room attribute value. The attribute value can contain a maximum of 4096 characters. The total length of custom chat room attributes cannot exceed 10 GB for each app.*/
				attributeValue: string;
				/**
				 * Whether to delete chat room attributes set by the member when he or she exits the chat room.
				 * - (Default)`true`: Yes;
				 * - `false`: No.
				 */
				autoDelete?: boolean;
				/**
				 * Whether to allow a member to overwrite the chat room attribute set by another member.
				 * - `true`: Yes;
				 * - (Default)`false`: No.
				 */
				isForced?: boolean;
			}
		): Promise<void>;

		/**
		 * Removes custom chat room attributes.
		 *
		 * ```typescript
		 * connection.removeChatRoomAttributes({chatRoomId: 'roomId', attributeKeys: ['key1','key2',...], isForced: false })
		 * ```
		 */
		removeChatRoomAttributes(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				/** The array of keys of attributes to remove. The array can contain a maximum number of 10 attribute keys. */
				attributeKeys: Array<string>;
				/** Whether to allow chat room members to overwrite the chat room attributes set by others.
				 * - `true`: Yes;
				 * - (Default)`false`: No.
				 */
				isForced?: boolean;
			}
		): Promise<AsyncResult<ChatroomAttributes>>;

		/**
		 * Remove chat room attributes individually.
		 *
		 * ```typescript
		 * connection.removeChatRoomAttribute({chatRoomId: 'roomId', attributeKey: 'attributeValue', isForced: false })
		 * ```
		 */
		removeChatRoomAttribute(
			this: Connection,
			params: {
				/** The chat room ID. */
				chatRoomId: string;
				/** The key of the chat room attribute to delete. */
				attributeKey: string;
				/**
				 * Whether to allow a member to delete any chat room attribute set by any member.
				 * - `true`: Yes;
				 * - (Default)`false`: No.
				 */
				isForced?: boolean;
			}
		): Promise<void>;
	}

	// ----- for EventHandler ------

	type DispatchParameters =
		| MessageBody
		| OnPresenceMsg
		| RosterData
		| ErrorEvent
		| ReceivedMsgBody
		| RecallMsgBody
		| ChannelMsgBody;

	interface ReactionMessage {
		/** The message sender. */
		from: string;
		/** The message recipient. */
		to: string;
		/** The conversation type. */
		chatType: 'singleChat' | 'groupChat';
		/** The reaction to be added to the message. The length is limited to 128 characters. */
		reactions: Reaction[];
		/** The ID of the message whose reaction updated. */
		messageId: string;
		/** The Unix timestamp for updating the reaction. */
		ts: number;
	}

	interface EventData {
		/** The type of operation. */
		operation: string;
		/** The ID of a group or chatroom. */
		id: string;
		/** Message sender. */
		from: string;
		/** Additional data for the operation event. */
		data?: any;
		/** The modified group info. */
		detail?: GroupModifyInfo;
		/** ChatRoom attributes.  */
		attributes?: {
			[key: string]: string;
		};
	}

	interface GetChatroomAttributesResult {
		/** ChatRoom ID.*/
		chatRoomId: string;
		/** The custom attribute to get. If you pass the attribute key, the SDK returns the attribute value. If you set it as null, the SDK returns all the attributes value. */
		attributeKeys: Array<string>;
	}
	interface ChatroomAttributes {
		/** Status code. */
		status: 'success' | 'fail';
		/** The keys of failure. */
		errorKeys: {
			[key: string]: string;
		};
		/** The keys of success. */
		successKeys: Array<string>;
	}

	type Event =
		| 'onOpened'
		| 'onPresence'
		| 'onTextMessage'
		| 'onImageMessage'
		| 'onAudioMessage'
		| 'onVideoMessage'
		| 'onFileMessage'
		| 'onLocationMessage'
		| 'onCmdMessage'
		| 'onCustomMessage'
		| 'onReceivedMessage'
		| 'onDeliveredMessage'
		| 'onReadMessage'
		| 'onRecallMessage'
		| 'onChannelMessage'
		| 'onError'
		| 'onOffline'
		| 'onOnline'
		| 'onStatisticMessage'
		| 'onContactAgreed'
		| 'onContactRefuse'
		| 'onContactDeleted'
		| 'onContactAdded'
		| 'onTokenWillExpire'
		| 'onTokenExpired'
		| 'onContactInvited'
		| 'onConnected'
		| 'onDisconnected'
		| 'onGroupChange'
		| 'onChatroomChange'
		| 'onContactChange'
		| 'onPresenceStatusChange'
		| 'onReactionChange'
		| 'onModifiedMessage'
		| 'onChatThreadChange'
		| 'onMultiDeviceEvent'
		| 'onGroupEvent'
		| 'onChatroomEvent';

	interface GroupEvent {
		/** The type of operation. <br/>
		 * create: Occurs when the current user created a group on another device.<br/>
		 * destroy:  Occurs when the group was destroyed.<br/>
		 * requestToJoin: Occurs when someone applied to join the group. Only the group owner and administrator will receive this event. <br/>
		 * acceptRequest: Occurs when your group adding application is approved. Only the person who applies for group will receive this event.<br/>
		 * joinPublicGroupDeclined: Occurs when your group adding application is refused. Only the person who applies for group will receive this event.<br/>
		 * inviteToJoin: Occurs when you receive an invitation to join a group. <br/>
		 * acceptInvite: Occurs when someone accepted your invitation to join the group. <br/>
		 * rejectInvite: Occurs when someone refused your invitation to join the group. <br/>
		 * removeMember:  Occurs when you are removed from a group or added to block list. Only the removed person receives this event.<br/>
		 * unblockMember: Occurs when being removed from the block list. Only the removed person receives this event.<br/>
		 * updateInfo: Occurs when modifying group. <br/>
		 * memberPresence: Occurs when someone joined the group. <br/>
		 * memberAbsence: Occurs when someone leaved the group. <br/>
		 * directJoined: Occurs when you are directly pulled into the group and no consent is required. <br/>
		 * changeOwner: Occurs when transferring group. Only new and old group owners can receive this event. <br/>
		 * setAdmin: Occurs when being set as administrator. Only the person who is set to administrator can receive this event.<br/>
		 * removeAdmin: Occurs when you are removed as an administrator. Only the removed person can receive this event.  <br/>
		 * muteMember: Occurs when you are muted. Only the person who is muted can receive this event. <br/>
		 * unmuteMember: Occurs when you are unmuted. Only the person who is unmuted can receive this event. <br/>
		 * updateAnnouncement: Occurs when the group announcement was updated.  <br/>
		 * deleteAnnouncement: Occurs when the group announcement was deleted.  <br/>
		 * uploadFile: Occurs when a shared file is uploaded.    <br/>
		 * deleteFile: Occurs when a shared file is deleted.  <br/>
		 * addUserToAllowlist: Occurs when being added to the allow list.   <br/>
		 * removeAllowlistMember: Occurs when being removed from the allow list.  <br/>
		 * muteAllMembers: Occurs when the group was set with a ban for all members.  <br/>
		 * unmuteAllMembers: Occurs when the group lifted the ban.  <br/>
		 * memberAttributesUpdate: Occurs when a custom attributes of a group member is updated. <br/>
		 */
		operation:
			| 'create'
			| 'destroy'
			| 'requestToJoin'
			| 'acceptRequest'
			| 'joinPublicGroupDeclined'
			| 'inviteToJoin'
			| 'acceptInvite'
			| 'rejectInvite'
			| 'removeMember'
			| 'unblockMember'
			| 'updateInfo'
			| 'memberPresence'
			| 'memberAbsence'
			| 'directJoined'
			| 'changeOwner'
			| 'setAdmin'
			| 'removeAdmin'
			| 'muteMember'
			| 'unmuteMember'
			| 'updateAnnouncement'
			| 'deleteAnnouncement'
			| 'uploadFile'
			| 'deleteFile'
			| 'addUserToAllowlist'
			| 'removeAllowlistMember'
			| 'muteAllMembers'
			| 'unmuteAllMembers'
			| 'memberAttributesUpdate';
		/** The ID of a group. */
		id: string;
		/** Message sender. */
		from: string;
		/** The name of a group.  */
		name?: string;
		/** The modified group info. */
		detail?: GroupModifyInfo;
	}

	interface ChatroomEvent {
		/** The type of operation. <br/>
		 * destroy:  Occurs when the chat room was destroyed.<br/>
		 * removeMember:  Occurs when you are removed from a chat room or added to block list. Only the removed person receives this event.<br/>
		 * unblockMember: Occurs when being removed from the block list. Only the removed person receives this event.<br/>
		 * updateInfo: Occurs when modifying chat room. <br/>
		 * memberPresence: Occurs when someone joined the chat room. <br/>
		 * memberAbsence: Occurs when someone leaved the chat room. <br/>
		 * setAdmin: Occurs when being set as administrator. Only the person who is set to administrator can receive this event.<br/>
		 * removeAdmin: Occurs when you are removed as an administrator. Only the removed person can receive this event.  <br/>
		 * muteMember: Occurs when you are muted. Only the person who is muted can receive this event. <br/>
		 * unmuteMember: Occurs when you are unmuted. Only the person who is unmuted can receive this event. <br/>
		 * updateAnnouncement: Occurs when the chat room announcement was updated.  <br/>
		 * deleteAnnouncement: Occurs when the chat room announcement was deleted.  <br/>
		 * uploadFile: Occurs when a shared file is uploaded.    <br/>
		 * deleteFile: Occurs when a shared file is deleted.  <br/>
		 * addUserToAllowlist: Occurs when being added to the allow list.   <br/>
		 * removeAllowlistMember: Occurs when being removed from the allow list.  <br/>
		 * muteAllMembers: Occurs when the chat room was set with a ban for all members.  <br/>
		 * unmuteAllMembers: Occurs when the chat room lifted the ban.  <br/>
		 * updateChatRoomAttributes: Occurs when the chat room attributes are updated.  <br/>
		 * removeChatRoomAttributes: when the chat room attributes are deleted. <br/>
		 */
		operation:
			| 'destroy'
			| 'removeMember'
			| 'unblockMember'
			| 'updateInfo'
			| 'memberPresence'
			| 'memberAbsence'
			| 'setAdmin'
			| 'removeAdmin'
			| 'muteMember'
			| 'unmuteMember'
			| 'updateAnnouncement'
			| 'deleteAnnouncement'
			| 'uploadFile'
			| 'deleteFile'
			| 'addUserToAllowlist'
			| 'removeAllowlistMember'
			| 'muteAllMembers'
			| 'unmuteAllMembers'
			| 'updateChatRoomAttributes'
			| 'removeChatRoomAttributes';
		/** The ID of a chatroom. */
		id: string;
		/** Message sender. */
		from: string;
		/** The name of a chatroom.  */
		name?: string;
		/** ChatRoom Attributes.  */
		attributes?: Array<string> | { [key: string]: string };
	}

	interface EventHandlerType {
		/** @deprecated  Use { onConnected } instead. */
		onOpened?: (msg: any) => void;
		/** @deprecated */
		onPresence?: (msg: OnPresenceMsg) => void;
		/** The callback to receive a text message. */
		onTextMessage?: (msg: TextMsgBody) => void;
		/** The callback to receive a image message. */
		onImageMessage?: (msg: ImgMsgBody) => void;
		/** The callback to receive a audio message. */
		onAudioMessage?: (msg: AudioMsgBody) => void;
		/** The callback to receive a video message. */
		onVideoMessage?: (msg: VideoMsgBody) => void;
		/** The callback to receive a file message. */
		onFileMessage?: (msg: FileMsgBody) => void;
		/** The callback to receive a location message. */
		onLocationMessage?: (msg: LocationMsgBody) => void;
		/** The callback to receive a command message. */
		onCmdMessage?: (msg: CmdMsgBody) => void;
		/** The callback to receive a custom message. */
		onCustomMessage?: (msg: CustomMsgBody) => void;
		/** The callback to receive a received ack. */
		onReceivedMessage?: (msg: ReceivedMsgBody) => void;
		/** The callback to receive a delivery ack. */
		onDeliveredMessage?: (msg: DeliveryMsgBody) => void;
		/** The callback to receive a read ack. */
		onReadMessage?: (msg: ReadMsgBody) => void;
		/** The callback to receive a recall message. */
		onRecallMessage?: (msg: RecallMsgBody) => void;
		/** The callback to receive a session read ack. */
		onChannelMessage?: (msg: ChannelMsgBody) => void;
		/** Occurs when the message content is modified. */
		onModifiedMessage?: (msg: ModifiedMsg) => void;
		/** The callback to receive error. */
		onError?: (error: ErrorEvent) => void;
		/** The callback for network disconnection. */
		onOffline?: () => void;
		/** The callback for network connection. */
		onOnline?: () => void;
		/** The callback to receive a statistic message. */
		onStatisticMessage?: (msg: any) => void;
		/** The callback to accept contact request. */
		onContactAgreed?: (msg: ContactMsgBody) => void;
		/** The callback to refuse contact request. */
		onContactRefuse?: (msg: ContactMsgBody) => void;
		/** The callback to deleted a contact. */
		onContactDeleted?: (msg: ContactMsgBody) => void;
		/** The callback to added a contact. */
		onContactAdded?: (msg: ContactMsgBody) => void;
		/** The callback whose token is about to expire. */
		onTokenWillExpire?: () => void;
		/** The callback whose token has expired. */
		onTokenExpired?: () => void;
		/** The callback to contact request was received. */
		onContactInvited?: (msg: ContactMsgBody) => void;
		/** The callback for successful connection. */
		onConnected?: () => void;
		/** The callback for disconnected. */
		onDisconnected?: () => void;
		/** @deprecated  Use { onGroupEvent } instead. */
		onGroupChange?: (msg: any) => void;
		/** @deprecated  Use { onChatroomEvent } instead. */
		onChatroomChange?: (msg: any) => void;
		/** @deprecated */
		onContactChange?: (msg: any) => void;
		/** Occurs when the presence state of a subscribed user changes. */
		onPresenceStatusChange?: (msg: PresenceType[]) => void;
		/** The callback to receive a reaction message. */
		onChatThreadChange?: (msg: ThreadChangeInfo) => void;
		/** The callback to receive a multi device event. */
		onMultiDeviceEvent?: (msg: MultiDeviceEvent) => void;
		/** The callback to receive a reaction message. */
		onReactionChange?: (msg: ReactionMessage) => void;
		/** The callback to receive a group event. */
		onGroupEvent?: (eventData: GroupEvent) => void;
		/** The callback to receive a chatroom event. */
		onChatroomEvent?: (eventData: ChatroomEvent) => void;
	}

	interface HandlerData {
		[key: string]: EventHandlerType;
	}

	/**
	 * This is the module of the SDK that is responsible for registering listening events.
	 * @module eventHandler
	 */
	class EventHandler {
		handlerData: HandlerData;
		constructor(
			Connection: any,
			eventHandlerId: string,
			eventHandler: EventHandlerType
		);
		/** Adds listening events. */
		addEventHandler(
			eventHandlerId: string,
			eventHandler: EventHandlerType
		): void;
		/** Removes listening events. */
		removeEventHandler(eventHandlerId: string): void;
		dispatch(
			this: EventHandler,
			event: Event,
			parameters?: DispatchParameters
		): void;
	}

	/**
	 * @module listen
	 * @deprecated
	 */
	interface ListenParameters {
		onOpened?: () => void;
		onPresence?: (msg: PresenceMsg) => void;
		onTextMessage?: (msg: TextMsgBody) => void;
		onPictureMessage?: (msg: ImgMsgBody) => void;
		onAudioMessage?: (msg: AudioMsgBody) => void;
		onVideoMessage?: (msg: VideoMsgBody) => void;
		onFileMessage?: (msg: FileMsgBody) => void;
		onLocationMessage?: (msg: LocationMsgBody) => void;
		onCmdMessage?: (msg: CmdMsgBody) => void;
		onCustomMessage?: (msg: CustomMsgBody) => void;
		onReceivedMessage?: (msg: ReceivedMsgBody) => void;
		onDeliveredMessage?: (msg: DeliveryMsgBody) => void;
		onReadMessage?: (msg: ReadMsgBody) => void;
		onRecallMessage?: (msg: RecallMsgBody) => void;
		onChannelMessage?: (msg: ChannelMsgBody) => void;
		onError?: (error: ErrorEvent) => void;
		onOffline?: () => void;
		onOnline?: () => void;
		onStatisticMessage?: () => void;
		onContactAgreed?: (msg: ContactMsgBody) => void;
		onContactRefuse?: (msg: ContactMsgBody) => void;
		onContactDeleted?: (msg: ContactMsgBody) => void;
		onContactAdded?: (msg: ContactMsgBody) => void;
		onTokenWillExpire?: () => void;
		onTokenExpired?: () => void;
		onClosed?: () => void;
		onPresenceStatusChange?: (msg: PresenceType[]) => void;
	}

	// ----- for Error -----

	interface ErrorParameters {
		/** Error code. */
		type: Code;
		/** Error message.  */
		message: string;
		/** Other data. */
		data?: any;
	}

	/**
	 * Error class
	 * @module Error
	 */
	class ErrorEvent {
		/** Error code. */
		type: Code;
		/** Error message.  */
		message: string;
		/** Other data. */
		data?: any;
		constructor(parameters: ErrorParameters);
		static create(parameters: ErrorParameters): ErrorEvent;
	}

	// ---- for Logger ---

	type DefaultLevel =
		| 'TRACE'
		| 'DEBUG'
		| 'INFO'
		| 'WARN'
		| 'ERROR'
		| 'SILENT';
	type LevelNum = 0 | 1 | 2 | 3 | 4 | 5;
	type Level = DefaultLevel | LevelNum;
	enum Levels {
		'TRACE' = 0,
		'DEBUG' = 1,
		'INFO' = 2,
		'WARN' = 3,
		'ERROR' = 4,
		'SILENT' = 5,
	}
	interface Config {
		useCache: boolean;
		maxCache: number;
		color: string;
		background: string;
	}

	/**
	 * SDK log function
	 * @module Logger
	 */
	class Logger {
		name: string;
		currentLevel: LevelNum;
		useCookiePersist: boolean;
		storageLogLevelKey: string;
		levels: typeof Levels;
		logs: string[];
		config: Config;
		logBytes: number;
		constructor(name: string, defaultLevel: Level, factory?: any);
		setConfig(cofig: Config): void;
		/**
		 * get current log level
		 */
		getLevel(): LevelNum;
		/**
		 * set log level, level: 0-5
		 */
		setLevel(
			level: Level,
			persist: boolean,
			name: string
		): 'No console available for logging' | undefined;
		setDefaultLevel(level: Level): void;
		/**
		 * Allows all levels of log output
		 */
		enableAll(persist?: boolean): void;
		/**
		 * Disabling Log Output
		 */
		disableAll(persist?: boolean): void;
		/**
		 * get logs object
		 */
		getLogs(): string[];
		/**
		 * down load logs
		 */
		download(): void;
	}

	// --- for Message ---

	type MessageType =
		| 'read'
		| 'delivery'
		| 'channel'
		| 'txt'
		| 'cmd'
		| 'custom'
		| 'loc'
		| 'img'
		| 'audio'
		| 'file'
		| 'video';

	type ChatType = 'singleChat' | 'groupChat' | 'chatRoom';
	interface FileObj {
		/** The file URL. */
		url: string;
		/** The file name. */
		filename: string;
		/** The file type. */
		filetype: string;
		/** The File object. */
		data: File;
	}

	interface Reaction {
		/** The content of the reaction to be added to the message. The length is limited to 128 characters. */
		reaction: string;
		/** The reaction count. */
		count: number;
		/** The reaction update operation. Once the reaction is updated, the onReactionChange callback is triggered. */
		op?: { operator: UserId; reactionType: 'create' | 'delete' }[];
		/** The IDs of the users that added the reaction. */
		userList: UserId[];
		/** Whether the current user has added this reaction.
		 * - `true`: Yes.
		 * - `false`: No.
		 */
		isAddedBySelf?: boolean;
	}

	/** Message online state type. */
	enum ONLINESTATETYPE {
		/** Offline message. */
		OFFLINE = 0,
		/** Online message. */
		ONLINE = 1,
		/** Unknown state. */
		UNKNOWN = 2,
		/** Message online status is not enabled. */
		NONE = 3,
	}

	interface PresenceMsg {
		type: OnPresenceMsgType;
		to: string;
		from: string;
		status: string;
		chatroom?: boolean;
		toJid?: string;
		fromJid?: string;
		gid?: string;
		owner?: string;
		reason?: string;
		kicked?: string;
		detail?: GroupModifyInfo;
	}

	interface ReadMsgSetParameters {
		/** The message ID. */
		id: string;
		/** The recipient. */
		to: string;
		/** The sender, which can only be the current user and can not be changed. */
		from?: string;
		/** The session type. */
		chatType: 'singleChat' | 'groupChat';
	}
	interface ReadMsgBody extends ReadMsgSetParameters {
		/** The message type. */
		type: 'read';
		/** Session type. */
		chatType: 'singleChat' | 'groupChat';
		/** The ID of the read message */
		ackId?: string;
		/** The ID of the read message This parameter has the same value as ackId.*/
		mid?: string;
		/** The number of group members that have read the messages. */
		groupReadCount?: { [key: string]: number };
		/** The message content. */
		ackContent?: string;
		/** Whether the message is a thread message. */
		isChatThread?: boolean;
		/** Message online state type. */
		onlineState?: ONLINESTATETYPE;
		/** Message priority. */
		priority?: MessagePriority;
		/** Whether the message is delivered only when the recipient(s) is/are online:
		 *  - `true`: The message is delivered only when the recipient(s) is/are online. If the recipient is offline, the message is discarded.
		 *  - (Default) `false`: The message is delivered when the recipient(s) is/are online. If the recipient(s) is/are offline, the message will not be delivered to them until they get online.
		 */
		deliverOnlineOnly?: boolean;
	}
	interface ReadParameters {
		/** The message type. */
		type: 'read';
		/** The recipient. */
		id: string;
	}

	interface CreateReadMsgParameters {
		/** The recipient. */
		to: string;
		/** The sender, which can only be the current user and can not be changed. */
		from?: string;
		/** The message type. */
		type: 'read';
		/** The session type. */
		chatType: 'singleChat' | 'groupChat';
		/** The ID of the read message. */
		id: string;
		/** The message content. */
		ackContent?: string;
		/** Whether the message is a thread message. */
		isChatThread?: boolean;
		/** Message priority. */
		priority?: MessagePriority;
		/** Whether the message is delivered only when the recipient(s) is/are online:
		 *  - `true`: The message is delivered only when the recipient(s) is/are online. If the recipient is offline, the message is discarded.
		 *  - (Default) `false`: The message is delivered when the recipient(s) is/are online. If the recipient(s) is/are offline, the message will not be delivered to them until they get online.
		 */
		deliverOnlineOnly?: boolean;
	}

	interface DeliveryParameters {
		/** The ID of the delivery receipt. */
		id: string;
		/** The message type. */
		type: 'delivery';
	}
	interface DeliveryMsgSetParameters {
		/** The ID of the delivered message. This parameter has the same value as mid. */
		ackId: string;
		/** The recipient. */
		to: string;
		/** The sender, which can only be the current user and can not be changed. */
		from?: string;
	}
	interface DeliveryMsgBody {
		/** The ID of the delivery receipt. */
		id: string;
		/** The ID of the delivered message. */
		mid?: string;
		/** The ID of the delivered message. This parameter has the same value as mid. */
		ackId?: string;
		/** The message type. */
		type: 'delivery';
		/** The recipient. */
		to: string;
		/** The sender, which can only be the current user and can not be changed. */
		from?: string;
		/** Whether the message is a thread message. */
		isChatThread?: boolean;
		/** Message online state type. */
		onlineState?: ONLINESTATETYPE;
		/** Message priority. */
		priority?: MessagePriority;
		/** Whether the message is delivered only when the recipient(s) is/are online:
		 *  - `true`: The message is delivered only when the recipient(s) is/are online. If the recipient is offline, the message is discarded.
		 *  - (Default) `false`: The message is delivered when the recipient(s) is/are online. If the recipient(s) is/are offline, the message will not be delivered to them until they get online.
		 */
		deliverOnlineOnly?: boolean;
	}

	interface CreateDeliveryMsgParameters {
		/** The ID of the delivered message. */
		ackId: string;
		/** The message type. */
		type: 'delivery';
		/** The recipient. */
		to: string;
		/** The sender, which can only be the current user and can not be changed.*/
		from?: string;
		/** Whether the message is a thread message. */
		isChatThread?: boolean;
		/** Message priority. */
		priority?: MessagePriority;
		/** Whether the message is delivered only when the recipient(s) is/are online:
		 *  - `true`: The message is delivered only when the recipient(s) is/are online. If the recipient is offline, the message is discarded.
		 *  - (Default) `false`: The message is delivered when the recipient(s) is/are online. If the recipient(s) is/are offline, the message will not be delivered to them until they get online.
		 */
		deliverOnlineOnly?: boolean;
	}

	interface ChannelMsgSetParameters {
		/** The session type. */
		chatType: ChatType;
		/** The receipt. */
		to: string;
		/** The sender, which can only be the current user and can not be changed. */
		from?: string;
	}

	interface ChannelMsgBody extends ChannelMsgSetParameters {
		/** The message ID. */
		id: string;
		mid?: string;
		/** Whether it's group chat. */
		group?: string;
		/** The message type. */
		type: 'channel';
		/** Time. */
		time: number;
		/** Whether the message is a thread message. */
		isChatThread?: boolean;
		/** Message online state type. */
		onlineState?: ONLINESTATETYPE;
		/** Message priority. */
		priority?: MessagePriority;
		/** Whether the message is delivered only when the recipient(s) is/are online:
		 *  - `true`: The message is delivered only when the recipient(s) is/are online. If the recipient is offline, the message is discarded.
		 *  - (Default) `false`: The message is delivered when the recipient(s) is/are online. If the recipient(s) is/are offline, the message will not be delivered to them until they get online.
		 */
		deliverOnlineOnly?: boolean;
	}

	interface ChannelParameters {
		/** The message type. */
		type: 'channel';
		/** The message ID. */
		id: string;
	}

	interface CreateChannelMsgParameters {
		/** The message type. */
		type: 'channel';
		/** The ID of the read message. */
		id?: string;
		/** The session type. */
		chatType: ChatType;
		/** The receipt. */
		to: string;
		/** The sender, which can only be the current user and can not be changed. */
		from?: string;
		/** Whether the message is a thread message. */
		isChatThread?: boolean;
		/** Message priority. */
		priority?: MessagePriority;
		/** Whether the message is delivered only when the recipient(s) is/are online:
		 *  - `true`: The message is delivered only when the recipient(s) is/are online. If the recipient is offline, the message is discarded.
		 *  - (Default) `false`: The message is delivered when the recipient(s) is/are online. If the recipient(s) is/are offline, the message will not be delivered to them until they get online.
		 */
		deliverOnlineOnly?: boolean;
	}

	interface TextParameters {
		/** The message type. */
		type: 'txt';
		/** The message ID. */
		id: string;
	}

	interface TextMsgSetParameters {
		/** The session type. */
		chatType: ChatType;
		/** The recipient. */
		to: string;
		/** The message content. */
		msg: string;
		/** The sender, which can only be the current user and can not be changed.*/
		from?: string;
		/** @deprecated Whether the session type is chat room. */
		roomType?: boolean;
		/** The callback for message sending success. */
		success?: (data: SendMsgResult) => void;
		/** The callback for a message sending failure. */
		fail?: () => void;
		/** Message extension. */
		ext?: { [key: string]: any };
		/** Whether the message is a thread message. */
		isChatThread?: boolean;
	}

	interface TextMsgBody {
		/** The message ID. */
		id: string;
		/** The session type. */
		chatType: ChatType;
		/** The message type. */
		type: 'txt';
		/** The recipient. */
		to: string;
		/** The message content. */
		msg: string;
		/** The sender, which can only be the current user and can not be changed.*/
		from?: string;
		/** @deprecated Whether the session type is chat room. */
		roomType?: boolean;
		/** @deprecated Whether the session type is group. */
		group?: string;
		/** The callback for message sending success. */
		success?: (data: SendMsgResult) => void;
		/** The callback for a message sending failure. */
		fail?: () => void;
		/** Message extension. */
		ext?: { [key: string]: any };
		/** Whether read receipts are required during a group session. */
		msgConfig?: { allowGroupAck?: boolean; languages?: string[] };
		/** Message translation */
		translations?: TranslationResult;
		/** Time. */
		time: number;
		/** Whether the message is a thread message. */
		isChatThread?: boolean;
		/** The reaction to be added to the message. The length is limited to 128 characters. */
		reactions?: Reaction[];
		/** The message thread. */
		chatThread?: ChatThread;
		/** The message thread overview. */
		chatThreadOverview?: ChatThreadOverview;
		/** Message online state type. */
		onlineState?: ONLINESTATETYPE;
		/** Message priority. */
		priority?: MessagePriority;
		/** Whether global notify message or not. */
		broadcast?: boolean;
		/** Whether the message is delivered only when the recipient(s) is/are online:
		 *  - `true`: The message is delivered only when the recipient(s) is/are online. If the recipient is offline, the message is discarded.
		 *  - (Default) `false`: The message is delivered when the recipient(s) is/are online. If the recipient(s) is/are offline, the message will not be delivered to them until they get online.
		 */
		deliverOnlineOnly?: boolean;
		/** Message modified info. */
		modifiedInfo?: ModifiedMsgInfo;
		/** The list of message recipients. */
		receiverList?: string[];
	}

	interface CreateTextMsgParameters {
		/** The session type. */
		chatType: ChatType;
		/** The message type. */
		type: 'txt';
		/** The recipient. */
		to: string;
		/** The message content. */
		msg: string;
		/** The sender, which can only be the current user and can not be changed.*/
		from?: string;
		/** Message extension. */
		ext?: { [key: string]: any };
		/** Whether read receipts are required during a group session. */
		msgConfig?: { allowGroupAck?: boolean; languages?: string[] };
		/** Whether the message is a thread message. */
		isChatThread?: boolean;
		/** Message priority. */
		priority?: MessagePriority;
		/** Whether the message is delivered only when the recipient(s) is/are online:
		 *  - `true`: The message is delivered only when the recipient(s) is/are online. If the recipient is offline, the message is discarded.
		 *  - (Default) `false`: The message is delivered when the recipient(s) is/are online. If the recipient(s) is/are offline, the message will not be delivered to them until they get online.
		 */
		deliverOnlineOnly?: boolean;
		/** The list of message recipients. */
		receiverList?: string[];
	}

	interface CombineMsgBody {
		/** The message ID. */
		id: string;
		/** The session type. */
		chatType: ChatType;
		/** The message type. */
		type: 'combine';
		/** The recipient. */
		to: string;
		/** The sender, which can only be the current user and can not be changed.*/
		from?: string;
		/** Message extension. */
		ext?: { [key: string]: any };
		/** Whether read receipts are required during a group session. */
		msgConfig?: {
			allowGroupAck?: boolean;
			languages?: string[];
		};
		/** Time. */
		time: number;
		/** Whether the message is a thread message. */
		isChatThread?: boolean;
		/** Message priority. */
		priority?: MessagePriority;
		/** Whether global notify message or not. */
		broadcast?: boolean;
		/** Whether the message is delivered only when the recipient(s) is/are online:
		 *  - `true`: The message is delivered only when the recipient(s) is/are online. If the recipient is offline, the message is discarded.
		 *  - (Default) `false`: The message is delivered when the recipient(s) is/are online. If the recipient(s) is/are offline, the message will not be delivered to them until they get online.
		 */
		deliverOnlineOnly?: boolean;
		/** The list of message recipients. */
		receiverList?: string[];
		/** The file URL. */
		url?: string;
		/** The secret key required to download the file. */
		secret?: string;
		/** The size of the  file. */
		file_length?: number;
		/** The file type. */
		filename: string;
		/** The title of the merged messages. */
		title: string;
		/** The summary list of merged messages. */
		summary: string;
		/** The reactions list of the message. */
		reactions?: Reaction[];
		/** The information of thread message. */
		chatThread?: ChatThread;
		/** The overview of thread message. */
		chatThreadOverview?: ChatThreadOverview;
		/** The online state. */
		onlineState?: ONLINESTATETYPE;
		/** Compatibility information for merging messages. */
		compatibleText: string;
		/** The level of the merged message. */
		combineLevel: number;
		/** The callback of a file upload error. */
		onFileUploadError?: (error: any) => void;
		/** The callback of file upload completion. */
		onFileUploadComplete?: (data: { url: string; secret: string }) => void;
	}

	type CombineMsgList = Exclude<
		MessagesType,
		DeliveryMsgBody | ReadMsgBody | ChannelMsgBody
	>[];

	interface CreateCombineMsgParameters {
		/** The conversation type. */
		chatType: ChatType;
		/** The message type. */
		type: 'combine';
		/** The recipient. */
		to: string;
		/** The sender, which can only be the current user and can not be changed. */
		from?: string;
		/** The message extension. */
		ext?: { [key: string]: any };
		/** Whether read receipts are required during a group session. */
		msgConfig?: { allowGroupAck?: boolean; languages?: string[] };
		/** Whether the message is a thread message. */
		isChatThread?: boolean;
		/** Message priority. */
		priority?: MessagePriority;
		/** Whether the message is delivered only when the recipient(s) is/are online:
		 *  - `true`: The message is delivered only when the recipient(s) is/are online. If the recipient is offline, the message is discarded.
		 *  - (Default) `false`: The message is delivered when the recipient(s) is/are online. If the recipient(s) is/are offline, the message will not be delivered to them until they get online.
		 */
		deliverOnlineOnly?: boolean;
		/** The list of message recipients. */
		receiverList?: string[];
		/** Compatibility information for merging messages. */
		compatibleText: string;
		/** The title of the merged messages. */
		title: string;
		/** The summary list of merged messages. */
		summary: string;
		/** The list of merged messages. */
		messageList: CombineMsgList;
		/** The callback of a file upload error. */
		onFileUploadError?: (error: any) => void;
		/** The callback of file upload completion. */
		onFileUploadComplete?: (data: { url: string; secret: string }) => void;
	}

	interface CmdParameters {
		/** The message type. */
		type: 'cmd';
		/** The message ID. */
		id: string;
	}
	interface CmdMsgSetParameters {
		/** The session type. */
		chatType: ChatType;
		/** The recipient. */
		to: string;
		/** The command. */
		action: string;
		/** The sender, which can only be the current user and can not be changed.*/
		from?: string;
		/** @deprecated Whether the session type is chat room. */
		roomType?: boolean;
		/** The callback for message sending success. */
		success?: (data: SendMsgResult) => void;
		/** The callback for a message sending failure. */
		fail?: () => void;
		/** Message extension. */
		ext?: { [key: string]: any };
	}

	interface CmdMsgBody {
		/** The message ID. */
		id: string;
		/** The session type. */
		chatType: ChatType;
		/** The message type. */
		type: 'cmd';
		/** The recipient. */
		to: string;
		/** The command. */
		action: string;
		/** The sender, which can only be the current user and can not be changed.*/
		from?: string;
		/** @deprecated Whether the session type is chat room. */
		roomType?: boolean;
		/** @deprecated Whether the session type is group. */
		group?: string;
		/** The callback for message sending success. */
		success?: (data: SendMsgResult) => void;
		/** The callback for a message sending failure. */
		fail?: () => void;
		/** Message extension. */
		ext?: { [key: string]: any };
		/** Whether read receipts are required during a group session. */
		msgConfig?: { [key: string]: any };
		/** Time. */
		time: number;
		/** Whether the message is a thread message. */
		isChatThread?: boolean;
		/** The reaction to be added to the message. The length is limited to 128 characters. */
		reactions?: Reaction[];
		/** The message thread. */
		chatThread?: ChatThread;
		/** The message thread overview. */
		chatThreadOverview?: ChatThreadOverview;
		/** Message online state type. */
		onlineState?: ONLINESTATETYPE;
		/** Message priority. */
		priority?: MessagePriority;
		/** Whether global notify message or not. */
		broadcast?: boolean;
		/** Whether the message is delivered only when the recipient(s) is/are online:
		 *  - `true`: The message is delivered only when the recipient(s) is/are online. If the recipient is offline, the message is discarded.
		 *  - (Default) `false`: The message is delivered when the recipient(s) is/are online. If the recipient(s) is/are offline, the message will not be delivered to them until they get online.
		 */
		deliverOnlineOnly?: boolean;
		/** The list of message recipients. */
		receiverList?: string[];
	}

	interface CreateCmdMsgParameters {
		/** The message type. */
		type: 'cmd';
		/** The session type. */
		chatType: ChatType;
		/** The recipient. */
		to: string;
		/** The command. */
		action: string;
		/** The sender, which can only be the current user and can not be changed.*/
		from?: string;
		/** @deprecated Whether the session type is chat room. */
		roomType?: boolean;
		/** Message extension. */
		ext?: { [key: string]: any };
		/** Whether read receipts are required during a group session. */
		msgConfig?: { allowGroupAck: boolean };
		/** Whether the message is a thread message. */
		isChatThread?: boolean;
		/** Message priority. */
		priority?: MessagePriority;
		/** Whether the message is delivered only when the recipient(s) is/are online:
		 *  - `true`: The message is delivered only when the recipient(s) is/are online. If the recipient is offline, the message is discarded.
		 *  - (Default) `false`: The message is delivered when the recipient(s) is/are online. If the recipient(s) is/are offline, the message will not be delivered to them until they get online.
		 */
		deliverOnlineOnly?: boolean;
		/** The list of message recipients. */
		receiverList?: string[];
	}

	interface CustomParameters {
		/** The message type. */
		type: 'custom';
		/** The message ID. */
		id: string;
	}
	interface CustomMsgSetParameters {
		/** The session type. */
		chatType: ChatType;
		/** The recipient. */
		to: string;
		/** The custom event. */
		customEvent: string;
		/** The custom event extension. */
		customExts: { [key: string]: any };
		/** The sender, which can only be the current user and can not be changed.*/
		from?: string;
		/** @deprecated Whether the session type is chat room. */
		roomType?: boolean;
		/** The callback for message sending success. */
		success?: (data: SendMsgResult) => void;
		/** The callback for a message sending failure. */
		fail?: () => void;
		/** Message extension. */
		ext?: { [key: string]: any };
	}

	interface CustomMsgBody {
		/** The message ID. */
		id: string;
		/** The session type. */
		chatType: ChatType;
		/** The message type. */
		type: 'custom';
		/** The recipient. */
		to: string;
		/** The custom event. */
		customEvent: string;
		/** The custom event extension. */
		customExts: { [key: string]: any };
		/** The sender, which can only be the current user and can not be changed.*/
		from?: string;
		/** @deprecated Whether the session type is chat room. */
		roomType?: boolean;
		/** @deprecated Whether the session type is group. */
		group?: string;
		params?: { [key: string]: any };
		/** The callback for message sending success. */
		success?: (data: SendMsgResult) => void;
		/** The callback for a message sending failure. */
		fail?: () => void;
		/** Message extension. */
		ext?: { [key: string]: any };
		/** Whether read receipts are required during a group session. */
		msgConfig?: { [key: string]: any };
		/** Time. */
		time: number;
		/** Whether the message is a thread message. */
		isChatThread?: boolean;
		/** The reaction to be added to the message. The length is limited to 128 characters. */
		reactions?: Reaction[];
		/** The message thread. */
		chatThread?: ChatThread;
		/** The message thread overview. */
		chatThreadOverview?: ChatThreadOverview;
		/** Message online state type. */
		onlineState?: ONLINESTATETYPE;
		/** Message priority. */
		priority?: MessagePriority;
		/** Whether global notify message or not. */
		broadcast?: boolean;
		/** Whether the message is delivered only when the recipient(s) is/are online:
		 *  - `true`: The message is delivered only when the recipient(s) is/are online. If the recipient is offline, the message is discarded.
		 *  - (Default) `false`: The message is delivered when the recipient(s) is/are online. If the recipient(s) is/are offline, the message will not be delivered to them until they get online.
		 */
		deliverOnlineOnly?: boolean;
		/** The list of message recipients. */
		receiverList?: string[];
	}

	interface CreateCustomMsgParameters {
		/** The message type. */
		type: 'custom';
		/** The session type. */
		chatType: ChatType;
		/** The recipient. */
		to: string;
		/** The custom event. */
		customEvent: string;
		/** The custom event extension. */
		customExts: { [key: string]: any };
		/** The sender, which can only be the current user and can not be changed.*/
		from?: string;
		/** Message extension. */
		ext?: { [key: string]: any };
		/** Whether read receipts are required during a group session. */
		msgConfig?: { allowGroupAck: boolean };
		/** Whether the message is a thread message. */
		isChatThread?: boolean;
		/** Message priority. */
		priority?: MessagePriority;
		/** Whether the message is delivered only when the recipient(s) is/are online:
		 *  - `true`: The message is delivered only when the recipient(s) is/are online. If the recipient is offline, the message is discarded.
		 *  - (Default) `false`: The message is delivered when the recipient(s) is/are online. If the recipient(s) is/are offline, the message will not be delivered to them until they get online.
		 */
		deliverOnlineOnly?: boolean;
		/** The list of message recipients. */
		receiverList?: string[];
	}

	interface LocationParameters {
		/** The message type. */
		type: 'loc';
		/** The message ID. */
		id: string;
	}

	interface LocationMsgSetParameters {
		/** The session type. */
		chatType: ChatType;
		/** The recipient. */
		to: string;
		/** The address. */
		addr: string;
		/** The building name. */
		buildingName: string;
		/** The latitude. */
		lat: number;
		/** The longitude. */
		lng: number;
		/** The sender, which can only be the current user and can not be changed. */
		from?: string;
		/** @deprecated Whether the session type is chat room. */
		roomType?: boolean;
		/** The callback for message sending success. */
		success?: (data: SendMsgResult) => void;
		/** The callback for a message sending failure. */
		fail?: () => void;
		/** The message extension. */
		ext?: { [key: string]: any };
	}

	interface LocationMsgBody {
		/** The message ID. */
		id: string;
		/** The session type. */
		chatType: ChatType;
		/** The message type. */
		type: 'loc';
		/** The recipient. */
		to: string;
		/** The address. */
		addr: string;
		/** The building name. */
		buildingName: string;
		/** The latitude. */
		lat: number;
		/** The longitude. */
		lng: number;
		/** The sender, which can only be the current user and can not be changed. */
		from?: string;
		/** @deprecated Whether the session type is chat room. */
		roomType?: boolean;
		/** @deprecated Whether the session type is group. */
		group?: string;
		/** The callback for message sending success. */
		success?: (data: SendMsgResult) => void;
		/** The callback for a message sending failure. */
		fail?: () => void;
		/** The message extension. */
		ext?: { [key: string]: any };
		/** Time. */
		time: number;
		/** Whether read receipts are required during a group session. */
		msgConfig?: { allowGroupAck: boolean };
		/** Whether the message is a thread message. */
		isChatThread?: boolean;
		/** The reaction to be added to the message. The length is limited to 128 characters. */
		reactions?: Reaction[];
		/** The message thread. */
		chatThread?: ChatThread;
		/** The message thread overview. */
		chatThreadOverview?: ChatThreadOverview;
		/** Message online state type. */
		onlineState?: ONLINESTATETYPE;
		/** Message priority. */
		priority?: MessagePriority;
		/** Whether global notify message or not. */
		broadcast?: boolean;
		/** Whether the message is delivered only when the recipient(s) is/are online:
		 *  - `true`: The message is delivered only when the recipient(s) is/are online. If the recipient is offline, the message is discarded.
		 *  - (Default) `false`: The message is delivered when the recipient(s) is/are online. If the recipient(s) is/are offline, the message will not be delivered to them until they get online.
		 */
		deliverOnlineOnly?: boolean;
		/** The list of message recipients. */
		receiverList?: string[];
	}

	interface CreateLocationMsgParameters {
		/** The message type. */
		type: 'loc';
		/** The session type. */
		chatType: ChatType;
		/** The recipient. */
		to: string;
		/** The address. */
		addr: string;
		/** The building name. */
		buildingName: string;
		/** The latitude. */
		lat: number;
		/** The longitude. */
		lng: number;
		/** The sender, which can only be the current user and can not be changed. */
		from?: string;
		/** The message extension. */
		ext?: { [key: string]: any };
		/** Whether read receipts are required during a group session. */
		msgConfig?: { allowGroupAck: boolean };
		/** Whether the message is a thread message. */
		isChatThread?: boolean;
		/** Message priority. */
		priority?: MessagePriority;
		/** Whether the message is delivered only when the recipient(s) is/are online:
		 *  - `true`: The message is delivered only when the recipient(s) is/are online. If the recipient is offline, the message is discarded.
		 *  - (Default) `false`: The message is delivered when the recipient(s) is/are online. If the recipient(s) is/are offline, the message will not be delivered to them until they get online.
		 */
		deliverOnlineOnly?: boolean;
		/** The list of message recipients. */
		receiverList?: string[];
	}

	interface FileParameters {
		/** The message type. */
		type: 'file';
		/** The message ID. */
		id: string;
	}

	interface UploadFileResult {
		/** The file URL. */
		url: string;
		entities: {
			/** Secret required to download the file. */
			'share-secret': string;
			/** the file category. */
			type: 'chatfile';
			/** Unique ID generated by the file on the server. */
			uuid: string;
		}[];
		[key: string]: any;
	}

	interface FileMsgSetParameters {
		/** The session type. */
		chatType: ChatType;
		/** The file object. */
		file: FileObj;
		/** The file name. */
		filename?: string;
		/** The input ID of the file to be uploaded. */
		fileInputId?: string;
		/** The size of the  file. */
		file_length?: number;
		/** The recipient. */
		to: string;
		/** The sender, which can only be the current user and can not be changed.*/
		from?: string;
		/** @deprecated Whether the session type is chat room. */
		roomType?: boolean;
		/** The callback for message sending success. */
		success?: (data: SendMsgResult) => void;
		/** The callback for a message sending failure. */
		fail?: () => void;
		/** The message extension. */
		ext?: { [key: string]: any };
		/** File upload address. */
		apiUrl?: string;
		/** The callback of a file upload error. */
		onFileUploadError?: (err: ErrorEvent) => void;
		/** The callback of file upload completion. */
		onFileUploadComplete?: (data: UploadFileResult) => void;
		/** The callback of the file upload progress. */
		onFileUploadProgress?: (data: ProgressEvent) => void;
		/** The message body. */
		body?: {
			/** The file URL. */
			url: string;
			/** The file type. */
			type: string;
			/** The file name. */
			filename: string;
		};
		/** Whether the message is a thread message. */
		isChatThread?: boolean;
	}

	interface FileMsgBody extends CreateFileMsgParameters {
		/** The message ID. */
		id: string;
		/** The message type. */
		type: 'file';
		/** @deprecated Whether the session type is group. */
		group?: string;
		/** The file URL. */
		url?: string;
		/** Secret required to download the file. */
		secret?: string;
		length?: number;
		/** The file size. */
		file_length?: number;
		/** The file type. */
		filetype?: string;
		/** AccessToken needed to download files */
		accessToken?: string;
		/** Whether read receipts are required during a group session. */
		msgConfig?: { allowGroupAck: boolean };
		/** Time. */
		time: number;
		/** The reaction to be added to the message. The length is limited to 128 characters. */
		reactions?: Reaction[];
		/** The message thread. */
		chatThread?: ChatThread;
		/** The message thread overview. */
		chatThreadOverview?: ChatThreadOverview;
		/** Message online state type. */
		onlineState?: ONLINESTATETYPE;
		/** Whether the message is a thread message. */
		isChatThread?: boolean;
		/** Message priority. */
		priority?: MessagePriority;
		/** Whether global notify message or not. */
		broadcast?: boolean;
		/** Whether the message is delivered only when the recipient(s) is/are online:
		 *  - `true`: The message is delivered only when the recipient(s) is/are online. If the recipient is offline, the message is discarded.
		 *  - (Default) `false`: The message is delivered when the recipient(s) is/are online. If the recipient(s) is/are offline, the message will not be delivered to them until they get online.
		 */
		deliverOnlineOnly?: boolean;
	}

	interface CreateFileMsgParameters {
		/** The message type. */
		type: 'file';
		/** The session type. */
		chatType: ChatType;
		/** The file object. */
		file: FileObj;
		/** The file name. */
		filename?: string;
		/** The input ID of the file to be uploaded. */
		fileInputId?: string;
		/** The recipient. */
		to: string;
		/** The sender, which can only be the current user and can not be changed.*/
		from?: string;
		/** The message extension. */
		ext?: { [key: string]: any };
		/** File upload address. */
		apiUrl?: string;
		/** The callback of a file upload error. */
		onFileUploadError?: (err: ErrorEvent) => void;
		/** The callback of file upload completion. */
		onFileUploadComplete?: (data: UploadFileResult) => void;
		/** The callback of the file upload progress. */
		onFileUploadProgress?: (data: ProgressEvent) => void;
		/** The message body. */
		body?: {
			/** The file URL. */
			url: string;
			/** The file type. */
			type: string;
			/** The file name. */
			filename: string;
		};
		/** Whether read receipts are required during a group session. */
		msgConfig?: { allowGroupAck: boolean };
		/** Whether the message is a thread message. */
		isChatThread?: boolean;
		/** Message priority. */
		priority?: MessagePriority;
		/** Whether the message is delivered only when the recipient(s) is/are online:
		 *  - `true`: The message is delivered only when the recipient(s) is/are online. If the recipient is offline, the message is discarded.
		 *  - (Default) `false`: The message is delivered when the recipient(s) is/are online. If the recipient(s) is/are offline, the message will not be delivered to them until they get online.
		 */
		deliverOnlineOnly?: boolean;
		/** The list of message recipients. */
		receiverList?: string[];
	}

	interface ImgParameters {
		/** The message type. */
		type: 'img';
		/** The message ID. */
		id: string;
	}

	interface ImgMsgSetParameters {
		/** The session type. */
		chatType: ChatType;
		/** The recipient. */
		to: string;
		/** The file object. */
		file?: FileObj;
		/** The image width. */
		width?: number;
		/** The image height. */
		height?: number;
		/** The image file length. */
		file_length?: number;
		/** The input ID of the file to be uploaded. */
		fileInputId?: string;
		/** The sender, which can only be the current user and can not be changed.*/
		from?: string;
		/** @deprecated Whether the session type is chat room. */
		roomType?: boolean;
		/** @deprecated Whether the session type is group. */
		group?: string;
		/** The callback for message sending success. */
		success?: (data: SendMsgResult) => void;
		/** The callback for a message sending failure. */
		fail?: () => void;
		/** The message extension. */
		ext?: { [key: string]: any };
		/** The file URL. If the file is uploaded, you can directly use the URL. */
		url?: string;
		/** The callback of a file upload error. */
		onFileUploadError?: (err: ErrorEvent) => void;
		/** The callback of file upload completion. */
		onFileUploadComplete?: (data: UploadFileResult) => void;
		/** The callback of the file upload progress. */
		onFileUploadProgress?: (data: ProgressEvent) => void;
		/** Whether read receipts are required during a group session. */
		msgConfig?: { [key: string]: any };
		/** The message body. */
		body?: {
			/** The file URL. */
			url: string;
			/** The file type. */
			type: string;
			/** The file name. */
			filename: string;
		};
	}

	interface ImgMsgBody extends ImgMsgSetParameters {
		/** The message ID. */
		id: string;
		/** The message type. */
		type: 'img';
		/** Time. */
		time: number;
		/** Secret required to download the image. */
		secret?: string;
		/** The thumbnails of image. */
		thumb?: string;
		/** Secret required to download the thumbnails. */
		thumb_secret?: string;
		/** Whether the message is a thread message. */
		isChatThread?: boolean;
		/** The reaction to be added to the message. The length is limited to 128 characters. */
		reactions?: Reaction[];
		/** The message thread. */
		chatThread?: ChatThread;
		/** The message thread overview. */
		chatThreadOverview?: ChatThreadOverview;
		/** Message online state type. */
		onlineState?: ONLINESTATETYPE;
		/** Message priority. */
		priority?: MessagePriority;
		/** Whether global notify message or not. */
		broadcast?: boolean;
		/** Whether the message is delivered only when the recipient(s) is/are online:
		 *  - `true`: The message is delivered only when the recipient(s) is/are online. If the recipient is offline, the message is discarded.
		 *  - (Default) `false`: The message is delivered when the recipient(s) is/are online. If the recipient(s) is/are offline, the message will not be delivered to them until they get online.
		 */
		deliverOnlineOnly?: boolean;
		/** The list of message recipients. */
		receiverList?: string[];
		/** The thumbnail width. */
		thumbnailWidth?: number;
		/** The thumbnail height. */
		thumbnailHeight?: number;
	}

	interface CreateImgMsgParameters {
		/** The message type. */
		type: 'img';
		/** The session type. */
		chatType: ChatType;
		/** The file object. */
		file?: FileObj;
		/** The file URL. If the file is uploaded, you can directly use the URL. */
		url?: string;
		/** The image width. */
		width?: number;
		/** The image height. */
		height?: number;
		/** The image file length. */
		file_length?: number;
		/** The recipient. */
		to: string;
		/** The sender, which can only be the current user and can not be changed.*/
		from?: string;
		/** The callback of a file upload error. */
		onFileUploadError?: (err: ErrorEvent) => void;
		/** The callback of file upload completion. */
		onFileUploadComplete?: (data: UploadFileResult) => void;
		/** The callback of the file upload progress. */
		onFileUploadProgress?: (data: ProgressEvent) => void;
		/** The message extension. */
		ext?: { [key: string]: any };
		/** The message body. */
		body?: {
			/** The file URL. */
			url: string;
			/** The file type. */
			type: string;
			/** The file name. */
			filename: string;
		};
		/** Whether read receipts are required during a group session. */
		msgConfig?: { allowGroupAck: boolean };
		/** Whether the message is a thread message. */
		isChatThread?: boolean;
		/** Message priority. */
		priority?: MessagePriority;
		/** Whether the message is delivered only when the recipient(s) is/are online:
		 *  - `true`: The message is delivered only when the recipient(s) is/are online. If the recipient is offline, the message is discarded.
		 *  - (Default) `false`: The message is delivered when the recipient(s) is/are online. If the recipient(s) is/are offline, the message will not be delivered to them until they get online.
		 */
		deliverOnlineOnly?: boolean;
		/** The list of message recipients. */
		receiverList?: string[];
		/** The thumbnail width. */
		thumbnailWidth?: number;
		/** The thumbnail height. */
		thumbnailHeight?: number;
	}

	interface AudioParameters {
		/** The message type. */
		type: 'audio';
		/** The message ID. */
		id: string;
	}
	interface AudioMsgSetParameters {
		/** The session type. */
		chatType: ChatType;
		/** The file object. */
		file: FileObj;
		/** The file name. */
		filename: string;
		/** The audio duration. */
		length?: number;
		/** The file size. */
		file_length?: number;
		/** The input ID of the file to be uploaded. */
		fileInputId?: string;
		/** The recipient. */
		to: string;
		/** The sender, which can only be the current user and can not be changed.*/
		from?: string;
		/** @deprecated Whether the session type is chat room. */
		roomType?: boolean;
		/** The callback for message sending success. */
		success?: (data: SendMsgResult) => void;
		/** The callback for a message sending failure. */
		fail?: () => void;
		/** The message extension. */
		ext?: { [key: string]: any };
		/** File upload address. */
		apiUrl?: string;
		/** The callback of a file upload error. */
		onFileUploadError?: (err: ErrorEvent) => void;
		/** The callback of file upload completion. */
		onFileUploadComplete?: (data: UploadFileResult) => void;
		/** The callback of the file upload progress. */
		onFileUploadProgress?: (data: ProgressEvent) => void;
		/** The message body. */
		body?: {
			/** The file URL. */
			url: string;
			/** The file type. */
			type: string;
			/** The file name. */
			filename: string;
		};
	}

	interface AudioMsgBody extends AudioMsgSetParameters {
		/** The message ID. */
		id: string;
		/** The message type. */
		type: 'audio';
		/** The audio file URL. */
		url?: string;
		/** Secret required to download the audio file. */
		secret?: string;
		/** The file type. */
		filetype?: string;
		/** AccessToken needed to download files */
		accessToken?: string;
		/** @deprecated Whether the session type is group. */
		group?: string;
		/** Whether read receipts are required during a group session. */
		msgConfig?: { [key: string]: any };
		/** Time. */
		time: number;
		/** Whether the message is a thread message. */
		isChatThread?: boolean;
		/** The reaction to be added to the message. The length is limited to 128 characters. */
		reactions?: Reaction[];
		/** The message thread. */
		chatThread?: ChatThread;
		/** The message thread overview. */
		chatThreadOverview?: ChatThreadOverview;
		/** Message online state type. */
		onlineState?: ONLINESTATETYPE;
		/** Message priority. */
		priority?: MessagePriority;
		/** Whether global notify message or not. */
		broadcast?: boolean;
		/** Whether the message is delivered only when the recipient(s) is/are online:
		 *  - `true`: The message is delivered only when the recipient(s) is/are online. If the recipient is offline, the message is discarded.
		 *  - (Default) `false`: The message is delivered when the recipient(s) is/are online. If the recipient(s) is/are offline, the message will not be delivered to them until they get online.
		 */
		deliverOnlineOnly?: boolean;
		/** The list of message recipients. */
		receiverList?: string[];
	}

	interface CreateAudioMsgParameters {
		/** The message type. */
		type: 'audio';
		/** The session type. */
		chatType: ChatType;
		/** The file object. */
		file: FileObj;
		/** The file name. */
		filename: string;
		/** The audio duration. */
		length?: number;
		/** The audio file length. */
		file_length?: number;
		/** The input ID of the file to be uploaded. */
		fileInputId?: string;
		/** The recipient. */
		to: string;
		/** The sender, which can only be the current user and can not be changed.*/
		from?: string;
		/** The message extension. */
		ext?: { [key: string]: any };
		/** The callback of a file upload error. */
		onFileUploadError?: (err: ErrorEvent) => void;
		/** The callback of file upload completion. */
		onFileUploadComplete?: (data: UploadFileResult) => void;
		/** The callback of the file upload progress. */
		onFileUploadProgress?: (data: ProgressEvent) => void;
		/** The message body. */
		body?: {
			/** The file URL. */
			url: string;
			/** The file type. */
			type: string;
			/** The file name. */
			filename: string;
		};
		/** Whether read receipts are required during a group session. */
		msgConfig?: { allowGroupAck: boolean };
		/** Whether the message is a thread message. */
		isChatThread?: boolean;
		/** Message priority. */
		priority?: MessagePriority;
		/** Whether the message is delivered only when the recipient(s) is/are online:
		 *  - `true`: The message is delivered only when the recipient(s) is/are online. If the recipient is offline, the message is discarded.
		 *  - (Default) `false`: The message is delivered when the recipient(s) is/are online. If the recipient(s) is/are offline, the message will not be delivered to them until they get online.
		 */
		deliverOnlineOnly?: boolean;
		/** The list of message recipients. */
		receiverList?: string[];
	}

	interface VideoParameters {
		/** The message type. */
		type: 'video';
		/** The message ID. */
		id: string;
	}
	interface VideoMsgSetParameters {
		/** The session type. */
		chatType: ChatType;
		/** The file object. */
		file: FileObj;
		/** The file name. */
		filename: string;
		/** The video duration. */
		length?: number;
		/** The size of the video file. */
		file_length?: number;
		/** The input ID of the file to be uploaded. */
		fileInputId?: string;
		/** The recipient. */
		to: string;
		/** The sender, which can only be the current user and can not be changed. */
		from?: string;
		/** @deprecated Whether the session type is chat room. */
		roomType?: boolean;
		/** The callback for message sending success. */
		success?: (data: SendMsgResult) => void;
		/** The callback for a message sending failure. */
		fail?: () => void;
		/** The message extension. */
		ext?: { [key: string]: any };
		/** File upload address. */
		apiUrl?: string;
		/** The callback of a file upload error. */
		onFileUploadError?: (err: ErrorEvent) => void;
		/** The callback of file upload completion. */
		onFileUploadComplete?: (data: UploadFileResult) => void;
		/** The callback of the file upload progress. */
		onFileUploadProgress?: (data: ProgressEvent) => void;
		/** The message body. */
		body?: {
			/** The file URL. */
			url: string;
			/** The file type. */
			type: string;
			/** The file name. */
			filename: string;
		};
	}

	interface VideoMsgBody extends VideoMsgSetParameters {
		/** The message ID. */
		id: string;
		/** The message type. */
		type: 'video';
		/** The file URL. */
		url?: string;
		/** Secret required to download the video file. */
		secret?: string;
		/** The file type. */
		filetype?: string;
		/** AccessToken needed to download files */
		accessToken?: string;
		/** Whether read receipts are required during a group session. */
		msgConfig?: { [key: string]: any };
		/** @deprecated Whether the session type is group. */
		group?: string;
		/** Time. */
		time: number;
		/** Whether the message is a thread message. */
		isChatThread?: boolean;
		/** The reaction to be added to the message. The length is limited to 128 characters. */
		reactions?: Reaction[];
		/** The message thread. */
		chatThread?: ChatThread;
		/** The message thread overview. */
		chatThreadOverview?: ChatThreadOverview;
		/** Message online state type. */
		onlineState?: ONLINESTATETYPE;
		/** Message priority. */
		priority?: MessagePriority;
		/** Whether global notify message or not. */
		broadcast?: boolean;
		/** Whether the message is delivered only when the recipient(s) is/are online:
		 *  - `true`: The message is delivered only when the recipient(s) is/are online. If the recipient is offline, the message is discarded.
		 *  - (Default) `false`: The message is delivered when the recipient(s) is/are online. If the recipient(s) is/are offline, the message will not be delivered to them until they get online.
		 */
		deliverOnlineOnly?: boolean;
		/** The list of message recipients. */
		receiverList?: string[];
	}

	interface CreateVideoMsgParameters {
		/** The message type. */
		type: 'video';
		/** The session type. */
		chatType: ChatType;
		/** The file object. */
		file: FileObj;
		/** The file name. */
		filename: string;
		/** The video duration. */
		length?: number;
		/** The size of the video file. */
		file_length?: number;
		/** The input ID of the file to be uploaded. */
		fileInputId?: string;
		/** The recipient. */
		to: string;
		/** The sender, which can only be the current user and can not be changed. */
		from?: string;
		/** The message extension. */
		ext?: { [key: string]: any };
		/** File upload address. */
		apiUrl?: string;
		/** The callback of a file upload error. */
		onFileUploadError?: (err: ErrorEvent) => void;
		/** The callback of file upload completion. */
		onFileUploadComplete?: (data: UploadFileResult) => void;
		/** The callback of the file upload progress. */
		onFileUploadProgress?: (data: ProgressEvent) => void;
		/** The message body. */
		body?: {
			/** The file URL. */
			url: string;
			/** The file type. */
			type: string;
			/** The file name. */
			filename: string;
		};
		/** Whether read receipts are required during a group session. */
		msgConfig?: { allowGroupAck: boolean };
		/** Whether the message is a thread message. */
		isChatThread?: boolean;
		/** Message priority. */
		priority?: MessagePriority;
		/** Whether the message is delivered only when the recipient(s) is/are online:
		 *  - `true`: The message is delivered only when the recipient(s) is/are online. If the recipient is offline, the message is discarded.
		 *  - (Default) `false`: The message is delivered when the recipient(s) is/are online. If the recipient(s) is/are offline, the message will not be delivered to them until they get online.
		 */
		deliverOnlineOnly?: boolean;
		/** The list of message recipients. */
		receiverList?: string[];
	}

	interface ReceivedMsgBody {
		/** Locally generated message ID. */
		id: string;
		/** Message ID generated by the server. */
		mid: string;
		/** The recipient. */
		to: string;
	}

	interface RecallMsgBody {
		/** The message ID. */
		id: string;
		/** The message sender. */
		from: string;
		/** The message receiver. */
		to: string;
		/** The ID of the message to be recalled. */
		mid: string;
		/** Message online state type. */
		onlineState?: ONLINESTATETYPE;
	}

	interface ContactMsgBody {
		/** The message type, subscribe: request a contact, unsubscribed: cancel or refuse to add contact, subscribed: added contact successfully. */
		type: 'subscribe' | 'unsubscribed' | 'subscribed';
		/** The message receiver. */
		to: string;
		/** The message sender. */
		from: string;
		/** Reason. */
		status?: string;
	}

	type NewMessageParamters =
		| ReadParameters
		| DeliveryParameters
		| ChannelParameters
		| TextParameters
		| CmdParameters
		| CustomParameters
		| LocationParameters
		| ImgParameters
		| AudioParameters
		| VideoParameters
		| FileParameters;

	type MessagesType =
		| TextMsgBody
		| DeliveryMsgBody
		| ChannelMsgBody
		| CmdMsgBody
		| CustomMsgBody
		| ImgMsgBody
		| LocationMsgBody
		| AudioMsgBody
		| VideoMsgBody
		| FileMsgBody
		| ReadMsgBody
		| CombineMsgBody;

	type MessageSetParameters =
		| ReadMsgSetParameters
		| DeliveryMsgSetParameters
		| ChannelMsgSetParameters
		| TextMsgSetParameters
		| CmdMsgSetParameters
		| CustomMsgSetParameters
		| LocationMsgSetParameters
		| ImgMsgSetParameters
		| AudioMsgSetParameters
		| VideoMsgSetParameters
		| FileMsgSetParameters;

	type CreateMsgType =
		| CreateTextMsgParameters
		| CreateImgMsgParameters
		| CreateCmdMsgParameters
		| CreateFileMsgParameters
		| CreateVideoMsgParameters
		| CreateCustomMsgParameters
		| CreateLocationMsgParameters
		| CreateChannelMsgParameters
		| CreateDeliveryMsgParameters
		| CreateReadMsgParameters
		| CreateAudioMsgParameters
		| CreateCombineMsgParameters;

	type MessageBody =
		| ReadMsgBody
		| DeliveryMsgBody
		| ChannelMsgBody
		| TextMsgBody
		| CmdMsgBody
		| CustomMsgBody
		| LocationMsgBody
		| ImgMsgBody
		| AudioMsgBody
		| VideoMsgBody
		| FileMsgBody
		| CombineMsgBody;

	type MessagePriority = 'high' | 'normal' | 'low';
	interface MetaExts {
		chatroom_msg_tag: number;
		is_broadcast?: boolean;
	}
	/**
	 * Message class is used to create a message.
	 * @module message
	 */
	class Message {
		/** The message ID. */
		id: string;
		/** The message type. */
		type: MessageType;
		body?: MessageBody;
		constructor(type: MessageType, id?: string);
		/** @deprecated */
		static createOldMsg(options: NewMessageParamters): MessageBody;
		/** Create messages. */
		static create(options: CreateMsgType): MessageBody;
		/** @deprecated */
		set(options: MessageSetParameters): void;
	}

	// ---- for Utils

	interface AjaxOptions {
		url: string;
		dataType?: string;
		type?: string;
		data?: any;
		headers?: KVString;
		responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text';
		mimeType?: string;
		success?: (res: any) => void;
		error?: (res: any) => void;
	}

	enum PLATFORM {
		WEB = 'web',
		WX = 'wx',
		ZFB = 'zfb',
		DD = 'dd',
		TT = 'tt',
		BAIDU = 'baidu',
		QUICK_APP = 'quick_app',
		UNI = 'uni',
	}
	interface EnvInfo {
		/** Code running platform. */
		platform: PLATFORM;
		/** global variable. */
		global: any;
	}
	interface UploadFile {
		onFileUploadProgress?: (data: ProgressEvent) => void;
		onFileUploadComplete?: (data: any) => void;
		onFileUploadError?: (error: ErrorEvent) => void;
		onFileUploadCanceled?: () => void;
		accessToken: string;
		appKey: string;
		apiUrl?: string;
		uploadUrl?: string;
		file: object;
	}
	interface DownloadParams {
		url: string;
		onFileDownloadComplete: (data: any) => void;
		onFileDownloadError: (error: {
			type: Code;
			id: string;
			xhr: XMLHttpRequest;
		}) => void;
		id?: string;
		headers?: { [key: string]: any };
		secret?: string;
		[key: string]: any;
	}

	/**
	 * Some utility methods provided in SDK
	 * @module utils
	 */
	interface Utils {
		getUniqueId: () => string;
		ajax: (options: AjaxOptions) => Promise<any>;
		getFileUrl: (fileInputId: string | HTMLInputElement) => FileObj;
		uploadFile: (options: UploadFile) => void;
		listenNetwork: (online: () => void, offline: () => void) => void;
		getEnvInfo: () => EnvInfo;
		wxRequest: (options: AjaxOptions) => Promise<any>;
		parseDownloadResponse: (res: any) => string;
		download: (params: DownloadParams) => void;
	}
}
