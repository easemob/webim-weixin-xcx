let WebIM = require("../../utils/WebIM")["default"];
let __test_account__, __test_psword__;
let disp = require("../../utils/broadcast");
// __test_account__ = "easezy";
// __test_psword__ = "111111";
let runAnimation = true
let times = 60;
let timer
Page({
  data: {
    name: "",
    psd: "",
    grant_type: "password",
    rtcUrl: "",
    show_config: false, //默认不显示配置按钮
    isSandBox: false, //默认线上环境
    btnText: "获取验证码",
  },

  statechange(e) {
    console.log("live-player code:", e.detail.code);
  },

  error(e) {
    console.error("live-player error:", e.detail.errMsg);
  },

  onLoad: function (option) {
    const me = this;
    const app = getApp();
    new app.ToastPannel.ToastPannel();

    disp.on("em.xmpp.error.passwordErr", function () {
      me.toastFilled("用户名或密码错误");
    });
    disp.on("em.xmpp.error.activatedErr", function () {
      me.toastFilled("用户被封禁");
    });

    wx.getStorage({
      key: "isSandBox",
      success(res) {
        console.log(res.data);
        me.setData({
          isSandBox: !!res.data,
        });
      },
    });

    if (option.username && option.password != "") {
      this.setData({
        name: option.username,
        psd: option.password,
      });
    }
  },

  bindUsername: function (e) {
    this.setData({
      name: e.detail.value,
    });
  },

  bindPassword: function (e) {
    this.setData({
      psd: e.detail.value,
    });
  },
  onFocusPsd: function () {
    this.setData({
      psdFocus: "psdFocus",
    });
  },
  onBlurPsd: function () {
    this.setData({
      psdFocus: "",
    });
  },
  onFocusName: function () {
    this.setData({
      nameFocus: "nameFocus",
    });
  },
  onBlurName: function () {
    this.setData({
      nameFocus: "",
    });
  },

  getSmsCode: function () {
    const self = this;
    if (this.data.name == "") {
      return this.toastFilled("请输入手机号！");
    }

    if (this.data.btnText != "获取验证码") return;
    // 发送短信验证码
    wx.request({
      url: `https://a1.easemob.com/inside/app/sms/send/${this.data.name}`,
      header: {
        "content-type": "application/json",
      },
      method: "POST",
      data: {
        phoneNumber: this.data.name,
      },
      success(res) {
        if (res.statusCode == 200) {
          self.toastSuccess("短信发送成功！");
          self.countDown();
        } else if (res.statusCode == 400) {
          if (res.data.errorInfo == "phone number illegal") {
            self.toastFilled("请输入正确的手机号！");
          } else if (
            res.data.errorInfo == "Please wait a moment while trying to send."
          ) {
            self.toastFilled("你的操作过于频繁，请稍后再试！");
          } else if (res.data.errorInfo.includes("exceed the limit")) {
            self.toastFilled("获取已达上限！");
          } else {
            self.toastFilled(res.data.errorInfo);
          }
        }
      },
      fail(error) {
        self.toastFilled("短信发送失败！");
      },
    });
  },
  countDown: function () {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      times--;
      this.setData({
        btnText: times,
      });
      if (times === 0) {
        times = 60;
        this.setData({
          btnText: "获取验证码",
        });
        return clearTimeout(timer);
      }
      this.countDown();
    }, 1000);
  },
  login: function () {
    runAnimation = !runAnimation;
    // if(!__test_account__ && this.data.name == ""){
    // 	this.toastFilled('请输入手机号！')
    // 	return;
    // }
    // else if(!__test_account__ && this.data.psd == ""){
    // 	this.toastFilled('请输入验证码！')
    // 	return;
    // }
    getApp().conn.open({
      user: this.data.name,
      pwd: this.data.psd,
    });
  },

  longpress: function () {
    this.setData({
      show_config: !this.data.show_config,
    });
  },

  changeConfig: function () {
    this.setData(
      {
        isSandBox: !this.data.isSandBox,
      },
      () => {
        wx.setStorage({
          key: "isSandBox",
          data: this.data.isSandBox,
        });
      }
    );
  },
});
