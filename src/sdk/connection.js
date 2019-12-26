// import getAll from './allnode'
// import protobuf from './weichatPb/protobuf';
import Base64 from 'Base64';
import getCode from './status';
import _utils from './utils'
import _msg from './message';
import Queue from './queue'
import ChatMessage from './chat/sendChatMessage';
import HandleChatMessage from './chat/handleChatMessage';
import HandleMucMessage from './muc/HandleMucMessage';
import HandleRosterMessage from './roster/HandleRosterMessage';
import HandleStatisticsMessage from './statistics/HandleStatisticsMessage';
import Long from 'long';
var protobuf = require('./weichatPb/protobuf.js');
// protobuf.util.Long = Long;
// protobuf.configure();
var all  = require('./allnode');
var root = protobuf.Root.fromJSON(all);
console.log('root>>',root);

var _version = '3.0.0';
// var all = getAll()
const _code = getCode();
var _msgHash = {};
var sock;
var mr_cache = {};
var max_cache_length = 100;
var load_msg_cache = [];
if(!window){
    window = wx
}

var root = protobuf.Root.fromJSON(all);

var _listenNetwork = function (onlineCallback, offlineCallback) {
    if (window.addEventListener) {
        window.addEventListener('online', onlineCallback);
        window.addEventListener('offline', offlineCallback);

    } else if (window.attachEvent) {
        if (document.body) {
            document.body.attachEvent('ononline', onlineCallback);
            document.body.attachEvent('onoffline', offlineCallback);
        } else {
            window.attachEvent('load', function () {
                document.body.attachEvent('ononline', onlineCallback);
                document.body.attachEvent('onoffline', offlineCallback);
            });
        }
    } else {
        /*var onlineTmp = window.ononline;
         var offlineTmp = window.onoffline;

         window.attachEvent('ononline', function () {
         try {
         typeof onlineTmp === 'function' && onlineTmp();
         } catch ( e ) {}
         onlineCallback();
         });
         window.attachEvent('onoffline', function () {
         try {
         typeof offlineTmp === 'function' && offlineTmp();
         } catch ( e ) {}
         offlineCallback();
         });*/
    }
};

var _parseNameFromJidFn = function (jid, domain) {     //*******删掉或者改动 */
    return jid.name;
};

// var _getSock = function(conn){
//     if (conn.isHttpDNS) {
//         var host = conn.xmppHosts[conn.xmppIndex];
//         var domain = host.domain;
//         var ip = host.ip;
//         var url = "";
//         if (ip) {
//             url = ip;
//             var port = host.port;
//             if (port != '80') {
//                 url += ':' + port;
//             }
//         } else {
//             url = domain;
//         }
//         if(url){
//             conn.url = "//" + url + "/ws";
//         }
//     }
//     var sock = wx.connectSocket({
//         url: url,
//         fail: function (e) {
//             console.log('连接失败', e)
//             //部分机型从后台切回前台状态有延迟
//             if (e.errMsg.indexOf('suspend') != -1) {
//                 //重连
//             }
//         },
//         success: function (e) {
//             console.log('连接成功', e)
//         }
//     })
//     return sock
// }
var _login = function (options, conn) {
    debugger
    console.log('conn>>>',conn);
    if(!options){
        return;
    }
    sock = wx.connectSocket({
        url: conn.url,
        header: {
            'content-type': 'application/json'
        },
        fail: function (e) {
            console.log('连接失败', e)
            //部分机型从后台切回前台状态有延迟
            if (e.errMsg.indexOf('suspend') != -1) {
                //重连
            }
        },
        success: function (e) {
            console.log('连接成功', e)
        }
    })

    sock.onOpen(function () {
        debugger
        var emptyMessage = [];
        var time = (new Date()).valueOf();
        var provisionMessage = root.lookup("easemob.pb.Provision");
        var secondMessage = provisionMessage.decode(emptyMessage);
        
        
        conn.context.jid.clientResource = conn.deviceId + "_" + time.toString();
        secondMessage.compressType = conn.compressType;
        secondMessage.encryptType = conn.encryptType;
        secondMessage.osType = conn.osType;
        secondMessage.version = conn.version;
        secondMessage.deviceName = conn.deviceId;
        secondMessage.resource = conn.deviceId + "_" + time.toString();
        secondMessage.deviceUuid = time.toString();
        secondMessage.auth = "$t$" + options.access_token;
        secondMessage = provisionMessage.encode(secondMessage).finish();
        var firstLookUpMessage = root.lookup("easemob.pb.MSync");
        var firstMessage = firstLookUpMessage.decode(emptyMessage);

        firstMessage.version = conn.version;
        firstMessage.guid = conn.context.jid;
        firstMessage.auth = "$t$" + options.access_token;
        firstMessage.command = 3;
        firstMessage.deviceId = conn.deviceId;
        firstMessage.encryptType = conn.encryptType;
        firstMessage.payload = secondMessage;
        firstMessage = firstLookUpMessage.encode(firstMessage).finish();
        base64transform(firstMessage);
        conn.logOut = false;
        conn.offLineSendConnecting = false;
        if (conn.unSendMsgArr.length > 0) {
            for (var i in conn.unSendMsgArr) {
                var str = conn.unSendMsgArr[i];
                conn.sendMSync(str);
                delete conn.unSendMsgArr[i];
            }
        }
        conn.onOpened();
    });

    sock.onClose( function (e) {
        if(!conn.logOut 
            && conn.autoReconnectNumTotal <= conn.autoReconnectNumMax
            && (conn.autoReconnectNumTotal <= conn.xmppHosts.length && conn.isHttpDNS || !conn.isHttpDNS)
            // && conn.xmppIndex < conn.xmppHosts.length - 1
        )
        {
            conn.reconnect();
            var error = {
                type: _code.WEBIM_CONNCTION_DISCONNECTED
            };
            conn.onError(error);
            // conn.onClosed();
        }
        else if(conn.logOut){
            conn.clear();
            conn.onClosed();
        }
        else{
            var error = {
                type: _code.WEBIM_CONNCTION_DISCONNECTED
            };
            conn.onError(error);
            conn.onClosed();
        }
    })

    sock.onMessage(function (e) {
        console.log('e>>>>',e);
        
        var getmessage = Base64.atob(e.data);
        var arr = [];
        for (var i = 0, j = getmessage.length; i < j; ++i) {
            arr.push(getmessage.charCodeAt(i));
        }
        debugger
        //var tmpUint8Array = new Uint8Array(arr);    //注释：ie9不兼容https://www.cnblogs.com/jiangxiaobo/p/6016431.html
        var mainMessage = root.lookup("easemob.pb.MSync");
        console.log('mainMessage>>>',arr); // arr = [114, 90, 44, 123, 25, 165, 158, 208, 46, 174, 120, 158, 181, 250, 90, 173, 169, 172, 198, 105, 103, 179, 25, 169, 165, 250, 218, 154, 41, 224]
        
        var result = mainMessage.decode(arr);
        switch (result.command) {
            case 0:
                var CommSyncDLMessage = root.lookup("easemob.pb.CommSyncDL");
                CommSyncDLMessage = CommSyncDLMessage.decode(result.payload);
                var msgId = new Long(CommSyncDLMessage.serverId.low,CommSyncDLMessage.serverId.high, CommSyncDLMessage.serverId.unsigned).toString();
                var metaId = new Long(CommSyncDLMessage.metaId.low,CommSyncDLMessage.metaId.high, CommSyncDLMessage.metaId.unsigned).toString();
                if (CommSyncDLMessage.metas.length !== 0) {
                    metapayload(CommSyncDLMessage.metas, CommSyncDLMessage.status, conn);
                    lastsession(CommSyncDLMessage.nextKey, CommSyncDLMessage.queue, conn);
                }
                else if(CommSyncDLMessage.isLast){
                    //当前为最后一条消息
                }
                else if(CommSyncDLMessage.status && CommSyncDLMessage.status.errorCode === 0){
                    if (_msgHash[metaId]) {
                        try {
                            _msgHash[metaId].success instanceof Function && _msgHash[metaId].success(metaId, msgId);
                        } catch (e) {
                            //console.log(e)
                            conn.onError({
                                type: _code.WEBIM_CONNCTION_CALLBACK_INNER_ERROR
                                , data: e
                            });
                        }
                        delete _msgHash[metaId];
                    }
                    conn.onReceivedMessage({
                        id: metaId,
                        mid: msgId
                    })
                }
                else if(CommSyncDLMessage.status && CommSyncDLMessage.status.errorCode === 15){
                    conn.onMutedMessage({
                        mid: msgId
                    });
                }
                else if(CommSyncDLMessage.status && CommSyncDLMessage.status.errorCode === 1){
                    var type = '';
                    switch (CommSyncDLMessage.status.reason){
                        case "blocked":
                             type = _code.PERMISSION_DENIED
                            break;
                        case "group not found":
                            type = _code.GROUP_NOT_EXIST
                            break;
                        case "not in group or chatroom":
                            type = _code.GROUP_NOT_JOINED
                            break;
                        case "exceed recall time limit":
                            type = _code.MESSAGE_RECALL_TIME_LIMIT
                            break;
                        case "message recall disabled":
                            type = _code.SERVICE_NOT_ENABLED
                            break;
                        default:
                            type = _code.SERVER_UNKNOWN_ERROR
                            break;
                    }  
                    conn.onError({
                        type: type,
                        data:{
                            id:metaId,
                            mid: msgId
                        }
                    });
                }
                else if(CommSyncDLMessage.status && CommSyncDLMessage.status.errorCode === 7 && CommSyncDLMessage.status.reason === "sensitive words"){
                    conn.onError({
                        type: _code.MESSAGE_INCLUDE_ILLEGAL_CONTENT,
                        data:{
                            id:metaId,
                            mid: msgId
                        }
                    });
                }
                else{
                    if (_msgHash[metaId]) {
                        try {
                            _msgHash[metaId].fail instanceof Function && _msgHash[metaId].fail(metaId, msgId);
                        } catch (e) {
                            conn.onError({
                                type: _code.WEBIM_CONNCTION_CALLBACK_INNER_ERROR
                                , data: e
                            });
                        }
                        delete _msgHash[metaId];
                    }
                    conn.onError({
                        type: _code.WEBIM_LOAD_MSG_ERROR
                        , data: {
                            errorCode: CommSyncDLMessage.status && CommSyncDLMessage.status.errorCode,
                            reason: CommSyncDLMessage.status && CommSyncDLMessage.status.reason
                        }
                    });
                }
                break;
            case 1:
                var CommUnreadDLMessage = root.lookup("easemob.pb.CommUnreadDL");
                CommUnreadDLMessage = CommUnreadDLMessage.decode(result.payload);
                if (CommUnreadDLMessage.unread.length === 0) {
                }
                else {
                    for (var i = 0; i < CommUnreadDLMessage.unread.length; i++) {
                        backqueue(CommUnreadDLMessage.unread[i].queue, conn);
                    }
                }
                rebuild(); //测试每次都会走 case 1
                break;
            case 2:
                var Message = root.lookup("easemob.pb.CommNotice");
                var noticeMessage = Message.decode(result.payload);
                backqueue(noticeMessage.queue, conn);
                break;
            case 3:
                receiveProvision(result, conn);
                break;
        }
    })

    sock.onError(function(e){
        console.log('onError', e);
    })
    debugger
    var accessToken = options.access_token ||'';
    if (accessToken == '') {
        var loginfo = _utils.stringify(options);
        conn.onError({
            type: _code.WEBIM_CONNCTION_OPEN_USERGRID_ERROR,
            data: options
        });
        return;
    }

    conn.context.accessToken = options.access_token;
};


/**
 * 确定收到消息给erlang反馈//跟服务端确认是否为最后一条消息comm消息islast = true
 * */
var lastsession = function (nexkey, queue, conn) {
    var emptyMessage = [];
    var commSyncULMessage = root.lookup("easemob.pb.CommSyncUL");
    var secondMessage = commSyncULMessage.decode(emptyMessage);
    secondMessage.queue = queue;
    secondMessage.key = new Long(nexkey.low,nexkey.high, nexkey.unsigned).toString();
    secondMessage = commSyncULMessage.encode(secondMessage).finish();

    var mSyncMessage = root.lookup("easemob.pb.MSync");

    var firstMessage = mSyncMessage.decode(emptyMessage);
    firstMessage.version = conn.version;
    firstMessage.encryptType = conn.encryptType;
    firstMessage.command = 0;
    firstMessage.payload = secondMessage;
    firstMessage = mSyncMessage.encode(firstMessage).finish();

    // SockJS.OPEN = 1
    if (sock.readyState !== 1) {
        var error = {
            type: _code.WEBIM_CONNCTION_DISCONNECTED
        };
        conn.onError(error);
    } else {

        base64transform(firstMessage);
    }
}

