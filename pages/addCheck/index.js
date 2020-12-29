// pages/merchant/index.js
import {
  getUserInfoByUserId,
  updateUserInfoByUserId
} from '../../api/user.js'
import publicFun from '../../utils/public.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '添加登记人员信息',
    id: '',
    table_number: '',
    company_name: '',
    person_name: '',
    person_phone: '',
    person_email: '',
    wechat_number: '',
    address: '',
    couponId: '',
    is_edit: 0,//是否修改进来 0:不是  1:是
    is_from: 0,//是否是邀请点进来
    region: ['北京市', '北京市', '东城区'],
    is_show_table_info: false,//是否显示用户桌子信息
    position: [{id:0,val:'企业老板'},{id:1,val:'企业高管'},{id:1,val:'企业经理'}],
    position_index: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      person_phone: wx.getStorageSync('userInfo').phone
    })
    getUserInfoByUserId({
      userId: wx.getStorageSync('userInfo').unionId
    }).then((res)=>{
      if(res.code == 200){
        this.setData({
          person_name: res.data.realName,
          person_email: res.data.email,
          address: res.data.address
        })
      }
    })
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.data.address = e.detail.value[0] + '-' + e.detail.value[1] + '-' + e.detail.value[2];
    this.setData({
      region: e.detail.value,
      address: this.data.address
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

  },
  getInputVal(e){
    let prams1 = e.target.dataset.key;
    this.setData({
      [prams1]: e.detail.value
    })
  },
  submitForm(e){
    var reg = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    // if(!reg.test(this.data.card)){
    //   wx.showToast({
    //     title: '请输入正确的身份证号码',
    //     icon: 'none'
    //   })
    //   return;
    // }
    // if(this.data.company_name==''){
    //   publicFun.getToast('请输入企业名称')
    //   return;
    // }
    // if(this.data.person_name==''){
    //   publicFun.getToast('请输入真实名字')
    //   return;
    // }
    // if(this.data.person_phone==''){
    //   publicFun.getToast('请输入联系方式')
    //   return;
    // }
    // if(this.data.person_email==''){
    //   publicFun.getToast('请输入邮箱')
    //   return;
    // }
    // if(this.data.address==''){
    //   publicFun.getToast('请输入收货地址')
    //   return;
    // }
    // if(this.data.roomImg==''){
    //   publicFun.getToast('请选择会议背景图片')
    //   return;
    // }
    let data = {
      userId: wx.getStorageSync('userInfo').unionId,
      realName: this.data.person_name,
      phone: this.data.person_phone,
      email: this.data.person_email,
      address: this.data.address
    }
    updateUserInfoByUserId(data).then(res=>{
      if(res.code == 200){
        publicFun.getToast('提交成功');
        setTimeout(()=>{
          wx.navigateBack();
        },1500)
      }
    })
  }
})