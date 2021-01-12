// pages/qinqinhehe/companyApprove/index.js
import {
  getBusinessList,
  getBusinessRole,
  createBusinessRole
} from '../../api/user.js'
import publicFun from '../../utils/public.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    company_list: [],
    roleList: ["啤酒老板","餐馆老板","代理人","服务员"],
    roleNumber: [2,3,4,5],
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
    getBusinessList({
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
  bindRoleChange(e){
    let item = e.target.dataset.item;
    let index = e.detail.value;
    console.log(JSON.stringify(e))
    if(index == 0 || index == 1){
      wx.navigateTo({
        url: '/pages/applyShop/index?type='+index+'&business_id='+item.businessId+'&identity='+this.data.roleNumber[index]
      })
    }else{
      createBusinessRole({
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