var metapayload = function (metas, status, conn) {
    for (var i = 0; i < metas.length; i++) {
        var msgId = new Long(metas[i].id.low, metas[i].id.high, metas[i].id.unsigned).toString();
        if(load_msg_cache.indexOf(msgId) < 0){
            if(metas[i].ns === 1){      //CHAT
                // messageBody(metas[i]);
                HandleChatMessage(metas[i], status, conn)
            }
            else if(metas[i].ns === 2){   //MUC
                HandleMucMessage(metas[i], status, conn);
            }
            else if(metas[i].ns === 3){    //ROSTER
                HandleRosterMessage.handleMessage(metas[i], status, conn);
            }
            else if(metas[i].ns === 0){ 
                //CHAT
                // messageBody(metas[i]);
                HandleStatisticsMessage(metas[i], status, conn)
            }else if(metas[i].ns === 4){//rtc信令
                conn.registerConfrIQHandler && (conn.registerConfrIQHandler(metas[i], status, conn));
            }
            if(load_msg_cache.length <= max_cache_length){
                load_msg_cache.push(msgId);
            }
            else{
                load_msg_cache.shift();
                load_msg_cache.push(msgId);
            }
        }
    }
}



/**
 *
 * 如何没有未读消息的处理
 * */
var rebuild = function () {

    var emptyMessage = [];
    //再次发送信息
    var StatisticsMessage = root.lookup("easemob.pb.StatisticsBody");
    var fourthMessage = StatisticsMessage.decode(emptyMessage);
    fourthMessage.operation = 0;
    // statisticsmessage.imTime=123;
    // statisticsmessage.chatTime=123;
    fourthMessage = StatisticsMessage.encode(fourthMessage).finish();

    var MetaMessage = root.lookup("easemob.pb.Meta");
    var thirdMessage = MetaMessage.decode(emptyMessage);
    thirdMessage.id = (new Date()).valueOf();
    thirdMessage.ns = 0;
    thirdMessage.payload = fourthMessage;
    // metamessage = MetaMessage.encode(metamessage).finish();
    var commsynculMessage = root.lookup("easemob.pb.CommSyncUL");
    var secondMessage = commsynculMessage.decode(emptyMessage);
    secondMessage.meta = thirdMessage;
    secondMessage = commsynculMessage.encode(secondMessage).finish();

    var mainMessage = root.lookup("easemob.pb.MSync");
    var firstMessage = mainMessage.decode(emptyMessage);
    firstMessage.version = "3.0.0";
    firstMessage.encryptType = [0];
    firstMessage.command = 0;
    firstMessage.payload = secondMessage;
    firstMessage = mainMessage.encode(firstMessage).finish();
    base64transform(firstMessage);
}

/**
 * 当服务器有新消息提示时进行返回queue
 * */
var backqueue = function (backqueue, conn) {
    var emptyMessage = [];
    var commsynculMessage = root.lookup("easemob.pb.CommSyncUL");
    var secondMessage = commsynculMessage.decode(emptyMessage);
    secondMessage.queue = backqueue;
    secondMessage = commsynculMessage.encode(secondMessage).finish();
    var mainMessage = root.lookup("easemob.pb.MSync");
    var firstMessage = mainMessage.decode(emptyMessage);
    firstMessage.version = conn.version;
    firstMessage.encryptType = conn.encryptType;
    firstMessage.command = 0;
    firstMessage.payload = secondMessage;
    firstMessage = mainMessage.encode(firstMessage).finish();
    base64transform(firstMessage);
}

var receiveProvision = function (result, conn) {

    var provisionMessage = root.lookup("easemob.pb.Provision");
    var receiveProvisionResult = provisionMessage.decode(result.payload);
    conn.context.jid.clientResource = receiveProvisionResult.resource;

    if (receiveProvisionResult.status.errorCode == 0) {
        unreadDeal(conn);
    }
}

var unreadDeal = function (conn) {
    var emptyMessage = [];
    var MSyncMessage = root.lookup("easemob.pb.MSync");
    var firstMessage = MSyncMessage.decode(emptyMessage);
    firstMessage.version = conn.version;
    firstMessage.encryptType = conn.encryptType;
    firstMessage.command = 1;
    firstMessage = MSyncMessage.encode(firstMessage).finish();
    base64transform(firstMessage);
}

var base64transform = function (str) {

    var strr = "";
    for (var i = 0; i < str.length; i++) {
        var str0 = String.fromCharCode(str[i]);
        strr = strr + str0;
    }
    strr = Base64.btoa(strr)
    //strr = window.btoa(strr);
    sock.send(strr);
}


var _getJid = function (options, conn) {      //均在已经废弃的api中使用
    var jid = options.toJid || {};

    if (jid === {}) {
        
        var appKey = conn.context.appKey || '';
        var toJid = {
            appKey: appKey,
            name: options.to,
            domain: conn.domain,
            clientResource: conn.clientResource
        }
        if (options.resource) {
            toJid.clientResource = options.resource
        }
        jid = toJid;
    }
    return jid;
};

var _getJidByName = function (name, conn) {    //均在已经废弃的api中使用
    var options = {
        to: name
    };
    return _getJid(options, conn);
};

var _validCheck = function (options, conn) {
    options = options || {};

    if (options.user == '') {
        conn.onError({
            type: _code.WEBIM_CONNCTION_USER_NOT_ASSIGN_ERROR
        });
        return false;
    }

    var user = (options.user + '') || '';
    var appKey = options.appKey || '';
    var devInfos = appKey.split('#');

    if (devInfos.length !== 2) {
        conn.onError({
            type: _code.WEBIM_CONNCTION_APPKEY_NOT_ASSIGN_ERROR
        });
        return false;
    }
    var orgName = devInfos[0];
    var appName = devInfos[1];

    if (!orgName) {
        conn.onError({
            type: _code.WEBIM_CONNCTION_APPKEY_NOT_ASSIGN_ERROR
        });
        return false;
    }
    if (!appName) {
        conn.onError({
            type: _code.WEBIM_CONNCTION_APPKEY_NOT_ASSIGN_ERROR
        });
        return false;
    }

    // var jid = appKey + '_' + user.toLowerCase() + '@' + conn.domain,
    //     resource = options.resource || 'webim';

    // if (conn.isMultiLoginSessions) {
    //     resource += user + new Date().getTime() + Math.floor(Math.random().toFixed(6) * 1000000);
    // }
    // conn.context.jid = jid + '/' + resource;
    /*jid: {appkey}_{username}@domain/resource*/

    conn.context.jid = {
        appKey: appKey,
        name: user,
        domain: conn.domain,
        clientResource: conn.clientResource
    }
    // conn.context.sock = sock;
    conn.context.root = root;
    conn.context.userId = user;
    conn.context.appKey = appKey;
    conn.context.appName = appName;
    conn.context.orgName = orgName;

    return true;
};

// var _getXmppUrl = function (baseUrl, https) {
//     if (/^(ws|http)s?:\/\/?/.test(baseUrl)) {
//         return baseUrl;
//     }

//     var url = {
//         prefix: 'http',
//         base: '://' + baseUrl,
//         suffix: '/http-bind/'
//     };

//     if (https && _utils.isSupportWss) {
//         url.prefix = 'wss';
//         url.suffix = '/ws/';
//     } else {
//         if (https) {
//             url.prefix = 'https';
//         } else if (window.WebSocket) {
//             url.prefix = 'ws';
//             url.suffix = '/ws/';
//         }
//     }

//     return url.prefix + url.base + url.suffix;
// };


/**
 * The connection class.
 * @constructor
 * @param {Object} options - 创建连接的初始化参数
 * @param {String} options.url - xmpp服务器的URL
 * @param {String} options.apiUrl - API服务器的URL
 * @param {Boolean} options.isHttpDNS - 防止域名劫持
 * @param {Boolean} options.isMultiLoginSessions - 为true时同一账户可以同时在多个Web页面登录（多标签登录，默认不开启，如有需要请联系商务），为false时同一账号只能在一个Web页面登录
 * @param {Boolean} options.https - 是否启用wss.
 * @param {Number} options.heartBeatWait - 发送心跳包的时间间隔（毫秒）
 * @param {Boolean} options.isAutoLogin - 登录成功后是否自动出席
 * @param {Number} options.autoReconnectNumMax - 掉线后重连的最大次数
 * @param {Number} options.autoReconnectInterval -  掉线后重连的间隔时间（毫秒）
 * @param {Boolean} options.isWindowSDK - 是否运行在WindowsSDK上
 * @param {Boolean} options.encrypt - 是否加密文本消息
 * @param {Boolean} options.delivery - 是否发送delivered ack
 * @returns {Class}  连接实例
 */


//class
var connection = function (options) {
    if (!this instanceof connection) {
        return new connection(options);
    }

    var options = options || {};

    this.isHttpDNS = options.isHttpDNS || false;
    this.isMultiLoginSessions = options.isMultiLoginSessions || false;
    this.wait = options.wait || 30;    //**** attach*/
    this.retry = options.retry || false;   //*** */
    this.https = options.https && location.protocol === 'https:';
    this.url = options.url;
    this.hold = options.hold || 1;    //**** attach*/
    this.route = options.route || null;   //*** */
    // this.domain = options.domain || 'easemob.com';
    this.inactivity = options.inactivity || 30;     //****getStrophe */
    this.heartBeatWait = options.heartBeatWait || 4500;   //*** */
    this.maxRetries = options.maxRetries || 5;     //*** getStrophe*/
    this.isAutoLogin = options.isAutoLogin === false ? false : true;      //**** */
    this.pollingTime = options.pollingTime || 800;    //****getStrophe */
    this.stropheConn = false;
    this.autoReconnectNumMax = options.autoReconnectNumMax || 0;
    this.autoReconnectNumTotal = 0;
    this.autoReconnectInterval = options.autoReconnectInterval || 0;
    this.context = {status: _code.STATUS_INIT};
    this.sendQueue = new Queue();  //instead of sending message immediately,cache them in this queue
    this.intervalId = null;   //clearInterval return value
    this.apiUrl = options.apiUrl || '';
    this.isWindowSDK = options.isWindowSDK || false;    //????
    this.encrypt = options.encrypt || {encrypt: {type: 'none'}};   //**** */
    this.delivery = options.delivery || false;


    //jid 所用参数
    this.appKey = options.appKey || "";
    this.domain = options.domain || "easemob.com";
    this.clientResource = "84ff3eba1";
    this.user = '';
    this.orgName = '';
    this.appName = '';
    this.token = '';
    this.unSendMsgArr = [];


    this.dnsArr = ['https://rs.easemob.com', 'http://182.92.174.78', 'http://112.126.66.111']; //http dns server hosts
    this.dnsIndex = 0;   //the dns ip used in dnsArr currently
    this.dnsTotal = this.dnsArr.length;  //max number of getting dns retries
    this.restHosts = []; //rest server ips
    this.restIndex = 0;    //the rest ip used in restHosts currently
    this.restTotal = 0;    //max number of getting rest token retries
    this.xmppHosts = []; //xmpp server ips
    this.xmppIndex = 0;    //the xmpp ip used in xmppHosts currently
    this.xmppTotal = 0;    //max number of creating xmpp server connection(ws/bosh) retries

    this.groupOption = {};
    //mysnc配置
    this.version = options.version || "3.0.0";
    this.compressAlgorimth = options.compressAlgorimth || 0;   //*** */
    this.userAgent = options.userAgent || 0;    //*** */
    this.pov = options.pov || 0;    /**** */
    this.command = options.command || 3;
    this.deviceId = options.deviceId || "webim";
    this.encryptKey = options.encryptKey || "";
    this.firstPayload = options.firstPayload || [];   //*** */
    this.compressType = options.compressType || [0];
    this.encryptType = options.encryptType || [0];
    this.osType = 16;
    window.this = this;
};

/**
 * 注册新用户
 * @param {Object} options - 
 * @param {String} options.username - 用户名，即用户ID
 * @param {String} options.password - 密码
 * @param {String} options.nickname - 用户昵称
 * @param {Function} options.success - 成功之后的回调，默认为空
 * @param {Function} options.error - 失败之后的回调，默认为空
 */

connection.prototype.registerUser = function (options) {
    if (this.isHttpDNS) {
        this.dnsIndex = 0;
        this.getHttpDNS(options, 'signup');
    } else {
        this.signup(options);
    }
}

