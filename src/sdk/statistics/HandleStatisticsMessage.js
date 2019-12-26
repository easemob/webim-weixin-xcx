import Long from 'long';
import _utils from '../utils'
import getCode from '../status';
const _code = getCode();
var handleMessage = function(meta, status, conn){
	var self = conn;
	var messageBodyMessage = self.context.root.lookup("easemob.pb.StatisticsBody");
    var thirdMessage = messageBodyMessage.decode(meta.payload);
    var msgId = new Long(meta.id.low, meta.id.high, meta.id.unsigned).toString();

    switch (thirdMessage.operation){
        case 0:
            conn.onStatisticMessage(thirdMessage)
            break;
        case 1:
            var error = {
                type: _code.WEBIM_CONNCTION_USER_REMOVED
            };
            conn.logOut = true;
            conn.onError(error);
            // conn.onClosed();
            break;
        case 2:
            var error = {
                type: _code.WEBIM_CONNCTION_USER_LOGIN_ANOTHER_DEVICE
            };
            conn.logOut = true;
            conn.onError(error);
            break;
        case 3:
            var error = {
                type: _code.WEBIM_CONNCTION_USER_KICKED_BY_CHANGE_PASSWORD
            };
            conn.logOut = true;
            conn.onError(error);
            break;
        case 4:
            var error = {
                type: _code.WEBIM_CONNCTION_USER_KICKED_BY_OTHER_DEVICE
            };
            conn.logOut = true;
            conn.onError(error);
            break;
    }

    // conn.onPresence(msg);
    
}

export default handleMessage
