// pages/login/index.js
import emConnect from '../../EaseIM/emApis/emConnect.js'
const {
  loginWithPassword,
  loginWithAccessToken
} = emConnect()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginPhoneNumber: "",
    loginSms: "",
    loginLoadingStatus: false,
    loginBtnDisabledStatus: false,
    privacyChecked: false,
    smsButtonText: "发送验证码",
    counter: 60
  },
  counterTimer: null,
  onPrivacyChecked() {
    this.setData({
      'privacyChecked': !this.data.privacyChecked
    })
    console.log(this.data.privacyChecked)
  },
  async onEntryConversationPage() {
    try {
      // await loginWithPassword('hfp', '1')
      // await loginWithAccessToken('9258f9d5fb', 'YWMtWWNl5F64Ee-yd8MXMAFbTlzzvlQ7sUrSpVuQGlyIzFQPontQpikR7bOrSTabUrc-AwMAAAGRblfOFTeeSACD4MTKml8Gxq9cSojO0tzIgQmU3q8k_SXDaJakSAH8pQ')
      wx.switchTab({
        url: '../conversation/index',
      })
    } catch (error) {
      console.log('error', error);
      wx.showToast({
        title: 'IM Open Fail'
      })
    }

  },
  startCount() {
    this.counterTimer = setInterval(() => {
      this.setData({
        counter: this.data.counter - 1
      })
      if (this.data.counter <= 0) {
        clearInterval(this.counterTimer);
        this.setData({
          counter: 60
        })
      }
    }, 1000);
  },
  //该接口仅演示使用，如需请自行部署验证码获取接口。
  getCode() {
    if (!/^1[3456789]\d{9}$/.test(this.data.loginPhoneNumber)) {
      wx.showToast({
        title: '手机号错误',
        icon: "none"
      });
      return false;
    }
    try {
      this.startCount();
      // 发送验证码
      wx.request({
        url: `https://a1.easemob.com/inside/app/sms/send/${this.data.loginPhoneNumber}`,
        header: {
          "content-type": "application/json"
        },
        method: "POST",
        data: {
          phoneNumber: this.data.phoneNumber
        },
        success: (res) => {
          console.log('>>>>>验证码获取成功', res);
          if (res.statusCode == 200) {
            wx.showToast({
              title: '验证码已发送',
              icon: "none"
            });
          } else if (res.statusCode == 400) {
            if (res.data.errorInfo == "phone number illegal") {
              wx.showToast({
                title: '手机号不合法',
                icon: "none"
              });
            } else if (
              res.data.errorInfo == "Please wait a moment while trying to send."
            ) {
              wx.showToast({
                title: '请稍等一会再获取',
                icon: "none"
              });
            } else if (res.data.errorInfo.includes("exceed the limit")) {
              wx.showToast({
                title: '验证码获取超限',
                icon: "none"
              });
            } else {
              wx.showToast({
                title: '验证码获取异常',
                icon: "none"
              });
            }
          }
        },
      });
    } catch (error) {
      console.log('>>>>>验证码获取异常', error);
    }
  },
  //仅供演示使用，该im token接口为内部演示接口
  getLoginInfo() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: "https://a1.easemob.com/inside/app/user/login/V2",
        header: {
          "content-type": "application/json"
        },
        method: "POST",
        data: {
          phoneNumber: this.data.loginPhoneNumber,
          smsCode: this.data.loginSms
        },
        success: (res) => {
          // console.log('>>>>>token获取成功', res);
          console.log('res.data.code', res.data.code);
          if (res.data.code === 200) {
            resolve(res.data)
          } else if (res.data.code === 400 && res.data.errorInfo) {
            switch (res.data.errorInfo) {
              case "UserId password error.":
                wx.showToast({
                  title: '用户名或密码错误',
                  icon: "none"
                });
                break;
              case "phone number illegal":
                wx.showToast({
                  title: '请输入正确的手机号!',
                  icon: "none"
                });
                break;
              case "SMS verification code error.":
                wx.showToast({
                  title: '验证码错误',
                  icon: "none"
                });
                break;
              case "Sms code cannot be empty.":
                wx.showToast({
                  title: '验证码不能为空',
                  icon: "none"
                });
                break;
              case "Please send SMS to get mobile phone verification code.":
                wx.showToast({
                  title: '请先发送验证码',
                  icon: "none"
                });
                break;
              default:
                wx.showToast({
                  title: res.data.errorInfo,
                  icon: "none"
                });
                break;
            }
            reject({
              type: 'smsError',
              errorInfo: res.data.errorInfo
            })
          }
        },
        fail: (error) => {
          console.log('>>>>token获取失败', error);
        }
      });
    })


  },
  async loginIM() {
    if (!this.data.privacyChecked) {
      wx.showToast({
        title: '请先勾选隐私协议',
        icon: "none"
      })
      return false
    }
    try {
      const infoData = await this.getLoginInfo()
      console.log('>>>>>登录所需信息获取完成', infoData);
      const {
        chatUserName,
        token
      } = infoData
      if (chatUserName && token) {
        await loginWithAccessToken(chatUserName, token)
        wx.switchTab({
          url: '../conversation/index',
        })
      }
    } catch (error) {
      console.log(error);
      if (error?.type === 'smsError') {
        console.log('>>>验证码获取失败');
      } else {
        console.log(error);
        wx.showToast({
          title: '登录异常',
          icon: 'none'
        })
      }
    }
  },
})