/**
 * 处理发送队列
 * @private
 */

// connection.prototype.handelSendQueue = function () {
//     var options = this.sendQueue.pop();
//     if (options !== null) {
//         this.sendReceiptsMessage(options);
//     }
// };

/**
 * 注册监听函数
 * @param {Object} options - 回调函数集合
 * @param {connection~onOpened} options.onOpened - 处理登录的回调
 * @param {connection~onTextMessage} options.onTextMessage - 处理文本消息的回调
 * @param {connection~onEmojiMessage} options.onEmojiMessage - 处理表情消息的回调
 * @param {connection~onPictureMessage} options.onPictureMessage - 处理图片消息的回调
 * @param {connection~onAudioMessage} options.onAudioMessage - 处理音频消息的回调
 * @param {connection~onVideoMessage} options.onVideoMessage - 处理视频消息的回调
 * @param {connection~onFileMessage} options.onFileMessage - 处理文件消息的回调
 * @param {connection~onLocationMessage} options.onLocationMessage - 处理位置消息的回调
 * @param {connection~onCmdMessage} options.onCmdMessage - 处理命令消息的回调
 * @param {connection~onPresence} options.onPresence - 处理Presence消息的回调
 * @param {connection~onError} options.onError - 处理错误消息的回调
 * @param {connection~onReceivedMessage} options.onReceivedMessage - 处理Received消息的回调
 * @param {connection~onInviteMessage} options.onInviteMessage - 处理邀请消息的回调    /.....
 * @param {connection~onDeliverdMessage} options.onDeliverdMessage - 处理Delivered ACK消息的回调
 * @param {connection~onReadMessage} options.onReadMessage - 处理Read ACK消息的回调   //.....
 * @param {connection~onRecallMessage} options.onRecallMessage - 处理Recall 消息的回调   //.....
 * @param {connection~onMutedMessage} options.onMutedMessage - 处理禁言消息的回调
 * @param {connection~onOffline} options.onOffline - 处理断网的回调
 * @param {connection~onOnline} options.onOnline - 处理联网的回调
 * @param {connection~onCreateGroup} options.onCreateGroup - 处理创建群组的回调
 */
connection.prototype.listen = function (options) {
    /**
     * 登录成功后调用
     * @callback connection~onOpened
     */
    /**
     * 收到文本消息
     * @callback connection~onTextMessage
     */
    /**
     * 收到表情消息
     * @callback connection~onEmojiMessage
     */
    /**
     * 收到图片消息
     * @callback connection~onPictureMessage
     */
    /**
     * 收到音频消息
     * @callback connection~onAudioMessage
     */
    /**
     * 收到视频消息
     * @callback connection~onVideoMessage
     */
    /**
     * 收到文件消息
     * @callback connection~onFileMessage
     */
    /**
     * 收到位置消息
     * @callback connection~onLocationMessage
     */
    /**
     * 收到命令消息
     * @callback connection~onCmdMessage
     */
    /**
     * 收到错误消息
     * @callback connection~onError
     */
    /**
     * 收到Presence消息
     * @callback connection~onPresence
     */
    /**
     * 收到Received消息
     * @callback connection~onReceivedMessage
     */
    /**
     * 被邀请进群
     * @callback connection~onInviteMessage   //....
     */
    /**
     * 收到已送达回执
     * @callback connection~onDeliverdMessage
     */
    /**
     * 收到已读回执
     * @callback connection~onReadMessage
     */
    /**
     * 收到撤回消息回执
     * @callback connection~onRecallMessage
     */
    /**
     * 被群管理员禁言
     * @callback connection~onMutedMessage
     */
    /**
     * 浏览器被断网时调用
     * @callback connection~onOffline
     */
    /**
     * 浏览器联网时调用
     * @callback connection~onOnline
     */
    /**
     * 建群成功后调用
     * @callback connection~onCreateGroup
     */
    this.onOpened = options.onOpened || _utils.emptyfn;
    this.onClosed = options.onClosed || _utils.emptyfn;
    this.onTextMessage = options.onTextMessage || _utils.emptyfn;
    this.onEmojiMessage = options.onEmojiMessage || _utils.emptyfn;
    this.onPictureMessage = options.onPictureMessage || _utils.emptyfn;
    this.onAudioMessage = options.onAudioMessage || _utils.emptyfn;
    this.onVideoMessage = options.onVideoMessage || _utils.emptyfn;
    this.onFileMessage = options.onFileMessage || _utils.emptyfn;
    this.onLocationMessage = options.onLocationMessage || _utils.emptyfn;
    this.onCmdMessage = options.onCmdMessage || _utils.emptyfn;
    this.onStatisticMessage = options.onStatisticMessage || _utils.emptyfn;
    this.onPresence = options.onPresence || _utils.emptyfn;
    this.onRoster = options.onRoster || _utils.emptyfn;
    this.onError = options.onError || _utils.emptyfn;
    this.onReceivedMessage = options.onReceivedMessage || _utils.emptyfn;
    this.onInviteMessage = options.onInviteMessage || _utils.emptyfn;
    this.onDeliverdMessage = options.onDeliveredMessage || _utils.emptyfn;
    this.onReadMessage = options.onReadMessage || _utils.emptyfn;
    this.onRecallMessage = options.onRecallMessage  || _utils.emptyfn;
    this.onMutedMessage = options.onMutedMessage || _utils.emptyfn;
    this.onOffline = options.onOffline || _utils.emptyfn;
    this.onOnline = options.onOnline || _utils.emptyfn;
    this.onConfirmPop = options.onConfirmPop || _utils.emptyfn;
    this.onCreateGroup = options.onCreateGroup || _utils.emptyfn;
    //for WindowSDK start
    this.onUpdateMyGroupList = options.onUpdateMyGroupList || _utils.emptyfn;
    this.onUpdateMyRoster = options.onUpdateMyRoster || _utils.emptyfn;
    //for WindowSDK end
    this.onBlacklistUpdate = options.onBlacklistUpdate || _utils.emptyfn;

    _listenNetwork(this.onOnline, this.onOffline);
};


/**
 * @private
 */
connection.prototype.getRestFromHttpDNS = function (options, type) {
    if (this.restIndex > this.restTotal) {
        return;
    }
    var url = '';
    var host = this.restHosts[this.restIndex];
    var domain = host.domain;
    var ip = host.ip;
    if (ip) {
        var port = host.port;
        url = (location.protocol === 'https:' ? 'https:' : 'http:') + '//' + ip + ':' + port;
    } else {
        url = (location.protocol === 'https:' ? 'https:' : 'http:') + '//' + domain;
    }

    if (url != '') {
        this.apiUrl = url;
        options.apiUrl = url;
    }

    if (type == 'login') {
        this.login(options);
    } else {
        this.signup(options);
    }
};

/**
 * @private
 */

connection.prototype.getHttpDNS = function (options, type) {
    // if (this.restHosts) {r
    //     this.getRestFromHttpDNS(options, type);
    //     return;
    // }
    var self = this;
    var suc = function (data, xhr) {
        // data = new DOMParser().parseFromString(data, "text/xml").documentElement;
        //get rest ips
        var restHosts = data.rest.hosts;
        if (!restHosts) {
            return;
        }

        var httpType = self.https ? 'https' : 'http';
        for(var i = 0; i< restHosts.length; i++){
            if( restHosts[i].protocol=== httpType ){
                var currentPost = restHosts[i];
                restHosts.splice(i,1);
                restHosts.unshift(currentPost);
            }
        }
        self.restHosts = restHosts;
        self.restTotal = restHosts.length;

        //get xmpp ips
        var makeArray = function(obj){    //伪数组转为数组
          return Array.prototype.slice.call(obj,0); 
        } 
        try{ 
            Array.prototype.slice.call(document.documentElement.childNodes, 0)[0].nodeType; 
        }catch(e){ 
            makeArray = function(obj){ 
                var res = []; 
                for(var i=0,len=obj.length; i<len; i++){
                   res.push(obj[i]); 
                } 
              return res; 
          } 
        } 
        var xmppHosts = data['msync-ws'].hosts;
        if (!xmppHosts) {
            return;
        }
        for(var i = 0; i< xmppHosts.length; i++){
            // var httpType = self.https ? 'https' : 'http';
            if( xmppHosts[i].protocol=== httpType ){
                var currentPost = xmppHosts[i];
                xmppHosts.splice(i,1);
                xmppHosts.unshift(currentPost);
            }
        }
        self.xmppHosts = xmppHosts;
        self.xmppTotal = xmppHosts.length;

        self.getRestFromHttpDNS(options, type);
    };
    var error = function (res, xhr, msg) {
        console.log('getHttpDNS error', res, msg);
        self.dnsIndex++;
        if (self.dnsIndex < self.dnsTotal) {
            self.getHttpDNS(options, type);
        }

    };
    var options2 = {
        url: this.dnsArr[this.dnsIndex] + '/easemob/server.json',
        dataType: 'json',
        type: 'GET',

        // url: 'http://www.easemob.com/easemob/server.xml',
        // dataType: 'xml',
        data: {app_key: encodeURIComponent(options.appKey || this.appKey)},
        success: suc || _utils.emptyfn,
        error: error || _utils.emptyfn
    };
    _utils.ajax(options2);
};

/**
 * @private
 */

connection.prototype.signup = function (options) {
    var self = this;
    var orgName = options.orgName || '';
    var appName = options.appName || '';
    var appKey = options.appKey || this.appKey;
    var suc = options.success || _utils.emptyfn;
    var err = options.error || _utils.emptyfn;

    if (!orgName && !appName && appKey) {
        var devInfos = appKey.split('#');
        if (devInfos.length === 2) {
            orgName = devInfos[0];
            appName = devInfos[1];
        }
    }
    if (!orgName && !appName) {
        err({
            type: _code.WEBIM_CONNCTION_APPKEY_NOT_ASSIGN_ERROR
        });
        return;
    }

    var error = function (res, xhr, msg) {
        if (self.isHttpDNS) {
            if ((self.restIndex + 1) < self.restTotal) {
                self.restIndex++;
                self.getRestFromHttpDNS(options, 'signup');
                return;
            }
        }
        self.clear();
        err(res);
    };
    var https = options.https || this.https;
    var apiUrl = options.apiUrl || this.apiUrl;
    var restUrl = apiUrl + '/' + orgName + '/' + appName + '/users';

    var userjson = {
        username: options.username,
        password: options.password,
        nickname: options.nickname || ''
    };

    var userinfo = _utils.stringify(userjson);
    var options2 = {
        url: restUrl,
        dataType: 'json',
        data: userinfo,
        success: suc,
        error: error
    };
    _utils.ajax(options2);
};

/**
 * 登录  
 * @param {Object} options - 用户信息
 * @param {String} options.user - 用户名
 * @param {String} options.pwd - 用户密码，跟token二选一
 * @param {String} options.accessToken - token，跟密码二选一
 * @param {String} options.appKey - Appkey
 * @param {String} options.apiUrl - Rest 服务地址,非必须。可在项目的WebIMConfig配置
 * @param {String} options.xmppURL - Xmpp 服务地址,非必须。可在项目的WebIMConfig配置
 * @param {Function} options.success - 成功之后的回调，默认为空，token登录没有该回调
 * @param {Function} options.error - 失败之后的回调，默认为空，token登录没有该回调
 */

connection.prototype.open = function (options) {
    var appkey = options.appKey,
        orgName = appkey.split('#')[0],
        appName = appkey.split('#')[1];
    this.orgName = orgName;
    this.appName = appName;
    if (options.accessToken) {
        this.token = options.accessToken;
    }
    // if (options.xmppURL) {
    //     this.url = _getXmppUrl(options.xmppURL, this.https);
    // }
    if (this.isHttpDNS) {
        this.dnsIndex = 0;
        this.getHttpDNS(options, 'login');
    } else {
        this.login(options);
    }
};

/**
 *
 * @param options
 * @private
 */

