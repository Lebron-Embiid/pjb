// pages/qinqinhehe/companyApprove/index.js
import {
  getBeerShopList,
  approveBeerShop
} from '../../api/user.js'
import publicFun from '../../utils/public.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shop_list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getShopList();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getShopList(){
    getBeerShopList({}).then((res)=>{
      if(res.code == 200){
        for(let i in res.data){
          res.data[i].phone = res.data[i].phone.substr(0,3)+"****"+res.data[i].phone.substr(7);
        }
        this.setData({
          shop_list: res.data
        })
      }
    })
  },
  agreeShop(e){
    let item = e.currentTarget.dataset.item;
    approveBeerShop({
      shopId: item.idKey,
      status: 1
    }).then((res)=>{
      if(res.code == 200){
        this.getShopList();
      }
    })
  },
  rejectShop(e){
    let item = e.currentTarget.dataset.item;
    approveBeerShop({
      shopId: item.idKey,
      status: 2
    }).then((res)=>{
      if(res.code == 200){
        this.getShopList();
      }
    })
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