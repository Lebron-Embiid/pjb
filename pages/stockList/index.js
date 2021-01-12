// pages/qinqinhehe/companyApprove/index.js
import {
  getBeerStockList,
  queryShopBeerStockCaseList,
  queryStockCaseRecordList
} from '../../api/user.js'
import publicFun from '../../utils/public.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav_list: ['危险','警告','安全'],
    nav_active: 0,
    from_type: 0,//0：库存列表 1：库存情况
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = {
        factoryShopId: wx.getStorageSync('shop_id')
      }
    if(wx.getStorageSync('userInfo').type == 3){
      data = {
        diningShopId: wx.getStorageSync('shop_id')
      }
    }

    if(options.from_type == 1){
      this.setData({
        from_type: 1
      })
      this.getStockList(3);
    }else{
      getBeerStockList(data).then((res)=>{
        console.log('---list1---'+JSON.stringify(res.data))
        if(res.code == 200){
          this.setData({
            list: res.data
          })
        }
      })
    }
  },
  getStockList(level){
    let data = {
      factoryShopId: wx.getStorageSync('shop_id')
    }
    if(wx.getStorageSync('userInfo').type == 3){
      data = {
        diningShopId: wx.getStorageSync('shop_id')
      }
    }
    queryStockCaseRecordList(data).then((res)=>{
      console.log('---list2---'+JSON.stringify(res.data))
      if(res.code == 200){
        this.setData({
          list: res.data
        })
      }
    })
    // queryShopBeerStockCaseList({
    //   businessId: wx.getStorageSync('business_id')
    // },level).then((res)=>{
    //   if(res.code == 200){
    //   }
    // })
  },
  clickNav(e){
    let index = e.currentTarget.dataset.index;
    this.setData({
      nav_active: index
    })
    let level = 3;
    if(index == 0){
      level = 3;
    }else if(index == 1){
      level = 2;
    }else{
      level = 1;
    }
    this.getStockList(level);
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