connection.prototype.login = function (options) {
    console.log('options>>>',options);
    
    this.user = options.user;
    var pass = _validCheck(options, this);

    if (!pass) {
        return;
    }

    var conn = this;

    if (conn.isOpened()) {    //** */
        return;
    }
    debugger
    if (options.accessToken) {
        options.access_token = options.accessToken;
        // conn.context.restTokenData = options;
        _login(options, conn);
    } else {
        var apiUrl = options.apiUrl;
        var userId = this.context.userId;
        var pwd = options.pwd || '';
        var appName = this.context.appName;
        var orgName = this.context.orgName;

        var suc = function (data, xhr) {
            // conn.context.status = _code.STATUS_DOLOGIN_IM;
            // conn.context.restTokenData = data;
            if (options.success)
                options.success(data);
            conn.token = data.access_token;
            conn.context.restTokenData = data.access_token;
            _login(data, conn);
        };
        var error = function (res, xhr, msg) {
            if (options.error)
                options.error();
            if (conn.isHttpDNS) {
                if ((conn.restIndex + 1) < conn.restTotal) {
                    conn.restIndex++;
                    conn.getRestFromHttpDNS(options, 'login');
                    return;
                }
            }
            conn.clear();
            if (res.error && res.error_description) {
                conn.onError({
                    type: _code.WEBIM_CONNCTION_OPEN_USERGRID_ERROR,
                    data: res,
                    xhr: xhr
                });
            } else {
                conn.onError({
                    type: _code.WEBIM_CONNCTION_OPEN_ERROR,
                    data: res,
                    xhr: xhr
                });
            }
        };

        // this.context.status = _code.STATUS_DOLOGIN_USERGRID;

        var loginJson = {
            grant_type: 'password',
            username: userId,
            password: pwd,
            timestamp: +new Date()
        };
        var loginfo = _utils.stringify(loginJson);

        var options2 = {
            url: apiUrl + '/' + orgName + '/' + appName + '/token',
            dataType: 'json',
            data: loginfo,
            success: suc || _utils.emptyfn,
            error: error || _utils.emptyfn
        };
        _utils.ajax(options2);
    }
};


/**
 * 断开连接，同时心跳停止
 * @param {String} reason - 断开原因
 */

connection.prototype.close = function (reason) {
    this.logOut = true;
    this.context.status = _code.STATUS_CLOSING;
    console.log('sock>>>>',sock);
    
    sock.close();

    this.context.status = _code.STATUS_CLOSING;
};


/**
 * 发送撤回消息
 * @param {Object} option - 
 * @param {Object} option.mid -   回撤消息id
 * @param {Object} option.to -   消息的接收方
 * @param {Object} option.type -  chat(单聊) groupchat(群组聊天) chatroom(聊天室聊天)
 */
connection.prototype.recallMessage = function(option){
    var messageOption = {
        id: this.getUniqueId(),
        type: "recall",
        group: option.type,
        ackId: option.mid,
        to: option.to,
        success: option.success,
        fail: option.fail
    }
    this.send(messageOption, this);
}



/**
 * @private
 */
connection.prototype.sendMSync = function(str){     //
    var strr = "";
    // this.unSendMsgArr.push(dom);
    for (var i = 0; i < str.length; i++) {
        var str0 = String.fromCharCode(str[i]);
        strr = strr + str0;
    }
    debugger
    strr = Base64.btoa(strr);
    //strr = window.btoa(strr);

    //SockJS.OPEN = 1
    if(sock.readyState === 1){
        sock.send(strr);
    }
    else{
        this.unSendMsgArr.push(strr);
        if(
            !this.logOut 
            && this.autoReconnectNumTotal <= this.autoReconnectNumMax
            && (this.autoReconnectNumTotal <= this.xmppHosts.length && this.isHttpDNS || !this.isHttpDNS)
        ){
            this.offLineSendConnecting = true;
            this.reconnect();
        }
        this.onError({
            type: _code.WEBIM_CONNCTION_DISCONNECTED,
            reconnect: true
        });
    }
}

connection.prototype.getUniqueId = function (prefix) { //*******
    // fix: too frequently msg sending will make same id
    if (this.autoIncrement) {
        this.autoIncrement++
    } else {
        this.autoIncrement = 1
    }
    var cdate = new Date();
    var offdate = new Date(2010, 1, 1);
    var offset = cdate.getTime() - offdate.getTime();
    var hexd = offset + this.autoIncrement;
    return hexd;

};

/**
 * 发送消息
 * @param {Object} messageSource - 由 Class Message 生成
 * @example
 *let deliverMessage = new WebIM.message('delivery', msgId);
 *deliverMessage.set({
 *  id: msgId, 
 *  to: msg.from
 *});
 *conn.send(deliverMessage.body);
 */

connection.prototype.send= function (messageOption) {
    var self = this;
    ChatMessage(messageOption, self);
    _msgHash[messageOption.id] = messageOption;
};

/**
 * 删除联系人
 *
 * @param {Object} options -
 * @param {String} options.to - 联系人ID
 * @param {Function} options.success - 成功之后的回调，默认为空
 * @param {Function} options.error - 失败之后的回调，默认为空
 */

connection.prototype.removeRoster = function (options) {
    HandleRosterMessage.operatRoster(options, "remove", this);
};

/**
 * 获取联系人
 * @param {Object} options - 
 * @param {Function} options.success - 成功之后的回调，默认为空
 * @param {Function} options.error - 失败之后的回调，默认为空
 */

connection.prototype.getRoster = function (options) {
    debugger
    var options = options || {};
    var self = this;
    // if (!_utils.isCanSetRequestHeader) {
    //     this.onError({
    //         type: _code.WEBIM_CONNCTION_NOT_SUPPORT_CHATROOM_ERROR
    //     });
    //     return;
    // }

    var conn = this,
        token = options.accessToken || this.token;

    if (token) {
        var apiUrl = options.apiUrl || this.apiUrl;
        var appName = this.context.appName;
        var orgName = this.context.orgName;

        if (!appName || !orgName) {
            conn.onError({
                type: _code.WEBIM_CONNCTION_AUTH_ERROR
            });
            return;
        }

        var suc = function (data, xhr) {
            //_parseFriend *****之前用这个方法处理的返回消息
            let friends = [];
            data.data.forEach((v,i) => {
                friends.push({
                    name: v,
                    subscription: 'both',
                    jid: self.context.jid
                });
            })
            typeof options.success === 'function' && options.success(friends);
            // this.onRoster && this.onRoster();
        };

        var error = function (res, xhr, msg) {
            typeof options.error === 'function' && options.error(res);
        };

        var opts = {
            url: apiUrl + '/' + orgName + '/' + appName + '/users/' + this.user + '/contacts/users',
            dataType: 'json',
            type: 'GET',
            headers: {'Authorization': 'Bearer ' + token},
            // data: pageInfo,
            success: suc || _utils.emptyfn,
            error: error || _utils.emptyfn
        };
        _utils.ajax(opts);
    } else {
        conn.onError({
            type: _code.WEBIM_CONNCTION_TOKEN_NOT_ASSIGN_ERROR
        });
    }
};



/**
 * 订阅和反向订阅
 * @example
 *
 * A订阅B（A添加B为好友）
 * A执行：
 *  conn.subscribe({
        to: 'B',
        message: 'Hello~'
    });
 B的监听函数onPresence参数message.type == subscribe监听到有人订阅他
 B执行：
 conn.subscribed({
    to: 'A',
    message: '[resp:true]'
 });
 同意A的订阅请求
//  B继续执行：
//  conn.subscribe({
//     to: 'A',
//     message: '[resp:true]'
//  });
//  反向订阅A，这样才算双方添加好友成功。
//被注释部分 sdk 3.0之后需要去掉
 若B拒绝A的订阅请求，只需执行：
 conn.unsubscribed({
    to: 'A',
    message: 'I do not want to be subscribed'
 });
 另外，在监听函数onPresence参数message.type == "subscribe"这个case中，加一句
 if (message && message.status === '[resp:true]') {
    return;
 }
 否则会进入死循环
 *
 * @param {Object} options - 
 * @param {String} options.to - 想要订阅的联系人ID
 * @param {String} options.nick - 想要订阅的联系人昵称 （非必须）
 * @param {String} options.message - 发送给想要订阅的联系人的验证消息（非必须）
 */
connection.prototype.subscribe = function (options) {
    HandleRosterMessage.operatRoster(options, "add", this);
};

/**
 * 被订阅后确认同意被订阅
 * @param {Object} options - 
 * @param {String} options.to - 订阅人的ID
 * @param {String} options.message  - 默认为[resp:true]，后续将去掉该参数
 */
connection.prototype.subscribed = function (options) {
    HandleRosterMessage.operatRoster(options, "accept", this);
};

/**
 * 取消订阅成功(已废弃)
 * @param {Object} options
 * @deprecated
 */
connection.prototype.unsubscribe = function (options) {
    var jid = _getJid(options, this);
    var pres = $pres({to: jid, type: 'unsubscribe'});

    if (options.message) {
        pres.c('status').t(options.message);
    }
    this.sendCommand(pres.tree());
};

/**
 * 拒绝对方的订阅请求
 * @param {Object} options -
 * @param {String} options.to - 订阅人的ID
 * @param {String} options.message - 发送给拒绝订阅的联系人的验证消息（非必须）
 */
connection.prototype.unsubscribed = function (options) {
    HandleRosterMessage.operatRoster(options, "decline", this);
};

/**
 * 加入公开群组(已废弃)
 * @param {Object} options
 * @deprecated
 */
connection.prototype.joinPublicGroup = function (options) {
    var roomJid = this.context.appKey + '_' + options.roomId + '@conference.' + this.domain;
    var room_nick = roomJid + '/' + this.context.userId;
    var suc = options.success || _utils.emptyfn;
    var err = options.error || _utils.emptyfn;
    var errorFn = function (ele) {
        err({
            type: _code.WEBIM_CONNCTION_JOINROOM_ERROR,
            data: ele
        });
    };
    var iq = $pres({
        from: this.context.jid,
        to: room_nick
    })
        .c('x', {xmlns: Strophe.NS.MUC});

    this.context.stropheConn.sendIQ(iq.tree(), suc, errorFn);
};


/**
 * @private
 *
 */
connection.prototype.isOpened = function () {
    //SockJS.OPEN = 1
    return sock && sock.readyState === 1;
};

/**
 * @private
 *
 */
connection.prototype.clear = function () {
    var key = this.context.appKey;
    if (this.errorType != _code.WEBIM_CONNCTION_DISCONNECTED) {
        // this.context = {
        //     status: _code.STATUS_INIT,
        //     appKey: key
        // };
        if (this.logOut) {
            this.unSendMsgArr = [];
            this.offLineSendConnecting = false;
            this.context = {
                status: _code.STATUS_INIT,
                appKey: key
            };
        }
    }
    if (this.intervalId) {
        clearInterval(this.intervalId);
    }
    this.restIndex = 0;
    this.xmppIndex = 0;

    if (this.errorType == _code.WEBIM_CONNCTION_CLIENT_LOGOUT || this.errorType == -1) {
        var message = {
            data: {
                data: "logout"
            },
            type: _code.WEBIM_CONNCTION_CLIENT_LOGOUT
        };
        this.onError(message);
    }
};

