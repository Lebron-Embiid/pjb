// pages/merchant/index.js
import {
  uploadFile,
  addMerchantInfo,
  applyBusinessInfo,
  queryBusinessInfo,
  getBusinessInfo,
  updateByIdBusiness
} from '../../api/user.js'
import { base64src } from '../../utils/base64src.js'
import publicFun from '../../utils/public.js'
// var requestUrl = 'http://192.168.1.2:8082';
var requestUrl = "https://b.3p3.top"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    business_id: '',
    name: '',
    license: '',
    is_license: 0,
    back_img: '',
    is_back: 0,
    person_name: '',
    card: '',
    person_code: '',
    company_name: '',
    card_img: '',
    is_card: 0,
    book_img: '',
    is_book: 0,
    is_pass: 0,
    address: '',
    longitude: '',
    latitude: '',
    area: '',

    apply_type: '1',
    company_list: [{name: '县城老板',value: '1',checked: true},{name: '啤酒老板',value: '2',checked: false},{name: '餐馆老板',value: '3',checked: false}]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBusinessInfo();
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
    if(currPage.data.area){
      this.setData({
        area: currPage.data.area
      })
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
  getBusinessInfo(){
    getBusinessInfo({
      userId: wx.getStorageSync('userInfo').unionId
    }).then((res)=>{
      if(res.code == 200){
        if(res.data != null){
          if(res.data.status == 0){
            // 审批中
            this.setData({
              is_pass: 1,
              business_id: ''
            })
          }else if(res.data.status == 1){
            // 通过
            wx.setNavigationBarTitle({
              title: '修改资料'
            })
            this.setData({
              business_id: res.data.businessId,
              name: res.data.bossName,
              license: res.data.licenseImg,
              is_license: res.data.licenseImg==''?0:1,
              back_img: res.data.businessImg,
              is_back: res.data.businessImg==''?0:1,
              person_name: res.data.legalPerson,
              card: res.data.idnumber,
              person_code: res.data.uscc,
              company_name: res.data.businessName,
              card_img: res.data.idnumberImg,
              is_card: res.data.idnumberImg==''?0:1,
              book_img: res.data.authorizeImg,
              is_book: res.data.authorizeImg==''?0:1,
              is_pass: 0
            })
          }
        }
      }
    })
  },
  toSearchArea(){
    wx.navigateTo({
      url: '/pages/mapSearch/index?type=area'
    })
  },
  toSearchAddress(){
    wx.navigateTo({
      url: '/pages/mapSearch/index'
    })
  },
  radioChange(e){
    this.setData({
      apply_type: e.detail.value
    })
  },
  getName(e){
    this.setData({
      name: e.detail.value
    })
  },
  getPersonName(e){
    this.setData({
      person_name: e.detail.value
    })
  },
  getCard(e){
    this.setData({
      card: e.detail.value
    })
  },
  getPersonCode(e){
    this.setData({
      person_code: e.detail.value
    })
  },
  getCompanyName(e){
    this.setData({
      company_name: e.detail.value
    })
  },
  chooseLicense(e){
    var that = this;
    publicFun.getImage(1,false,['album']).then((res)=>{
      // uploadFile({
      //   file: res[0]
      // }).then((imgRes)=>{
      //   console.log(imgRes)
      // })
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
            let res = wx.getSystemInfoSync();
            let img_pic = JSON.parse(imgRes.data).data;
            if(res.platform == 'ios'){
              console.log('ios手机');
            }
            if(res.platform == 'android'){
              console.log('android手机');
            }
            
            that.setData({
              license: img_pic,
              is_license: 1
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
  chooseImageFun(e){
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
          if(JSON.parse(imgRes.data).code == 200){
            let img_pic = JSON.parse(imgRes.data).data;
            that.setData({
              back_img: img_pic,
              is_back: 1
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
  chooseCardImage(e){
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
          if(JSON.parse(imgRes.data).code == 200){
            let img_pic = JSON.parse(imgRes.data).data;
            that.setData({
              card_img: img_pic,
              is_card: 1
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
  chooseBookImage(e){
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
          if(JSON.parse(imgRes.data).code == 200){
            let img_pic = JSON.parse(imgRes.data).data;
            that.setData({
              book_img: img_pic,
              is_book: 1
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
  submitForm(e){
    var reg = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    // if(!reg.test(this.data.card)){
    //   wx.showToast({
    //     title: '请输入正确的身份证号码',
    //     icon: 'none'
    //   })
    //   return;
    // }
    if(this.data.company_name==''){
      publicFun.getToast('请输入企业名称')
      return;
    }
    if(this.data.person_name==''){
      publicFun.getToast('请输入法人名称')
      return;
    }
    // if(this.data.person_code==''){
    //   publicFun.getToast('请输入统一社会信用代码')
    //   return;
    // }
    // if(this.data.license==''){
    //   publicFun.getToast('请上传执照')
    //   return;
    // }
    if(this.data.back_img==''){
      publicFun.getToast('请上传企业背景图片')
      return;
    }
    if(this.data.address==''){
      publicFun.getToast('请输入县城区域')
      return;
    }
    if(this.data.longitude=='' || this.data.latitude==''){
      publicFun.getToast('请输入正确的地址')
      return;
    }
    console.log(this.data.business_id)
    let data = {
      userId: wx.getStorageSync('userInfo').unionId,
      businessId: this.data.business_id,
      county: this.data.address,
      longitude: this.data.longitude,
      latitude: this.data.latitude,
      businessName: this.data.company_name,//企业名称
      legalPerson: this.data.person_name,//法人名称
      uscc: this.data.person_code,//统一社会信用代码
      licenseImg: this.data.license,//执照
      businessImg: this.data.back_img,//企业图片
      bossName: this.data.name,//老板名称
      idnumber: this.data.card,//身份证
      idnumberImg: this.data.card_img,//身份证图片
      authorizeImg: this.data.book_img,//授权图片
    }
    if(this.data.business_id == ''){
      // 提交
      applyBusinessInfo(data).then(res=>{
        if(res.code == 200){
          if(this.data.business_id == ''){
            this.setData({
              name: '',
              license: '',
              is_license: 0,
              back_img: '',
              is_back: 0,
              person_name: '',
              card: '',
              person_code: '',
              company_name: '',
              card_img: '',
              is_card: 0,
              book_img: '',
              is_book: 0,
              is_pass: 1
            })
          }
          wx.showToast({
            title: '提交成功',
            icon: 'none'
          })
        }
      })
    }else{
      // 修改
      updateByIdBusiness(data).then(res=>{
        if(res.code == 200){
          wx.showToast({
            title: '修改成功',
            icon: 'none'
          })
        }
      })
    }
  }
})