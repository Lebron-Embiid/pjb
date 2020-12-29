// pages/qinqinhehe/companyApprove/index.js
import {
  getUserRoleInfoList,
  getShopRoleInfoList,
  approveBusinessRole,
  approvalShopRole
} from '../../api/user.js'
import publicFun from '../../utils/public.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',//shop 店铺
    page: 1,
    role_list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("----当前角色----"+wx.getStorageSync('role_identity'))
    if(options.type == 'shop'){
      this.setData({
        type: options.type
      })
      // 店铺
      this.getShopRoleList();
    }else{
      this.getRoleList();
    }
  },
  getShopRoleList(){
    getShopRoleInfoList({
      pageNum: this.data.page,
      pageSize: 20,
      shopType: wx.getStorageSync('role_identity')
    }).then((res)=>{
      if(res.code == 200){
        if(this.data.length != 0){
          this.setData({
            role_list: res.data
          })
        }else{
          this.setData({
            role_list: this.data.role_list.concat(res.data)
          })
        }
      }
    })
  },
  getRoleList(){
    getUserRoleInfoList({
      pageNum: this.data.page,
      pageSize: 20
    }).then((res)=>{
      if(res.code == 200){
        if(this.data.length != 0){
          this.setData({
            role_list: res.data
          })
        }else{
          this.setData({
            role_list: this.data.role_list.concat(res.data)
          })
        }
      }
    })
  },
  agreeBtn(e){
    let item = e.currentTarget.dataset.item;
    if(this.data.type == 'shop'){
      approvalShopRole({
        idKey: item.roleIdKey,
        userId: item.userId,
        type: item.roleType,
        status: 1
      }).then((res)=>{
        if(res.code == 200){
          this.getRoleList();
        }
      })
    }else{
      approveBusinessRole({
        idKey: item.roleIdKey,
        userId: item.userId,
        type: item.roleType,
        status: 1
      }).then((res)=>{
        if(res.code == 200){
          this.getRoleList();
        }
      })
    }
  },
  rejectBtn(e){
    let item = e.currentTarget.dataset.item;
    if(this.data.type == 'shop'){
      approvalShopRole({
        idKey: item.roleIdKey,
        userId: item.userId,
        type: item.roleType,
        status: 2
      }).then((res)=>{
        if(res.code == 200){
          this.getRoleList();
        }
      })
    }else{
      approveBusinessRole({
        idKey: item.roleIdKey,
        userId: item.userId,
        type: item.roleType,
        status: 2
      }).then((res)=>{
        if(res.code == 200){
          this.getRoleList();
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
    this.data.page++;
    this.setData({
      page: this.data.page
    })
    this.getRoleList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})