var _fetchMessages = function(options,conn) {

    var token = options.accessToken || conn.context.accessToken
    
    if (!_utils.isCanSetRequestHeader) {
        conn.onError({
            type: _code.WEBIM_CONNCTION_NOT_SUPPORT_CHATROOM_ERROR
        });
        return;
    }

    if (token) {
        var apiUrl = conn.apiUrl;
        var appName = conn.context.appName;
        var orgName = conn.context.orgName;

        if (!appName || !orgName) {
            conn.onError({
                type: _code.WEBIM_CONNCTION_AUTH_ERROR
            });
            return;
        }

        if (!options.queue) {
            conn.onError({
                type: "",
                msg: "queue is not specified"
            });
            return;
        }

        var queue = options.queue
        var _dataQueue = mr_cache[queue] || (mr_cache[queue] = {msgs: []})
    
        var suc = function (res, xhr) {
            
            if (res && res.data) {
                var data = res.data
                if(!res.data.msgs){
                    typeof options.success === 'function' && options.success({msgs:[]});
                    _dataQueue.is_last = true
                    _dataQueue.next_key = ''
                    return;
                }
                var msgs =data.msgs;
                var length = msgs.length;
                
                _dataQueue.is_last = data.is_last;
                _dataQueue.next_key = data.next_key;

                var _parseMeta = function(meta){
                    var arr = [];
                    meta = Base64.atob(meta);
                    for (var i = 0, j = meta.length; i < j; ++i) {
                        arr.push(meta.charCodeAt(i));
                    }
                    //var tmpUint8Array = new Uint8Array(arr); 

                    var CommSyncDLMessage = conn.context.root.lookup("easemob.pb.Meta");
                    CommSyncDLMessage = CommSyncDLMessage.decode(arr);

                    var status = {
                        errorCode: 0,
                        reason: ''
                    }
                    if(CommSyncDLMessage.ns == 1){
                        var thirdMessage = HandleChatMessage(CommSyncDLMessage, status, conn, true)
                        return thirdMessage;
                    }else{

                    }
                }
                
                try {
                   for (var i = 0; i < length; i++) {
                        var msgObj = _parseMeta(msgs[i].msg)
                        msgObj&&_dataQueue.msgs.push(msgObj); 
                    }
                }
                catch(err) {
                    console.log(err)
                } 
                finally {
                    typeof options.success === 'function' && options.success(_dataQueue);
                }
            }
        };

        var error = function (res, msg) {
            if (res.error && res.error_description) {
                conn.onError({
                    type: _code.WEBIM_CONNCTION_LOAD_CHATROOM_ERROR,
                    msg: res.error_description,
                    data: res
                });
            }
        };

        var userId = conn.context.userId;    
        var start = -1
        
        // 无历史消息或者缓存消息足够不再加载
        if (_dataQueue.msgs.length >= options.count || _dataQueue.is_last) {
            typeof options.success === 'function' && options.success(_dataQueue);
            return;
        }
        
        // 根据上一次拉取返回的last_key 进行本次消息拉取
        if (_dataQueue && _dataQueue.next_key) {
            start = _dataQueue.next_key
        }

        var suffix = options.isGroup ? "@conference.easemob.com" : "@easemob.com";
        var data = {
            queue: queue + suffix,
            start: start,
            end: -1
        };
 
        var opts = {
            url: apiUrl + '/' + orgName + '/' + appName + '/users/' + userId + '/messageroaming',
            dataType: 'json',
            type: 'POST',
            headers: {'Authorization': 'Bearer ' + token},
            data: JSON.stringify(data),
            success: suc || _utils.emptyfn,
            error: error || _utils.emptyfn
        };

        _utils.ajax(opts);

    }  else {
        conn.onError({
            type: _code.WEBIM_CONNCTION_TOKEN_NOT_ASSIGN_ERROR
        });
    }
}

/**
 * 获取对话历史消息
 * @param {Object} options
 * @param {String} options.queue   - 对方用户名Id
 * @param {String} options.count   - 拉取条数
 * @param {Boolean} options.isGroup - 是否是群聊,默认为false
 * @param {Function} options.success
 * @param {Funciton} options.fail
 */
connection.prototype.fetchHistoryMessages = function(options) {
    var conn = this
    if (!options.queue) {
        conn.onError({
            type: "",
            msg: "queue is not specified"
        });
        return;
    }

    var count = options.count || 20
    function _readCacheMessages() {
        _fetchMessages({
            count: count,
            isGroup: options.isGroup ? true: false,
            queue: options.queue,
            success: function(data) {
                var length = data.msgs.length
                if (length >= count || data.is_last) {
                    options.success&&options.success(_utils.reverse(data.msgs.splice(0, count)))
                } else {
                    _readCacheMessages()
                }
            },
            fail: function(){
            }
        }, conn)
    }
    _readCacheMessages()
};


/**
 * 获取聊天室列表（分页）
 * @param {Object} options -
 * @param {String} options.apiUrl - rest的接口地址
 * @param {Number} options.pagenum - 页码，默认1
 * @param {Number} options.pagesize - 每页数量，默认20
 * @param {Function} options.success - 成功之后的回调，默认为空
 */
connection.prototype.getChatRooms = function (options) {

    if (!_utils.isCanSetRequestHeader) {
        conn.onError({
            type: _code.WEBIM_CONNCTION_NOT_SUPPORT_CHATROOM_ERROR
        });
        return;
    }

    var conn = this,
        token = options.accessToken || this.context.accessToken;

    if (token) {
        var apiUrl = options.apiUrl;
        var appName = this.context.appName;
        var orgName = this.context.orgName;

        if (!appName || !orgName) {
            conn.onError({
                type: _code.WEBIM_CONNCTION_AUTH_ERROR
            });
            return;
        }

        var suc = function (data, xhr) {
            typeof options.success === 'function' && options.success(data);
        };

        var error = function (res, xhr, msg) {
            if (res.error && res.error_description) {
                conn.onError({
                    type: _code.WEBIM_CONNCTION_LOAD_CHATROOM_ERROR,
                    msg: res.error_description,
                    data: res,
                    xhr: xhr
                });
            }
        };

        var pageInfo = {
            pagenum: parseInt(options.pagenum) || 1,
            pagesize: parseInt(options.pagesize) || 20
        };

        var opts = {
            url: apiUrl + '/' + orgName + '/' + appName + '/chatrooms',
            dataType: 'json',
            type: 'GET',
            headers: {'Authorization': 'Bearer ' + token},
            data: pageInfo,
            success: suc || _utils.emptyfn,
            error: error || _utils.emptyfn
        };
        _utils.ajax(opts);
    } else {
        conn.onError({
            type: _code.WEBIM_CONNCTION_TOKEN_NOT_ASSIGN_ERROR
        });
    }

};

/**
 * 加入聊天室
 * @param {Object} options - 
 * @param {String} options.roomId - 聊天室的ID
 * @param {stirng} opt.message - 原因，可选项
 * @param {Function} options.success - 成功之后的回调，默认为空
 * @param {Function} options.error - 失败之后的回调，默认为空
 */
connection.prototype.joinChatRoom = function (options) {
    var options = options || {};
    if (!_utils.isCanSetRequestHeader) {
        conn.onError({
            type: _code.WEBIM_CONNCTION_NOT_SUPPORT_CHATROOM_ERROR
        });
        return;
    }

    var conn = this
    var token = options.accessToken || this.token;

    if (token) {
        var apiUrl = options.apiUrl || this.apiUrl;
        var appName = this.context.appName;
        var orgName = this.context.orgName;
        var roomId = options.roomId
        var message = options.message || '';
        if (!appName || !orgName) {
            conn.onError({
                type: _code.WEBIM_CONNCTION_AUTH_ERROR
            });
            return;
        }

        var suc = function (data, xhr) {
            typeof options.success === 'function' && options.success(data);
        };

        var error = function (res, xhr, msg) {
            typeof options.error === 'function' && options.error(res);
        };

        var opts = {
            url: apiUrl + '/' + orgName + '/' + appName + '/chatrooms/' + roomId + '/apply',
            dataType: 'json',
            type: 'POST',
            data: JSON.stringify({
                message: message
            }),
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            success: suc || _utils.emptyfn,
            error: error || _utils.emptyfn
        };
        _utils.ajax(opts);
    } else {
        conn.onError({
            type: _code.WEBIM_CONNCTION_TOKEN_NOT_ASSIGN_ERROR
        });
    }
};

/**
 * 退出聊天室
 * @param {Object} options -
 * @param {String} options.roomId - 聊天室的ID
 * @param {Function} options.success - 成功之后的回调，默认为空
 * @param {Function} options.error - 失败之后的回调，默认为空
 */
connection.prototype.quitChatRoom = function (options) {
    var options = options || {};
    if (!_utils.isCanSetRequestHeader) {
        conn.onError({
            type: _code.WEBIM_CONNCTION_NOT_SUPPORT_CHATROOM_ERROR
        });
        return;
    }

    var conn = this
    var token = options.accessToken || this.token;

    if (token) {
        var apiUrl = options.apiUrl || this.apiUrl;
        var appName = this.context.appName;
        var orgName = this.context.orgName;
        var roomId = options.roomId
        if (!appName || !orgName) {
            conn.onError({
                type: _code.WEBIM_CONNCTION_AUTH_ERROR
            });
            return;
        }

        var suc = function (data, xhr) {
            typeof options.success === 'function' && options.success(data);
        };

        var error = function (res, xhr, msg) {
            typeof options.error === 'function' && options.error(res);
        };

        var opts = {
            url: apiUrl + '/' + orgName + '/' + appName + '/chatrooms/' + roomId + '/quit',
            dataType: 'json',
            type: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: suc || _utils.emptyfn,
            error: error || _utils.emptyfn
        };
        _utils.ajax(opts);
    } else {
        conn.onError({
            type: _code.WEBIM_CONNCTION_TOKEN_NOT_ASSIGN_ERROR
        });
    }
};

/**
 * for windowSDK
 * @private
 *
 */
connection.prototype._onReceiveInviteFromGroup = function (info) {
    info = eval('(' + info + ')');
    var self = this;
    var options = {
        title: "Group invitation",
        msg: info.user + " invites you to join into group:" + info.group_id,
        agree: function agree() {
            WebIM.doQuery('{"type":"acceptInvitationFromGroup","id":"' + info.group_id + '","user":"' + info.user + '"}', function (response) {
            }, function (code, msg) {
                var message = {
                    data: {
                        data: "acceptInvitationFromGroup error:" + msg
                    },
                    type: _code.WEBIM_CONNECTION_ACCEPT_INVITATION_FROM_GROUP
                };
                self.onError(message);
            });
        },
        reject: function reject() {
            WebIM.doQuery('{"type":"declineInvitationFromGroup","id":"' + info.group_id + '","user":"' + info.user + '"}', function (response) {
            }, function (code, msg) {
                var message = {
                    data: {
                        data: "declineInvitationFromGroup error:" + msg
                    },
                    type: _code.WEBIM_CONNECTION_DECLINE_INVITATION_FROM_GROUP
                };
                self.onError(message);
            });
        }
    };

    this.onConfirmPop(options);
};

/**
 * for windowSDK
 * @private
 *
 */
connection.prototype._onReceiveInviteAcceptionFromGroup = function (info) {
    info = eval('(' + info + ')');
    var options = {
        title: "Group invitation response",
        msg: info.user + " agreed to join into group:" + info.group_id,
        agree: function agree() {
        }
    };
    this.onConfirmPop(options);
};

/**
 * for windowSDK
 * @private
 *
 */
connection.prototype._onReceiveInviteDeclineFromGroup = function (info) {
    info = eval('(' + info + ')');
    var options = {
        title: "Group invitation response",
        msg: info.user + " rejected to join into group:" + info.group_id,
        agree: function agree() {
        }
    };
    this.onConfirmPop(options);
};

/**
 * for windowSDK
 * @private
 *
 */
connection.prototype._onAutoAcceptInvitationFromGroup = function (info) {
    info = eval('(' + info + ')');
    var options = {
        title: "Group invitation",
        msg: "You had joined into the group:" + info.group_name + " automatically.Inviter:" + info.user,
        agree: function agree() {
        }
    };
    this.onConfirmPop(options);
};

/**
 * for windowSDK
 * @private
 *
 */
connection.prototype._onLeaveGroup = function (info) {
    info = eval('(' + info + ')');
    var options = {
        title: "Group notification",
        msg: "You have been out of the group:" + info.group_id + ".Reason:" + info.msg,
        agree: function agree() {
        }
    };
    this.onConfirmPop(options);
};

/**
 * for windowSDK
 * @private
 *
 */
connection.prototype._onReceiveJoinGroupApplication = function (info) {
    info = eval('(' + info + ')');
    var self = this;
    var options = {
        title: "Group join application",
        msg: info.user + " applys to join into group:" + info.group_id,
        agree: function agree() {
            WebIM.doQuery('{"type":"acceptJoinGroupApplication","id":"' + info.group_id + '","user":"' + info.user + '"}', function (response) {
            }, function (code, msg) {
                var message = {
                    data: {
                        data: "acceptJoinGroupApplication error:" + msg
                    },
                    type: _code.WEBIM_CONNECTION_ACCEPT_JOIN_GROUP
                };
                self.onError(message);
            });
        },
        reject: function reject() {
            WebIM.doQuery('{"type":"declineJoinGroupApplication","id":"' + info.group_id + '","user":"' + info.user + '"}', function (response) {
            }, function (code, msg) {
                var message = {
                    data: {
                        data: "declineJoinGroupApplication error:" + msg
                    },
                    type: _code.WEBIM_CONNECTION_DECLINE_JOIN_GROUP
                };
                self.onError(message);
            });
        }
    };
    this.onConfirmPop(options);
};

/**
 * for windowSDK
 * @private
 *
 */
connection.prototype._onReceiveAcceptionFromGroup = function (info) {
    info = eval('(' + info + ')');
    var options = {
        title: "Group notification",
        msg: "You had joined into the group:" + info.group_name + ".",
        agree: function agree() {
        }
    };
    this.onConfirmPop(options);
};

/**
 * for windowSDK
 * @private
 *
 */
connection.prototype._onReceiveRejectionFromGroup = function () {
    info = eval('(' + info + ')');
    var options = {
        title: "Group notification",
        msg: "You have been rejected to join into the group:" + info.group_name + ".",
        agree: function agree() {
        }
    };
    this.onConfirmPop(options);
};

