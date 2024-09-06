import EaseSDK from './Easemob-chat';
import { EM_APP_KEY, EM_API_URL, EM_WEB_SOCKET_URL } from './config/index';
let EMClient = (wx.EMClient = {});
EMClient = new EaseSDK.connection({
  appKey: EM_APP_KEY,
  apiUrl: EM_API_URL,
  url: EM_WEB_SOCKET_URL,
  enableReportLogs: true, //小程序平台（uniApp）开启日志上传。
});
wx.EMClient = EMClient;
export { EaseSDK, EMClient };
