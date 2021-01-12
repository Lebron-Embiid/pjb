// pages/myBuyCoupon/index.js
import {
  querySellSuccessCouponInfoList
} from '../../api/user.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0,//0:可使用 1:无使用次数 2:过期 3:被删除
    page: 1,
    nav_list: ['可使用','已用完'],//'已用完','已过期',
    nav_active: 0,
    type_index: 1,
    myBuyCouponList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMyBuyCouponList(this.data.type_index);
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
  clickNav(e){
    let index = e.currentTarget.dataset.index;
    let type = '';
    if(index == 0){
      type = 1;
    }else{
      type = 0;
    }
    this.setData({
      nav_active: index,
      type: index,
      type_index: type
    })
    this.getMyBuyCouponList(type);
  },
  getMyBuyCouponList(type){
    let data = {
      pageNum: this.data.page,
      pageSize: 20,
      // type: type,
      consumerId: wx.getStorageSync('userInfo').unionId
    }
    if(this.data.nav_active == 1){
      data.count = 0
    }
    querySellSuccessCouponInfoList(data).then((res)=>{
      if(res.code == 200){
        for(let i in res.data){
          res.data[i].sellDate = res.data[i].sellDate.split(" ")[0]
        }
        if(this.data.page == 1){
          this.setData({
            myBuyCouponList: res.data
          })
        }else{
          this.setData({
            myBuyCouponList: this.data.myBuyCouponList.concat(res.data)
          })
        }
      }
    })
  },
  toDetail(e){
    let couponId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/myBuyCouponDetail/index?id='+couponId
    })
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
    this.getMyBuyCouponList(this.data.type_index);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})