/**
 * for windowSDK
 * @private
 *
 */
connection.prototype._onUpdateMyGroupList = function (options) {
    this.onUpdateMyGroupList(options);
};

/**
 * for windowSDK
 * @private
 *
 */
connection.prototype._onUpdateMyRoster = function (options) {
    this.onUpdateMyRoster(options);
};

/**
 * @private
 *
 */
connection.prototype.reconnect = function (v) {
    // debugger
    // var that = this;
    // if(that.xmppIndex < that.xmppHosts.length - 1){
    //     that.xmppIndex++;       //重连时改变ip地址
    // }
    // setTimeout(function () {
    //     _login({access_token: that.context.accessToken}, that);
    // }, (this.autoReconnectNumTotal == 0 ? 0 : this.autoReconnectInterval) * 1000);
    // this.autoReconnectNumTotal++;
};

/**
 *
 * @private
 * @deprecated
 */
connection.prototype.closed = function () {
    var message = {
        data: {
            data: "Closed error"
        },
        type: _code.WEBIM_CONNECTION_CLOSED
    };
    this.onError(message);
};

/**
 * used for blacklist
 * @private
 *
 */
function _parsePrivacy(iq) {      //**** */
    var list = {};
    var items = iq.getElementsByTagName('item');

    if (items) {
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var jid = item.getAttribute('value');
            var order = item.getAttribute('order');
            var type = item.getAttribute('type');
            if (!jid) {
                continue;
            }
            var n = _parseNameFromJidFn(jid);
            list[n] = {
                type: type,
                order: order,
                jid: jid,
                name: n
            };
        }
    }
    return list;
};

/**
 * 获取好友黑名单
 * @param {Object} options - 
 * @param {Function} options.success - 成功之后的回调，默认为空
 * @param {Function} options.error - 失败之后的回调，默认为空
 */
connection.prototype.getBlacklistOld = function (options) {
    options = (options || {});
    var iq = $iq({type: 'get'});
    var sucFn = options.success || _utils.emptyfn;
    var errFn = options.error || _utils.emptyfn;
    var me = this;

    iq.c('query', {xmlns: 'jabber:iq:privacy'})
        .c('list', {name: 'special'});

    this.context.stropheConn.sendIQ(iq.tree(), function (iq) {
        me.onBlacklistUpdate(_parsePrivacy(iq));
        sucFn();
    }, function () {
        me.onBlacklistUpdate([]);
        errFn();
    });
};

/**
 * 获取好友黑名单
 * @param {Object} options - 
 * @param {Function} options.success - 成功之后的回调，默认为空
 * @param {Function} options.error - 失败之后的回调，默认为空
 */
connection.prototype.getBlacklist = function (options) {
    var me = this;
    var options = options || {};
    if (!_utils.isCanSetRequestHeader) {
        conn.onError({
            type: _code.WEBIM_CONNCTION_NOT_SUPPORT_CHATROOM_ERROR
        });
        return;
    }

    var conn = this,
        token = options.accessToken || this.token;

    if (token) {
        var apiUrl = options.apiUrl || this.apiUrl;
        var appName = this.context.appName;
        var orgName = this.context.orgName;

        if (!appName || !orgName) {
            conn.onError({
                type: _code.WEBIM_CONNCTION_AUTH_ERROR
            });
            return;
        }

        var suc = function (data, xhr) {
            var list = {};
            data.data.forEach((v,i)=>{
                list[v] = {
                    name: v
                }
            })
            me.onBlacklistUpdate(list);
            typeof options.success === 'function' && options.success(data);
        };

        var error = function (res, xhr, msg) {
            me.onBlacklistUpdate([]);
            typeof options.error === 'function' && options.error(res);
        };

        var opts = {
            url: apiUrl + '/' + orgName + '/' + appName + '/users/' + this.user + '/blocks/users',
            dataType: 'json',
            type: 'GET',
            headers: {'Authorization': 'Bearer ' + token},
            success: suc || _utils.emptyfn,
            error: error || _utils.emptyfn
        };
        _utils.ajax(opts);
    } else {
        conn.onError({
            type: _code.WEBIM_CONNCTION_TOKEN_NOT_ASSIGN_ERROR
        });
    }
};

/**
 * 将好友加入到黑名单
 * @param {Object} options -    //&&&&
 * @param {Object[]} options.name - 用户ID,添加一个为单个用户ID；批量添加为用户ID数组，如["user1","user2",...]
 */
connection.prototype.addToBlackList = function (options) {
    HandleRosterMessage.operatRoster({
        to: options.name
    }, "ban", this);
};

/**
 * 将好友从黑名单移除
 * @param {Object} options -      //&&&&&
 * @param {Object[]} options.name - 用户ID,删除一个为单个用户ID，如 "user1"；批量删除为用户ID数组，如 ["user1","user2",...]
 */
connection.prototype.removeFromBlackList = function (options) {
    HandleRosterMessage.operatRoster({
        to: options.name
    }, "allow", this);
};

/**
 * 查询群组消息都被哪些用户读过
 * @param {Object} options -
 * @param {String} options.groupId - 群组id
 * @param {String} options.msgId - 消息id
 * @param {Function} options.success - 成功的回调
 * @param {Function} options.error - 失败的回调
 *
 */
connection.prototype.getGroupMsgReadUser = function (options) {
    var me = this;
    var options = options || {};
    if (!_utils.isCanSetRequestHeader) {
        conn.onError({
            type: _code.WEBIM_CONNCTION_NOT_SUPPORT_CHATROOM_ERROR
        });
        return;
    }

    var token = options.accessToken || this.token;

    if (token) {
        var apiUrl = me.apiUrl;
        var appName = me.context.appName;
        var orgName = me.context.orgName;

        if (!appName || !orgName) {
            me.onError({
                type: _code.WEBIM_CONNCTION_AUTH_ERROR
            });
            return;
        }

        var suc = function(data){
            typeof options.success === 'function' && options.success(data);
        }
        var error = function(err){
            typeof options.error === 'function' && options.error(err);
        }

        var opts = {
            url: apiUrl + '/' + orgName + '/' + appName + '/chatgroups/'+options.groupId+'/acks/' + options.msgId,
            dataType: 'json',
            type: 'GET',
            data: {limit:500, key: undefined},
            headers: {'Authorization': 'Bearer ' + token},
            success: suc || _utils.emptyfn,
            error: error || _utils.emptyfn
        };
        _utils.ajax(opts);

    }
    else {
        me.onError({
            type: _code.WEBIM_CONNCTION_TOKEN_NOT_ASSIGN_ERROR
        });
    }
}
/**
 *
 * @private
 */
connection.prototype._getGroupJid = function (to) {      //****均在已经废弃的方法中使用 */
    var appKey = this.context.appKey || '';
    return appKey + '_' + to + '@conference.' + this.domain;
};

/**
 *
 * @private
 */
function _parseGroupBlacklist(iq) {
    var list = {};
    var items = iq.getElementsByTagName('item');

    if (items) {
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var jid = item.getAttribute('jid');
            var affiliation = item.getAttribute('affiliation');
            var nick = item.getAttribute('nick');
            if (!jid) {
                continue;
            }
            var n = _parseNameFromJidFn(jid);
            list[n] = {
                jid: jid,
                affiliation: affiliation,
                nick: nick,
                name: n
            };
        }
    }
    return list;
}

/**
 * 接受加入申请(已废弃)
 *
 * @param {Object} options - 
 * @param {Array} options.list - 列表，默认[]
 * @param {String} options.roomId - 聊天室id
 * @param {String} options.reason - 原因
 * @param {Function} options.success - 成功之后的回调，默认为空
 * @param {Function} options.error - 失败之后的回调，默认为空
 * @deprecated
 */
connection.prototype.acceptInviteFromGroup = function (options) {
    options.success = function () {
        // then send sendAcceptInviteMessage
        // connection.prototype.sendAcceptInviteMessage(optoins);
    };
    this.addGroupMembers(options);
};

/**
 * 创建群组(已废弃)
 * @param {Object} options -
 * @deprecated
 * @example
 * 1. 创建申请 -> 得到房主身份
 * 2. 获取房主信息 -> 得到房间form
 * 3. 完善房间form -> 创建成功
 * 4. 添加房间成员
 * 5. 消息通知成员
 */
connection.prototype.createGroup = function (options) {
    this.groupOption = options;
    var roomId = +new Date();
    var toRoom = this._getGroupJid(roomId);
    var to = toRoom + '/' + this.context.userId;

    var pres = $pres({to: to})
        .c('x', {xmlns: 'http://jabber.org/protocol/muc'}).up()
        .c('create', {xmlns: 'http://jabber.org/protocol/muc'}).up();

    // createGroupACK
    this.sendCommand(pres.tree());
};
/**
 * 通过RestFul API接口创建群组
 * @param opt {Object} - 
 * @param opt.data {Object} - 群组信息
 * @param opt.data.groupname {string} - 群组名
 * @param opt.data.desc {string} - 群组描述
 * @param opt.data.members {string[]} - 好友id数组，群好友列表
 * @param opt.data.public {Boolean} - true: 公开群，false: 私有群
 * @param opt.data.approval {Boolean} - 前提：opt.data.public=true, true: 加群需要审批，false: 加群无需审批
 * @param opt.data.allowinvites {Boolean} - 前提：opt.data.public=false, true: 允许成员邀请入群，false: 不允许成员邀请入群
 * @param {Function} opt.success - 成功之后的回调，默认为空
 * @param {Function} opt.error - 失败之后的回调，默认为空
 * @since 1.4.11
 */
connection.prototype.createGroupNew = function (opt) {
    opt.data.owner = this.user;
    opt.data.invite_need_confirm = false;
    var options = {
        url: this.apiUrl + '/' + this.orgName + '/' + this.appName + '/chatgroups',
        dataType: 'json',
        type: 'POST',
        data: JSON.stringify(opt.data),
        headers: {
            'Authorization': 'Bearer ' + this.token,
            'Content-Type': 'application/json'
        }
    };
    options.success = function (respData) {
        opt.success(respData);
        this.onCreateGroup(respData);
    }.bind(this);
    options.error = opt.error || _utils.emptyfn;
    WebIM.utils.ajax(options);
};

/**
 * 通过RestFul API屏蔽群组，只对移动端有效
 * @param {Object} opt -
 * @param {string} opt.groupId - 需要屏蔽的群组ID
 * @param {Function} opt.success - 成功之后的回调，默认为空
 * @param {Function} opt.error - 失败之后的回调，默认为空
 * @since 1.4.11
 */
connection.prototype.blockGroup = function (opt) {
    var groupId = opt.groupId;
    groupId = 'notification_ignore_' + groupId;
    var data = {
        entities: []
    };
    data.entities[0] = {};
    data.entities[0][groupId] = true;
    var options = {
        type: 'PUT',
        url: this.apiUrl + '/' + this.orgName + '/'
        + this.appName + '/' + 'users' + '/' + this.user,
        data: JSON.stringify(data),
        headers: {
            'Authorization': 'Bearer ' + this.token,
            'Content-Type': 'application/json'
        }
    };
    options.success = opt.success || _utils.emptyfn;
    options.error = opt.error || _utils.emptyfn;
    WebIM.utils.ajax(options);
};


/**
 * 通过RestFul API分页获取群组列表
 * @param {Object} opt -
 * @param {Number} opt.limit - 每一页群组的最大数目
 * @param {string} opt.cursor=null - 游标，如果数据还有下一页，API 返回值会包含此字段，传递此字段可获取下一页的数据，为null时获取第一页数据
 * @param {Function} opt.success - 成功之后的回调，默认为空
 * @param {Function} opt.error - 失败之后的回调，默认为空
 * @since 1.4.11
 */
connection.prototype.listGroups = function (opt) {
    var requestData = [];
    requestData['limit'] = opt.limit;
    requestData['cursor'] = opt.cursor;
    if (!requestData['cursor'])
        delete requestData['cursor'];
    if (isNaN(opt.limit)) {
        throw 'The parameter \"limit\" should be a number';
        return;
    }
    var options = {
        url: this.apiUrl + '/' + this.orgName + '/' + this.appName + '/publicchatgroups',
        type: 'GET',
        dataType: 'json',
        data: requestData,
        headers: {
            'Authorization': 'Bearer ' + this.token,
            'Content-Type': 'application/json'
        }
    };
    options.success = opt.success || _utils.emptyfn;
    options.error = opt.error || _utils.emptyfn;
    WebIM.utils.ajax(options);
};

