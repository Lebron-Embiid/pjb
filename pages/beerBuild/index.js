// pages/qinqinhehe/companyApprove/index.js
import {
  getBuildSystemConfig,
  buildSystemConfig,
  updateBuildSystemConfig
} from '../../api/user.js'
import publicFun from '../../utils/public.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    secure_val: '',
    warn_val: '',
    danger_val: '',
    is_change: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getBuildSystemConfig({
      shopId: wx.getStorageSync('shop_id')
    }).then((res)=>{
      if(res.code == 200){
        if(res.data!=null){
          this.setData({
            id: res.data.idKey,
            secure_val: res.data.secureValue,
            warn_val: res.data.warnValue,
            danger_val: res.data.dangerValue,
            is_change: true
          })
        }
      }
    })
  },
  getSecure(e){
    this.setData({
      secure_val: e.detail.value
    })
  },
  getWarn(e){
    this.setData({
      warn_val: e.detail.value
    })
  },
  getDanger(e){
    this.setData({
      danger_val: e.detail.value
    })
  },
  addSubmit(){
    if(this.data.is_change == true){
      updateBuildSystemConfig({
        idKey: this.data.id,
        secureValue: this.data.secure_val,
        warnValue: this.data.warn_val,
        // dangerValue: this.data.danger_val,
        userId: wx.getStorageSync('userInfo').unionId,
        shopId: wx.getStorageSync('shop_id')
      }).then((res)=>{
        if(res.code == 200){
          publicFun.getToast("修改成功");
          setTimeout(()=>{
            wx.navigateBack()
          },1500)
        }
      })
    }else{
      buildSystemConfig({
        secureValue: this.data.secure_val,
        warnValue: this.data.warn_val,
        // dangerValue: this.data.danger_val,
        userId: wx.getStorageSync('userInfo').unionId,
        shopId: wx.getStorageSync('shop_id')
      }).then((res)=>{
        if(res.code == 200){
          publicFun.getToast("添加成功");
          setTimeout(()=>{
            wx.navigateBack()
          },1500)
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})