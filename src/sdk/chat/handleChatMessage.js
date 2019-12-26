import Long from 'long'
import _utils from '../utils'
import ChatMessage from './sendChatMessage';
import getCode from '../status';
const _code = getCode();
var sendDelivery = function(conn, msg ,msgId){
    if(conn.delivery && msg.from !== msg.to){
        var id = conn.getUniqueId();
        var deliverMessage = new WebIM.message('delivery', id);
        deliverMessage.set({
            ackId: msgId
            , to: msg.from
        });
        ChatMessage(deliverMessage.body, conn);
        // self.send(deliverMessage.body);
    }
}
var handleMessage = function(meta, status, conn){
    var self = conn;
    var time = new Long(meta.timestamp.low,meta.timestamp.high, meta.timestamp.unsigned).toString();
    var messageBodyMessage = self.context.root.lookup("easemob.pb.MessageBody");
    var thirdMessage = messageBodyMessage.decode(meta.payload);
    var msgId = new Long(meta.id.low, meta.id.high, meta.id.unsigned).toString();
    var ackMsgId = thirdMessage.ackMessageId ? new Long(thirdMessage.ackMessageId.low, thirdMessage.ackMessageId.high, thirdMessage.ackMessageId.unsigned).toString() : "";
    var type = null;
    if (thirdMessage.type === 1) {             //messagetype 群组/聊天室。。。。
        type = "chat";
    }
    else if (thirdMessage.type === 2) {
        type = "groupchat";
    }
    else if (thirdMessage.type === 3) {
        type = "chatroom";
    }
    else if(thirdMessage.type === 4){
        type = "read_ack";     //发送ack没写

        if(thirdMessage.msgConfig){
            conn.onReadMessage({
                mid: ackMsgId,
                groupReadCount: thirdMessage.ext[0]&&JSON.parse(thirdMessage.ext[0].stringValue),
                ackContent: thirdMessage.ackContent
            })
            return
        }
        conn.onReadMessage({
            mid: ackMsgId
        });
        return;
    }
    else if(thirdMessage.type === 5){
        type = "deliver_ack";
        conn.onDeliverdMessage({
            mid: ackMsgId
        });
        return;
    }
    else if(thirdMessage.type === 6){
        type = "recall";
        conn.onRecallMessage({     //需要增加一个回撤消息的监听
            mid: ackMsgId
        });
        return;
    }
    
    for (var i = 0; i < thirdMessage.contents.length; i++) {
        var msg = {};
        var errorBool = status.errorCode > 0;
        var errorCode = status.errorCode;
        var errorText = status.reason;
        var msgBody = thirdMessage.contents[i];
        var from = thirdMessage.from.name;
        var to = thirdMessage.to.name
        var extmsg = {};
        for(var k = 0; k < thirdMessage.ext.length; k++){
            if(thirdMessage.ext[k].type == 8){
                extmsg[thirdMessage.ext[k].key] = JSON.parse(thirdMessage.ext[k].stringValue);
            }
            else if(thirdMessage.ext[k].type == 7){
                extmsg[thirdMessage.ext[k].key] = thirdMessage.ext[k].stringValue;
            }
            else if(thirdMessage.ext[k].type == 6){
                extmsg[thirdMessage.ext[k].key] = thirdMessage.ext[k].doubleValue;
            }
            else if(thirdMessage.ext[k].type == 5){
                extmsg[thirdMessage.ext[k].key] = thirdMessage.ext[k].floatValue;
            }
            else if(thirdMessage.ext[k].type == 1 || thirdMessage.ext[k].type == 2 || thirdMessage.ext[k].type == 3 || thirdMessage.ext[k].type == 4){
                extmsg[thirdMessage.ext[k].key] = thirdMessage.ext[k].varintValue;
            }
        }
        try {
            switch(msgBody.type){                               //contentsType 为消息类型 txt、img。。。
                case 0:
                    var receiveMsg = thirdMessage.contents[i].text;
                    var emojibody = _utils.parseTextMessage(receiveMsg, WebIM.Emoji);
                    if (emojibody.isemoji) {
                        msg = {
                            id: msgId
                            , type: type
                            , from: from
                            , to: to
                            // , delay: parseMsgData.delayTimeStamp
                            , data: emojibody.body
                            , ext: extmsg
                            , time: time
                            , msgConfig: thirdMessage.msgConfig
                        };
                        !msg.delay && delete msg.delay;
                        !msg.msgConfig && delete thirdMessage.msgConfig;
                        msg.error = errorBool;
                        msg.errorText = errorText;
                        msg.errorCode = errorCode;
                        self.onEmojiMessage(msg);
                    }
                    else{
                        msg = {
                            id: msgId,
                            type: type,
                            from: from,
                            to: to,
                            data: msgBody.text,
                            ext: extmsg,
                            sourceMsg: msgBody.text,
                            time: time,
                            msgConfig: thirdMessage.msgConfig
                        }
                        !msg.msgConfig && delete thirdMessage.msgConfig;
                        msg.error = errorBool;
                        msg.errorText = errorText;
                        msg.errorCode = errorCode;
                        conn.onTextMessage(msg);
                    }
                    break;
            case 1:
                if (msgBody.size) {
                    var rwidth = msgBody.size.width || 0;
                    var rheight = msgBody.size.height || 0;
                }
                msg = {
                    id: msgId
                    , type: type
                    , from: from
                    , to: to
                    ,
                    url: msgBody.remotePath && self.apiUrl + msgBody.remotePath.substr(msgBody.remotePath.indexOf("/", 9))
                    , secret: msgBody.secretKey
                    , filename: msgBody.displayName
                    , thumb: msgBody.thumbnailRemotePath
                    , thumb_secret: msgBody.thumbnailSecretKey
                    , file_length: msgBody.fileLength || ''
                    , width: rwidth
                    , height: rheight
                    , filetype: msgBody.filetype || ''
                    , accessToken: conn.token || ''
                    , ext: extmsg
                    , time: time
                    , msgConfig: thirdMessage.msgConfig
                    // , delay: parseMsgData.delayTimeStamp
                };
                !msg.delay && delete msg.delay;
                !msg.msgConfig && delete thirdMessage.msgConfig;
                msg.error = errorBool;
                msg.errorText = errorText;
                msg.errorCode = errorCode;
                conn.onPictureMessage(msg);
                break;
            case 2:
                msg = {
                    id: msgId
                    , type: type
                    , from: from
                    , to: to
                    ,
                    url: msgBody.remotePath && self.apiUrl + msgBody.remotePath.substr(msgBody.remotePath.indexOf("/", 9))
                    , secret: msgBody.secretKey
                    , filename: msgBody.displayName
                    , length: msgBody.duration || ''
                    , file_length: msgBody.fileLength || ''
                    , filetype: msgBody.filetype || ''
                    , accessToken: conn.token || ''
                    , ext: extmsg
                    , time: time
                    , msgConfig: thirdMessage.msgConfig
                    // , delay: parseMsgData.delayTimeStamp
                };
                !msg.delay && delete msg.delay;
                !msg.msgConfig && delete thirdMessage.msgConfig;
                msg.error = errorBool;
                msg.errorText = errorText;
                msg.errorCode = errorCode;
                conn.onVideoMessage(msg);
                break;
            case 3:
                msg = {
                    id: msgId
                    , type: type
                    , from: from
                    , to: to
                    , addr: msgBody.address
                    , lat: msgBody.latitude
                    , lng: msgBody.longitude
                    , ext: extmsg
                    , time: time
                    , msgConfig: thirdMessage.msgConfig
                    // , delay: parseMsgData.delayTimeStamp
                };
                !msg.delay && delete msg.delay;
                !msg.msgConfig && delete thirdMessage.msgConfig;
                msg.error = errorBool;
                msg.errorText = errorText;
                msg.errorCode = errorCode;
                conn.onLocationMessage(msg);
                break;
            case 4:
                msg = {
                    id: msgId
                    , type: type
                    , from: from
                    , to: to
                    ,
                    url: msgBody.remotePath && self.apiUrl + msgBody.remotePath.substr(msgBody.remotePath.indexOf("/", 9))
                    , secret: msgBody.secretKey
                    , filename: msgBody.displayName
                    , file_length: msgBody.fileLength || ''
                    , accessToken: conn.token || ''
                    , ext: extmsg
                    ,length: msgBody.duration
                    , time: time
                    , msgConfig: thirdMessage.msgConfig
                    // , delay: parseMsgData.delayTimeStamp
                };
                !msg.delay && delete msg.delay;
                !msg.msgConfig && delete thirdMessage.msgConfig;
                msg.error = errorBool;
                msg.errorText = errorText;
                msg.errorCode = errorCode;
                conn.onAudioMessage(msg);
                break;
            case 5:
                msg = {
                    id: msgId
                    , type: type
                    , from: from
                    , to: to
                    ,
                    url: msgBody.remotePath && self.apiUrl + msgBody.remotePath.substr(msgBody.remotePath.indexOf("/", 9))
                    , secret: msgBody.secretKey
                    , filename: msgBody.displayName
                    , file_length: msgBody.fileLength
                    , accessToken: conn.token || ''
                    , ext: extmsg
                    , time: time
                    , msgConfig: thirdMessage.msgConfig
                    // , delay: parseMsgData.delayTimeStamp
                };
                !msg.delay && delete msg.delay;
                !msg.msgConfig && delete thirdMessage.msgConfig;
                msg.error = errorBool;
                msg.errorText = errorText;
                msg.errorCode = errorCode;
                conn.onFileMessage(msg);
                break;
            case 6:
                msg = {
                    id: msgId
                    , from: from
                    , to: to
                    , action: msgBody.action
                    , ext: extmsg
                    , time: time
                    , msgConfig: thirdMessage.msgConfig
                    // , delay: parseMsgData.delayTimeStamp
                };
                !msg.msgConfig && delete thirdMessage.msgConfig;
                msg.error = errorBool;
                msg.errorText = errorText;
                msg.errorCode = errorCode;
                conn.onCmdMessage(msg);
                break;
            // default:
            //     break;
            }
        } catch (e) {
            conn.onError({
                type: _code.WEBIM_CONNCTION_CALLBACK_INNER_ERROR
                , data: e
            });
        }
        // msg.error = "";
        // msg.errorText = "";
        // msg.errorCode = "";
        thirdMessage.type === 1 && conn.delivery && sendDelivery(conn, msg, msgId);

        if (conn.delivery) {
            msg.message_type = type
            return msg
        }
    }
    
}

export default handleMessage
