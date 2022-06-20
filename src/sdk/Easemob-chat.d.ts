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
		type: Code;
		data?: T;
		entities?: T;
		message?: string;
		[key: string]: any;
	}

	type UserId = string;

	interface CommonRequestResult {
		result: boolean;
		action: string;
		reason?: string;
		user: string;
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

	interface RosterData {
		name: string;
		subscription: 'both';
		jid: Jid;
	}

	interface Host {
		protocol: string;
		domain: string;
		ip: string;
		port: string;
	}

	interface SendMsgResult {
		/** The message local ID. */
		localMsgId: string;
		/** The ID of the message on the server. */
		serverMsgId: string;
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
		operation: multiDeviceEventType;
		chatThreadId?: string;
		chatThreadName?: string;
		parentId?: string;
	}

	/**
	 * The connection module is the module where the SDK creates long link, And all about links, friends, groups, and chat apis are  all in this module
	 *
	 * @module connection
	 */

	interface ConnectionParameters {
		appKey: string;
		apiUrl?: string;
		url?: string;
		delivery?: boolean;
		isDebug?: boolean;
		isHttpDNS?: boolean;
		heartBeatWait?: number;
		deviceId?: string;
		useOwnUploadFun?: boolean;
		autoReconnectNumMax?: number;
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
	// The group api result end.

	// The contact api start.
	interface UpdateOwnUserInfoParams {
		/** The nickname. */
		nickname?: string;
		/** The avatar url. */
		avatarurl?: string;
		/** The email. */
		mail?: string;
		/** The phone number. */
		phone?: string;
		/** Gender. */
		gender?: string | number | boolean;
		/** Sign. */
		sign?: string;
		/** Birthday. */
		birth?: string;
		/** Extension. */
		ext?: { [key: string]: string | number | boolean };
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

	interface PushInfo {
		/** The device token. */
		device_id: string;
		/** The push token, which can be defined by yourself, is generally used to identify the same device. */
		device_token: string;
		/** The Push service appId, senderID for FCM, "appId+#+AppKey" for Vivo */
		notifier_name: string;
	}

	interface UploadTokenResult extends BaseUserInfo {
		/** The push ionfo. */
		pushInfo: PushInfo[];
	}

	interface SessionInfo {
		/** The session ID. */
		channel_id: string;
		/** The last message content. */
		meta: {
			/** The message sender. */
			from: string;
			/** The message ID. */
			id: string;
			/** The message content. */
			payload: string;
			/** The time of receiving message. */
			timestamp: number;
			/** Message receiver. */
			to: string;
		};
		/** The number of unread messages. */
		unread_num: number;
	}

	interface DeleteSessionResult {
		/** The result of request. */
		/** 请求结果。 */
		result: 'ok';
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
		ranslations: {
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

	interface PublishPresenceResult {
		/** The result of publish. */
		result: 'ok';
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
			[propname: UserId]: SilentModeConversationType;
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
		/** All messsage. */
		ALL = 'ALL',
		/** @ messaage of myself. */
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
	interface HistoryMessages {
		//** The cursor that specifies where to start to get data. If there will be data on the next page, this method will return the value of this field to indicate the position to start to get data of the next page. If it is empty string, the data of the first page will be fetched.*/
		cursor?: string;
		/** The Historical messages. */
		messages: MessageBody[];
	}
	interface conversationList {
		/** The conversation ID. */
		channel_id: string;
		/** Overview of the latest news. */
		lastMessage: LastMessage;
		/** The number of unread messages. */
		unread_num: number;
	}

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

	enum Code {
		REQUEST_SUCCESS = 0,
		REQUEST_TIMEOUT = -1,
		REQUEST_UNKNOWN = -2,
		REQUEST_PARAMETER_ERROR = -3,
		REQUEST_ABORT = -4,
		WEBIM_CONNCTION_USER_NOT_ASSIGN_ERROR = 0,
		WEBIM_CONNCTION_OPEN_ERROR = 1,
		WEBIM_CONNCTION_AUTH_ERROR = 2,
		WEBIM_CONNCTION_OPEN_USERGRID_ERROR = 3,
		WEBIM_CONNCTION_ATTACH_ERROR = 4,
		WEBIM_CONNCTION_ATTACH_USERGRID_ERROR = 5,
		WEBIM_CONNCTION_REOPEN_ERROR = 6,
		WEBIM_CONNCTION_SERVER_CLOSE_ERROR = 7,
		WEBIM_CONNCTION_SERVER_ERROR = 8,
		WEBIM_CONNCTION_IQ_ERROR = 9,
		WEBIM_CONNCTION_PING_ERROR = 10,
		WEBIM_CONNCTION_NOTIFYVERSION_ERROR = 11,
		WEBIM_CONNCTION_GETROSTER_ERROR = 12,
		WEBIM_CONNCTION_CROSSDOMAIN_ERROR = 13,
		WEBIM_CONNCTION_LISTENING_OUTOF_MAXRETRIES = 14,
		WEBIM_CONNCTION_RECEIVEMSG_CONTENTERROR = 15,
		WEBIM_CONNCTION_DISCONNECTED = 16,
		WEBIM_CONNCTION_AJAX_ERROR = 17,
		WEBIM_CONNCTION_JOINROOM_ERROR = 18,
		WEBIM_CONNCTION_GETROOM_ERROR = 19,
		WEBIM_CONNCTION_GETROOMINFO_ERROR = 20,
		WEBIM_CONNCTION_GETROOMMEMBER_ERROR = 21,
		WEBIM_CONNCTION_GETROOMOCCUPANTS_ERROR = 22,
		WEBIM_CONNCTION_LOAD_CHATROOM_ERROR = 23,
		WEBIM_CONNCTION_NOT_SUPPORT_CHATROOM_ERROR = 24,
		WEBIM_CONNCTION_JOINCHATROOM_ERROR = 25,
		WEBIM_CONNCTION_QUITCHATROOM_ERROR = 26,
		WEBIM_CONNCTION_APPKEY_NOT_ASSIGN_ERROR = 27,
		WEBIM_CONNCTION_TOKEN_NOT_ASSIGN_ERROR = 28,
		WEBIM_CONNCTION_SESSIONID_NOT_ASSIGN_ERROR = 29,
		WEBIM_CONNCTION_RID_NOT_ASSIGN_ERROR = 30,
		WEBIM_CONNCTION_CALLBACK_INNER_ERROR = 31,
		WEBIM_CONNCTION_CLIENT_OFFLINE = 32,
		WEBIM_CONNCTION_CLIENT_LOGOUT = 33,
		WEBIM_CONNCTION_CLIENT_TOO_MUCH_ERROR = 34,
		WEBIM_CONNECTION_ACCEPT_INVITATION_FROM_GROUP = 35,
		WEBIM_CONNECTION_DECLINE_INVITATION_FROM_GROUP = 36,
		WEBIM_CONNECTION_ACCEPT_JOIN_GROUP = 37,
		WEBIM_CONNECTION_DECLINE_JOIN_GROUP = 38,
		WEBIM_CONNECTION_CLOSED = 39,
		WEBIM_CONNECTION_ERROR = 40,
		MAX_LIMIT = 50,
		MESSAGE_NOT_FOUND = 51,
		NO_PERMISSION = 52,
		OPERATION_UNSUPPORTED = 53,
		WEBIM_UPLOADFILE_BROWSER_ERROR = 100,
		WEBIM_UPLOADFILE_ERROR = 101,
		WEBIM_UPLOADFILE_NO_LOGIN = 102,
		WEBIM_UPLOADFILE_NO_FILE = 103,
		WEBIM_DOWNLOADFILE_ERROR = 200,
		WEBIM_DOWNLOADFILE_NO_LOGIN = 201,
		WEBIM_DOWNLOADFILE_BROWSER_ERROR = 202,
		USER_NOT_FOUND = 204,
		WEBIM_CONNCTION_USER_LOGIN_ANOTHER_DEVICE = 206,
		WEBIM_CONNCTION_USER_REMOVED = 207,
		WEBIM_CONNCTION_USER_KICKED_BY_CHANGE_PASSWORD = 216,
		WEBIM_CONNCTION_USER_KICKED_BY_OTHER_DEVICE = 217,
		USER_MUTED_BY_ADMIN = 219,
		USER_NOT_FRIEND = 221,
		WEBIM_MESSAGE_REC_TEXT = 300,
		WEBIM_MESSAGE_REC_TEXT_ERROR = 301,
		WEBIM_MESSAGE_REC_EMOTION = 302,
		WEBIM_MESSAGE_REC_PHOTO = 303,
		WEBIM_MESSAGE_REC_AUDIO = 304,
		WEBIM_MESSAGE_REC_AUDIO_FILE = 305,
		WEBIM_MESSAGE_REC_VEDIO = 306,
		WEBIM_MESSAGE_REC_VEDIO_FILE = 307,
		WEBIM_MESSAGE_REC_FILE = 308,
		WEBIM_MESSAGE_SED_TEXT = 309,
		WEBIM_MESSAGE_SED_EMOTION = 310,
		WEBIM_MESSAGE_SED_PHOTO = 311,
		WEBIM_MESSAGE_SED_AUDIO = 312,
		WEBIM_MESSAGE_SED_AUDIO_FILE = 313,
		WEBIM_MESSAGE_SED_VEDIO = 314,
		WEBIM_MESSAGE_SED_VEDIO_FILE = 315,
		WEBIM_MESSAGE_SED_FILE = 316,
		WEBIM_MESSAGE_SED_ERROR = 317,
		STATUS_INIT = 400,
		STATUS_DOLOGIN_USERGRID = 401,
		STATUS_DOLOGIN_IM = 402,
		STATUS_OPENED = 403,
		STATUS_CLOSING = 404,
		STATUS_CLOSED = 405,
		STATUS_ERROR = 406,
		SERVER_BUSY = 500,
		MESSAGE_INCLUDE_ILLEGAL_CONTENT = 501,
		MESSAGE_EXTERNAL_LOGIC_BLOCKED = 502,
		SERVER_UNKNOWN_ERROR = 503,
		MESSAGE_RECALL_TIME_LIMIT = 504,
		SERVICE_NOT_ENABLED = 505,
		SERVICE_NOT_ALLOW_MESSAGING = 506,
		SERVICE_NOT_ALLOW_MESSAGING_MUTE = 507,
		MESSAGE_MODERATION_BLOCKED = 508,
		GROUP_NOT_EXIST = 605,
		GROUP_NOT_JOINED = 602,
		GROUP_MEMBERS_FULL = 606,
		PERMISSION_DENIED = 603,
		WEBIM_LOAD_MSG_ERROR = 604,
		GROUP_ALREADY_JOINED = 601,
		GROUP_MEMBERS_LIMIT = 607,
		REST_PARAMS_STATUS = 700,
		CHATROOM_MEMBERS_FULL = 704,
		CHATROOM_NOT_EXIST = 705,
		SDK_RUNTIME_ERROR = 999,
		PRESENCE_PARAM_EXCEED = 1100,
		REACTION_ALREADY_ADDED = 1101,
		REACTION_CREATING = 1102,
		REACTION_OPERATION_IS_ILLEGAL = 1103,
		TRANSLATION_NOT_VALID = 1200,
		TRANSLATION_TEXT_TOO_LONG = 1201,
		TRANSLATION_FAILED = 1204,
		THREAD_NOT_EXIST = 1300,
		THREAD_ALREADY_EXIST = 1301,
	}

	/**
	 * @category Connection
	 */
	class Connection {
		isDebug: boolean;
		isHttpDNS: boolean;
		heartBeatWait: number;
		appKey: string;
		appName: string;
		orgName: string;
		token: string;
		autoReconnectNumMax: number;
		autoReconnectNumTotal: number;
		version: string;
		deviceId: string;
		osType: number;
		useOwnUploadFun: boolean;
		apiUrl: string;
		url: string;
		https: boolean;
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
		/**
		 * @since 4.0.1
		 */
		eventHandler?: EventHandler;
		/**
		 * @deprecated 4.0.1
		 */
		onOpened?: () => void;
		/**
		 * @deprecated 4.0.1
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
		onMutedMessage?: (msg: MuteMsgBody) => void;
		onChannelMessage?: (msg: ChannelMsgBody) => void;
		onError?: (error: ErrorEvent) => void;
		onOffline?: () => void;
		onOnline?: () => void;
		onRoster?: (rosters: RosterData[]) => void;
		onStatisticMessage?: (msg: any) => void;
		onCreateGroup?: (data: any) => void;
		onBlacklistUpdate?: (list: {
			[key: string]: {
				name: string;
			};
		}) => void;
		onContactAgreed?: (msg: ContactMsgBody) => void;
		onContactRefuse?: (msg: ContactMsgBody) => void;
		onContactDeleted?: (msg: ContactMsgBody) => void;
		onContactAdded?: (msg: ContactMsgBody) => void;
		onTokenWillExpire?: () => void;
		onTokenExpired?: () => void;
		// eslint-disable-next-line no-undef
		[key: string]: any;
		constructor(options: ConnectionParameters);

		registerUser(
			this: Connection,
			params: {
				username: string;
				password: string;
				nickname?: string;
				success?: (res: any) => void;
				error?: (err: ErrorEvent) => void;
				apiUrl?: string;
			}
		): Promise<RegisterUserResult>;

		open(parameters: {
			user: string;
			pwd?: string;
			accessToken?: string;
			agoraToken?: string;
			success?: (res: any) => void;
			error?: (res: any) => void;
		}): Promise<LoginResult>;
		isOpened(): boolean;
		close(): void;
		getChatToken(agoraToken: string): Promise<any>;
		reconnect(): void;
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
				pagenum: number;
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
				name: string;
				description: string;
				maxusers: number;
				members: UserId[];
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
				chatRoomId: string;
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
				chatRoomId: string;
				chatRoomName: string;
				description: string;
				maxusers: number;
				success?: (res: AsyncResult<ModifyChatRoomResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<ModifyChatRoomResult>>;

		/**@deprecated*/
		removeSingleChatRoomMember(
			this: Connection,
			params: {
				chatRoomId: string;
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
		 * @since v4.0.1
		 */
		removeChatRoomMember(
			this: Connection,
			params: {
				chatRoomId: string;
				username: string;
				success?: (res: AsyncResult<CommonRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult>>;

		/**@deprecated*/
		removeMultiChatRoomMember(
			this: Connection,
			params: {
				chatRoomId: string;
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
		 * @since v4.0.1
		 */
		removeChatRoomMembers(
			this: Connection,
			params: {
				chatRoomId: string;
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
				chatRoomId: string;
				users: string[];
				success?: (res: AsyncResult<AddUsersToChatRoomResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<AddUsersToChatRoomResult>>;

		/**
		 * Joins the chat room. After joining successfully, others will receive type: 'memberjoinchatroomsuccess' in the onPresence callback.
		 *
		 * ```typescript
		 * connection.joinChatRoom({roomId: 'roomId'})
		 * ```
		 */
		joinChatRoom(
			this: Connection,
			params: {
				roomId: string;
				message?: string;
				success?: (res: AsyncResult<CommonRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult>>;

		/**
		 * Exits chat room. And others will receive type: 'leaveChatRoom' in the onPresence callback.
		 *
		 * ```typescript
		 * connection.quitChatRoom({roomId: 'roomId'})
		 * ```
		 */
		quitChatRoom(
			this: Connection,
			params: {
				roomId: string;
				success?: (res: AsyncResult<{ result: boolean }>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<{ result: boolean }>>;

		/** @deprecated */
		listChatRoomMember(
			this: Connection,
			params: {
				pageNum: number;
				pageSize: number;
				chatRoomId: string;
				success?: (res: AsyncResult<{ member: string }[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<{ member: string }[]>>;

		/**
		 * The list of all the chat room members (paginated).
		 *
		 * ```typescript
		 * connection.listChatRoomMembers({pageNum: 1, pageSize: 20, chatRoomId: 'chatRoomId'})
		 * ```
		 * @since v4.0.1
		 */
		listChatRoomMembers(
			this: Connection,
			params: {
				pageNum: number;
				pageSize: number;
				chatRoomId: string;
				success?: (res: AsyncResult<{ member: string }[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<{ member: string }[]>>;

		/**
		 * Gets all admins in the chat room.
		 *
		 * ```typescript
		 * connection.getChatRoomAdmin({chatRoomId: 'chatRoomId'})
		 * ```
		 */
		getChatRoomAdmin(
			this: Connection,
			params: {
				chatRoomId: string;
				success?: (res: AsyncResult<GetChatRoomAdminResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GetChatRoomAdminResult>>;

		/**
		 * Sets up chat room admins. Only the chatroom owner can call this method. The members who are set as administrators will receive type: 'addadmin' in the onPresence callback.
		 *
		 * ```typescript
		 * connection.setChatRoomAdmin({chatRoomId: 'chatRoomId', username: 'user1'})
		 * ```
		 */
		setChatRoomAdmin(
			this: Connection,
			params: {
				chatRoomId: string;
				username: string;
				success?: (res: AsyncResult<SetChatRoomAdminResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<SetChatRoomAdminResult>>;

		/**
		 * Removes the chat room admins. Only the chatroom owner can call this method. The users whose administrator is removed will receive type: 'removeadmin' in the callback of onPresence.
		 *
		 * ```typescript
		 * connection.removeChatRoomAdmin({chatRoomId: 'chatRoomId', username: 'user1'})
		 * ```
		 */
		removeChatRoomAdmin(
			this: Connection,
			params: {
				chatRoomId: string;
				username: string;
				success?: (res: AsyncResult<RemoveChatRoomAdminResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<RemoveChatRoomAdminResult>>;

		/**
		 * Mutes chat room member. Only the chatroom owner can call this method. The members who are muted and others will receive type: 'addmute' in the onPresence callback.
		 *
		 * ```typescript
		 * connection.muteChatRoomMember({username: 'user1', muteDuration: -1, chatRoomId: 'chatRoomId'})
		 * ```
		 * @since 1.4.11
		 */
		muteChatRoomMember(
			this: Connection,
			params: {
				username: string;
				muteDuration: number;
				chatRoomId: string;
				success?: (res: AsyncResult<MuteChatRoomMemberResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<MuteChatRoomMemberResult>>;

		/** @deprecated */
		removeMuteChatRoomMember(
			this: Connection,
			params: {
				chatRoomId: string;
				username: string;
				success?: (
					res: AsyncResult<UnmuteChatRoomMemberResult[]>
				) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<UnmuteChatRoomMemberResult[]>>;

		/**
		 * Unmutes the chat room member. Only the chatroom owner can call this method. The members who are muted and others will receive type: 'removeMute' in the onPresence callback.
		 *
		 * ```typescript
		 * connection.unmuteChatRoomMember({chatRoomId: 'chatRoomId', username: 'user1'})
		 * `
		 * @since v4.0.1
		 */
		unmuteChatRoomMember(
			this: Connection,
			params: {
				chatRoomId: string;
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
		 * connection.getChatRoomMuteList({chatRoomId: 'chatRoomId'})
		 * ```
		 *
		 * @since v4.0.1
		 */
		getChatRoomMuteList(
			this: Connection,
			params: {
				chatRoomId: string;
				success?: (
					res: AsyncResult<GetChatRoomMuteListResult[]>
				) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GetChatRoomMuteListResult[]>>;

		/** @deprecated */
		chatRoomBlockSingle(
			this: Connection,
			params: {
				chatRoomId: string;
				username: string;
				success?: (res: AsyncResult<CommonRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult>>;

		/**
		 * Adds a single user to the chat room blocklist. Only the chatroom owner or admin can call this method.
		 *
		 * ```typescript
		 * connection.blockChatRoomMember({chatRoomId: 'chatRoomId', username: 'user1'})
		 * ```
		 *@since v4.0.1
		 */
		blockChatRoomMember(
			this: Connection,
			params: {
				chatRoomId: string;
				username: string;
				success?: (res: AsyncResult<CommonRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult>>;

		/** @deprecated */
		chatRoomBlockMulti(
			this: Connection,
			params: {
				chatRoomId: string;
				usernames: string[];
				success?: (res: AsyncResult<CommonRequestResult[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult[]>>;

		/**
		 * Adds users to the chat room blocklist. Only the chatroom owner or admin can call this method.
		 *
		 * ```typescript
		 * connection.blockChatRoomMembers({usernames: ['user1', 'user2'], chatRoomId: 'chatRoomId'})
		 * ```
		 *
		 * @since v4.0.1
		 */
		blockChatRoomMembers(
			this: Connection,
			params: {
				chatRoomId: string;
				usernames: string[];
				success?: (res: AsyncResult<CommonRequestResult[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult[]>>;

		/** @deprecated */
		removeChatRoomBlockSingle(
			this: Connection,
			params: {
				chatRoomId: string;
				username: string;
				success?: (res: AsyncResult<CommonRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult>>;

		/**
		 * Removes an individual user from the chat room blocklist. Only the chatroom owner or admin can call this method.
		 *
		 * ```typescript
		 * connection.unblockChatRoomMember({chatRoomId: 'chatRoomId', username: 'user1'})
		 * ```
		 * @since v4.0.1
		 */
		unblockChatRoomMember(
			this: Connection,
			params: {
				chatRoomId: string;
				username: string;
				success?: (res: AsyncResult<CommonRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult>>;

		/** @deprecated */
		removeChatRoomBlockMulti(
			this: Connection,
			params: {
				chatRoomId: string;
				usernames: string[];
				success?: (res: AsyncResult<CommonRequestResult[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult[]>>;

		/**
		 * Removes members from the chat room blocklist. Only the chatroom owner or admin can call this method.
		 *
		 * ```typescript
		 * connection.unblockChatRoomMembers({chatRoomId: 'chatRoomId', usernames: ['user1', 'user2']})
		 * ```
		 *
		 * @since v4.0.1
		 */
		unblockChatRoomMembers(
			this: Connection,
			params: {
				chatRoomId: string;
				usernames: string[];
				success?: (res: AsyncResult<CommonRequestResult[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult[]>>;

		/** @deprecated */
		getChatRoomBlacklistNew(
			this: Connection,
			params: {
				chatRoomId: string;
				success?: (res: AsyncResult<UserId[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<UserId[]>>;

		/**
		 * Gets the blocklist of the chat room.
		 *
		 * ```typescript
		 * connection.getChatRoomBlacklist({chatRoomId: 'chatRoomId'})
		 * ```
		 * @since v4.0.1
		 */
		getChatRoomBlacklist(
			this: Connection,
			params: {
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
				chatRoomId: string;
				success?: (
					res: AsyncResult<WhetherAbleSendChatRoomMsgResult>
				) => void;
				error?: (errror: ErrorEvent) => void;
			}
		): Promise<AsyncResult<WhetherAbleSendChatRoomMsgResult>>;

		/**
		 * Unmutes all the members in the chat room. Only the chatroom owner or admin can call this method.
		 *
		 * ```typescript
		 * connection.enableSendChatRoomMsg({chatRoomId: 'chatRoomId'})
		 * ```
		 */
		enableSendChatRoomMsg(
			this: Connection,
			params: {
				chatRoomId: string;
				success?: (
					res: AsyncResult<WhetherAbleSendChatRoomMsgResult>
				) => void;
				error?: (errror: ErrorEvent) => void;
			}
		): Promise<AsyncResult<WhetherAbleSendChatRoomMsgResult>>;

		/**
		 * Adds members to the allowlist of the chat room. Users added to the allow list of the chat room will receive in onPresence callback type: 'addUserToChatRoomWhiteList'.
		 *
		 * ```typescript
		 * connection.addUsersToGroupWhitelist({groupId: 'groupId'})
		 * ```
		 */
		addUsersToChatRoomWhitelist(
			this: Connection,
			params: {
				chatRoomId: string;
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
				chatRoomId: string;
				userName: string;
				success?: (res: AsyncResult<CommonRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult>>;

		/**
		 * Removes members from the allowlist in the chatroom. Only the chatroom owner or admin can call this method. The users who are removed will receive in onPresence callback type: 'rmUserFromChatRoomWhiteList'.
		 *
		 * ```typescript
		 * connection.removeChatRoomWhitelistMember({chatRoomId: 'chatRoomId', userName: 'user1'})
		 * `
		 * @since v4.0.1
		 */
		removeChatRoomWhitelistMember(
			this: Connection,
			params: {
				chatRoomId: string;
				userName: string;
				success?: (res: AsyncResult<CommonRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult>>;

		/**
		 * Gets the allowlist of the chat room. Only the chatroom owner or admin can call this method.
		 *
		 * ```typescript
		 * connection.getChatRoomWhitelist({chatRoomId: 'chatRoomId'})
		 * ```
		 */
		getChatRoomWhitelist(
			this: Connection,
			params: {
				chatRoomId: string;
				success: (res: AsyncResult<UserId[]>) => void;
				error: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<UserId[]>>;

		/**
		 * Queries whether chat room members are in the allowlist. Only the chatroom owner or admin can call this method. The chatroom members can query themselves.
		 *
		 * ```typescript
		 * connection.isChatRoomWhiteUser({chatRoomId: 'chatRoomId', userName: 'user1'})
		 * `
		 */
		isChatRoomWhiteUser(
			this: Connection,
			params: {
				chatRoomId: string;
				userName: string;
				success?: (res: AsyncResult<IsChatRoomWhiteUserResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<IsChatRoomWhiteUserResult>>;

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
				roomId: string;
				announcement: string;
				success: (
					res: AsyncResult<UpdateChatRoomAnnouncementResult>
				) => void;
				error: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<UpdateChatRoomAnnouncementResult>>;

		/**
		 * Uploads shared files to the chat room.
		 *
		 * ```typescript
		 * connection.uploadChatRoomSharedFile({roomId: 'roomId', file: 'file object', onFileUploadProgress: onFileUploadProgress, onFileUploadComplete: onFileUploadComplete,onFileUploadError:onFileUploadError,onFileUploadCanceled:onFileUploadCanceled})
		 * ```
		 * @return Void
		 */
		uploadChatRoomSharedFile(
			this: Connection,
			params: {
				roomId: string;
				file: object;
				onFileUploadProgress?: (data: any) => void;
				onFileUploadComplete?: (data: any) => void;
				onFileUploadError?: (data: any) => void;
				onFileUploadCanceled?: (data: any) => void;
			}
		): void;

		/**
		 * Deletes the chat room shared files.
		 *
		 * ```typescript
		 * connection.deleteChatRoomSharedFile({roomId: 'roomId', fileId: 'fileId'})
		 *
		 */
		deleteChatRoomSharedFile(
			this: Connection,
			params: {
				roomId: string;
				fileId: string;
				success?: (
					res: AsyncResult<DeleteChatRoomSharedFileResult>
				) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<DeleteChatRoomSharedFileResult>>;

		/**
		 * Gets a list of shared files in the chat room.
		 *
		 * ```typescript
		 * connection.fetchChatRoomSharedFileList({roomId: 'roomId'})
		 * ```
		 */
		fetchChatRoomSharedFileList(
			this: Connection,
			params: {
				roomId: string;
				success?: (
					res: AsyncResult<FetchChatRoomSharedFileListResult[]>
				) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<FetchChatRoomSharedFileListResult[]>>;

		// Group API
		/**  @deprecated */
		createGroupNew(
			this: Connection,
			params: {
				data: {
					groupname: string;
					desc: string;
					members: UserId[];
					public: boolean;
					approval: boolean;
					allowinvites: boolean;
					inviteNeedConfirm: boolean;
					maxusers: number;
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
        * @since v4.0.1
        */
		createGroup(
			this: Connection,
			params: {
				data: {
					groupname: string;
					desc: string;
					members: UserId[];
					public: boolean;
					approval: boolean;
					allowinvites: boolean;
					inviteNeedConfirm: boolean;
					maxusers: number;
				};
				success?: (res: AsyncResult<CreateGroupResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CreateGroupResult>>;

		/**  @deprecated */
		blockGroup(
			this: Connection,
			params: {
				groupId: string;
				success?: (res: AsyncResult<BlockGroupResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<BlockGroupResult>>;

		/**
		 * Block group messages， Only valid for mobile terminal
		 * ```typescript
		 * connection.blockGroupMessages({groupId: 'groupId'})
		 * ```
		 * @since v4.0.1
		 */
		blockGroupMessages(
			this: Connection,
			params: {
				groupId: string;
				success?: (res: AsyncResult<BlockGroupResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<BlockGroupResult>>;

		/**
		 * Gets public groups (paginated).
		 *
		 * ```typescript
		 * connection.listGroups({limit: 20, cursor: null})
		 * ```
		 * @since 1.4.11
		 */
		listGroups(
			this: Connection,
			params: {
				limit: number;
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
		 * @since 1.4.11
		 * @deprecated
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
		 * ```typescript
		 * connection.getJoinedGroups()
		 * ```
		 */
		getJoinedGroups(
			this: Connection,
			params: {
				pageNum: number;
				pageSize: number;
				success?: (res: AsyncResult<BaseGroupInfo[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<BaseGroupInfo[]>>;

		/**  @deprecated */
		changeOwner(
			this: Connection,
			params: {
				groupId: string;
				newOwner: UserId;
				success?: (res: AsyncResult<ChangeGroupOwnerResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<ChangeGroupOwnerResult>>;

		/**
		 * Transfers group. Requires owner permission. Group members will receive type: 'changeowner' in the onpresence callback
		 *
		 * ```typescript
		 * connection.changeGroupOwner({groupId: 'groupId', newOwner: 'user1'})
		 * ```
		 * @since v4.0.1
		 */
		changeGroupOwner(
			this: Connection,
			params: {
				groupId: string;
				newOwner: UserId;
				success?: (res: AsyncResult<ChangeGroupOwnerResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<ChangeGroupOwnerResult>>;

		/**
		 * Gets group details
		 * ```typescript
		 * connection.getGroupInfo({groupId: groupId})
		 * ```
		 * @since 1.4.11
		 */
		getGroupInfo(
			this: Connection,
			params: {
				groupId: string | string[];
				success?: (res: AsyncResult<GroupDetailInfo[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GroupDetailInfo[]>>;

		/**
		 * Modifys group information, Administrator right is required.
		 *
		 * ```typescript
		 * connection.modifyGroup({groupId: 'groupId', groupName: 'groupName', description:'description'})
		 * ```
		 */
		modifyGroup(
			this: Connection,
			params: {
				groupId: string;
				groupName: string;
				description: string;
				success?: (res: AsyncResult<ModifyGroupResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<ModifyGroupResult>>;

		/**  @deprecated */
		listGroupMember(
			this: Connection,
			params: {
				groupId: string;
				pageNum: number;
				pageSize: number;
				success?: (res: AsyncResult<GroupMember[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GroupMember[]>>;

		/**
		 * Lists all members of the group (paginated).
		 *
		 * ```typescript
		 * connection.listGroupMembers({pageNum: 1, pageSize: 20, groupId: 'groupId'})
		 * ```
		 * @since v4.0.1
		 */
		listGroupMembers(
			this: Connection,
			params: {
				groupId: string;
				pageNum: number;
				pageSize: number;
				success?: (res: AsyncResult<GroupMember[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GroupMember[]>>;

		/**
		 * Gets all administrators in the group.
		 * ```typescript
		 * connection.getGroupAdmin({groupId: 'groupId'})
		 * ```
		 * @since 1.4.11
		 */
		getGroupAdmin(
			this: Connection,
			params: {
				groupId: string;
				success?: (res: AsyncResult<UserId[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<UserId[]>>;

		/**  @deprecated */
		setAdmin(
			this: Connection,
			params: {
				groupId: string;
				username: UserId;
				success?: (res: AsyncResult<SetGroupAdminResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<SetGroupAdminResult>>;

		/**
		 * Sets up group administrator, need group owner authority. Users who are set as administrators will receive type: 'addadmin' in the onPresence callback.
		 *
		 * ```typescript
		 * connection.setGroupAdmin({groupId: 'groupId', username: 'user1'})
		 * ```
		 * @since v4.0.1
		 */
		setGroupAdmin(
			this: Connection,
			params: {
				groupId: string;
				username: UserId;
				success?: (res: AsyncResult<SetGroupAdminResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<SetGroupAdminResult>>;

		/**
		 * Removes the group administrator, need the permission of the group master. The user whose administrator is canceled will receive type: 'removeadmin' in the callback of onPresence.
		 *
		 * ```typescript
		 * connection.removeAdmin({gorupId: 'gorupId', username: 'user1'})
		 * ```
		 */
		removeAdmin(
			this: Connection,
			params: {
				groupId: string;
				username: string;
				success?: (res: AsyncResult<RemoveGroupAdminResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<RemoveGroupAdminResult>>;

		/**  @deprecated */
		dissolveGroup(
			this: Connection,
			params: {
				groupId: string;
				success?: (res: AsyncResult<DestroyGroupResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<DestroyGroupResult>>;

		/**
		 * Destroys a group, need the permission of the group owner. Group members will receive type: 'deletegroupchat' in the callback of onPrenscence.
		 *
		 * ```typescript
		 * connection.destroyGroup({groupId: 'groupId'})
		 * ```
		 * @since v4.0.1
		 */
		destroyGroup(
			this: Connection,
			params: {
				groupId: string;
				success?: (res: AsyncResult<DestroyGroupResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<DestroyGroupResult>>;

		/**
		 * Leaves the group, group members will receive type: 'leavegroup' in the callback of onPresence.
		 *
		 * ```typescript
		 * connection.quitGroup({groupId: 'groupId'})
		 * ```
		 */
		quitGroup(
			this: Connection,
			params: {
				groupId: string;
				success?: (res: AsyncResult<{ result: true }>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<{ result: true }>>;

		/**  @deprecated */
		inviteToGroup(
			this: Connection,
			params: {
				groupId: string;
				users: UserId[];
				success?: (
					res: AsyncResult<InviteUsersToGroupResult[]>
				) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<InviteUsersToGroupResult[]>>;

		/**
		 * Invites users into group. The invited user will receive type: 'invite' in the callback of onPresence.
		 *
		 * ```typescript
		 * connection.inviteUsersToGroup({groupId: 'groupId', users: ['user1', 'user2']})
		 * ```
		 * @since v4.0.1
		 */
		inviteUsersToGroup(
			this: Connection,
			params: {
				groupId: string;
				users: UserId[];
				success?: (
					res: AsyncResult<InviteUsersToGroupResult[]>
				) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<InviteUsersToGroupResult[]>>;

		/**
		 * Applys to join the group. The group owner and administrator will receive type: 'joingroupnotifications' in the onPresence callback
		 *
		 * ```typescript
		 * connection.joinGroup({groupId: 'groupId', message: 'I want to join the group'})
		 * ```
		 * @since 1.4.11
		 */
		joinGroup(
			this: Connection,
			params: {
				groupId: string;
				message: string;
				success?: (res: AsyncResult<CommonRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult>>;

		/**  @deprecated */
		agreeJoinGroup(
			this: Connection,
			params: {
				applicant: UserId;
				groupId: string;
				success?: (res: AsyncResult<CommonRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult>>;

		/**
		 * Allows user to join the group. Group owner or administrator permissions are required. Users who join the group will receive type: 'joinpublicgroupsuccess' in the callback of onPresence.
		 *
		 * ```typescript
		 * connection.acceptGroupJoinRequest({applicant: 'user1', groupId: 'groupId'})
		 * ```
		 * @since v4.0.1
		 */
		acceptGroupJoinRequest(
			this: Connection,
			params: {
				applicant: UserId;
				groupId: string;
				success?: (res: AsyncResult<CommonRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult>>;

		/**  @deprecated */
		rejectJoinGroup(
			this: Connection,
			params: {
				applicant: UserId;
				groupId: string;
				reason: string;
				success?: (res: AsyncResult<CommonRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult>>;

		/**
		 * Refuses user to join the group. Group owner or administrator permissions are required.
		 *
		 * ```typescript
		 * connection.rejectGroupJoinRequest({applicant: 'user1', groupId: 'groupId', reason: 'I do not like you'})
		 * ```
		 * @since v4.0.1
		 */
		rejectGroupJoinRequest(
			this: Connection,
			params: {
				applicant: UserId;
				groupId: string;
				reason: string;
				success?: (res: AsyncResult<CommonRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult>>;

		/**  @deprecated */
		agreeInviteIntoGroup(
			this: Connection,
			params: {
				invitee: UserId;
				groupId: string;
				success?: (res: AsyncResult<CommonRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult>>;

		/**
		 * Accepts the group invitation. If others invite you to join the group, you can call this API and agree. The inviter will receive type: 'invite_accept' in the callback of onPresence, After joining successfully, group members will receive type: 'memberjoinpublicgroupsuccess' in the callback of onPresence.
		 *
		 * ```typescript
		 * connection.acceptGroupInvite({invitee: 'myUserId', groupId: 'groupId'})
		 * ```
		 * @since v4.0.1
		 */
		acceptGroupInvite(
			this: Connection,
			params: {
				invitee: UserId;
				groupId: string;
				success?: (res: AsyncResult<CommonRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<CommonRequestResult>>;

		/**  @deprecated */
		rejectInviteIntoGroup(
			this: Connection,
			params: {
				invitee: UserId;
				groupId: string;
				success?: (res: AsyncResult<CommonRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<any>;

		/**
		 * Rejects group invitation. Other user invite you to join the group, you can call this API to refuse.
		 *
		 * ```typescript
		 * connection.rejectGroupInvite({invitee: 'myUserId', groupId: 'groupId'})
		 * ```
		 * @since v4.0.1
		 */
		rejectGroupInvite(
			this: Connection,
			params: {
				invitee: UserId;
				groupId: string;
				success?: (res: AsyncResult<CommonRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<any>;

		/**  @deprecated */
		removeSingleGroupMember(
			this: Connection,
			params: {
				groupId: string;
				username: UserId;
				success?: (res: AsyncResult<RemoveGroupMemberResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<RemoveGroupMemberResult>>;

		/**
		 * Removes a group member. Group owner or administrator permission is required. The removed user will receive type: 'removedfromgroup' in the callback of onPresence, and other group members will receive type: 'leavegroup' in the callback of onPresence.
		 *
		 * ```typescript
		 * connection.removeGroupMember({groupId: 'groupId', username: 'user1'})
		 * ```
		 * @since v4.0.1
		 */
		removeGroupMember(
			this: Connection,
			params: {
				groupId: string;
				username: UserId;
				success?: (res: AsyncResult<RemoveGroupMemberResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<RemoveGroupMemberResult>>;

		/**  @deprecated */
		removeMultiGroupMember(
			this: Connection,
			params: {
				groupId: string;
				users: UserId[];
				success?: (res: AsyncResult<RemoveGroupMemberResult[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<RemoveGroupMemberResult[]>>;

		/**
		 * Removes group members. Group owner or administrator permission is required. The removed users will receive type: 'removedfromgroup' in the callback of onPresence, and other group members will receive type: 'leavegroup' in the callback of onPresence.
		 *
		 * ```typescript
		 * connection.removeGroupMembers({groupId: 'groupId', users: ['user1', 'user2']})
		 * ```
		 * @since v4.0.1
		 */
		removeGroupMembers(
			this: Connection,
			params: {
				groupId: string;
				users: UserId[];
				success?: (res: AsyncResult<RemoveGroupMemberResult[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<RemoveGroupMemberResult[]>>;

		/**  @deprecated */
		mute(
			this: Connection,
			params: {
				username: UserId;
				muteDuration: number;
				groupId: string;
				success?: (res: AsyncResult<MuteGroupMemberResult[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<MuteGroupMemberResult[]>>;

		/**
		 * Mutes a group member. Group owner or administrator permission is required. Forbidden user and other users will receive type: 'addmute' in the onPresence callback.
		 *
		 * ```typescript
		 * connection.muteGroupMember({username: 'user1', muteDuration: -1, groupId: 'groupId'})
		 * ```
		 * @since v4.0.1
		 */
		muteGroupMember(
			this: Connection,
			params: {
				username: UserId;
				muteDuration: number;
				groupId: string;
				success?: (res: AsyncResult<MuteGroupMemberResult[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<MuteGroupMemberResult[]>>;

		/**  @deprecated */
		removeMute(
			this: Connection,
			params: {
				groupId: string;
				username: UserId;
				success?: (res: AsyncResult<UnmuteGroupMemberResult[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<UnmuteGroupMemberResult[]>>;

		/**
		 * Unmutes group member. Group owner or administrator permissions are required. Users who have been released and other users will receive type: 'removemute' in the callback of onPresence.
		 *
		 * ```typescript
		 * connection.unmuteGroupMember({groupId: 'groupId', username: 'user1'})
		 * ```
		 * @since v4.0.1
		 */
		unmuteGroupMember(
			this: Connection,
			params: {
				groupId: string;
				username: UserId;
				success?: (res: AsyncResult<UnmuteGroupMemberResult[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<UnmuteGroupMemberResult[]>>;

		/**  @deprecated */
		getMuted(
			this: Connection,
			params: {
				groupId: string;
				success?: (res: AsyncResult<GetGroupMuteListResult[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GetGroupMuteListResult[]>>;

		/**
		 * Gets the group mute list.
		 *
		 * ```typescript
		 * connection.getGroupMuteList({groupId: 'groupId'})
		 * ```
		 * @since v4.0.1
		 */
		getGroupMuteList(
			this: Connection,
			params: {
				groupId: string;
				success?: (res: AsyncResult<GetGroupMuteListResult[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GetGroupMuteListResult[]>>;

		/**  @deprecated */
		groupBlockSingle(
			this: Connection,
			params: {
				groupId: string;
				username: UserId;
				success?: (res: AsyncResult<GroupRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GroupRequestResult>>;

		/**
		 * Adds a member to the group blacklist. Group owner or administrator permission is required, The user added to the blacklist will receive type: 'removedFromGroup' in the onPresence callback.
		 *
		 * ```typescript
		 * connection.blockGroupMember({groupId: 'groupId', username: 'user1'})
		 * ```
		 * @since v4.0.1
		 */
		blockGroupMember(
			this: Connection,
			params: {
				groupId: string;
				username: UserId;
				success?: (res: AsyncResult<GroupRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GroupRequestResult>>;

		/**  @deprecated */
		groupBlockMulti(
			this: Connection,
			params: {
				groupId: string;
				usernames: UserId[];
				success?: (res: AsyncResult<GroupRequestResult[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GroupRequestResult[]>>;

		/**
		 * Adds group members to the group blacklist. Administrator rights required，Users added to the blacklist will receive type: 'removedFromGroup' in the onPresence callback.
		 *
		 * ```typescript
		 * connection.blockGroupMembers({usernames: ['user1', 'user2'], groupId: 'groupId'})
		 * ```
		 * @since v4.0.1
		 */
		blockGroupMembers(
			this: Connection,
			params: {
				groupId: string;
				usernames: UserId[];
				success?: (res: AsyncResult<GroupRequestResult[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GroupRequestResult[]>>;

		/**  @deprecated */
		removeGroupBlockSingle(
			this: Connection,
			params: {
				groupId: string;
				username: string;
				success?: (res: AsyncResult<GroupRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GroupRequestResult>>;

		/**
		 * Unblock a group member. Administrator rights required, Users who have been removed from the blacklist will receive type: 'allow' in the onPresence callback.
		 *
		 * ```typescript
		 * connection.unblockGroupMember({groupId: 'groupId'})
		 * ```
		 * @since v4.0.1
		 */
		unblockGroupMember(
			this: Connection,
			params: {
				groupId: string;
				username: string;
				success?: (res: AsyncResult<GroupRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GroupRequestResult>>;

		/**  @deprecated */
		removeGroupBlockMulti(
			this: Connection,
			params: {
				groupId: string;
				usernames: UserId[];
				success?: (res: AsyncResult<GroupRequestResult[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GroupRequestResult[]>>;

		/**
		 * Unblock the group members. Group owner or administrator permissions are required, Users who have been removed from the blacklist will receive type: 'allow' in the onPresence callback.
		 *
		 * ```typescript
		 * connection.unblockGroupMembers({groupId: 'groupId', usernames: ['user1', 'user2']})
		 * ```
		 * @since v4.0.1
		 */
		unblockGroupMembers(
			this: Connection,
			params: {
				groupId: string;
				usernames: UserId[];
				success?: (res: AsyncResult<GroupRequestResult[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GroupRequestResult[]>>;

		/**  @deprecated */
		getGroupBlacklistNew(
			this: Connection,
			params: {
				groupId: string;
				success?: (res: AsyncResult<UserId[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<UserId[]>>;

		/**
		 * Gets group blacklist.
		 *
		 * ```typescript
		 * connection.getGroupBlacklist({groupId: 'groupId'})
		 * ```
		 * @since v4.0.1
		 */
		getGroupBlacklist(
			this: Connection,
			params: {
				groupId: string;
				success?: (res: AsyncResult<UserId[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<UserId[]>>;

		/**
		 * Mutes all members. All group members are prohibited from speaking. Operation permissions: group admin or above identity, Group members will receive type: 'muteGroup' in the onPresence callback.
		 *
		 * ```typescript
		 *  connection.disableSendGroupMsg({groupId: 'groupId'})
		 * ```
		 */
		disableSendGroupMsg(
			this: Connection,
			params: {
				groupId: string;
				success?: (res: AsyncResult<{ mute: true }>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<{ mute: true }>>;

		/**
		 * Unmutes all members. Operation permissions: group admin or above identity, Group members will receive type: 'rmgroupmute' in the callback of onpresence.
		 *
		 * ```typescript
		 * connection.enableSendGroupMsg({groupId: 'groupId'})
		 * ```
		 */
		enableSendGroupMsg(
			this: Connection,
			params: {
				groupId: string;
				success?: (res: AsyncResult<{ mute: false }>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<{ mute: false }>>;

		/**
		 * Adds members to the group whitelist. Members of the white list can continue to speak after the group bans.  Operation authority: Group admin or above, Users added to the whitelist will receive type: 'addusertogroupwhitelist' in the callback of onPresence.
		 *
		 * ```typescript
		 * connection.addUsersToGroupWhitelist({groupId: 'groupId'})
		 * ```
		 */
		addUsersToGroupWhitelist(
			this: Connection,
			params: {
				groupId: string;
				users: UserId[];
				success?: (res: AsyncResult<GroupRequestResult[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GroupRequestResult[]>>;

		/**  @deprecated */
		rmUsersFromGroupWhitelist(
			this: Connection,
			params: {
				groupId: string;
				userName: UserId;
				success?: (res: AsyncResult<GroupRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GroupRequestResult>>;

		/**
		 * Remove the group whitelist member.  Operation permissions: group admin or above identity, The user whose whitelist is removed will receive type:'rmUserFromGroupWhiteList' in the onPresence callback.
		 *
		 * ```typescript
		 * connection.removeGroupWhitelistMember({groupId: 'groupId', userName: 'user1'})
		 * ```
		 *
		 * @since v4.0.1
		 */
		removeGroupWhitelistMember(
			this: Connection,
			params: {
				groupId: string;
				userName: UserId;
				success?: (res: AsyncResult<GroupRequestResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GroupRequestResult>>;

		/**
		 * Gets group white list. Operation authority: admin or above.
		 *
		 * ```typescript
		 * connection.getGroupWhitelist({groupId: 'groupId'})
		 * ```
		 */
		getGroupWhitelist(
			this: Connection,
			params: {
				groupId: string;
				success?: (res: AsyncResult<UserId[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<UserId[]>>;

		/**  @deprecated */
		isGroupWhiteUser(
			this: Connection,
			params: {
				groupId: string;
				userName: UserId;
				success?: (res: AsyncResult<IsInGroupWhiteListResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<IsInGroupWhiteListResult>>;

		/**
		 * Queries whether the group member is in white list. Operation permission: app admin can query all users; App users can query themselves.
		 *
		 * ```typescript
		 * connection.isInGroupWhiteList({groupId: 'groupId', userName: 'user1'})
		 * ```
		 * @since v4.0.1
		 */
		isInGroupWhiteList(
			this: Connection,
			params: {
				groupId: string;
				userName: UserId;
				success?: (res: AsyncResult<IsInGroupWhiteListResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<IsInGroupWhiteListResult>>;

		/**
		 * Queries which users have read group message [Value-added function] needs to be opened separately.
		 *
		 * ```typescript
		 * connection.getGroupMsgReadUser({groupId: 'groupId', msgId: 'msgId'})
		 * ```
		 */
		getGroupMsgReadUser(
			this: Connection,
			params: {
				groupId: string;
				msgId: string;
				success?: (res: AsyncResult<GetGroupMsgReadUserResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<GetGroupMsgReadUserResult>>;

		/**
		 * Gets group announcement
		 *
		 * ```typescript
		 * connection.fetchGroupAnnouncement({groupId: 'groupId'})
		 * ```
		 */
		fetchGroupAnnouncement(
			this: Connection,
			params: {
				groupId: string;
				success?: (res: AsyncResult<{ announcement: string }>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<{ announcement: string }>>;

		/**
		 * Updates group announcement.
		 *
		 * ```typescript
		 * connection.updateGroupAnnouncement({groupId: 'groupId', announcement: 'hello'})
		 * ```
		 */
		updateGroupAnnouncement(
			this: Connection,
			params: {
				groupId: string;
				announcement: string;
				success?: (
					res: AsyncResult<UpdateGroupAnnouncementResult>
				) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<UpdateGroupAnnouncementResult>>;

		/**
		 * Uploads group shared file.
		 *
		 * ```typescript
		 * connection.uploadGroupSharedFile({groupId: 'groupId', file: 'file object', onFileUploadProgress: onFileUploadProgress, onFileUploadComplete: onFileUploadComplete,onFileUploadError:onFileUploadError,onFileUploadCanceled:onFileUploadCanceled})
		 * ```
		 */
		uploadGroupSharedFile(
			this: Connection,
			params: {
				groupId: string;
				file: object;
				onFileUploadProgress?: (data: ProgressEvent) => void;
				onFileUploadComplete?: (data: any) => void;
				onFileUploadError?: (data: any) => void;
				onFileUploadCanceled?: (data: any) => void;
			}
		): void;

		/**
		 * Deletes group shared file
		 *
		 * ```typescript
		 * connection.deleteGroupSharedFile({groupId: 'groupId', fileId: 'fileId'})
		 * ```
		 */
		deleteGroupSharedFile(
			this: Connection,
			params: {
				groupId: string;
				fileId: string;
				success?: (
					res: AsyncResult<DeleteGroupSharedFileResult>
				) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<DeleteGroupSharedFileResult>>;

		/**
		 * Gets a list of group shared files.
		 *
		 * ```typescript
		 * connection.fetchGroupSharedFileList({groupId: 'groupId'})
		 * ```
		 */
		fetchGroupSharedFileList(
			this: Connection,
			params: {
				groupId: string;
				pageNum?: number;
				pageSize?: number;
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
				groupId: string;
				fileId: string;
				secret?: string;
				onFileDownloadComplete?: (data: Blob) => void;
				onFileDownloadError?: (err: ErrorEvent) => void;
			}
		): void;

		// Contact API
		/**
		 * Gets friends blacklist.
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

		/** @deprecated */
		getRoster(
			this: Connection,
			params?: {
				success?: (res: RosterData[]) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<UserId[]>>;

		/**
		 * Gets contacts.
		 *
		 * ```typescript
		 * connection.getContacts()
		 * ```
		 * @since v4.0.1
		 */
		getContacts(
			this: Connection,
			params?: {
				success?: (res: RosterData[]) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<UserId[]>>;

		/** @deprecated */
		uploadToken(
			this: Connection,
			params: {
				deviceId: string;
				deviceToken: string;
				notifierName: string;
				success?: (res: AsyncResult<UploadTokenResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<UploadTokenResult>>;

		/**
		 * If you use the SDK on a native client and integrate third-party push functionality, you can call this method to upload the Token to the server.
		 *
		 * ```typescript
		 * connection.uploadPushToken({deviceId: 'deviceId', deviceToken: 'deviceToken', notifierName: 'notifierName'})
		 * ```
		 * @since v4.0.1
		 */
		uploadPushToken(
			this: Connection,
			params: {
				deviceId: string;
				deviceToken: string;
				notifierName: string;
				success?: (res: AsyncResult<UploadTokenResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<UploadTokenResult>>;

		/**
		 * Gets the session list.
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
		): Promise<AsyncResult<SessionInfo[]>>;

		/**
		 * Gets the conversation list and the latest message under the conversation.
		 *
		 * ```typescript
		 * connection.getConversationList()
		 * ```
		 */
		getConversationList(
			this: Connection,
			params?: {
				success?: (res: AsyncResult<SessionInfo[]>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<conversationList[]>>;

		/**
		 * Delete the session.
		 *
		 * ```typescript
		 * connection.deleteSession()
		 * ```
		 */
		deleteSession(
			this: Connection,
			params: {
				channel: string;
				chatType: 'singleChat' | 'groupChat';
				deleteRoam: boolean;
				success?: (res: AsyncResult<DeleteSessionResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<DeleteSessionResult>>;

		/**
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
			value?: any
		): Promise<AsyncResult<UpdateOwnUserInfoParams>>;

		/**
		 * Queres user information.
		 *
		 * ```typescript
		 * connection.fetchUserInfoById('user1') | fetchUserInfoById(['user1', 'user2'])
		 * ```
		 */
		fetchUserInfoById(
			this: Connection,
			userId: UserId | UserId[],
			properties: ConfigurableKey[] | ConfigurableKey
		): Promise<AsyncResult<UpdateOwnUserInfoParams>>;

		/**
		 * When registering, you can set a nickname, which is used to display when pushing messages. You can call the following API to modify the nickname.
		 *
		 * ```typescript
		 * connection.updateCurrentUserNick('Tom')
		 * ```
		 */
		updateCurrentUserNick(
			this: Connection,
			nick: string
		): Promise<AsyncResult<BaseUserInfo[]>>;

		/**
		 * Gets historical messages.
		 *
		 * ```typescript
		 * connection.fetchHistoryMessages({queue:'user1', count: 20})
		 * ```
		 */
		fetchHistoryMessages(
			this: Connection,
			options: {
				queue: string;
				start?: number | null;
				count?: number;
				isGroup?: boolean;
				format?: boolean;
				success?: (res: MessageBody[]) => void;
				fail?: (error: ErrorEvent) => void;
			}
		): Promise<MessageBody[]>;

		/**
		 * Gets the message history.
		 *
		 * ```typescript
		 * connection.getHistoryMessages({targetId:'user1',chatType:'groupChat', pageSize: 20})
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
				/** The chat type for SDK V4.0:
				 * - `singleChat`: one-to-one chat;
				 * - `groupchat`: group chat;
				 * - `chatroom`: chat room.
				 * - (Default)`singleChat`: No.
				 */
				chatType?: 'singleChat' | 'groupChat' | 'chatRoom';
				/** Whether to select pull history messages in positive order(Pull message from the oldest to the latest).
				 * - `up`: means searching from the newer messages to the older messages.
				 * - `down`: means searching from the older messages to the newer messages.
				 * - (Default)`up`.
				 */
				searchDirection?: string;
				success?: (res: MessageBody[]) => void;
				fail?: (error: ErrorEvent) => void;
			}
		): Promise<HistoryMessages>;

		/**
		 * Adds Contact.
		 *
		 * ```typescript
		 * connection.addContact('user1', 'I am Bob')
		 * ```
		 */
		addContact(this: Connection, to: string, message?: string): void;

		/**
		 * Deletes contact.
		 *
		 * ```typescript
		 * connection.deleteContact('user1')
		 * ```
		 */
		deleteContact(this: Connection, to: string): void;

		/** @deprecated  */
		acceptInvitation(this: Connection, to: string): void;

		/**
		 * Accepting contact request
		 *
		 * ```typescript
		 * connection.acceptContactInvite('user1')
		 * ```
		 * @since v4.0.1
		 */
		acceptContactInvite(this: Connection, to: string): void;

		/** @deprecated  */
		declineInvitation(this: Connection, to: string): void;

		/**
		 * Declines contact invite.
		 *
		 * ```typescript
		 * connection.declineContactInvite('user1')
		 * ```
		 * @since v4.0.1
		 */
		declineContactInvite(this: Connection, to: string): void;

		/** @deprecated */
		addToBlackList(
			this: Connection,
			options: {
				name: UserId | UserId[];
			}
		): void;

		/**
		 * Add contacts to your blacklist.
		 *
		 * ```typescript
		 * connection.addUsersToBlacklist({name: 'user1'})
		 * ```
		 * @since v4.0.1
		 */
		addUsersToBlacklist(
			this: Connection,
			options: {
				name: UserId | UserId[];
			}
		): void;

		/** @deprecated */
		removeFromBlackList(
			this: Connection,
			options: {
				name: UserId | UserId[];
			}
		): void;

		/**
		 * Removes friends from your blacklist
		 *
		 * ```typescript
		 * connection.removeUserFromBlackList({name: 'user1'})
		 * ```
		 * @since v4.0.1
		 */
		removeUserFromBlackList(
			this: Connection,
			options: {
				name: UserId | UserId[];
			}
		): void;

		/** @deprecated*/
		subscribe(
			this: Connection,
			options: { to: UserId; message?: string }
		): void;
		/** @deprecated*/
		subscribed(this: Connection, options: { to: UserId }): void;
		/** @deprecated*/
		unsubscribed(this: Connection, options: { to: UserId }): void;
		/** @deprecated*/
		removeRoster(this: Connection, options: { to: UserId }): void;

		/**
		 * Recall a message
		 *
		 * ```typescript
		 * connection.recallMessage({mid: 'messageId', to: 'user1', type: 'singleChat', isChatThread: false})
		 * ```
		 */
		recallMessage(
			this: Connection,
			option: {
				mid: string;
				to: UserId;
				type?: 'chat' | 'groupchat' | 'chatroom'; // v3.0
				chatType?: 'singleChat' | 'groupChat' | 'chatRoom'; // v4.0
				isChatThread?: boolean;
				success?: (res: number) => void;
				fail?: (error: ErrorEvent) => void;
			}
		): Promise<SendMsgResult>;

		// listen @since 3.0
		listen(this: Connection, parameters: ListenParameters): void;

		// eventHandler @since 4.0
		addEventHandler(id: string, handler: EventHandlerType): void;
		removeEventHandler(id: string): void;

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
			success?: (res: AsyncResult<PublishPresenceResult>) => void;
			error?: (error: ErrorEvent) => void;
		}): Promise<AsyncResult<PublishPresenceResult>>;

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
			success?: (res: AsyncResult<PublishPresenceResult>) => void;
			error?: (error: ErrorEvent) => void;
		}): Promise<AsyncResult<PublishPresenceResult>>;

		/**
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
		 * Reports a message.
		 *
		 * ```typescript
		 * reportMessage({reportType: 'adult', reportReason: 'reason', messageId: 'id'})
		 * ```
		 */
		reportMessage(
			this: Connection,
			params: {
				reportType: string;
				reportReason: string;
				messageId: string;
			}
		): Promise<void>;

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
		 *  Gets the reaction list for the message.
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
	}

	/**
	 *
	 * @module eventHandler
	 */
	type DispatchParameters =
		| MessageBody
		| OnPresenceMsg
		| RosterData
		| ErrorEvent
		| MuteMsgBody
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
		/** 操作类型。 */
		operation: string;
		/** The ID of a group or chatroom. */
		/** 群组或者聊天室 ID。 */
		id: string;
		/** Message sender. */
		/** 消息发送者。 */
		from: string;
		/** Message receiver. */
		/** 消息接收者。 */
		to: string;
		/** Additional data for the operation event. */
		/** 操作事件的其他数据。 */
		data?: any;
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
		| 'onMutedMessage'
		| 'onChannelMessage'
		| 'onError'
		| 'onOffline'
		| 'onOnline'
		| 'onRoster'
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
		| 'onChatThreadChange'
		| 'onMultiDeviceEvent'
		| 'onGroupEvent'
		| 'onChatroomEvent';

	interface EventHandlerType {
		onOpened?: (msg: any) => void;
		onPresence?: (msg: OnPresenceMsg) => void;
		onTextMessage?: (msg: TextMsgBody) => void;
		onImageMessage?: (msg: ImgMsgBody) => void;
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
		onMutedMessage?: (msg: MuteMsgBody) => void;
		onChannelMessage?: (msg: ChannelMsgBody) => void;
		onError?: (error: ErrorEvent) => void;
		onOffline?: (msg: any) => void;
		onOnline?: (msg: any) => void;
		onRoster?: (rosters: RosterData[]) => void;
		onStatisticMessage?: (msg: any) => void;
		onContactAgreed?: (msg: ContactMsgBody) => void;
		onContactRefuse?: (msg: ContactMsgBody) => void;
		onContactDeleted?: (msg: ContactMsgBody) => void;
		onContactAdded?: (msg: ContactMsgBody) => void;
		onTokenWillExpire?: (msg: any) => void;
		onTokenExpired?: (msg: any) => void;
		onContactInvited?: (msg: any) => void;
		onConnected?: () => void;
		onDisconnected?: () => void;
		onGroupChange?: (msg: any) => void;
		onChatroomChange?: (msg: any) => void;
		onContactChange?: (msg: any) => void;
		onPresenceStatusChange?: (msg: PresenceType[]) => void;
		onChatThreadChange?: (msg: ThreadChangeInfo) => void;
		onMultiDeviceEvent?: (msg: ThreadMultiDeviceInfo) => void;
		onReactionChange?: (msg: ReactionMessage) => void;
		onGroupEvent?: (eventData: EventData) => void;
		onChatroomEvent?: (eventData: EventData) => void;
	}

	interface HandlerData {
		[key: string]: EventHandlerType;
	}

	class EventHandler {
		handlerData: HandlerData;
		constructor(
			Connection: any,
			eventHandlerId: string,
			eventHandler: EventHandlerType
		);
		addEventHandler(
			eventHandlerId: string,
			eventHandler: EventHandlerType
		): void;
		removeEventHandler(eventHandlerId: string): void;
		dispatch(
			this: EventHandler,
			event: Event,
			parameters?: DispatchParameters
		): void;
	}

	/**
	 * @module listen
	 * @deprecated v4.0.1
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
		onMutedMessage?: (msg: MuteMsgBody) => void;
		onChannelMessage?: (msg: ChannelMsgBody) => void;
		onError?: (error: ErrorEvent) => void;
		onOffline?: () => void;
		onOnline?: () => void;
		onRoster?: (rosters: RosterData[]) => void;
		onStatisticMessage?: () => void;
		onCreateGroup?: () => void;
		onBlacklistUpdate?: () => void;
		onContactAgreed?: (msg: ContactMsgBody) => void;
		onContactRefuse?: (msg: ContactMsgBody) => void;
		onContactDeleted?: (msg: ContactMsgBody) => void;
		onContactAdded?: (msg: ContactMsgBody) => void;
		onTokenWillExpire?: () => void;
		onTokenExpired?: () => void;
		onClosed?: () => void;
		onPresenceStatusChange?: (msg: PresenceType[]) => void;
	}

	/**
	 * @module Error
	 */
	interface ErrorParameters {
		type: Code;
		message: string;
		data?: any;
	}
	class ErrorEvent {
		type: Code;
		message: string;
		data?: any;
		constructor(parameters: ErrorParameters);
		static create(parameters: ErrorParameters): ErrorEvent;
	}

	/**
	 * @module Logger
	 */
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

	/**
	 * @moudle message
	 */
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
		url: string;
		filename: string;
		filetype: string;
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
	}

	interface ReadMsgSetParameters {
		id: string;
		to: string;
		from?: string;
		chatType: 'singleChat' | 'groupChat';
	}
	interface ReadMsgBody extends ReadMsgSetParameters {
		type: 'read';
		ackId?: string;
		mid?: string;
		groupReadCount?: { [key: string]: number };
		ackContent?: string;
		chatType: 'singleChat' | 'groupChat';
		isChatThread?: boolean;
	}
	interface ReadParameters {
		type: 'read';
		id: string;
	}

	interface CreateReadMsgParameters {
		to: string;
		from?: string;
		type: 'read';
		id: string;
		ackContent?: string;
		chatType: 'singleChat' | 'groupChat';
		isChatThread?: boolean;
	}

	interface DeliveryParameters {
		id: string;
		type: 'delivery';
	}
	interface DeliveryMsgSetParameters {
		ackId: string;
		to: string;
		from?: string;
	}
	interface DeliveryMsgBody {
		id: string;
		mid?: string;
		ackId?: string;
		type: 'delivery';
		to: string;
		from?: string;
		isChatThread?: boolean;
	}

	interface CreateDeliveryMsgParameters {
		ackId: string;
		type: 'delivery';
		to: string;
		from?: string;
		isChatThread?: boolean;
	}

	interface ChannelMsgSetParameters {
		chatType: ChatType;
		to: string;
		from?: string;
	}

	interface ChannelMsgBody extends ChannelMsgSetParameters {
		id: string;
		group?: string;
		type: 'channel';
		time: number;
		isChatThread?: boolean;
	}
	interface ChannelParameters {
		type: 'channel';
		id: string;
	}

	interface CreateChannelMsgParameters {
		type: 'channel';
		chatType: ChatType;
		to: string;
		from?: string;
		isChatThread?: boolean;
	}

	interface TextParameters {
		type: 'txt';
		id: string;
	}
	interface TextMsgSetParameters {
		chatType: ChatType;
		to: string;
		msg: string;
		from?: string;
		roomType?: boolean;
		success?: (data: SendMsgResult) => void;
		fail?: () => void;
		ext?: { [key: string]: any };
	}

	interface TextMsgBody {
		id: string;
		chatType: ChatType;
		type: 'txt';
		to: string;
		msg: string;
		from?: string;
		roomType?: boolean;
		group?: string;
		success?: (data: SendMsgResult) => void;
		fail?: () => void;
		ext?: { [key: string]: any };
		msgConfig?: { allowGroupAck?: boolean; languages?: string[] };
		translations?: TranslationResult;
		time: number;
		isChatThread?: boolean;
		reactions?: Reaction;
	}

	interface CreateTextMsgParameters {
		chatType: ChatType;
		type: 'txt';
		to: string;
		msg: string;
		from?: string;
		ext?: { [key: string]: any };
		msgConfig?: { allowGroupAck?: boolean; languages?: string[] };
		isChatThread?: boolean;
	}

	interface CmdParameters {
		type: 'cmd';
		id: string;
	}
	interface CmdMsgSetParameters {
		chatType: ChatType;
		to: string;
		action: string;
		from?: string;
		roomType?: boolean;
		success?: (data: SendMsgResult) => void;
		fail?: () => void;
		ext?: { [key: string]: any };
	}

	interface CmdMsgBody {
		id: string;
		chatType: ChatType;
		type: 'cmd';
		to: string;
		action: string;
		from?: string;
		roomType?: boolean;
		group?: string;
		success?: (data: SendMsgResult) => void;
		fail?: () => void;
		ext?: { [key: string]: any };
		msgConfig?: { [key: string]: any };
		time: number;
		isChatThread?: boolean;
		reactions?: Reaction;
	}

	interface CreateCmdMsgParameters {
		type: 'cmd';
		chatType: ChatType;
		to: string;
		action: string;
		from?: string;
		roomType?: boolean;
		ext?: { [key: string]: any };
		msgConfig?: { allowGroupAck: boolean };
		isChatThread?: boolean;
	}

	interface CustomParameters {
		type: 'custom';
		id: string;
	}
	interface CustomMsgSetParameters {
		chatType: ChatType;
		to: string;
		customEvent: string;
		customExts: { [key: string]: any };
		from?: string;
		roomType?: boolean;
		success?: (data: SendMsgResult) => void;
		fail?: () => void;
		ext?: { [key: string]: any };
	}

	interface CustomMsgBody {
		id: string;
		chatType: ChatType;
		type: 'custom';
		to: string;
		customEvent: string;
		customExts: { [key: string]: any };
		from?: string;
		roomType?: boolean;
		group?: string;
		params?: { [key: string]: any };
		success?: (data: SendMsgResult) => void;
		fail?: () => void;
		ext?: { [key: string]: any };
		msgConfig?: { [key: string]: any };
		time: number;
		isChatThread?: boolean;
		reactions?: Reaction;
	}

	interface CreateCustomMsgParameters {
		type: 'custom';
		chatType: ChatType;
		to: string;
		customEvent: string;
		customExts: { [key: string]: any };
		from?: string;
		ext?: { [key: string]: any };
		msgConfig?: { allowGroupAck: boolean };
		isChatThread?: boolean;
	}

	interface LocationParameters {
		type: 'loc';
		id: string;
	}
	interface LocationMsgSetParameters {
		chatType: ChatType;
		to: string;
		addr: string;
		buildingName: string;
		lat: number;
		lng: number;
		from?: string;
		roomType?: boolean;
		success?: (data: SendMsgResult) => void;
		fail?: () => void;
		ext?: { [key: string]: any };
	}

	interface LocationMsgBody {
		id: string;
		chatType: ChatType;
		type: 'loc';
		to: string;
		addr: string;
		buildingName: string;
		lat: number;
		lng: number;
		from?: string;
		roomType?: boolean;
		group?: string;
		success?: (data: SendMsgResult) => void;
		fail?: () => void;
		ext?: { [key: string]: any };
		time: number;
		msgConfig?: { allowGroupAck: boolean };
		isChatThread?: boolean;
		reactions?: Reaction;
	}

	interface CreateLocationMsgParameters {
		type: 'loc';
		chatType: ChatType;
		to: string;
		addr: string;
		buildingName: string;
		lat: number;
		lng: number;
		from?: string;
		ext?: { [key: string]: any };
		msgConfig?: { allowGroupAck: boolean };
		isChatThread?: boolean;
	}

	interface FileParameters {
		type: 'file';
		id: string;
	}
	interface FileMsgSetParameters {
		chatType: ChatType;
		file: FileObj;
		filename?: string;
		fileInputId?: string;
		to: string;
		from?: string;
		roomType?: boolean;
		success?: (data: SendMsgResult) => void;
		fail?: () => void;
		ext?: { [key: string]: any };
		apiUrl?: string;
		onFileUploadError?: (err: any) => void;
		onFileUploadComplete?: (data: any) => void;
		onFileUploadProgress?: (data: ProgressEvent) => void;
		body?: {
			url: string;
			type: string;
			filename: string;
		};
	}

	interface FileMsgBody extends CreateFileMsgParameters {
		id: string;
		type: 'file';
		group?: string;
		url?: string;
		secret?: string;
		length?: number;
		file_length?: number;
		filetype?: string;
		accessToken?: string;
		msgConfig?: { allowGroupAck: boolean };
		time: number;
		reactions?: Reaction;
	}

	interface CreateFileMsgParameters {
		type: 'file';
		chatType: ChatType;
		file: FileObj;
		filename?: string;
		fileInputId?: string;
		to: string;
		from?: string;
		ext?: { [key: string]: any };
		apiUrl?: string;
		onFileUploadError?: (err: any) => void;
		onFileUploadComplete?: (data: any) => void;
		onFileUploadProgress?: (data: ProgressEvent) => void;
		body?: {
			url: string;
			type: string;
			filename: string;
		};
		msgConfig?: { allowGroupAck: boolean };
		isChatThread?: boolean;
	}

	interface ImgParameters {
		type: 'img';
		id: string;
	}

	interface ImgMsgSetParameters {
		chatType: ChatType;
		to: string;
		file?: FileObj;
		width?: number;
		height?: number;
		fileInputId?: string;
		from?: string;
		roomType?: boolean;
		group?: string;
		success?: (data: SendMsgResult) => void;
		fail?: () => void;
		ext?: { [key: string]: any };
		url?: string;
		onFileUploadError?: (error: any) => void;
		onFileUploadComplete?: (data: any) => void;
		onFileUploadProgress?: (data: ProgressEvent) => void;
		uploadError?: (error: any) => void;
		uploadComplete?: (data: any) => void;
		msgConfig?: { [key: string]: any };
		body?: {
			url: string;
			type: string;
			filename: string;
		};
	}

	interface ImgMsgBody extends ImgMsgSetParameters {
		id: string;
		type: 'img';
		time: number;
		secret?: string;
		thumb?: string;
		thumb_secret?: string;
		isChatThread?: boolean;
		reactions?: Reaction;
	}

	interface CreateImgMsgParameters {
		type: 'img';
		chatType: ChatType;
		file?: FileObj;
		url?: string;
		width?: number;
		height?: number;
		to: string;
		from?: string;
		onFileUploadError?: (error: any) => void;
		onFileUploadComplete?: (data: any) => void;
		onFileUploadProgress?: (data: ProgressEvent) => void;
		uploadError?: (error: any) => void;
		uploadComplete?: (data: any) => void;
		ext?: { [key: string]: any };
		body?: {
			url: string;
			type: string;
			filename: string;
		};
		msgConfig?: { allowGroupAck: boolean };
		isChatThread?: boolean;
	}

	interface AudioParameters {
		type: 'audio';
		id: string;
	}
	interface AudioMsgSetParameters {
		chatType: ChatType;
		file: FileObj;
		filename: string;
		length?: number;
		file_length?: number;
		fileInputId?: string;
		to: string;
		from?: string;
		roomType?: boolean;
		success?: (data: SendMsgResult) => void;
		fail?: () => void;
		ext?: { [key: string]: any };
		apiUrl?: string;
		onFileUploadError?: (err: any) => void;
		onFileUploadComplete?: (data: any) => void;
		onFileUploadProgress?: (data: ProgressEvent) => void;
		body?: {
			url: string;
			type: string;
			filename: string;
		};
	}

	interface AudioMsgBody extends AudioMsgSetParameters {
		id: string;
		type: 'audio';
		url?: string;
		secret?: string;
		filetype?: string;
		accessToken?: string;
		group?: string;
		msgConfig?: { [key: string]: any };
		time: number;
		isChatThread?: boolean;
		reactions?: Reaction;
	}

	interface CreateAudioMsgParameters {
		type: 'audio';
		chatType: ChatType;
		file: FileObj;
		filename: string;
		length?: number;
		file_length?: number;
		fileInputId?: string;
		to: string;
		from?: string;
		roomType?: boolean;
		success?: (data: SendMsgResult) => void;
		fail?: () => void;
		ext?: { [key: string]: any };
		apiUrl?: string;
		onFileUploadError?: (err: any) => void;
		onFileUploadComplete?: (data: any) => void;
		onFileUploadProgress?: (data: ProgressEvent) => void;
		body?: {
			url: string;
			type: string;
			filename: string;
		};
		msgConfig?: { allowGroupAck: boolean };
		isChatThread?: boolean;
	}

	interface VideoParameters {
		type: 'video';
		id: string;
	}
	interface VideoMsgSetParameters {
		chatType: ChatType;
		file: FileObj;
		filename: string;
		length?: number;
		file_length?: number;
		fileInputId?: string;
		to: string;
		from?: string;
		roomType?: boolean;
		success?: (data: SendMsgResult) => void;
		fail?: () => void;
		ext?: { [key: string]: any };
		apiUrl?: string;
		onFileUploadError?: (err: any) => void;
		onFileUploadComplete?: (data: any) => void;
		onFileUploadProgress?: (data: ProgressEvent) => void;
		body?: {
			url: string;
			type: string;
			filename: string;
		};
	}

	interface VideoMsgBody extends VideoMsgSetParameters {
		id: string;
		type: 'video';
		url?: string;
		secret?: string;
		filetype?: string;
		accessToken?: string;
		msgConfig?: { [key: string]: any };
		group?: string;
		time: number;
		isChatThread?: boolean;
		reactions?: Reaction;
	}

	interface CreateVideoMsgParameters {
		type: 'video';
		chatType: ChatType;
		file: FileObj;
		filename: string;
		length?: number;
		file_length?: number;
		fileInputId?: string;
		to: string;
		from?: string;
		ext?: { [key: string]: any };
		apiUrl?: string;
		onFileUploadError?: (err: any) => void;
		onFileUploadComplete?: (data: any) => void;
		onFileUploadProgress?: (data: ProgressEvent) => void;
		body?: {
			url: string;
			type: string;
			filename: string;
		};
		msgConfig?: { allowGroupAck: boolean };
		isChatThread?: boolean;
	}

	interface ReceivedMsgBody {
		id: string;
		mid: string;
		to: string;
		time: number;
	}

	interface RecallMsgBody {
		id?: string;
		from: string;
		to: string;
		mid: string;
	}
	interface MuteMsgBody {
		mid: string;
	}
	interface ContactMsgBody {
		to: string;
		from: string;
		status: string;
		type: 'subscribed' | 'unsubscribed' | 'subscribe';
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
		| CreateAudioMsgParameters;

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
		| FileMsgBody;

	class Message {
		id: string;
		type: MessageType;
		body?: MessageBody;
		constructor(type: MessageType, id?: string);
		static createOldMsg(options: NewMessageParamters): MessageBody;
		static create(options: CreateMsgType): MessageBody;
		set(options: MessageSetParameters): void;
	}

	/**
	 * @moudle utils
	 */

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
		platform: PLATFORM;
		global: any;
	}
	interface Uri {
		url: string;
		filename: string;
		filetype: string;
		data: File | null;
	}
	interface UploadFile {
		onFileUploadProgress?: (msg: any) => void;
		onFileUploadComplete?: (msg: any) => void;
		onFileUploadError?: (msg: any) => void;
		onFileUploadCanceled?: (msg: any) => void;
		accessToken: string;
		appKey: string;
		apiUrl?: string;
		uploadUrl?: string;
		file: object;
	}
	interface DownloadParams {
		onFileDownloadComplete: (data: any) => void;
		onFileDownloadError: (error: any) => void;
		id: string;
		secret: string;
		[key: string]: any;
	}
	interface Utils {
		getUniqueId: () => string;
		ajax: (options: AjaxOptions) => Promise<any>;
		getFileUrl: (fileInputId: string | HTMLInputElement) => Uri;
		uploadFile: (options: UploadFile) => void;
		listenNetwork: (online: () => void, offline: () => void) => void;
		getEnvInfo: () => EnvInfo;
		wxRequest: (options: AjaxOptions) => Promise<any>;
		parseDownloadResponse: (res: any) => string;
		download: (params: DownloadParams) => void;
	}
}
