import Long from 'long';
var handleMessage = function(meta, status, conn){
	var self = conn;
	var messageBodyMessage = self.context.root.lookup("easemob.pb.MUCBody");
    var thirdMessage = messageBodyMessage.decode(meta.payload);
    var msgId = new Long(meta.id.low, meta.id.high, meta.id.unsigned).toString();
    var operation = thirdMessage.operation;

    function condition(operation){
        let info = {
            type: '',
            owner: thirdMessage.from.name,
            gid: thirdMessage.mucId.name,
            from: thirdMessage.from.name,
            fromJid: thirdMessage.from,
            to: thirdMessage.to.length?thirdMessage.to[0].name:'',
            toJid: thirdMessage.to,
            chatroom: thirdMessage.isChatroom,
            status: thirdMessage.status
        }

        return({
            28: () => {
                info.type = 'deleteFile';
                conn.onPresence(info);
            },
            27: () => {
                info.type = 'uploadFile';
                conn.onPresence(info);
            },
            26: () => {
                info.type = 'deleteAnnouncement';
                conn.onPresence(info);
            },
            25: () => {
                info.type = 'updateAnnouncement';
                conn.onPresence(info);
            },
            24: () => {
                info.type = 'removeMute';//解除禁言
                conn.onPresence(info);
            },
            23: () => {
                info.type = 'addMute';//禁言
                conn.onPresence(info);
            },
            22: () => {
                info.type = 'removeAdmin';//去除管理员
                conn.onPresence(info);
            },
            21: () => {
                info.type = 'addAdmin'; //成为管理员
                conn.onPresence(info);
            },
            20: () => {
                info.type = 'changeOwner'; //转让群组
                conn.onPresence(info);
            },
            19: () => {
                info.type = 'direct_joined'; //直接拉进群了
                conn.onPresence(info);
            },
            18: () => {
                info.type = thirdMessage.isChatroom ? 'leaveChatRoom' : 'leaveGroup';
                //info.type = 'absence'; //退出群了
                conn.onPresence(info);
            },
            17: () => {
                info.type = thirdMessage.isChatroom ? 'memberJoinChatRoomSuccess' : 'memberJoinPublicGroupSuccess';
                //info.type = 'presence'; // 有人进群了
                conn.onPresence(info);
            },
            16: () => {
                info.type = 'unblock';
                conn.onPresence(info);
            },
            15: () => {
                info.type = 'block';
                conn.onPresence(info);
            },
            14: () => {
                info.type = 'update';
                conn.onPresence(info);
            },
            13: () => {
                info.type = 'allow'; //移除黑名单
                info.reason = thirdMessage.reason;
                conn.onPresence(info);
            },
            12: () => {
                info.type = 'ban';
                conn.onPresence(info);
            },
            11: () => {
                info.type = 'getBlackList';
                conn.onPresence(info);
            },
            10: () => {
                info.type = 'removedFromGroup'; //被移出群 或者被加入黑名单
                info.kicked = info.to;
                conn.onPresence(info);
            },
            9: () => {
                info.type = 'invite_decline'; //拒绝加群邀请
                info.kicked = info.to;
                conn.onPresence(info);
            },
            8: () => {
                info.type = 'invite_accept'; //接受加群邀请
                info.kicked = info.to;
                conn.onPresence(info);
            },
            7: () => {
                info.type = 'invite'; //手机端邀请入群 "INVITE_ACCEPT": 8, "INVITE_DECLINE": 9,
                info.kicked = info.to;
                conn.onPresence(info);
            },
            6:  () => {
                info.type = 'joinPublicGroupDeclined'; //加群被拒绝
                conn.onPresence(info);
            },
            5: () => {
                info.type = 'joinPublicGroupSuccess'; //加群成功
                conn.onPresence(info);
            },
            4: () => {
                info.type = 'joinGroupNotifications'; //申请加群
                info.reason = thirdMessage.reason;
                conn.onPresence(info);
            },
            3: () => {
                info.type = 'leave';
                conn.onPresence(info);
            },
            2: () => {
                info.type = 'join';
                conn.onPresence(info);
            },
            1: () => {
                info.type = 'deleteGroupChat'; //群组解散
                conn.onPresence(info);
            },
            
        }[operation] || function(){
            console.log(`%c没有匹配${operation}类型`, 'background: green')
        })()
    }

    condition(operation)
}

export default handleMessage
