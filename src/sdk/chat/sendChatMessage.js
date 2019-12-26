    import _utils from '../utils'

    var sendMessage = function(messageOption, conn){
        debugger
        var self = conn;
        console.log('conn>>',conn);
        
        var emptyMessage = [];
        var contentMessage = conn.context.root.lookup("easemob.pb.MessageBody.Content");
        console.log('contentMessage>>',contentMessage);
        var fifthMessage = contentMessage.decode(emptyMessage);
        console.log('fifthMessage>>',fifthMessage);
        switch(messageOption.type){
            case 'txt':
                fifthMessage.type = 0;
                fifthMessage.text = messageOption.msg;
                break;
            case 'img':
                fifthMessage.type = 1;
                fifthMessage.displayName = messageOption.body.filename;
                fifthMessage.remotePath = messageOption.body.url;
                fifthMessage.secretKey = messageOption.body.secret;
                fifthMessage.fileLength = messageOption.body.file_length;
                fifthMessage.size = messageOption.body.size;
                fifthMessage.thumbnailDisplayName = messageOption.body.filename;
                break;
            case 'video':
                fifthMessage.type = 2;
                fifthMessage.displayName = messageOption.body.filename;
                fifthMessage.remotePath = messageOption.body.url;
                fifthMessage.secretKey = messageOption.body.secret;
                fifthMessage.fileLength = messageOption.body.file_length;
                fifthMessage.duration = messageOption.body.length;
                fifthMessage.thumbnailDisplayName = messageOption.body.filename;
                break;
            case 'loc':
                fifthMessage.type = 3;
                fifthMessage.latitude = messageOption.lat;
                fifthMessage.longitude = messageOption.lng;
                fifthMessage.address = messageOption.addr;
                fifthMessage.latitude = messageOption.lat;
                break;
            case 'audio':
                fifthMessage.type = 4;
                fifthMessage.displayName = messageOption.body.filename;
                fifthMessage.remotePath = messageOption.body.url;
                fifthMessage.secretKey = messageOption.body.secret;
                fifthMessage.fileLength = messageOption.body.file_length;
                fifthMessage.duration = messageOption.body.length;
                fifthMessage.size = messageOption.body.size;
                fifthMessage.thumbnailDisplayName = messageOption.body.filename;
                break;
            case 'file':
                fifthMessage.type = 5;
                fifthMessage.displayName = messageOption.body.filename;
                fifthMessage.remotePath = messageOption.body.url;
                fifthMessage.secretKey = messageOption.body.secret;
                fifthMessage.fileLength = messageOption.body.file_length;
                fifthMessage.size = messageOption.body.size;
                fifthMessage.thumbnailDisplayName = messageOption.body.filename;
                break;
            case 'cmd':
                fifthMessage.type = 6;
                fifthMessage.action = messageOption.action;
                // fifthMessage.params = 
                break;
            // default:
            //     fifthMessage.type = 0;
            //     break;
        }
        var keyValueBody = conn.context.root.lookup("easemob.pb.KeyValue");
        var keyValueBodyArr = [];
        if(messageOption.ext){
            for(var key in messageOption.ext){
                var keyValueBodyMessage = keyValueBody.decode(emptyMessage);
                keyValueBodyMessage.key = key;
                if(typeof messageOption.ext[key] == "object"){
                    keyValueBodyMessage.type = 8;
                    keyValueBodyMessage.stringValue = JSON.stringify(messageOption.ext[key]);
                }
                else if(typeof messageOption.ext[key] == "string"){
                    keyValueBodyMessage.type = 7;
                    keyValueBodyMessage.stringValue = messageOption.ext[key];
                }
                else if(typeof messageOption.ext[key] == "boolean"){
                    keyValueBodyMessage.type = 1;
                    keyValueBodyMessage.varintValue = messageOption.ext[key];
                }
                else if(Number.isInteger(messageOption.ext[key])){
                    keyValueBodyMessage.type = 2;
                    keyValueBodyMessage.varintValue = messageOption.ext[key];
                }
                else{
                    keyValueBodyMessage.type = 6;
                    keyValueBodyMessage.doubleValue = messageOption.ext[key];
                }

                keyValueBodyArr.push(keyValueBodyMessage);
            }
        }
        var messageBody = conn.context.root.lookup("easemob.pb.MessageBody");
        var fourthMessage = messageBody.decode(emptyMessage);
        if(messageOption.type === "recall"){
            fourthMessage.type = 6;
            // fourthMessage.from = conn.context.jid;
            // fourthMessage.to = {
            //     appKey: conn.appKey,
            //     name: messageOption.to,
            //     domain: "easemob.com",
            //     // clientResource: conn.clientResource
            // }
            fourthMessage.from = {
                name: conn.context.jid.name
            };
            fourthMessage.to = {
                name: messageOption.to
            }
            fourthMessage.ackMessageId = messageOption.ackId;
        }
        else if(messageOption.type === "delivery"){   //目前为单聊的delivery
            fourthMessage.type = 5;
            // fourthMessage.from = conn.context.jid;
            // fourthMessage.to = {
            //     appKey: conn.appKey,
            //     name: messageOption.to,
            //     domain: "easemob.com",
            //     // clientResource: conn.clientResource
            // }
            fourthMessage.from = {
                name: conn.context.jid.name
            };
            fourthMessage.to = {
                name: messageOption.to
            }
            fourthMessage.ackMessageId = messageOption.ackId;
        }
        else if(messageOption.type === "read"){
            fourthMessage.type = 4;
            // fourthMessage.from = conn.context.jid;
            // fourthMessage.to = {
            //     appKey: conn.appKey,
            //     name: messageOption.to,
            //     domain: "easemob.com",
            //     // clientResource: conn.clientResource
            // }
            fourthMessage.from = {
                name: conn.context.jid.name
            };
            fourthMessage.to = {
                name: messageOption.to
            }
            fourthMessage.ackMessageId = messageOption.ackId;
            if(messageOption.msgConfig&&messageOption.group === "groupchat" && !messageOption.roomType){
                fourthMessage.msgConfig = messageOption.msgConfig;
                fourthMessage.ackContent = messageOption.ackContent
            }
        }
        else if(!messageOption.group && !messageOption.roomType){
            fourthMessage.type = 1;
            // fourthMessage.to = {
            //     appKey: conn.appKey,
            //     name: messageOption.to,
            //     domain: "easemob.com",
            //     // clientResource: conn.clientResource
            // }
            fourthMessage.from = {
                name: conn.context.jid.name
            };
            fourthMessage.to = {
                name: messageOption.to
            }
        }
        else if (messageOption.group === "groupchat" && !messageOption.roomType) {
            fourthMessage.type = 2;
            // fourthMessage.from = {
            //     appKey: conn.appKey,
            //     name: conn.user,
            //     domain: "conference.easemob.com",
            //     clientResource: conn.clientResource
            // };
            // fourthMessage.to = {
            //     appKey: conn.appKey,
            //     name: messageOption.to,
            //     domain: "conference.easemob.com",
            //     // clientResource: conn.clientResource
            // }
            fourthMessage.from = {
                name: conn.context.jid.name
            };
            fourthMessage.to = {
                name: messageOption.to
            }
            if(messageOption.msgConfig){
                fourthMessage.msgConfig = messageOption.msgConfig;
            }

        }
        else if (messageOption.group === "groupchat" && messageOption.roomType) {
            fourthMessage.type = 3;
            // fourthMessage.from = {
            //     appKey: conn.appKey,
            //     name: conn.user,
            //     domain: "conference.easemob.com",
            //     clientResource: conn.clientResource
            // };
            // fourthMessage.to = {
            //     appKey: conn.appKey,
            //     name: messageOption.to,
            //     domain: "conference.easemob.com",
            //     // clientResource: conn.clientResource
            // }
            fourthMessage.from = {
                name: conn.context.jid.name
            };
            fourthMessage.to = {
                name: messageOption.to
            }
        }
        fourthMessage.contents = [fifthMessage];
        fourthMessage.ext = keyValueBodyArr;

        fourthMessage = messageBody.encode(fourthMessage).finish();
        var MetaMessage = conn.context.root.lookup("easemob.pb.Meta");
        var thirdMessage = MetaMessage.decode(emptyMessage);
        thirdMessage.id = messageOption.id;
        if(messageOption.type === "recall"){
            thirdMessage.from = conn.context.jid;
            var domain = "easemob.com"
            if (messageOption.group === 'groupchat' || messageOption.group === 'chatroom') {
                domain = 'conference.easemob.com'
            }
            thirdMessage.to = {
                appKey: conn.appKey,
                name: messageOption.to,
                domain: domain,
                // clientResource: conn.clientResource
            }
        }
        else if(messageOption.type === "delivery"){   //目前为单聊的delivery
            thirdMessage.from = conn.context.jid;
            thirdMessage.to = {
                appKey: conn.appKey,
                name: messageOption.to,
                domain: "easemob.com",
                // clientResource: conn.clientResource
            }
        }
        else if(messageOption.type === "read"){   //目前为单聊的read
            thirdMessage.from = conn.context.jid;
            var domain = "easemob.com"
            if (messageOption.group === 'groupchat') {
                domain = 'conference.easemob.com'
            }
            thirdMessage.to = {
                appKey: conn.appKey,
                name: messageOption.to,
                domain: domain,
                // clientResource: conn.clientResource
            }
        }
        else if(!messageOption.group && !messageOption.roomType){
            thirdMessage.from = conn.context.jid;
            thirdMessage.to = {
                appKey: conn.appKey,
                name: messageOption.to,
                domain: "easemob.com",
                // clientResource: conn.clientResource
            }
        }
        else if (messageOption.group === "groupchat" && !messageOption.roomType ) {
            thirdMessage.from = {
                appKey: conn.appKey,
                name: conn.user,
                domain: "conference.easemob.com",
                // clientResource: conn.clientResource
            };
            thirdMessage.to = {
                appKey: conn.appKey,
                name: messageOption.to,
                domain: "conference.easemob.com",
                // clientResource: conn.clientResource
            }
        }
        else if (messageOption.group === "groupchat" && messageOption.roomType) {
            thirdMessage.from = {
                appKey: conn.appKey,
                name: conn.user,
                domain: "conference.easemob.com",
                // clientResource: conn.clientResource
            };
            thirdMessage.to = {
                appKey: conn.appKey,
                name: messageOption.to,
                domain: "conference.easemob.com",
                // clientResource: conn.clientResource
            }
        }
        thirdMessage.ns = 1;
        thirdMessage.payload = fourthMessage;
        var commSyncULMessage = conn.context.root.lookup("easemob.pb.CommSyncUL");
        var secondMessage = commSyncULMessage.decode(emptyMessage);
        secondMessage.meta = thirdMessage;
        secondMessage = commSyncULMessage.encode(secondMessage).finish();
        var msyncMessage = conn.context.root.lookup("easemob.pb.MSync");
        var firstMessage = msyncMessage.decode(emptyMessage);
        firstMessage.version = conn.version;
        firstMessage.encryptType = conn.encryptType;
        firstMessage.command = 0;
        firstMessage.guid = conn.context.jid;
        firstMessage.payload = secondMessage;
        firstMessage = msyncMessage.encode(firstMessage).finish();
        conn.sendMSync(firstMessage);
    }

    var sendChatMessage = function(messageOption, conn){
        var me = conn || this;
        //var me = this;
        me.msg = messageOption;
        if(messageOption.file){
            if (me.msg.body && me.msg.body.url) {// Only send msg
                sendMessage(me.msg, conn);
                return;
            }
            var _tmpComplete = me.msg.onFileUploadComplete;
            var _complete = function (data) {
                if (data.entities[0]['file-metadata']) {
                    var file_len = data.entities[0]['file-metadata']['content-length'];
                    // me.msg.file_length = file_len;
                    me.msg.filetype = data.entities[0]['file-metadata']['content-type'];
                    if (file_len > 204800) {
                        me.msg.thumbnail = true;
                    }
                }

                me.msg.body = {
                    type: me.msg.type || 'file'
                    ,
                    url: ((conn.isHttpDNS) ? (conn.apiUrl + data.uri.substr(data.uri.indexOf("/", 9))) : data.uri) + '/' + data.entities[0]['uuid']
                    , 
                    secret: data.entities[0]['share-secret']
                    , 
                    filename: me.msg.file.filename || me.msg.filename
                    , 
                    size: {
                        width: me.msg.width || 0
                        , height: me.msg.height || 0
                    }
                    , 
                    length: me.msg.length || 0
                    , 
                    file_length: me.msg.ext.file_length || 0
                    , 
                    filetype: me.msg.filetype || me.msg.file.filetype
                }
                sendMessage(me.msg, conn);
                _tmpComplete instanceof Function && _tmpComplete(data, me.msg.id);
            };

            me.msg.onFileUploadComplete = _complete;
            _utils.uploadFile.call(conn, me.msg);
        }
        else{
            sendMessage(me.msg, conn);
        }
    }

    export default sendChatMessage

 