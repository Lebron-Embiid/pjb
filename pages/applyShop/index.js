// pages/applyShop/index.js
import {
  getBeerShop,
  applyBeerShop,
  updateByIdShop,
  getBeerShopList
} from '../../api/user.js'
import publicFun from '../../utils/public.js'
// var requestUrl = 'http://192.168.1.2:8082';
var requestUrl = "https://b.3p3.top";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '申请店铺信息',
    id: '',
    identity: '',
    business_id: '',
    shop_type: '',
    company_name: '',
    person_name: '',
    person_phone: '',
    person_email: '',
    person_idcard: '',
    address: '',
    licenseImg: '',
    is_licenseImg: 0,
    shopImg: '',
    is_shopImg: 0,
    is_edit: 0,//是否修改进来 0:不是  1:是
    region: ['北京市', '北京市', '东城区'],
    position: [{id:0,val:'企业老板'},{id:1,val:'企业高管'},{id:1,val:'企业经理'}],
    position_index: null,
    verify1: '',
    verify2: '',
    verify3: '',
    verify4: '',
    verify5: '',
    verify6: '',
    is_pass: 0,
    items: [
      {value: '1', name: '啤酒店铺', checked: 'true'},
      {value: '0', name: '啤酒厂家'}
    ],
    shop_types: ['饺子店','火锅店','包子店','茶饮店','烧烤店','自助餐','快餐店','简餐店','西餐店','中餐店','地方小吃','文旅小镇','美食广场','食堂','酒店餐饮','餐饮新零售','纯外卖餐饮','早餐店'],
    shop_index: null,
    longitude: '',//经度
    latitude: '',//纬度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      person_phone: wx.getStorageSync('userInfo').phone,
      identity: wx.getStorageSync('userInfo').type
    })
    if(options.identity){
      this.setData({
        identity: options.identity
      })
    }
    console.log(this.data.identity)

    if(options.business_id){
      console.log(JSON.stringify(options))
      this.setData({
        shop_type: options.type,
        business_id: options.business_id
      })
    }

    getBeerShop({
      userId: wx.getStorageSync('userInfo').unionId
    }).then((res)=>{
      if(res.code == 200){
        if(res.data != null){
          this.setData({
            is_pass: 1
          })
          if(res.data.status == 1){
            this.setData({
              id: res.data.idKey,
              business_id: res.data.businessId,
              company_name: res.data.shopName?res.data.shopName:'',
              person_name: res.data.bossName?res.data.bossName:'',
              person_phone: res.data.phone,
              person_email: res.data.email?res.data.email:'',
              person_idcard: res.data.idnumber?res.data.idnumber:'',
              address: res.data.address?res.data.address:'',
              licenseImg: res.data.licenseImg?res.data.licenseImg:'',
              is_licenseImg: res.data.licenseImg?1:0,
              shopImg: res.data.shopImg?res.data.shopImg:'',
              is_shopImg: res.data.shopImg?1:0,
              is_pass: 0
            })
          }
        }
      }
    })
    if(options.is_edit){
      this.setData({
        is_edit: 1,
        title: "修改店铺信息"
      })
    }
  },
  radioChange(e){

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
  bindPickerChange(e){
    this.setData({
      shop_index: e.detail.value
    })
  },
  toSearchAddress(){
    wx.navigateTo({
      url: '/pages/mapSearch/index'
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const pages = getCurrentPages()
    const currPage = pages[pages.length - 1] // 当前页
    console.log('---返回店数据---'+JSON.stringify(currPage.data))
    if(currPage.data.keywords){
      this.setData({
        address: currPage.data.keywords
      })
      if(currPage.data.location.length != 0){
        this.setData({
          longitude: currPage.data.location.split(',')[0],
          latitude: currPage.data.location.split(',')[1]
        })
      }else{
        this.setData({
          longitude: '',
          latitude: ''
        })
      }
    }
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
  chooseLicense(name,status){
    var that = this;
    publicFun.getImage(1,false,['album']).then((res)=>{
      wx.uploadFile({
        url: requestUrl + '/applet/file/upload', //仅为示例，非真实的接口地址
        filePath: res[0],
        name: 'file',
        header: {
          'Authentication': wx.getStorageSync('token')
        },
        formData:{
          type: ''
        },
        success (imgRes){
          // console.log('----ios1----'+JSON.stringify(imgRes))
          // console.log('----ios2----'+JSON.stringify(imgRes.data))
          // console.log('----ios3----'+JSON.parse(imgRes.data).data)
          if(JSON.parse(imgRes.data).code == 200){
            let img_pic = JSON.parse(imgRes.data).data;
            that.setData({
              [name]: img_pic,
              [status]: 1
            })
          }else{
            wx.showModal({
              title: "提示",
              content: JSON.parse(imgRes.data).msg || JSON.parse(imgRes.data).message,
              showCancel: false
            })
          }
        }
      })
    })
  },
  commonUpload(e){
    console.log(JSON.stringify(e))
    let name = e.currentTarget.dataset.upname;
    let status = e.currentTarget.dataset.is_upname;
    this.chooseLicense(name,status);
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
    if(this.data.identity != 2){
      if(this.data.shop_index == null){
        publicFun.getToast('请选择店铺类型')
        return;
      }
    }
    
    if(this.data.company_name==''){
      publicFun.getToast('请输入店铺名称')
      return;
    }
    if(this.data.person_name==''){
      publicFun.getToast('请输入老板名称')
      return;
    }
    if(this.data.address==''){
      if(this.data.identity == 3){
        publicFun.getToast('请输入店铺地址')
      }else{
        publicFun.getToast('请输入库存地址')
      }
      return;
    }
    if(this.data.longitude=='' || this.data.latitude==''){
      if(this.data.identity == 3){
        publicFun.getToast('请输入正确的店铺地址')
      }else{
        publicFun.getToast('请输入正确的库存地址')
      }
      return;
    }
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
      businessId: this.data.business_id,
      shopTypeName: this.data.shop_types[this.data.shop_index],
      longitude: this.data.longitude,
      latitude: this.data.latitude,
      shopName: this.data.company_name,
      bossName: this.data.person_name,
      phone: this.data.person_phone,
      email: this.data.person_email,
      idnumber: this.data.person_idcard,
      address: this.data.address,
      licenseImg: this.data.licenseImg,
      shopImg: this.data.shopImg,
      type: this.data.shop_type
    }

    if(this.data.identity == 2){
      // 啤酒老板
      data.shopType = ''
    }

    console.log('----提交data----'+JSON.stringify(data))
    if(this.data.is_edit == 1){
      data.idKey = this.data.id;
    }
    
    if(this.data.is_edit == 0){
      applyBeerShop(data).then(res=>{
        if(res.code == 200){
          this.setData({
            is_pass: 1
          })
          publicFun.getToast('提交成功');
          setTimeout(()=>{
            wx.navigateBack();
          },1500)
        }
      })
    }else{
      updateByIdShop(data).then(res=>{
        if(res.code == 200){
          publicFun.getToast('修改成功');
          setTimeout(()=>{
            wx.navigateBack();
          },1500)
        }
      })
    }
  }
})