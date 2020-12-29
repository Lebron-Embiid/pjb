// pages/couponUseList/index.js
import {
  queryUserCouponConsume
} from '../../api/user.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    couponList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCouponList();
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
  getCouponList(){
    queryUserCouponConsume({
      pageNum: this.data.page,
      pageSize: 20
    }).then((res)=>{
      if(res.code){
        if(this.data.page == 1){
          this.setData({
            couponList: res.data.records
          })
        }else{
          this.setData({
            couponList: this.data.couponList.concat(res.data.records)
          })
        }
      }
    })
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
    this.data.page++;
    this.setData({
      page: this.data.page
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})