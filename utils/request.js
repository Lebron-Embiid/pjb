const app = getApp();
//获取token


function getToken() {
  if (wx.getStorageSync('token') == "")
    return {}
  else {
    return {
      'Authentication': wx.getStorageSync('token') || ''
    }
  }
}

//url地址
// const requestUrl = 'https://maotaiapi.lcpower.cn';
// const requestUrl = 'http://192.168.1.2:8082';  //测试地址
// const requestUrl = 'http://47.114.123.200:8085';
const requestUrl = 'https://b.3p3.top';          //线上地址

/*
method 方法
url 地址
data 参数
header 请求头
dataType 数据格式 默认json
timeout 超时设置 默认5000ms
*/
const server = function({
  method,
  url,
  data,
  params,
  header = getToken(),
  dataType = 'json',
  timeout = 8000
}) {

  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: requestUrl + url,
      method,
      header,
      timeout,
      data: data || params,
      dataType,
      success: response => {
        let res = response.data;
        if (res.code == 401) {
          wx.showModal({
            title: "提示",
            content: res.msg || res.message,
            showCancel: false
          })
        } else if (res.code != 200) {
          wx.showModal({
            title: "提示",
            content: res.msg || res.message,
            showCancel: false
          })
        }
        wx.hideLoading()
        resolve(res)
      },
      fail: error => {
        wx.getNetworkType({
          success (res) {
            console.log(res.networkType);
            if(res.networkType == 'unknown' || res.networkType == 'none'){
              wx.showToast({
                title: '请检查网络状态',
                icon: 'none'
              })
              return;
            }
          }
        })
        wx.showToast({
          title: '请求超时',
          icon: 'none'
        })
        wx.hideLoading()
        reject('错误：'+JSON.stringify(error));
      }
    })
  })
};

export default server;