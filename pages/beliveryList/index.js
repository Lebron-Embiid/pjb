// pages/buildList/index.js
import {
  queryUserBeerDeliveryList,
  changeBeerDeliveryStatus
} from '../../api/user.js'
import publicFun from '../../utils/public.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    beerList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getShowInitList();
  },
  getShowInitList(){
    let data = {}
    if(wx.getStorageSync('userInfo').type == 6){
      data.userId = wx.getStorageSync('userInfo').unionId
    }
    queryUserBeerDeliveryList(data).then((der_res)=>{
      if(der_res.code == 200){
        this.setData({
          beerList: der_res.data
        })
      }
    })
  },
  add(){
    wx.navigateTo({
      url: '/pages/beerDelivery/index'
    })
  },
  updateDerviry(e){
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/beerDelivery/index?is_from=edit&data='+encodeURIComponent(JSON.stringify(item))
    })
  },
  deleteDerviry(e){
    let that = this;
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: "提示",
      content: "确定要删除吗?",
      success: function(mos){
        if(mos.confirm){
          changeBeerDeliveryStatus({
            idKey: id,
            status: 3
          }).then((res)=>{
            if(res.code == 200){
              that.getShowInitList();
            }
          })
        }
      }
    })
  },
  cancelDerviry(e){
    let that = this;
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: "提示",
      content: "确定要取消配送吗?",
      success: function(mos){
        if(mos.confirm){
          changeBeerDeliveryStatus({
            idKey: id,
            status: 5
          }).then((res)=>{
            if(res.code == 200){
              that.getShowInitList();
            }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})