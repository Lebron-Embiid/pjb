// pages/qinqinhehe/companyApprove/index.js
import {
  createBeerType
} from '../../api/user.js'
import publicFun from '../../utils/public.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getName(e){
    this.setData({
      name: e.detail.value
    })
  },
  addSubmit(){
    createBeerType({
      name: this.data.name,
      businessId: wx.getStorageSync('business_id'),
      userId: wx.getStorageSync('userInfo').unionId
    }).then((res)=>{
      if(res.code == 200){
        publicFun.getToast("添加成功");
        setTimeout(()=>{
          wx.navigateBack()
        },1500)
      }
    })
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