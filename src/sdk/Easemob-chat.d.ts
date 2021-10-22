
import { InputFiles } from "typescript";
declare interface GetChatRoomsParams {
    pagenum: number;
    pagesize: number;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface CreateChatRoomParams {
    name: string;
    description: string;
    maxusers: number;
    members: string[];
    token: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface DestroyChatRoomParams {
    chatRoomId: string;
    token: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface GetChatRoomDetailsParams {
    chatRoomId: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface ModifyChatRoomParams {
    chatRoomId: string;
    chatRoomName: string;
    description: string;
    maxusers: number;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface RemoveSingleChatRoomMemberParams {
    chatRoomId: string;
    username: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface RemoveMultiChatRoomMemberParams {
    chatRoomId: string;
    users: string[];
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface AddUsersToChatRoomParams {
    chatRoomId: string;
    users: string[];
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface JoinChatRoomParams {
    roomId: string;
    message?: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface QuitChatRoomParams {
    roomId: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface ListChatRoomMemberParams {
    pageNum: number;
    pageSize: number;
    chatRoomId: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface GetChatRoomAdminParams {
    chatRoomId: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface SetChatRoomAdminParams {
    chatRoomId: string;
    username: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface RemoveChatRoomAdminParams {
    chatRoomId: string;
    username: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface MuteChatRoomMemberParams {
    chatRoomId: string;
    username: string;
    muteDuration: number;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface RemoveMuteChatRoomMemberParams {
    chatRoomId: string;
    username: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface GetChatRoomMutedParams {
    chatRoomId: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface ChatRoomBlockSingleParams {
    chatRoomId: string;
    username: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface ChatRoomBlockMultiParams {
    chatRoomId: string;
    usernames: string[];
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface RemoveChatRoomBlockSingleParams {
    chatRoomId: string;
    username: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare type RemoveChatRoomBlockMultiParams = ChatRoomBlockMultiParams;
declare interface GetChatRoomBlacklistNewParams {
    chatRoomId: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface DisableSendChatRoomMsgParams {
    chatRoomId: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare type EnableSendChatRoomMsgParams = DisableSendChatRoomMsgParams;
declare interface AddUsersToChatRoomWhitelistParams {
    chatRoomId: string;
    users: string[];
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface RmUsersFromChatRoomWhitelistParams {
    chatRoomId: string;
    userName: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface GetChatRoomWhitelistParams {
    chatRoomId: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface IsChatRoomWhiteUserParams {
    chatRoomId: string;
    userName: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface FetchChatRoomAnnouncementParams {
    roomId: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface UpdateChatRoomAnnouncementParams {
    roomId: string;
    announcement: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface UploadChatRoomSharedFileParams {
    roomId: string;
    file: InputFiles;
    onFileUploadProgress?: (data: any) => any;
    onFileUploadComplete?: (data: any) => any;
    onFileUploadError?: (data: any) => any;
    onFileUploadCanceled?: (data: any) => any;
}
declare interface DeleteChatRoomSharedFileParams {
    roomId: string;
    fileId: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface FetchChatRoomSharedFileListParams {
    roomId: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
export { GetChatRoomsParams, CreateChatRoomParams, DestroyChatRoomParams, GetChatRoomDetailsParams, ModifyChatRoomParams, RemoveSingleChatRoomMemberParams, RemoveMultiChatRoomMemberParams, AddUsersToChatRoomParams, JoinChatRoomParams, QuitChatRoomParams, ListChatRoomMemberParams, GetChatRoomAdminParams, SetChatRoomAdminParams, RemoveChatRoomAdminParams, MuteChatRoomMemberParams, RemoveMuteChatRoomMemberParams, GetChatRoomMutedParams, ChatRoomBlockSingleParams, ChatRoomBlockMultiParams, RemoveChatRoomBlockSingleParams, RemoveChatRoomBlockMultiParams, GetChatRoomBlacklistNewParams, DisableSendChatRoomMsgParams, EnableSendChatRoomMsgParams, AddUsersToChatRoomWhitelistParams, RmUsersFromChatRoomWhitelistParams, GetChatRoomWhitelistParams, IsChatRoomWhiteUserParams, FetchChatRoomAnnouncementParams, UpdateChatRoomAnnouncementParams, UploadChatRoomSharedFileParams, DeleteChatRoomSharedFileParams, FetchChatRoomSharedFileListParams };

// Group Api
declare interface CreateGroupNewParams {
    data: {
        groupname: string;
        desc: string;
        members: string[];
        public: boolean;
        approval: boolean;
        allowinvites: boolean;
        inviteNeedConfirm: boolean;
    };
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface BlockGroupParams {
    groupId: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface ListGroupsParams {
    limit: number;
    cursor?: number | null;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface GetGroupParams {
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface ChangeOwnerParams {
    groupId: string;
    newOwner: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface GetGroupInfoParams {
    groupId: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface ModifyGroupParams {
    groupId: string;
    groupName: string;
    description: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface ListGroupMemberParams {
    pageNum: number;
    pageSize: number;
    groupId: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface GetGroupAdminParams {
    groupId: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface SetAdminParams {
    groupId: string;
    username: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare type RemoveAdminParams = SetAdminParams;
declare interface DissolveGroupParams {
    groupId: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface QuitGroupParams {
    groupId: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface InviteToGroupParams {
    groupId: string;
    users: string[];
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface JoinGroupParams {
    groupId: string;
    message: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface AgreeJoinGroupParams {
    groupId: string;
    applicant: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface RejectJoinGroupParams {
    groupId: string;
    applicant: string;
    reason: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface AgreeInviteIntoGroupParams {
    groupId: string;
    invitee: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare type RejectInviteIntoGroupParams = AgreeInviteIntoGroupParams;
declare interface RemoveSingleGroupMemberParams {
    groupId: string;
    username: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface RemoveMultiGroupMemberParams {
    groupId: string;
    users: string[];
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface MuteParams {
    groupId: string;
    username: string;
    muteDuration: number;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface RemoveMuteParams {
    groupId: string;
    username: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface GetMutedParams {
    groupId: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface GroupBlockSingleParams {
    groupId: string;
    username: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface GroupBlockMultiParams {
    groupId: string;
    usernames: string[];
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare type RemoveGroupBlockSingleParams = GroupBlockSingleParams;
declare type RemoveGroupBlockMultiParams = GroupBlockMultiParams;
declare interface GetGroupBlacklistNew {
    groupId: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface DisableSendGroupMsgParams {
    groupId: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare type EnableSendGroupMsgParams = DisableSendGroupMsgParams;
declare interface AddUsersToGroupWhitelistParams {
    groupId: string;
    users: string[];
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface RmUsersFromGroupWhitelistParams {
    groupId: string;
    userName: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface GetGroupWhitelistParams {
    groupId: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface IsGroupWhiteUserParams {
    groupId: string;
    userName: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface GetGroupMsgReadUserParams {
    groupId: string;
    msgId: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface FetchGroupAnnouncementParams {
    groupId: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface UpdateGroupAnnouncementParams {
    groupId: string;
    announcement: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface UploadGroupSharedFileParams {
    groupId: string;
    file: InputFiles;
    onFileUploadProgress?: (data: any) => any;
    onFileUploadComplete?: (data: any) => any;
    onFileUploadError?: (data: any) => any;
    onFileUploadCanceled?: (data: any) => any;
}
declare interface DeleteGroupSharedFileParams {
    groupId: string;
    fileId: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
declare interface FetchGroupSharedFileListParams {
    groupId: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}
export { CreateGroupNewParams, BlockGroupParams, ListGroupsParams, GetGroupParams, ChangeOwnerParams, GetGroupInfoParams, ModifyGroupParams, ListGroupMemberParams, GetGroupAdminParams, SetAdminParams, RemoveAdminParams, DissolveGroupParams, QuitGroupParams, InviteToGroupParams, JoinGroupParams, AgreeJoinGroupParams, RejectJoinGroupParams, AgreeInviteIntoGroupParams, RejectInviteIntoGroupParams, RemoveSingleGroupMemberParams, RemoveMultiGroupMemberParams, MuteParams, RemoveMuteParams, GetMutedParams, GroupBlockSingleParams, GroupBlockMultiParams, RemoveGroupBlockSingleParams, RemoveGroupBlockMultiParams, GetGroupBlacklistNew, DisableSendGroupMsgParams, EnableSendGroupMsgParams, AddUsersToGroupWhitelistParams, RmUsersFromGroupWhitelistParams, GetGroupWhitelistParams, IsGroupWhiteUserParams, GetGroupMsgReadUserParams, FetchGroupAnnouncementParams, UpdateGroupAnnouncementParams, UploadGroupSharedFileParams, DeleteGroupSharedFileParams, FetchGroupSharedFileListParams };

// Contact Api 
declare interface BaseApiParams {
    success?: (data: any) => any;
    error?: (error: any) => any;
}

declare interface UploadTokenParams {
    deviceId: string;
    deviceToken: string;
    notifierName: string;
    success?: (data: any) => any;
    error?: (error: any) => any;
}

declare interface UpdateOwnUserInfoParams {
    nickname?: string;
    avatarurl?: string;
    mail?: string;
    phone?: string;
    gender?: any;
    sign?: string;
    birth?: string;
    ext?: {
        [key: string]: any;
    };
}
declare type ConfigurableKey = 'nickname' | 'avatarurl' | 'mail' | 'phone' | 'gender' | 'sign' | 'birth' | 'ext';
declare interface RosterData {
    name: string;
    subscription: 'both';
    jid: Jid;
}
declare interface UserBlackListParams {
    name: string;
}
declare interface SubscribeParams {
    to: string;
    message?: string;
}
declare interface FetchHistoryMsgsParams {
    queue: string;
    start?: number | null;
    count?: number;
    isGroup?: boolean;
    success?: (data: any) => any;
    fail?: (error?: any) => any;
}
declare interface RecallMessageParams {
    mid: string;
    to: string;
    type?: 'chat' | 'groupchat' | 'chatroom';
    chatType?: 'singleChat' | 'groupChat' | 'chatRoom';
    success?: () => any;
    fail?: () => any;
}
export type { GetBlacklistParams, GetRosterParams, RosterData, UploadTokenParams, GetSessionListParams, UpdateOwnUserInfoParams, ConfigurableKey, UserBlackListParams, SubscribeParams, FetchHistoryMsgsParams, RecallMessageParams };


// eventHandle types
declare type OnPresenceMsgType = 'rmChatRoomMute' | 'rmGroupMute' | 'muteChatRoom' | 'muteGroup' | 'rmUserFromChatRoomWhiteList' | 'rmUserFromGroupWhiteList' | 'addUserToChatRoomWhiteList' | 'addUserToGroupWhiteList' | 'deleteFile' | /*delete group file*/ 'uploadFile' | /*upload group file*/ 'deleteAnnouncement' | /*delete group Announcement*/ 'updateAnnouncement' | /*delete group Announcement*/ 'removeMute' | /*Lift a person from the ban in the group*/ 'addMute' | /*Forbid one person in the group*/ 'removeAdmin' | /*Remove a group administrator*/ 'addAdmin' | 'changeOwner' | 'direct_joined' | 'leaveChatRoom' | 'leaveGroup' | 'memberJoinChatRoomSuccess' | 'memberJoinPublicGroupSuccess' | 'unblock' | 'block' | 'update' | 'allow' | 'ban' | 'getBlackList' | 'removedFromGroup' | 'invite_decline' | 'invite_accept' | 'invite' | 'joinPublicGroupDeclined' | 'joinPublicGroupSuccess' | 'joinGroupNotifications' | 'leave' | 'join' | 'deleteGroupChat' | 'subscribe' | 'unsubscribed' | 'subscribed';
declare interface OnPresenceMsg {
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
export declare type Event = 'onOpened' | 'onPresence' | 'onTextMessage' | 'onImageMessage' | 'onAudioMessage' | 'onVideoMessage' | 'onFileMessage' | 'onLocationMessage' | 'onCmdMessage' | 'onCustomMessage' | 'onReceivedMessage' | 'onDeliverdMessage' | 'onReadMessage' | 'onRecallMessage' | 'onMutedMessage' | 'onChannelMessage' | 'onError' | 'onOffline' | 'onOnline' | 'onRoster' | 'onStatisticMessage' | 'onContactAgreed' | 'onContactRefuse' | 'onContactDeleted' | 'onContactAdded' | 'onTokenWillExpire' | 'onTokenExpired' | 'onContactInvited' | 'onConnected' | 'onGroupChange' | 'onChatroomChange' | 'onContactChange';
export interface EventHandlerType {
    'onOpened'?: (msg: any) => any;
    'onPresence'?: (msg: OnPresenceMsg) => any;
    'onTextMessage'?: (msg: TextMsgBody) => any;
    'onImageMessage'?: (msg: ImgMsgBody) => any;
    'onAudioMessage'?: (msg: AudioMsgBody) => any;
    'onVideoMessage'?: (msg: VideoMsgBody) => any;
    'onFileMessage'?: (msg: FileMsgBody) => any;
    'onLocationMessage'?: (msg: LocationMsgBody) => any;
    'onCmdMessage'?: (msg: CmdMsgBody) => any;
    'onCustomMessage'?: (msg: CustomMsgBody) => any;
    'onReceivedMessage'?: (msg: ReceivedMsgBody) => any;
    'onDeliverdMessage'?: (msg: DeliveryMsgBody) => any;
    'onReadMessage'?: (msg: ReadMsgBody) => any;
    'onRecallMessage'?: (msg: RecallMsgBody) => any;
    'onMutedMessage'?: (msg: MuteMsgBody) => any;
    'onChannelMessage'?: (msg: ChannelMsgBody) => any;
    'onError'?: (error: ErrorEvent) => any;
    'onOffline'?: (msg: any) => any;
    'onOnline'?: (msg: any) => any;
    'onRoster'?: (rosters: RosterData[]) => any;
    'onStatisticMessage'?: (msg: any) => any;
    'onContactAgreed'?: (msg: ContactMsgBody) => any;
    'onContactRefuse'?: (msg: ContactMsgBody) => any;
    'onContactDeleted'?: (msg: ContactMsgBody) => any;
    'onContactAdded'?: (msg: ContactMsgBody) => any;
    'onTokenWillExpire'?: (msg: any) => any;
    'onTokenExpired'?: (msg: any) => any;
    'onContactInvited'?: (msg: any) => any;
    'onConnected'?: () => any;
    'onGroupChange'?: (msg: any) => any;
    'onChatroomChange'?: (msg: any) => any;
    'onContactChange'?: (msg: any) => any;
}
declare interface HandlerData {
    [key: string]: EventHandlerType;
}
declare class EventHandler {
    handlerData: HandlerData;
    addEventHandler: (eventHandlerId: string, eventHandler: EventHandlerType) => void;
    removeEventHandler: (eventHandlerId: string) => void;
    protected dispatch: (event: Event, ...args: any[]) => void;
}

declare let EasemobChat: {
    connection: typeof Connection;
    message: typeof Message;
    utils: Utils;
    logger: Logger;
    statusCode: typeof Code;
};

/**
 * The connection module is the module where the SDK creates long link, And all about links, friends, groups, and chat apis are  all in this module
 *
 * @module connection
 */

declare interface ConnectionParameters {
    apiUrl?: string;
    url?: string;
    isDebug?: boolean;
    isHttpDNS?: boolean;
    heartBeatWait?: number;
    appKey: string;
    deviceId?: string;
    useOwnUploadFun?: boolean;
    autoReconnectNumMax?: number;
}
declare interface RegisterUserParameters {
    username: string;
    password: string;
    nickname: string;
    success?: (res: any) => any;
    error?: (err: ErrorEvent) => any;
    apiUrl?: string;
}
declare interface LoginParameters {
    user: string;
    pwd: string;
    accessToken?: string;
    agoraToken?: string;
    success?: (res: any) => any;
    error?: (res: any) => any;
}
declare interface Host {
    protocol: string;
    domain: string;
    ip: string;
    port: string;
}

declare interface SendMsgResult {
    localMsgId: string, // local message id
    srverMsgId: string // server message id
}
/**
 * @category Connection
 */
declare class Connection {
    isDebug: boolean;
    isHttpDNS: boolean;
    heartBeatWait: number;
    appKey: string;
    /** @hidden */
    appName: string;
    /** @hidden */
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

    eventHandler?: EventHandler;
    onOpened?: () => any;
    /**
     * @since 3.0
     * @deprecated 4.0
     */
    onPresence?: (msg: PresenceMsg) => any;
    onTextMessage?: (msg: TextMsgBody) => any;
    onPictureMessage?: (msg: ImgMsgBody) => any;
    onAudioMessage?: (msg: AudioMsgBody) => any;
    onVideoMessage?: (msg: VideoMsgBody) => any;
    onFileMessage?: (msg: FileMsgBody) => any;
    onLocationMessage?: (msg: LocationMsgBody) => any;
    onCmdMessage?: (msg: CmdMsgBody) => any;
    onCustomMessage?: (msg: CustomMsgBody) => any;
    onReceivedMessage?: (msg: ReceivedMsgBody) => any;
    onDeliverdMessage?: (msg: DeliveryMsgBody) => any;
    onReadMessage?: (msg: ReadMsgBody) => any;
    onRecallMessage?: (msg: RecallMsgBody) => any;
    onMutedMessage?: (msg: MuteMsgBody) => any;
    onChannelMessage?: (msg: ChannelMsgBody) => any;
    onError?: (error: ErrorEvent) => any;
    onOffline?: () => any;
    onOnline?: () => any;
    onRoster?: (rosters: RosterData[]) => any;
    onStatisticMessage?: (msg: any) => any;
    onCreateGroup?: (data: any) => any;
    onBlacklistUpdate?: (list: {
        [key: string]: {
            name: string;
        };
    }) => any;
    onContactAgreed?: (msg: ContactMsgBody) => any;
    onContactRefuse?: (msg: ContactMsgBody) => any;
    onContactDeleted?: (msg: ContactMsgBody) => any;
    onContactAdded?: (msg: ContactMsgBody) => any;
    onTokenWillExpire?: () => any;
    onTokenExpired?: () => any;
    /** @hidden */
    [key: string]: any;
    constructor(options: ConnectionParameters);

    registerUser(this: Connection, params: RegisterUserParameters): Promise<any>;
    open(parameters: LoginParameters): void;
    isOpened(): boolean;
    close(): void;

    getChatToken(agoraToken: string): Promise<any>;

    reconnect(): void;
    /** send message */
    send(params: MessagesType): Promise<SendMsgResult>;

    // ChatRoom API
    getChatRooms(this: Connection, params: GetChatRoomsParams): Promise<Object>;
    createChatRoom(this: Connection, params: CreateChatRoomParams): Promise<Object>;
    destroyChatRoom(this: Connection, params: DestroyChatRoomParams): Promise<Object>;
    getChatRoomDetails(this: Connection, params: GetChatRoomDetailsParams): Promise<Object>;
    modifyChatRoom(this: Connection, params: ModifyChatRoomParams): Promise<Object>;
    removeSingleChatRoomMember(this: Connection, params: RemoveSingleChatRoomMemberParams): Promise<Object>;
    removeMultiChatRoomMember(this: Connection, params: RemoveMultiChatRoomMemberParams): Promise<Object>;
    addUsersToChatRoom(this: Connection, params: AddUsersToChatRoomParams): Promise<Object>;
    joinChatRoom(this: Connection, params: JoinChatRoomParams): Promise<Object>;
    quitChatRoom(this: Connection, params: QuitChatRoomParams): Promise<Object>;
    listChatRoomMember(this: Connection, params: ListChatRoomMemberParams): Promise<Object>;
    getChatRoomAdmin(this: Connection, params: GetChatRoomAdminParams): Promise<Object>;
    setChatRoomAdmin(this: Connection, params: SetChatRoomAdminParams): Promise<Object>;
    removeChatRoomAdmin(this: Connection, params: RemoveChatRoomAdminParams): Promise<Object>;
    muteChatRoomMember(this: Connection, params: MuteChatRoomMemberParams): Promise<Object>;
    removeMuteChatRoomMember(this: Connection, params: RemoveMuteChatRoomMemberParams): Promise<Object>;
    getChatRoomMuted(this: Connection, params: GetChatRoomMutedParams): Promise<Object>;
    chatRoomBlockSingle(this: Connection, params: ChatRoomBlockSingleParams): Promise<Object>;
    chatRoomBlockMulti(this: Connection, params: ChatRoomBlockMultiParams): Promise<Object>;
    removeChatRoomBlockSingle(this: Connection, params: RemoveChatRoomBlockSingleParams): Promise<Object>;
    removeChatRoomBlockMulti(this: Connection, params: RemoveChatRoomBlockMultiParams): Promise<Object>;
    getChatRoomBlacklistNew(this: Connection, params: GetChatRoomBlacklistNewParams): Promise<Object>;
    disableSendChatRoomMsg(this: Connection, params: DisableSendChatRoomMsgParams): Promise<Object>;
    enableSendChatRoomMsg(this: Connection, params: EnableSendChatRoomMsgParams): Promise<Object>;
    addUsersToChatRoomWhitelist(this: Connection, params: AddUsersToChatRoomWhitelistParams): Promise<Object>;
    rmUsersFromChatRoomWhitelist(this: Connection, params: RmUsersFromChatRoomWhitelistParams): Promise<Object>;
    getChatRoomWhitelist(this: Connection, params: GetChatRoomWhitelistParams): Promise<Object>;
    isChatRoomWhiteUser(this: Connection, params: IsChatRoomWhiteUserParams): Promise<Object>;
    fetchChatRoomAnnouncement(this: Connection, params: FetchChatRoomAnnouncementParams): Promise<Object>;
    updateChatRoomAnnouncement(this: Connection, params: UpdateChatRoomAnnouncementParams): Promise<Object>;
    uploadChatRoomSharedFile(this: Connection, params: UploadChatRoomSharedFileParams): void;
    deleteChatRoomSharedFile(this: Connection, params: DeleteChatRoomSharedFileParams): Promise<Object>;
    fetchChatRoomSharedFileList(this: Connection, params: FetchChatRoomSharedFileListParams): Promise<Object>;

    // Group API
    createGroupNew(this: Connection, params: CreateGroupNewParams): Promise<Object>;
    blockGroup(this: Connection, params: BlockGroupParams): Promise<Object>;
    listGroups(this: Connection, params: ListGroupsParams): Promise<Object>;
    getGroup(this: Connection, params?: BaseApiParams): Promise<Object>;
    changeOwner(this: Connection, params: ChangeOwnerParams): Promise<Object>;
    getGroupInfo(this: Connection, params: GetGroupInfoParams): Promise<Object>;
    modifyGroup(this: Connection, params: ModifyGroupParams): Promise<Object>;
    listGroupMember(this: Connection, params: ListGroupMemberParams): Promise<Object>;
    getGroupAdmin(this: Connection, params: GetGroupAdminParams): Promise<Object>;
    setAdmin(this: Connection, params: SetAdminParams): Promise<Object>;
    removeAdmin(this: Connection, params: RemoveAdminParams): Promise<Object>;
    dissolveGroup(this: Connection, params: DissolveGroupParams): Promise<Object>;
    quitGroup(this: Connection, params: QuitGroupParams): Promise<Object>;
    inviteToGroup(this: Connection, params: InviteToGroupParams): Promise<Object>;
    joinGroup(this: Connection, params: JoinGroupParams): Promise<Object>;
    agreeJoinGroup(this: Connection, params: AgreeJoinGroupParams): Promise<Object>;
    rejectJoinGroup(this: Connection, params: RejectJoinGroupParams): Promise<Object>;
    agreeInviteIntoGroup(this: Connection, params: AgreeInviteIntoGroupParams): Promise<Object>;
    rejectInviteIntoGroup(this: Connection, params: RejectInviteIntoGroupParams): Promise<Object>;
    removeSingleGroupMember(this: Connection, params: RemoveSingleGroupMemberParams): Promise<Object>;
    removeMultiGroupMember(this: Connection, params: RemoveMultiGroupMemberParams): Promise<Object>;
    mute(this: Connection, params: MuteParams): Promise<Object>;
    removeMute(this: Connection, params: RemoveMuteParams): Promise<Object>;
    getMuted(this: Connection, params: GetMutedParams): Promise<Object>;
    groupBlockSingle(this: Connection, params: GroupBlockSingleParams): Promise<Object>;
    groupBlockMulti(this: Connection, params: GroupBlockMultiParams): Promise<Object>;
    removeGroupBlockSingle(this: Connection, params: RemoveGroupBlockSingleParams): Promise<Object>;
    removeGroupBlockMulti(this: Connection, params: RemoveGroupBlockMultiParams): Promise<Object>;
    getGroupBlacklistNew(this: Connection, params: GetGroupBlacklistNew): Promise<Object>;
    disableSendGroupMsg(this: Connection, params: DisableSendGroupMsgParams): Promise<Object>;
    enableSendGroupMsg(this: Connection, params: EnableSendGroupMsgParams): Promise<Object>;
    addUsersToGroupWhitelist(this: Connection, params: AddUsersToGroupWhitelistParams): Promise<Object>;
    rmUsersFromGroupWhitelist(this: Connection, params: RmUsersFromGroupWhitelistParams): Promise<Object>;
    getGroupWhitelist(this: Connection, params: GetGroupWhitelistParams): Promise<Object>;
    isGroupWhiteUser(this: Connection, params: IsGroupWhiteUserParams): Promise<Object>;
    getGroupMsgReadUser(this: Connection, params: GetGroupMsgReadUserParams): Promise<Object>;
    fetchGroupAnnouncement(this: Connection, params: FetchGroupAnnouncementParams): Promise<Object>;
    updateGroupAnnouncement(this: Connection, params: UpdateGroupAnnouncementParams): Promise<Object>;
    uploadGroupSharedFile(this: Connection, params: UploadGroupSharedFileParams): void;
    deleteGroupSharedFile(this: Connection, params: DeleteGroupSharedFileParams): Promise<Object>;
    fetchGroupSharedFileList(this: Connection, params: FetchGroupSharedFileListParams): Promise<Object>;

    // Contact API
    getBlacklist(this: Connection, params?: BaseApiParams): Promise<Object>;
    getRoster(this: Connection, params?: BaseApiParams): Promise<Object>;
    uploadToken(this: Connection, params: UploadTokenParams): Promise<Object>;
    getSessionList(this: Connection, params?: BaseApiParams): Promise<Object>;
    updateOwnUserInfo(this: Connection, params: UpdateOwnUserInfoParams | ConfigurableKey, value?: any): Promise<Object>;
    fetchUserInfoById(this: Connection, userId: string | string[], properties: ConfigurableKey[] | ConfigurableKey): Promise<Object>;
    updateCurrentUserNick(this: Connection, nick: string): Promise<Object>;
    getChatToken(this: Connection, agoraToken: string): Promise<Object>;
    fetchHistoryMessages(this: Connection, options: FetchHistoryMsgsParams): Promise<any>;
    addContact(this: Connection, to: string, message?: string): Promise<Object>;
    deleteContact(this: Connection, to: string): Promise<Object>;
    acceptInvitation(this: Connection, to: string): Promise<Object>;
    declineInvitation(this: Connection, to: string): Promise<Object>;
    addToBlackList(this: Connection, options: UserBlackListParams): Promise<Object>;
    removeFromBlackList(this: Connection, options: UserBlackListParams): Promise<Object>;
    /** @deprecated*/
    subscribe(this: Connection, options: SubscribeParams): void;
    /** @deprecated*/
    subscribed(this: Connection, options: SubscribeParams): void;
    /** @deprecated*/
    unsubscribed(this: Connection, options: SubscribeParams): void;
    /** @deprecated*/
    removeRoster(this: Connection, options: SubscribeParams): void;

    recallMessage(this: Connection, option: RecallMessageParams): void;

    // listen @since 3.0
    listen(this: Connection, parameters: ListenParameters): void;

    // eventHandler @since 4.0
    addEventHandler(id: string, handler: EventHandlerType): void { }
    removeEventHandler(id: string): void { }
}


/**
* This is the doc comment for file1.ts (can be delete)
*
* Specify this is a module comment and rename it to my-module:
* @module eventHandler
*/

declare type DispatchParameters = MessagesType | OnPresenceMsg | RosterData | ErrorEvent | MuteMsgBody | ReceivedMsgBody | RecallMsgBody | ChannelMsgBody;
declare class EventHandler {
    handlerData: HandlerData;
    constructor(Connection: any, eventHandlerId: string, eventHandler: EventHandlerType);
    addEventHandler(eventHandlerId: string, eventHandler: EventHandlerType): void;
    removeEventHandler(eventHandlerId: string): void;
    /** @hidden */
    dispatch(this: EventHandler, event: Event, parameters?: DispatchParameters): void;
}

/**
 * @module listen
 */
declare interface ListenParameters {
    onOpened?: () => any;
    onPresence?: (msg: PresenceMsg) => any;
    onTextMessage?: (msg: TextMsgBody) => any;
    onPictureMessage?: (msg: ImgMsgBody) => any;
    onAudioMessage?: (msg: AudioMsgBody) => any;
    onVideoMessage?: (msg: VideoMsgBody) => any;
    onFileMessage?: (msg: FileMsgBody) => any;
    onLocationMessage?: (msg: LocationMsgBody) => any;
    onCmdMessage?: (msg: CmdMsgBody) => any;
    onCustomMessage?: (msg: CustomMsgBody) => any;
    onReceivedMessage?: (msg: ReceivedMsgBody) => any;
    onDeliverdMessage?: (msg: DeliveryMsgBody) => any;
    onReadMessage?: (msg: ReadMsgBody) => any;
    onRecallMessage?: (msg: RecallMsgBody) => any;
    onMutedMessage?: (msg: MuteMsgBody) => any;
    onChannelMessage?: (msg: ChannelMsgBody) => any;
    onError?: (error: ErrorEvent) => any;
    onOffline?: () => any;
    onOnline?: () => any;
    onRoster?: (rosters: RosterData[]) => any;
    onStatisticMessage?: () => any;
    onCreateGroup?: () => any;
    onBlacklistUpdate?: () => any;
    onContactAgreed?: (msg: ContactMsgBody) => any;
    onContactRefuse?: (msg: ContactMsgBody) => any;
    onContactDeleted?: (msg: ContactMsgBody) => any;
    onContactAdded?: (msg: ContactMsgBody) => any;
    onTokenWillExpire?: () => any;
    onTokenExpired?: () => any;
    onClosed?: () => any;
}

declare class ErrorEvent {
    type: Code;
    message: string;
    data?: any;
    constructor(parameters: ErrorParameters);
    static create(parameters: ErrorParameters): ErrorEvent;
}

// Logger
declare type DefaultLevel = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'SILENT';
declare type LevelNum = 0 | 1 | 2 | 3 | 4 | 5;
declare type Level = DefaultLevel | LevelNum;
declare enum Levels {
    "TRACE" = 0,
    "DEBUG" = 1,
    "INFO" = 2,
    "WARN" = 3,
    "ERROR" = 4,
    "SILENT" = 5
}
declare interface Config {
    useCache: boolean;
    maxCache: number;
    color: string;
    background: string;
}
declare class Logger {
    name: string;
    currentLevel: LevelNum;
    useCookiePersist: boolean;
    storageLogLevelKey: string;
    levels: typeof Levels;
    logMethods: string[];
    methodFactory: any;
    logs: string[];
    config: Config;
    logBytes: number;
    [key: string]: any;
    constructor(name: string, defaultLevel: Level, factory?: any);
    setConfig(cofig: Config): void;
    /**
     * get current log level
     */
    getLevel(): LevelNum;
    /**
     * set log level, level: 0-5
     */
    setLevel(level: Level, persist: boolean, name: string): "No console available for logging" | undefined;
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
    _bindMethod(obj: any, methodName: string, useCache: boolean): any;
    getTime(): string;
    _cacheLog(...rest: any[]): void;
    _cacheLogCall(log: any): void;
    _getPersistedLevel(): any;
    _persistLevel(levelNum: number): void;
    replaceLoggingMethods(level: LevelNum, loggerName: string): void;
    defaultMethodFactory(methodName: string, level: LevelNum, loggerName: string): any;
    realMethod(methodName: string): any;
    enableLoggingWhenConsoleArrives(methodName: string, level: LevelNum, loggerName: string): () => void;
}
declare const defaultLogger: Logger;



declare type MessageSetParameters = ReadMsgSetParameters | DeliveryMsgSetParameters | ChannelMsgSetParameters | TextMsgSetParameters | CmdMsgSetParameters | CustomMsgSetParameters | LocationMsgSetParameters | ImgMsgSetParameters | AudioMsgSetParameters | VideoMsgSetParameters | FileMsgSetParameters;
interface CreateOldMsgOpt {
    type: MessageType;
    id: string;
    version: '3.0';
}
declare type CreateMsgType = TextMsgBody | CreateImgOps | CmdMsgBody | FileMsgBody | VideoMsgBody | CustomMsgBody | LocationMsgBody | ChannelMsgBody | DeliveryMsgBody | ReadMsgBody | AudioMsgBody

export declare class Message {
    id: string;
    body: any;
    constructor(type: MessageType, id?: string);
    createOldMsg(options: any): any;
    static create(options: CreateMsgType): CreateMsgType;
    set(options: MessageSetParameters): void;
}


declare interface KVString {
    [key: string]: string;
}
declare interface AjaxOptions {
    url: string;
    dataType?: string;
    type?: string;
    data?: any;
    headers?: KVString;
    responseType?: "arraybuffer" | "blob" | "document" | "json" | "text";
    mimeType?: string;
    success?: (res: any) => any;
    error?: (res: any) => any;
}
declare enum PLATFORM {
    WEB = "web",
    WX = "wx",
    ZFB = "zfb",
    TT = "tt",
    BAIDU = "baidu",
    QUICK_APP = "quick_app",
    UNI = "uni"
}
interface EnvInfo {
    platform: PLATFORM;
    global: any;
}
interface uri {
    url: string;
    filename: string;
    filetype: string;
    data: File | null;
}
declare interface UploadFile {
    onFileUploadProgress?: (msg: any) => any;
    onFileUploadComplete?: (msg: any) => any;
    onFileUploadError?: (msg: any) => any;
    onFileUploadCanceled?: (msg: any) => any;
    accessToken: string;
    appKey: string;
    apiUrl: string;
    uploadUrl?: string;
    file: any;
}
declare interface DownloadParams {
    onFileDownloadComplete: (data: any) => any;
    onFileDownloadError: (error: any) => any;
    id: string;
    secret: string;
    [key: string]: any;
}
declare type Fns = (...args: any) => any;
interface Utils {
    autoIncrement: number;
    getUniqueId: () => string;
    ajax: (options: AjaxOptions) => PromiseResult<any>;
    getFileUrl: (fileInputId: string | HTMLInputElement) => uri;
    uploadFile: (options: UploadFile) => void;
    flow: (fns: Fns[]) => any;
    listenNetwork: (online: () => any, offline: () => any) => void;
    getEnvInfo: () => EnvInfo;
    wxRequest: (options: AjaxOptions) => PromiseResult<any>;
    parseDownloadResponse: (res: any) => string;
    download: (params: DownloadParams) => any;
}

declare enum Code {
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
    WEBIM_CONNCTION_USER_REMOVED = 207,
    WEBIM_CONNCTION_USER_LOGIN_ANOTHER_DEVICE = 206,
    WEBIM_CONNCTION_USER_KICKED_BY_CHANGE_PASSWORD = 216,
    WEBIM_CONNCTION_USER_KICKED_BY_OTHER_DEVICE = 217,
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
    WEBIM_UPLOADFILE_BROWSER_ERROR = 100,
    WEBIM_UPLOADFILE_ERROR = 101,
    WEBIM_UPLOADFILE_NO_LOGIN = 102,
    WEBIM_UPLOADFILE_NO_FILE = 103,
    WEBIM_DOWNLOADFILE_ERROR = 200,
    WEBIM_DOWNLOADFILE_NO_LOGIN = 201,
    WEBIM_DOWNLOADFILE_BROWSER_ERROR = 202,
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
    GROUP_NOT_EXIST = 605,
    GROUP_NOT_JOINED = 602,
    MESSAGE_RECALL_TIME_LIMIT = 504,
    SERVICE_NOT_ENABLED = 505,
    SERVICE_NOT_ALLOW_MESSAGING = 506,
    SERVICE_NOT_ALLOW_MESSAGING_MUTE = 507,
    SERVER_UNKNOWN_ERROR = 503,
    MESSAGE_INCLUDE_ILLEGAL_CONTENT = 501,
    MESSAGE_EXTERNAL_LOGIC_BLOCKED = 502,
    PERMISSION_DENIED = 603,
    WEBIM_LOAD_MSG_ERROR = 604,
    REST_PARAMS_STATUS = 700,
    SDK_RUNTIME_ERROR = 999
}

export {
    EasemobChat, Code, Utils, Connection, DispatchParameters, EventHandler,
    listen, ErrorEvent, DefaultLevel,
    LevelNum, Level, Levels, Config, Logger,
    Message, MessageSetParameters, CreateMsgType,
    PLATFORM, Fns, ConnectionParameters, RegisterUserParameters,
    LoginParameters, Host, ListenParameters, AudioMsgSetParameters,
    AudioMsgBody, ChannelMsgSetParameters, ChannelMsgBody, CmdMsgSetParameters, CmdMsgBody, CustomMsgSetParameters, CustomMsgBody, DeliveryMsgSetParameters,
    DeliveryMsgBody, FileMsgSetParameters, FileMsgBody, CreateOldMsgOpt, LocationMsgSetParameters, LocationMsgBody, ReadMsgSetParameters, TextMsgSetParameters, TextMsgBody, VideoMsgSetParameters, VideoMsgBody, KVString, AjaxOptions, uri, UploadFile, DownloadParams
}


// types / message

declare type MessageType = 'read' | 'delivery' | 'channel' | 'txt' | 'cmd' | 'custom' | 'loc' | 'img' | 'audio' | 'file' | 'video';

declare type ChatType = 'singleChat' | 'groupChat' | 'chatRoom';

declare interface ReadMsgSetParameters {
    ackId: string;
    to: string;
    from?: string;
}
declare interface ReadParameters {
    type: 'read';
    id?: string;
    to: string;
    from?: string;
    body?: ReadMsgSetParameters | undefined;
}
declare interface DeliveryMsgSetParameters {
    ackId?: string;
    to: string;
    from?: string;
}
declare interface DeliveryMsgBody extends DeliveryMsgSetParameters {
    id?: string;
    type: 'delivery';
    mid: string;
}
declare interface ChannelMsgSetParameters {
    chatType: ChatType;
    to: string;
    from?: string;
}
declare interface ChannelMsgBody extends ChannelMsgSetParameters {
    id?: string;
    type: 'channel';
}
declare interface TextMsgSetParameters {
    chatType: ChatType;
    to: string;
    msg: string;
    from?: string;
    roomType?: boolean;
    success?: () => any;
    fail?: () => any;
    ext?: {
        [key: string]: any;
    };
    time?: number;
    msgConfig?: {
        [key: string]: any;
    };
}
declare interface TextMsgBody extends TextMsgSetParameters {
    id?: string;
    type: 'txt';
}
declare interface CmdMsgSetParameters {
    chatType: ChatType;
    to: string;
    action: string;
    from?: string;
    roomType?: boolean;
    success?: () => any;
    fail?: () => any;
    ext?: {
        [key: string]: any;
    };
    time?: number;
    msgConfig?: {
        [key: string]: any;
    };
}
declare interface CmdMsgBody extends CmdMsgSetParameters {
    id?: string;
    type: 'cmd';
}
declare interface CustomMsgSetParameters {
    chatType: ChatType;
    to: string;
    customEvent: string;
    customExts: {
        [key: string]: any;
    };
    from?: string;
    roomType?: boolean;
    success?: () => any;
    fail?: () => any;
    ext?: {
        [key: string]: any;
    };
    time?: number;
    msgConfig?: {
        [key: string]: any;
    };
}
declare interface CustomMsgBody extends CustomMsgSetParameters {
    id?: string;
    type: 'custom';
    params: {
        [key: string]: any;
    };
}
declare interface LocationMsgSetParameters {
    chatType: ChatType;
    to: string;
    addr: string;
    lat: number;
    lng: number;
    from?: string;
    roomType?: boolean;
    success?: () => any;
    fail?: () => any;
    ext?: {
        [key: string]: any;
    };
    time?: number;
    msgConfig?: {
        [key: string]: any;
    };
}
declare interface LocationMsgBody extends LocationMsgSetParameters {
    id?: string;
    type: 'loc';
}
declare interface File {
    url: string;
    filetype: string;
    filename: string;
    data: any;
}
declare interface ImgMsgSetParameters {
    chatType: ChatType;
    to: string;
    file: File;
    width?: number;
    height?: number;
    fileInputId?: string;
    from?: string;
    roomType?: boolean;
    group?: string;
    success?: () => any;
    fail?: () => any;
    ext?: {
        [key: string]: any;
    };
    url?: string;
    onFileUploadError?: (error: any) => any;
    onFileUploadComplete?: (data: any) => any;
    onFileUploadProgress?: (data: any) => any;
    uploadError?: () => any;
    uploadComplete?: () => any;
    msgConfig?: {
        [key: string]: any;
    };
    body?: {
        url: string;
        type: string;
        filename: string;
    };
}
declare interface ImgMsgBody extends ImgMsgSetParameters {
    id?: string;
    type: 'img';
    time: number;
    secret?: string;
    thumb?: string;
    thumb_secret?: string;
}
declare interface CreateImgOps {
    type: 'img';
    chatType: ChatType;
    file: File;
    url?: string;
    width?: number;
    height?: number;
    to: string;
    onFileUploadError?: (error: any) => any;
    onFileUploadComplete?: (data: any) => any;
    onFileUploadProgress?: (data: any) => any;
    uploadError?: () => any;
    uploadComplete?: () => any;
    time?: number;
    ext?: {
        [key: string]: any;
    };
    msgConfig?: {
        [key: string]: any;
    };
}
declare interface AudioMsgSetParameters {
    chatType: ChatType;
    file: File;
    filename: string;
    length: number;
    file_length: number;
    fileInputId?: string;
    to: string;
    from?: string;
    roomType?: boolean;
    success?: () => any;
    fail?: () => any;
    ext?: {
        [key: string]: any;
    };
    time?: number;
    apiUrl: string;
    onFileUploadError?: () => any;
    onFileUploadComplete: () => any;
    onFileUploadProgress?: () => any;
    msgConfig?: {
        [key: string]: any;
    };
}
declare interface AudioMsgBody {
    id?: string;
    type: 'audio';
    chatType: ChatType;
    url: string;
    length: number;
    to: string;
    from: string;
    secret: string;
    file: any;
    filename: string;
    file_length: number;
    filetype: string;
    accessToken: string;
    time?: number;
    ext?: {
        [key: string]: any;
    };
    msgConfig?: {
        [key: string]: any;
    };
}
declare interface VideoMsgSetParameters {
    chatType: ChatType;
    file: File;
    filename: string;
    length: number;
    file_length: number;
    fileInputId?: string;
    to: string;
    from?: string;
    roomType?: boolean;
    success?: () => any;
    fail?: () => any;
    ext?: {
        [key: string]: any;
    };
    time?: number;
    apiUrl: string;
    onFileUploadError?: () => any;
    onFileUploadComplete: () => any;
    onFileUploadProgress?: () => any;
    msgConfig?: {
        [key: string]: any;
    };
}
declare interface VideoMsgBody {
    id?: string;
    type: 'video';
    chatType: ChatType;
    url: string;
    length: number;
    to: string;
    from: string;
    secret: string;
    filename: string;
    file: any;
    file_length: number;
    filetype: string;
    accessToken: string;
    time?: number;
    ext?: {
        [key: string]: any;
    };
    msgConfig?: {
        [key: string]: any;
    };
    onFileUploadCompletets?: (data: any) => any;
}
declare interface FileMsgSetParameters {
    chatType: ChatType;
    file: File;
    filename: string;
    fileInputId?: string;
    to: string;
    from?: string;
    roomType?: boolean;
    success?: () => any;
    fail?: () => any;
    ext?: {
        [key: string]: any;
    };
    time?: number;
    apiUrl: string;
    onFileUploadError?: () => any;
    onFileUploadComplete: () => any;
    onFileUploadProgress?: () => any;
    msgConfig?: {
        [key: string]: any;
    };
}
declare interface FileMsgBody {
    id?: string;
    type: 'file';
    chatType: ChatType;
    from: string;
    to: string;
    url: string;
    secret: string;
    filename: string;
    length: number;
    file: any;
    file_length: number;
    filetype: string;
    accessToken: string;
    ext?: {
        [key: string]: any;
    };
    time: number;
    msgConfig?: {
        [key: string]: any;
    };
}
declare interface ReceivedMsgBody {
    id: string;
    mid: string;
    to: string;
    time: number;
}
declare interface ReadMsgBody {
    id?: string;
    ackId?: string;
    type: 'read';
    to: string;
    from?: string;
    mid?: string;
    groupReadCount?: number;
    ackContent?: string;
}
declare interface RecallMsgBody {
    id?: string;
    from: string;
    to: string;
    mid: string;
}
declare interface MuteMsgBody {
    mid: string;
}
declare interface ContactMsgBody {
    to: string;
    from: string;
    status: string;
    type: 'subscribed' | 'unsubscribed' | 'subscribe';
}
declare type MessagesType = TextMsgBody | DeliveryMsgBody | ChannelMsgBody | CmdMsgBody | CustomMsgBody | ImgMsgBody | LocationMsgBody | AudioMsgBody | VideoMsgBody | FileMsgBody | ReadMsgBody;
export { MessageType, ReadMsgSetParameters, ReadParameters, DeliveryMsgSetParameters, ChannelMsgSetParameters, TextMsgSetParameters, CmdMsgSetParameters, CustomMsgSetParameters, LocationMsgSetParameters, ImgMsgSetParameters, AudioMsgSetParameters, VideoMsgSetParameters, FileMsgSetParameters, ChatType, TextMsgBody, DeliveryMsgBody, ChannelMsgBody, CmdMsgBody, CustomMsgBody, ImgMsgBody, CreateImgOps, LocationMsgBody, AudioMsgBody, VideoMsgBody, FileMsgBody, ReceivedMsgBody, ReadMsgBody, RecallMsgBody, MuteMsgBody, ContactMsgBody, MessagesType };
