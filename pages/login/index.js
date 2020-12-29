import {
  login,
  getUser,
  getSessinKey,
  getInfo
} from '../../api/user.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    openID:'',
    longitude:'',
    latitude:'',
    secretKey:'',
    is_auth: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("wx.getStorageSync('is_auth')---"+wx.getStorageSync('is_auth'))
    if(wx.getStorageSync('is_auth')){
      this.setData({
        is_auth: wx.getStorageSync('is_auth')
      })
    }
  },
  getUserInfoFun(e){
    console.log(e)
    let that = this;
    if(e.detail.errMsg == "getPhoneNumber:ok"){
      wx.login({
        success: (resg) => {
          if (resg.code) {
            console.log(resg);
            getSessinKey(resg.code).then(skres => {
              if (skres.code == 200) {
                console.log(skres);
                wx.getUserInfo({
                  success: (res) => {
                    console.log(res)
                    var userInfo = wx.getStorageSync('loginInfo')
                    var nickName = userInfo.nickName
                    var avatarUrl = userInfo.avatarUrl
                    //登录调用
                    getUser({
                      encryptedData: e.detail.encryptedData,
                      headPortraitLink: avatarUrl,
                      iv: e.detail.iv,
                      nickname: nickName,
                      sessionKey: skres.data.sessionKey,
                      unionId: skres.data.openId
                    }).then(logRes => {
                      if(logRes.code == 200){
                        wx.setStorageSync('token', logRes.data.token);
                        getInfo().then(login_res=>{
                          if(login_res.code == 200){
                            wx.setStorageSync('userInfo', login_res.data);
                            wx.setStorageSync('login_update',1)
                            wx.navigateBack();
                          }
                        })
                      }
                    }).catch(err => {
                      wx.showToast({
                        title: err
                      })
                      console.log(err)
                    })
                  }
                })
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    }
  },
  userInfo() {
    let that = this;
    wx.getUserInfo({
      success: (res) => {
        wx.setStorageSync('is_auth', true)
        wx.setStorageSync('loginInfo', res.userInfo)
        that.setData({
          userInfo: res.userInfo,
          is_auth: true
        })
      }
    })
  },
  toProtocol() {
    wx.navigateTo({
      url: '/pages/protocol/index'
    })
  }
})