/**
 * 通过RestFul API列出某用户所加入的所有群组
 * @param {Object} opt - 
 * @param {Function} opt.success - 成功之后的回调，默认为空
 * @param {Function} opt.error - 失败之后的回调，默认为空
 * @since 1.4.11
 */
connection.prototype.getGroup = function (opt) {
    var options = {
        url: this.apiUrl + '/' + this.orgName +
        '/' + this.appName + '/' + 'users' + '/' +
        this.user + '/' + 'joined_chatgroups',
        dataType: 'json',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + this.token,
            'Content-Type': 'application/json'
        }
    };
    options.success = opt.success || _utils.emptyfn;
    options.error = opt.error || _utils.emptyfn;
    WebIM.utils.ajax(options);
};

/**
* 通过restful api转让群组
* @param {Object} opt
* @param {String}opt.groupId - 群组id
* @param {String}opt.newOwner - 群组的新管理员 ID
* @param {Function} opt.success - 成功之后的回调，默认为空
* @param {Function} opt.error - 失败之后的回调，默认为空
*/
connection.prototype.changeOwner = function (opt) {
   var requestData = {
       newowner: opt.newOwner
   }
   var options = {
       url: this.apiUrl + '/' + this.orgName + '/' + this.appName + '/chatgroups/' + opt.groupId,
       type: 'PUT',
       dataType: 'json',
       headers: {
           'Authorization': 'Bearer ' + this.token,
           'Content-Type': 'application/json'
       },
       data: JSON.stringify(requestData)
   }
   options.success = opt.success || _utils.emptyfn;
   options.error = opt.error || _utils.emptyfn;
   WebIM.utils.ajax(options);
},

/**
 * 通过RestFul API根据groupId获取群组详情
 * @param {Object} opt -
 * @param {string} opt.groupId - 群组ID
 * @param {Function} opt.success - 成功之后的回调，默认为空
 * @param {Function} opt.error - 失败之后的回调，默认为空
 * @since 1.4.11
 */
connection.prototype.getGroupInfo = function (opt) {
    var options = {
        url: this.apiUrl + '/' + this.orgName + '/' + this.appName + '/chatgroups/' + opt.groupId + '?joined_time=true',
        type: 'GET',
        dataType: 'json',
        headers: {
            'Authorization': 'Bearer ' + this.token,
            'Content-Type': 'application/json'
        }
    };
    options.success = opt.success || _utils.emptyfn;
    options.error = opt.error || _utils.emptyfn;
    WebIM.utils.ajax(options);
};

/**
 * 通过RestFul API修改群信息
 * @param {Object} opt -
 * @param {string} opt.groupId - 群组ID
 * @param {string} opt.groupName - 群组名
 * @param {string} opt.description - 群组简介
 * @param {Function} opt.success - 成功之后的回调，默认为空
 * @param {Function} opt.error - 失败之后的回调，默认为空
 */
connection.prototype.modifyGroup = function (opt) {
    var groupId = opt.groupId,
        requestData = {
            groupname: opt.groupName,
            description: opt.description
        },
        options = {
            url: this.apiUrl + '/' + this.orgName + '/' + this.appName
            + '/' + 'chatgroups' + '/' + groupId,
            type: 'PUT',
            data: JSON.stringify(requestData),
            dataType: 'json',
            headers: {
                'Authorization': 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            }
        };
    options.success = opt.success || _utils.emptyfn;
    options.error = opt.error || _utils.emptyfn;
    WebIM.utils.ajax(options);
};

/**
 * 通过RestFul API分页列出群组的所有成员
 * @param {Object} opt -
 * @param {Number} opt.pageNum - 页码，默认1
 * @param {Number} opt.pageSize - 每一页的最大群成员数目,最大值1000
 * @param {string} opt.groupId - 群组ID
 * @param {Function} opt.success - 成功之后的回调，默认为空
 * @param {Function} opt.error - 失败之后的回调，默认为空
 */
connection.prototype.listGroupMember = function (opt) {
    if (isNaN(opt.pageNum) || opt.pageNum <= 0) {
        throw 'The parameter \"pageNum\" should be a positive number';
        return;
    } else if (isNaN(opt.pageSize) || opt.pageSize <= 0) {
        throw 'The parameter \"pageSize\" should be a positive number';
        return;
    } else if (opt.groupId === null && typeof opt.groupId === 'undefined') {
        throw 'The parameter \"groupId\" should be added';
        return;
    }
    var requestData = [],
        groupId = opt.groupId;
    requestData['pagenum'] = opt.pageNum;
    requestData['pagesize'] = opt.pageSize;
    var options = {
        url: this.apiUrl + '/' + this.orgName + '/' + this.appName + '/chatgroups'
        + '/' + groupId + '/users',
        dataType: 'json',
        type: 'GET',
        data: requestData,
        headers: {
            'Authorization': 'Bearer ' + this.token,
            'Content-Type': 'application/json'
        }
    };
    options.success = opt.success || _utils.emptyfn;
    options.error = opt.error || _utils.emptyfn;
    WebIM.utils.ajax(options);
};

/**
 * 通过RestFul API获取群组下所有管理员
 * @param {Object} opt -
 * @param {string} opt.groupId - 群组ID
 * @param {Function} opt.success - 成功之后的回调，默认为空
 * @param {Function} opt.error - 失败之后的回调，默认为空
 * @since 1.4.11
 */
connection.prototype.getGroupAdmin = function (opt) {
    var groupId = opt.groupId;
    var options = {
        url: this.apiUrl + '/' + this.orgName + '/' + this.appName + '/chatgroups'
        + '/' + groupId + '/admin',
        dataType: 'json',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + this.token,
            'Content-Type': 'application/json'
        }
    };
    options.success = opt.success || _utils.emptyfn;
    options.error = opt.error || _utils.emptyfn;
    WebIM.utils.ajax(options);
};

/**
 * 通过RestFul API设置群管理员
 * @param {Object} opt -
 * @param {string} opt.groupId - 群组ID
 * @param {string} opt.username - 用户ID
 * @param {Function} opt.success - 成功之后的回调，默认为空
 * @param {Function} opt.error - 失败之后的回调，默认为空
 */
connection.prototype.setAdmin = function (opt) {
    var groupId = opt.groupId,
        requestData = {
            newadmin: opt.username
        },
        options = {
            url: this.apiUrl + '/' + this.orgName + '/' + this.appName + '/' + 'chatgroups'
            + '/' + groupId + '/' + 'admin',
            type: "POST",
            dataType: 'json',
            data: JSON.stringify(requestData),
            headers: {
                'Authorization': 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            }
        };
    options.success = opt.success || _utils.emptyfn;
    options.error = opt.error || _utils.emptyfn;
    WebIM.utils.ajax(options);
};

/**
 * 通过RestFul API取消群管理员
 * @param {Object} opt -
 * @param {string} opt.gorupId - 群组ID
 * @param {string} opt.username - 用户ID
 * @param {Function} opt.success - 成功之后的回调，默认为空
 * @param {Function} opt.error - 失败之后的回调，默认为空
 */
connection.prototype.removeAdmin = function (opt) {
    var groupId = opt.groupId,
        username = opt.username,
        options = {
            url: this.apiUrl + '/' + this.orgName + '/' + this.appName + '/' + 'chatgroups'
            + '/' + groupId + '/' + 'admin' + '/' + username,
            type: 'DELETE',
            dataType: 'json',
            headers: {
                'Authorization': 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            }
        };
    options.success = opt.success || _utils.emptyfn;
    options.error = opt.error || _utils.emptyfn;
    WebIM.utils.ajax(options);
};

/**
 * 通过RestFul API解散群组
 * @param {Object} opt -
 * @param {string} opt.groupId - 群组ID
 * @param {Function} opt.success - 成功之后的回调，默认为空
 * @param {Function} opt.error - 失败之后的回调，默认为空
 */
connection.prototype.dissolveGroup = function (opt) {
    var groupId = opt.groupId,
        options = {
            url: this.apiUrl + '/' + this.orgName + '/' + this.appName
            + '/' + 'chatgroups' + '/' + groupId + '?version=v3',
            type: 'DELETE',
            dataType: 'json',
            headers: {
                'Authorization': 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            }
        };
    options.success = opt.success || _utils.emptyfn;
    options.error = opt.error || _utils.emptyfn;
    WebIM.utils.ajax(options);
};

/**
 * 通过RestFul API离开群组
 * @param {Object} opt -
 * @param {string} opt.groupId - 群组ID
 * @param {Function} opt.success - 成功之后的回调，默认为空
 * @param {Function} opt.error - 失败之后的回调，默认为空
 */
connection.prototype.quitGroup = function (opt) {
    var groupId = opt.groupId,
        options = {
            url: this.apiUrl + '/' + this.orgName + '/' + this.appName
            + '/' + 'chatgroups' + '/' + groupId + '/' + 'quit',
            type: 'DELETE',
            dataType: 'json',
            headers: {
                'Authorization': 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            }
        };
    options.success = opt.success || _utils.emptyfn;
    options.error = opt.error || _utils.emptyfn;
    WebIM.utils.ajax(options);
};

/**
 * 通过RestFul API邀请群成员
 * @param {Object} opt -
 * @param {string} opt.groupId - 群组名
 * @param {string[]} opt.users - 用户ID数组
 * @param {Function} opt.success - 成功之后的回调，默认为空
 * @param {Function} opt.error - 失败之后的回调，默认为空
 */
connection.prototype.inviteToGroup = function (opt) {
    var groupId = opt.groupId,
        users = opt.users,
        requestData = {
            usernames: users
        },
        options = {
            url: this.apiUrl + '/' + this.orgName + '/' + this.appName
            + '/' + 'chatgroups' + '/' + groupId + '/' + 'invite',
            type: 'POST',
            data: JSON.stringify(requestData),
            dataType: 'json',
            headers: {
                'Authorization': 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            }
        };
    options.success = opt.success || _utils.emptyfn;
    options.error = opt.error || _utils.emptyfn;
    WebIM.utils.ajax(options);
};

/**
 * 通过RestFul API发出入群申请
 * @param {Object} opt -
 * @param {String} opt.groupId - 加入群组ID
 * @param {Function} opt.success - 成功之后的回调，默认为空
 * @param {Function} opt.error - 失败之后的回调，默认为空
 * @since 1.4.11
 */
connection.prototype.joinGroup = function (opt) {
    var options = {
        url: this.apiUrl + '/' + this.orgName + '/'
        + this.appName + '/' + 'chatgroups' + '/' + opt.groupId + '/' + 'apply',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({ message: 'join group' }),    // 后端参数变更，申请入群需要填写入群消息
        headers: {
            'Authorization': 'Bearer ' + this.token,
            'Content-Type': 'application/json'
        }
    };
    options.success = opt.success || _utils.emptyfn;
    options.error = opt.error || _utils.emptyfn;
    WebIM.utils.ajax(options);
};

/**
 * 通过RestFul API同意用户加入群
 * @param {Object} opt -
 * @param {string} opt.applicant - 申请加群的用户ID
 * @param {Object} opt.groupId - 群组ID
 * @param {Function} opt.success - 成功之后的回调，默认为空
 * @param {Function} opt.error - 失败之后的回调，默认为空
 */
connection.prototype.agreeJoinGroup = function (opt) {
    var groupId = opt.groupId,
        requestData = {
            "applicant": opt.applicant,
            "verifyResult": true,
            "reason": "no clue"
        },
        options = {
            url: this.apiUrl + '/' + this.orgName + '/' + this.appName
            + '/' + 'chatgroups' + '/' + groupId + '/' + 'apply_verify',
            type: 'POST',
            dataType: "json",
            data: JSON.stringify(requestData),
            headers: {
                'Authorization': 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            }
        };
    options.success = opt.success || _utils.emptyfn;
    options.error = opt.error || _utils.emptyfn;
    WebIM.utils.ajax(options);
};

/**
 * 通过RestFul API拒绝用户加入群
 * @param {Object} opt -
 * @param {string} opt.applicant - 申请加群的用户ID
 * @param {Object} opt.groupId - 群组ID
 * @param {Function} opt.success - 成功之后的回调，默认为空
 * @param {Function} opt.error - 失败之后的回调，默认为空
 */
