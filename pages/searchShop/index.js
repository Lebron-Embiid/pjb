// pages/qinqinhehe/companyApprove/index.js
import {
  getBeerShopList,
  createShopRole
} from '../../api/user.js'
import publicFun from '../../utils/public.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    company_list: [],
    roleList: ["送酒员","店员"],
    roleNumber: [6,7],
    roleIndex: null,
    identity: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let role = '';
    if(wx.getStorageSync('role_identity')){
      role = wx.getStorageSync('role_identity');
    }else{
      role = wx.getStorageSync('userInfo').type
    }
    this.setData({
      identity: role
    })
    this.getCompanyList();
  },
  getCompanyList(){
    getBeerShopList({
      pageNum: this.data.page,
      pageSize: 20
    }).then((res)=>{
      if(res.code == 200){
        if(res.data.length != 0){
          let data = [];
          for(let i in res.data){
            if(res.data[i].status == 1){
              data.push(res.data[i])
            }
          }
          this.setData({
            company_list: data
          })
        }
      }
    })
  },
  applyShopRole(e){
    let item = e.target.dataset.item;
    createShopRole({
      shopId: item.idKey,
      userId: wx.getStorageSync('userInfo').unionId,
      type: item.roleType
    }).then((res)=>{
      if(res.code == 200){
        publicFun.getModal('申请成功',false)
      }
    })
  },
  bindRoleChange(e){
    let item = e.target.dataset.item;
    let index = e.detail.value;
    console.log(JSON.stringify(e))
    if(index == 0 || index == 1){
      wx.navigateTo({
        url: '/pages/applyShop/index?business_id='+item.businessId
      })
    }else{
      createShopRole({
        businessId: item.businessId,
        userId: wx.getStorageSync('userInfo').unionId,
        type: this.data.roleNumber[index]
      }).then((res)=>{
        if(res.code == 200){
          publicFun.getModal('申请成功',false)
        }
      })
    }
    // getBusinessRole({
    //   businessId: item.businessId
    // }).then((res)=>{
    //   if(res.code == 200){
        
    //   }
    // })
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
    this.data.page++;
    this.setData({
      page: this.data.page
    })
    this.getCompanyList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})