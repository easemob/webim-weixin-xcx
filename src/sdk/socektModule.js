class websocket {
    constructor(opt) {
        //重连时间
        this.heartBeatWait = opt.heartBeatWait || 5000;
        //重连延迟函数序列
        this.settime = "";
        //是否连接成功
        this.isconnect = false;
        //心跳发送数据
        this.heartdata = opt.heartdata || {};
        //多久发送一次心跳
        this.heartbeatsettime = opt.hearttime || 1000 * 50;
        //心跳延迟函数序列
        this.heartstime = 0;
        //url
        this.url = opt.url || "";
        //是否关闭心跳代码
        this.colse = false;
        //发送信息回调
        this.success = opt.success || function () { };
    }
    //连接
    connectsocket() {
        return new Promise((suc, err) => {
            if (this.url) {
                wx.connectSocket({
                    url: `${this.url}?topic=${this.heartdata.topic}&action=${this.heartdata.action}&abbr=${this.heartdata.abbr}&openid=${this.heartdata.openid}`,
                    success: task => {
                        //将websocket任务返回出去
                        this.monitor();
                        suc(task);
                    },
                    fail: err => {
                        console.log(1, err);
                        this.fails();
                        err();
                    }
                });
            } else {
                console.log("未输入地址");
                err();
            }
        });
    };
    //错误连接发生重连
    reconnect() {
        //必须先清理之前的定时器
        let self = this;
        clearTimeout(this.settime);
        //判断是否连接成功，成功则不再进行重新连接
        if (!this.isconnect) {
            //延迟发送
            this.settime = setTimeout(() => {
                self.connectsocket();
            }, this.heartBeatWait);
        }
    };
    //心跳发送
    heartbeat() {
        let sock = this.socket;
        //console.log(this.heartdata);
        //先清理之前的心跳
        clearTimeout(this.heartstime);
        this.heartstime = setTimeout(() => {
            wx.sendSocketMessage({
                data: JSON.stringify(this.heartdata),
                success: e => {
                    //发送成功则代表服务器正常
                    this.succ();
                },
                fail: e => {
                    //发送失败则代表服务器异常
                    this.fails();
                }
            });
        }, this.heartbeatsettime);
    }
    //监听事件
    monitor() {
        //检测异常关闭则执行重连
        wx.onSocketError((e) => {
            console.log(e);
            this.fails();
        });
        wx.onSocketClose((e) => {
            console.log(e);
            this.fails();
        });
        //连接成功则设置连接成功参数
        wx.onSocketOpen(() => {
            //成功则关闭重连函数
            this.succ();
            //首次连接发送数据
            wx.sendSocketMessage({
                data: JSON.stringify(this.heartdata),
                success: () => {
                    //发送成功则代表服务器正常
                    this.succ();
                },
                fail: e => {
                    //发送失败则代表服务器异常
                    this.fails();
                }
            });
            //回调函数
        });
        //接收发送信息
        this.sendsucc();
    }
    sendsucc() {
        //监听发送心跳之后数据是否正常返回，返回则再发一次心跳
        wx.onSocketMessage(res => {
            this.success(res);
            this.succ();
        });
    }
    //成功的处理
    succ() {
        this.isconnect = true;
        this.heartbeat();
    }
    //失败的处理
    fails() {
        if (!this.colse) {
            this.isconnect = false;
            this.reconnect();
        }
    }
    //结束心跳代码
    guanbi() {
        this.colse = true;
        clearTimeout(this.settime);
        clearTimeout(this.heartstime);
        wx.closeSocket();
        console.log("websock关闭");
    }
}
module.exports = websocket