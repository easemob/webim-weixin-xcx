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
		 * Joins the chat room. After a user joins successfully, other members in the chat room will receive operation: 'memberPresence' in the onChatroomEvent callback.
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
		 * @deprecated Use {@link leaveChatRoom} instead.
		 * Exits chat room. And others will receive "operation: 'memberAbsence'" in the callback of onChatroomEvent.
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

		/**
		 * Exits chat room. And others will receive "operation: 'memberAbsence'" in the callback of onChatroomEvent.
		 *
		 * ```typescript
		 * connection.leaveChatRoom({roomId: 'roomId'})
		 * ```
		 */
		leaveChatRoom(
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
		 * Lists all chat room members with pagination.
		 *
		 * ```typescript
		 * connection.listChatRoomMembers({pageNum: 1, pageSize: 20, chatRoomId: 'chatRoomId'})
		 * ```
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
		 * Gets all admins of the chat room.
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
		 * Sets a user as chat room admin. Only the chat room owner can call this method. The members who are set as admins will receive "operation: 'setAdmin'" in the callback of onChatroomEvent.
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
		 * Removes chat room admins. Only the chat room owner can call this method. The users whose admin privileges are removed will receive "operation: 'removeAdmin'" in the callback of onChatroomEvent.
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
		 *  Mutes chat room member. Only the chat room owner can call this method. The muted member and other members will receive "operation:'muteMember'" in the callback of onChatroomEvent.
		 *
		 * ```typescript
		 * connection.muteChatRoomMember({username: 'user1', muteDuration: -1, chatRoomId: 'chatRoomId'})
		 * ```
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
		 * Unmute the chat room member. Only the chatroom owner can call this method. The members who are muted and others will receive "operation: 'unmuteMember'" in the callback of onChatroomEvent.
		 *
		 * ```typescript
		 * connection.unmuteChatRoomMember({chatRoomId: 'chatRoomId', username: 'user1'})
		 * `
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
		 * Adds a member to the chat room blocklist. Only the chat room owner or admin can call this method.
		 *
		 * ```typescript
		 * connection.blockChatRoomMember({chatRoomId: 'chatRoomId', username: 'user1'})
		 * ```
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
		 * Adds members to the chat room blocklist. Only the chat room owner or admin can call this method.
		 *
		 * ```typescript
		 * connection.blockChatRoomMembers({usernames: ['user1', 'user2'], chatRoomId: 'chatRoomId'})
		 * ```
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
		 * Unmute all the members in the chat room. Only the chatroom owner or admin can call this method.
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
				chatRoomId: string;
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
				chatRoomId: string;
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
				chatRoomId: string;
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
		 * Uploads a shared file to the chat room.
		 *
		 * ```typescript
		 * connection.uploadChatRoomSharedFile({roomId: 'roomId', file: 'file object', onFileUploadProgress: onFileUploadProgress, onFileUploadComplete: onFileUploadComplete,onFileUploadError:onFileUploadError,onFileUploadCanceled:onFileUploadCanceled})
		 * ```
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
		 * Deletes a shared file of the chat room.
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
		 * Blocks group messages. This method is only valid for mobile devices.
		 * ```typescript
		 * connection.blockGroupMessages({groupId: 'groupId'})
		 * ```
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
				limit: number;
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
				needAffiliations?: boolean;
				needRole?: boolean;
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
		 * Transfers a group. Only the group owner can call this method. Group members will receive "operation: 'changeOwner'" in the callback of onGroupEvent.
		 *
		 * ```typescript
		 * connection.changeGroupOwner({groupId: 'groupId', newOwner: 'user1'})
		 * ```
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
		 * Gets specifications of the group.
		 * ```typescript
		 * connection.getGroupInfo({groupId: groupId})
		 * ```
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
		 * Modifies group information. Only the group admin can call this method.
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
		 * Lists all members of the group with pagination.
		 *
		 * ```typescript
		 * connection.listGroupMembers({pageNum: 1, pageSize: 20, groupId: 'groupId'})
		 * ```
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
		 * Gets all admins in the group.
		 * ```typescript
		 * connection.getGroupAdmin({groupId: 'groupId'})
		 * ```
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
		 * Sets a group admin. Only the group owner can call this method. The user set as an admin will receive "operation: 'setAdmin'" in the callback of onGroupEvent.
		 *
		 * ```typescript
		 * connection.setGroupAdmin({groupId: 'groupId', username: 'user1'})
		 * ```
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
		 * Removes a group admin. Only the group owner can call this method. The user whose admin permissions are revoked will receive "operation: 'removeAdmin'" in the callback of onGroupEvent.
		 *
		 * ```typescript
		 * connection.removeAdmin({groupId: 'groupId', username: 'user1'})
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
		 * Destroys a group. Only the group owner can call this method. Group members will receive "operation: 'destroy'" in the callback of onGroupEvent.
		 *
		 * ```typescript
		 * connection.destroyGroup({groupId: 'groupId'})
		 * ```
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
		 * Leaves the group. Group members will receive "operation: 'memberAbsence'" in the callback of onGroupEvent.
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
				groupId: string;
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
		 * Accepts a group request. Only the group owner or admin can call this method. The user joining the group will receive "operation: 'acceptRequest'" in the callback of onGroupEvent.
		 *
		 * ```typescript
		 * connection.acceptGroupJoinRequest({applicant: 'user1', groupId: 'groupId'})
		 * ```
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
		 * Declines a group request. Only the group owner or admin can call this method.
		 *
		 * ```typescript
		 * connection.rejectGroupJoinRequest({applicant: 'user1', groupId: 'groupId', reason: 'I do not like you'})
		 * ```
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
		 * Accepts a group invitation. If a group member invites a user to join the group, the invitee can call this method to accept the invitation. The inviter will receive "operation: 'acceptInvite'" in the callback of onGroupEvent. The user who joins the group successfully will receive "operation: 'memberPresence'" in the callback of onGroupEvent.
		 *
		 * ```typescript
		 * connection.acceptGroupInvite({invitee: 'myUserId', groupId: 'groupId'})
		 * ```
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
		 * Declines a group invitation. If a group member invites a user to join a group, the invitee can call this method to decline the invitation.
		 *
		 * ```typescript
		 * connection.rejectGroupInvite({invitee: 'myUserId', groupId: 'groupId'})
		 * ```
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
		 * Removes a member from the group. Only the group owner or admin can call this method. The removed member will receive "operation: 'removeMember' in the callback of onGroupEvent, and other group members will receive "operation: 'memberAbsence' in the callback of onGroupEvent.
		 *
		 * ```typescript
		 * connection.removeGroupMember({groupId: 'groupId', username: 'user1'})
		 * ```
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
		 * Removes members from the group. Only the group owner or admin can call this method. The removed members will receive "operation: 'removeMember'" in the callback of onGroupEvent, and other group members will receive "operation: 'memberAbsence' in the callback of onGroupEvent.
		 *
		 * ```typescript
		 * connection.removeGroupMembers({groupId: 'groupId', users: ['user1', 'user2']})
		 * ```
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
		 * Mutes a group member. Only the group owner or admin can call this method. The muted member and other members will receive "operation:'muteMember'" in the callback of onGroupEvent.
		 *
		 * ```typescript
		 * connection.muteGroupMember({username: 'user1', muteDuration: -1, groupId: 'groupId'})
		 * ```
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
		 * Unmute a group member. Only the group owner or admin can call this method. All members, including the muted, will receive "operation: 'unmuteMember'" in the callback of onGroupEvent.
		 *
		 * ```typescript
		 * connection.unmuteGroupMember({groupId: 'groupId', username: 'user1'})
		 * ```
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
		 * Gets the mute list of the group.
		 *
		 * ```typescript
		 * connection.getGroupMuteList({groupId: 'groupId'})
		 * ```
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
		 * Adds a member to the group blocklist. Only the group owner or admin can call this method. The member added to the blocklist will receive "operation: 'removeMember'" in the callback of onGroupEvent.
		 *
		 * ```typescript
		 * connection.blockGroupMember({groupId: 'groupId', username: 'user1'})
		 * ```
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
		 * Adds members to the group blocklist in bulk. Only the group admin can call this method. Members added to the blocklist will receive "operation: 'removeMember'" in the callback of onGroupEvent.
		 *
		 * ```typescript
		 * connection.blockGroupMembers({usernames: ['user1', 'user2'], groupId: 'groupId'})
		 * ```
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
		 * Removes a member from the group blocklist. Only the group admin can call this method. Members who have been removed from the blocklist will receive "operation: 'unblockMember'" in the callback of onGroupEvent.
		 *
		 * ```typescript
		 * connection.unblockGroupMember({groupId: 'groupId'})
		 * ```
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
		 * Removes members from the group blocklist in bulk. Only the group owner or admin can call this method. Members who are removed from the blocklist will receive "operation: 'unblockMember'" in the callback of onGroupEvent.
		 *
		 * ```typescript
		 * connection.unblockGroupMembers({groupId: 'groupId', usernames: ['user1', 'user2']})
		 * ```
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
		 * Gets the group blocklist.
		 *
		 * ```typescript
		 * connection.getGroupBlacklist({groupId: 'groupId'})
		 * ```
		 * @hidden
		 * @deprecated
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
		 * Gets the group blocklist.
		 *
		 * ```typescript
		 * connection.getGroupBlocklist({groupId: 'groupId'})
		 * ```
		 */
		getGroupBlocklist(
			this: Connection,
			params: {
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
				groupId: string;
				success?: (res: AsyncResult<{ mute: false }>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<{ mute: false }>>;

		/**
		 * @hidden
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
				groupId: string;
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
				groupId: string;
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
				groupId: string;
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
				groupId: string;
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
				groupId: string;
				userName: UserId;
				success?: (res: AsyncResult<IsInGroupWhiteListResult>) => void;
				error?: (error: ErrorEvent) => void;
			}
		): Promise<AsyncResult<IsInGroupWhiteListResult>>;

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
				groupId: string;
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
				groupId: string;
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
				groupId: string;
				file: object;
				onFileUploadProgress?: (data: ProgressEvent) => void;
				onFileUploadComplete?: (data: any) => void;
				onFileUploadError?: (data: any) => void;
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
				groupId: string;
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
		 * Gets a list of shared files in the group.
		 *
		 * ```typescript
		 * connection.getGroupSharedFilelist({groupId: 'groupId'})
		 * ```
		 */
		getGroupSharedFilelist(
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

		/** @deprecated */
		getRoster(
			this: Connection,
			params?: {
				success?: (res: RosterData[]) => void;
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
		 * Uploads the token to the server. This method is used when the SDK is used on a native client on which a third-party push service is to be integrated.
		 *
		 * ```typescript
		 * connection.uploadPushToken({deviceId: 'deviceId', deviceToken: 'deviceToken', notifierName: 'notifierName'})
		 * ```
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
		 * @deprecated Use Use {@link deleteConversation} instead.
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
		 * Deletes the conversation.
		 *
		 * ```typescript
		 * connection.deleteConversation()
		 * ```
		 */
		deleteConversation(
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
			value?: any
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
			value?: any
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
			userId: UserId | UserId[],
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
				/** The chat type:
				 * - `singleChat`: one-to-one chat;
				 * - `groupChat`: group chat;
				 * - `chatRoom`: chat room.
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
		 * Adds a friend.
		 *
		 * ```typescript
		 * connection.addContact('user1', 'I am Bob')
		 * ```
		 */
		addContact(this: Connection, to: string, message?: string): void;

		/**
		 * Deletes the contact.
		 *
		 * ```typescript
		 * connection.deleteContact('user1')
		 * ```
		 */
		deleteContact(this: Connection, to: string): void;

		/** @deprecated  */
		acceptInvitation(this: Connection, to: string): void;

		/**
		 * Accepts a friend request.
		 *
		 * ```typescript
		 * connection.acceptContactInvite('user1')
		 * ```
		 */
		acceptContactInvite(this: Connection, to: string): void;

		/** @deprecated  */
		declineInvitation(this: Connection, to: string): void;

		/**
		 * Declines a friend request.
		 *
		 * ```typescript
		 * connection.declineContactInvite('user1')
		 * ```
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
		 * @deprecated
		 * Add contacts to your blacklist.
		 *
		 * ```typescript
		 * connection.addUsersToBlacklist({name: 'user1'})
		 * ```
		 */
		addUsersToBlacklist(
			this: Connection,
			options: {
				name: UserId | UserId[];
			}
		): void;

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
		 * @deprecated
		 * Removes friends from your blacklist
		 *
		 * ```typescript
		 * connection.removeUserFromBlackList({name: 'user1'})
		 * ```
		 */
		removeUserFromBlackList(
			this: Connection,
			options: {
				name: UserId | UserId[];
			}
		): void;

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
		 * Recalls a message.
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
		 * @deprecated
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
