//app.js
import mqtt from './utils/mqtt.min.js';
let client = null;
App({
  globalData: {
    userInfo: null,
    is_login: 0
  },
  onLaunch: function() {
    // this.connectMqtt();
    var that = this;
    wx.checkSession({
      success () {
        console.log('登录未过期');
        wx.setStorage({
          data: 1,
          key: 'check',
        })
        //session_key 未过期，并且在本生命周期一直有效
      },
      fail () {
        console.log('登录已过期');
        wx.setStorage({
          data: 2,
          key: 'check',
        })
        // session_key 已经失效，需要重新执行登录流程
      }
    })
    // // 登录
    wx.formatParmas = this.formatParmas;
    //转为unicode 编码
    wx.encodeUnicode = this.encodeUnicode;
    // 解码  
    wx.decodeUnicode = this.decodeUnicode;
    //解析url中的参数
    wx.getQueryString = this.getQueryString;
  },
  //格式化传参
  formatParmas(array) {
    let newUrl = [];
    for (let i in array) {
      newUrl.push(i + "=" + array[i]);
    }
    return newUrl.join('&');
  },
  //转为unicode 编码
  encodeUnicode(str) {
    var res = [];
    for (var i = 0; i < str.length; i++) {
      res[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
    }
    return "\\u" + res.join("\\u");
  },

  // 解码  
  decodeUnicode(str) {
    str = str.replace(/\\/g, "%");
    return unescape(str);
  },
  //解析url中的参数
  getQueryString({url, name}) {
    var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i');
    var r = url.substr(1).match(reg);
    if (r != null) {
      return r[2];
    }
    return null;
  },
  connectMqtt: function() {
    var clinet_id = parseInt(Math.random() * 100 + 888888888, 10);
    console.log('wx_' + clinet_id);
    const options = {
      connectTimeout: 4000, // 超时时间
      clientId: 'wx_' + clinet_id,
      port: 8083,  
      username: 'xxxx',
      password: 'xxxxx',
    }
    client = mqtt.connect('wx://xxxxxx', options)
    client.on('reconnect', (error) => {
      console.log('正在重连:', error)
    })
    client.on('error', (error) => {
      console.log('连接失败:', error)
    })
    let that = this;
    client.on('connect', (e) => {
      console.log('成功连接服务器')
　　　 //订阅一个主题
      client.subscribe('message.queue', {
        qos: 0
      }, function(err) {
        if (!err) {
          console.log("订阅成功")
        }
      })
    })
    client.on('message', function (topic, message) {
      console.log('received msg:' + message.toString());
    })
  },
})