connection.prototype.rejectJoinGroup = function (opt) {
    var groupId = opt.groupId,
        requestData = {
            "applicant": opt.applicant,
            "verifyResult": false,
            "reason": "no clue"
        },
        options = {
            url: this.apiUrl + '/' + this.orgName + '/' + this.appName
            + '/' + 'chatgroups' + '/' + groupId + '/' + 'apply_verify',
            type: 'POST',
            dataType: "json",
            data: JSON.stringify(requestData),
            headers: {
                'Authorization': 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            }
        };
    options.success = opt.success || _utils.emptyfn;
    options.error = opt.error || _utils.emptyfn;
    WebIM.utils.ajax(options);
};

/**
 * 通过RestFul API同意加群邀请
 * @param {Object} opt -
 * @param {string} opt.invitee - 处理群邀请用户的用户名
 * @param {Object} opt.groupId - 群组ID
 * @param {Function} opt.success - 成功之后的回调，默认为空
 * @param {Function} opt.error - 失败之后的回调，默认为空
 */
connection.prototype.agreeInviteIntoGroup = function (opt) {
    var groupId = opt.groupId,
        requestData = {
            "invitee": opt.invitee,
            "verifyResult": true
        },
        options = {
            url: this.apiUrl + '/' + this.orgName + '/' + this.appName
            + '/' + 'chatgroups' + '/' + groupId + '/' + 'invite_verify',
            type: 'POST',
            dataType: "json",
            data: JSON.stringify(requestData),
            headers: {
                'Authorization': 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            }
        };
    options.success = opt.success || _utils.emptyfn;
    options.error = opt.error || _utils.emptyfn;
    WebIM.utils.ajax(options);
};

/**
 * 通过RestFul API拒绝加群邀请
 * @param {Object} opt -
 * @param {string} opt.invitee - 处理群邀请用户的用户名
 * @param {Object} opt.groupId - 群组ID
 * @param {Function} opt.success - 成功之后的回调，默认为空
 * @param {Function} opt.error - 失败之后的回调，默认为空
 */
connection.prototype.rejectInviteIntoGroup = function (opt) {
    var groupId = opt.groupId,
        requestData = {
            "invitee": opt.invitee,
            "verifyResult": false
        },
        options = {
            url: this.apiUrl + '/' + this.orgName + '/' + this.appName
            + '/' + 'chatgroups' + '/' + groupId + '/' + 'invite_verify',
            type: 'POST',
            dataType: "json",
            data: JSON.stringify(requestData),
            headers: {
                'Authorization': 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            }
        };
    options.success = opt.success || _utils.emptyfn;
    options.error = opt.error || _utils.emptyfn;
    WebIM.utils.ajax(options);
};

/**
 * 通过RestFul API删除单个群成员
 * @param {Object} opt -
 * @param {string} opt.groupId - 群组ID
 * @param {string} opt.username - 用户ID
 * @param {Function} opt.success - 成功之后的回调，默认为空
 * @param {Function} opt.error - 失败之后的回调，默认为空
 */
connection.prototype.removeSingleGroupMember = function (opt) {
    var groupId = opt.groupId,
        username = opt.username,
        options = {
            url: this.apiUrl + '/' + this.orgName + '/' + this.appName
            + '/' + 'chatgroups' + '/' + groupId + '/' + 'users' + '/'
            + username,
            type: 'DELETE',
            dataType: 'json',
            headers: {
                'Authorization': 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            }
        };
    options.success = opt.success || _utils.emptyfn;
    options.error = opt.error || _utils.emptyfn;
    WebIM.utils.ajax(options);
};

/**
 * 通过RestFul API删除多个群成员
 * @param {Object} opt -
 * @param {string} opt.groupId - 群组ID
 * @param {string[]} opt.users - 用户ID数组
 * @param {Function} opt.success - 成功之后的回调，默认为空
 * @param {Function} opt.error - 失败之后的回调，默认为空
 */
connection.prototype.removeMultiGroupMember = function (opt) {
    var groupId = opt.groupId,
        users = opt.users.join(','),
        options = {
            url: this.apiUrl + '/' + this.orgName + '/' + this.appName
            + '/' + 'chatgroups' + '/' + groupId + '/' + 'users' + '/'
            + users,
            type: 'DELETE',
            dataType: 'json',
            headers: {
                'Authorization': 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            }
        };
    options.success = opt.success || _utils.emptyfn;
    options.error = opt.error || _utils.emptyfn;
    WebIM.utils.ajax(options);
};

/**
 * 通过RestFul API禁止群用户发言
 * @param {Object} opt -
 * @param {string} opt.username - 被禁言的群成员的ID
 * @param {Number} opt.muteDuration - 被禁言的时长，单位ms，如果是“-1000”代表永久
 * @param {string} opt.groupId - 群组ID
 * @param {Function} opt.success - 成功之后的回调，默认为空
 * @param {Function} opt.error - 失败之后的回调，默认为空
 * @since 1.4.11
 */
connection.prototype.mute = function (opt) {
    var groupId = opt.groupId,
        requestData = {
            "usernames": [opt.username],
            "mute_duration": opt.muteDuration
        },
        options = {
            url: this.apiUrl + '/' + this.orgName + '/' + this.appName + '/' + 'chatgroups'
            + '/' + groupId + '/' + 'mute',
            dataType: 'json',
            type: 'POST',
            headers: {
                'Authorization': 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(requestData)
        };
    options.success = opt.success || _utils.emptyfn;
    options.error = opt.error || _utils.emptyfn;
    WebIM.utils.ajax(options);
};

/**
 * 通过RestFul API取消对用户禁言
 * @param {Object} opt -
 * @param {string} opt.groupId - 群组ID
 * @param {string} opt.username - 被取消禁言的群用户ID
 * @param {Function} opt.success - 成功之后的回调，默认为空
 * @param {Function} opt.error - 失败之后的回调，默认为空
 * @since 1.4.11
 */
connection.prototype.removeMute = function (opt) {
    var groupId = opt.groupId,
        username = opt.username;
    var options = {
        url: this.apiUrl + '/' + this.orgName + '/' + this.appName + '/' + 'chatgroups'
        + '/' + groupId + '/' + 'mute' + '/' + username,
        dataType: 'json',
        type: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + this.token,
            'Content-Type': 'application/json'
        }
    };
    options.success = opt.success || _utils.emptyfn;
    options.error = opt.error || _utils.emptyfn;
    WebIM.utils.ajax(options);
};

/**
 * 通过RestFul API获取群组下所有被禁言成员
 * @param {Object} opt -
 * @param {string} opt.groupId - 群组ID
 * @param {Function} opt.success - 成功之后的回调，默认为空
 * @param {Function} opt.error - 失败之后的回调，默认为空
 */
connection.prototype.getMuted = function (opt) {
    var groupId = opt.groupId;
    var options = {
        url: this.apiUrl + '/' + this.orgName + '/' + this.appName + '/chatgroups'
        + '/' + groupId + '/mute',
        dataType: 'json',
        type: 'GET',
        headers: {
            'Authorization': 'Bearer ' + this.token,
            'Content-Type': 'application/json'
        }
    };
    options.success = opt.success || _utils.emptyfn;
    options.error = opt.error || _utils.emptyfn;
    WebIM.utils.ajax(options);
};



/**
 * 通过RestFul API添加用户至群组黑名单(单个)
 * @param {Object} opt -
 * @param {string} opt.groupId - 群组ID
 * @param {stirng} opt.username - 用户ID
 * @param {Function} opt.success - 成功之后的回调，默认为空
 * @param {Function} opt.error - 失败之后的回调，默认为空
 */
connection.prototype.groupBlockSingle = function (opt) {
    var groupId = opt.groupId,
        username = opt.username,
        options = {
            url: this.apiUrl + '/' + this.orgName + '/' + this.appName
            + '/' + 'chatgroups' + '/' + groupId + '/' + 'blocks' + '/'
            + 'users' + '/' + username,
            type: 'POST',
            dataType: 'json',
            headers: {
                'Authorization': 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            }
        };
    options.success = opt.success || _utils.emptyfn;
    options.error = opt.error || _utils.emptyfn;
    WebIM.utils.ajax(options);
};

/**
 * 通过RestFul API添加用户至群组黑名单(批量)
 * @param {Object} opt -
 * @param {string[]} opt.username - 用户ID数组
 * @param {string} opt.groupId - 群组ID
 * @param {Function} opt.success - 成功之后的回调，默认为空
 * @param {Function} opt.error - 失败之后的回调，默认为空
 */
connection.prototype.groupBlockMulti = function (opt) {
    var groupId = opt.groupId,
        usernames = opt.usernames,
        requestData = {
            usernames: usernames
        },
        options = {
            url: this.apiUrl + '/' + this.orgName + '/' + this.appName
            + '/' + 'chatgroups' + '/' + groupId + '/' + 'blocks' + '/'
            + 'users',
            data: JSON.stringify(requestData),
            type: 'POST',
            dataType: 'json',
            headers: {
                'Authorization': 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            }
        };
    options.success = opt.success || _utils.emptyfn;
    options.error = opt.error || _utils.emptyfn;
    WebIM.utils.ajax(options);
};

/**
 * 通过RestFul API将用户从群黑名单移除（单个）
 * @param {Object} opt -
 * @param {string} opt.groupId - 群组ID
 * @param {string} opt.username - 用户ID
 * @param {Function} opt.success - 成功之后的回调，默认为空
 * @param {Function} opt.error - 失败之后的回调，默认为空
 */
connection.prototype.removeGroupBlockSingle = function (opt) {
    var groupId = opt.groupId,
        username = opt.username,
        options = {
            url: this.apiUrl + '/' + this.orgName + '/' + this.appName
            + '/' + 'chatgroups' + '/' + groupId + '/' + 'blocks' + '/'
            + 'users' + '/' + username,
            type: 'DELETE',
            dataType: 'json',
            headers: {
                'Authorization': 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            }
        };
    options.success = opt.success || _utils.emptyfn;
    options.error = opt.error || _utils.emptyfn;
    WebIM.utils.ajax(options);
};

/**
 * 通过RestFul API将用户从群黑名单移除（批量）
 * @param {Object} opt -
 * @param {string} opt.groupId - 群组ID
 * @param {string} opt.username - 多个用户ID逗号分隔
 * @param {Function} opt.success - 成功之后的回调，默认为空
 * @param {Function} opt.error - 失败之后的回调，默认为空
 */
connection.prototype.removeGroupBlockMulti = function (opt) {
    var groupId = opt.groupId,
        username = opt.username.join(','),
        options = {
            url: this.apiUrl + '/' + this.orgName + '/' + this.appName
            + '/' + 'chatgroups' + '/' + groupId + '/' + 'blocks' + '/'
            + 'users' + '/' + username,
            type: 'DELETE',
            dataType: 'json',
            headers: {
                'Authorization': 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            }
        };
    options.success = opt.success || _utils.emptyfn;
    options.error = opt.error || _utils.emptyfn;
    WebIM.utils.ajax(options);
};


/**
 * 通过RestFul API获取群组黑名单
 * @param {Object} opt -
 * @param {string} opt.groupId - 群组ID
 * @param {Function} opt.success - 成功之后的回调，默认为空
 * @param {Function} opt.error - 失败之后的回调，默认为空
 */
connection.prototype.getGroupBlacklistNew = function (opt) {
    var groupId = opt.groupId,
        options = {
            url: this.apiUrl + '/' + this.orgName + '/' + this.appName
            + '/' + 'chatgroups' + '/' + groupId + '/' + 'blocks' + '/' + 'users',
            type: 'GET',
            dataType: 'json',
            headers: {
                'Authorization': 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            }
        };
    options.success = opt.success || _utils.emptyfn;
    options.error = opt.error || _utils.emptyfn;
    WebIM.utils.ajax(options);
};
connection.prototype.listRooms = function (options) {}


var WebIM = window.WebIM || {};
WebIM.connection = connection;
WebIM.utils = _utils;
WebIM.statusCode = _code;
WebIM.message = _msg.message;
WebIM.doQuery = function (str, suc, fail) {
    if (typeof window.cefQuery === 'undefined') {
        return;
    }
    window.cefQuery({
            request: str,
            persistent: false,
            onSuccess: suc,
            onFailure: fail
        }
    );
};

/**************************** debug ****************************/
WebIM.debug = function (bool) {

    // logMessage = function (message) {
    //     bool && console.log(WebIM.utils.ts() + '[recv] ', message.data);
    // }

    // Strophe.Connection.prototype.rawOutput = function (data) {
    //     bool && console.log('%c ' + WebIM.utils.ts() + '[send] ' + data, "background-color: #e2f7da");
    // }

}
WebIM.version = _version;
window.WebIM = WebIM;
if (module.hot) {
    module.hot.accept();
}
export default WebIM;

