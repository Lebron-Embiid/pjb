import {
  refreshUserInfo,
  getInfo,
  appRole,
  getCode,
  getPrivateKey,
  showUserQRCode,
  couponCollect,
  queryCouponCollectList,
  queryMyCouponList,
  queryBusinessInfo,
  queryCouponBrowse,
  querySellCouponList,
  queryCouponUseList,
  querySellCouponListBySeller,
  queryUseCouponListBySeller,
  del_coupon_browse,
  del_coupon_collect,
  del_coupon_purchased,
  buy_coupon,
  show_sell_coupon_image,
  queryUserVideoBrowseRecord,
  updateByIdVideoBrowseRecord,
  querySellSuccessCouponImgList
} from '../../api/user.js'
import { base64src } from '../../utils/base64src.js'
import publicFun from '../../utils/public.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar: '/assets/avatar.svg',
    name: '',
    phone: '',
    is_login: false,
    identity: '',//boss agent seller 
    user_code: '',
    is_showCode: false,
    nav_list: ['浏览促销券','已购销售券'],//,'我想','收藏促销券'
    nav_active: 0,
    look_list: [],
    coupon_list: [],
    collect_list: [],
    sellerList1: [],
    sellerList2: [],
    promotion_list:[
      {icon: '/assets/nav_icon9.png',title: '我当销售员'},
      {icon: '/assets/nav_icon8.png',title: '我做代理人'},
      {icon: '/assets/nav_icon6.png',title: '我发促销券'}
    ],
    code_img: [],
    key: '',
    page: 1,
    page1: 1,
    page2: 1,
    page3: 1,
    pages: 1,
    is_pass: 0,
    is_look_sell: false, //销售员是否查看销售记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    console.log(wx.getStorageSync('token'));
    // this.userInfo();
    wx.checkSession({
      success () {
        that.updateCoupon();
      }
    })
    // this.getLookList();
  },
  onShow() {
    var that = this;
    //获取用户信息
    wx.checkSession({
      success () {
        console.log('登录未过期');
        wx.setStorage({
          data: 1,
          key: 'check',
        })
        that.getUserInfo();

        if(wx.getStorageSync('updateIndexCoupon') == 1){
          that.updateCoupon();
          wx.removeStorageSync('updateIndexCoupon')
        }
        // 用户二维码
        // showUserQRCode().then((res)=>{
        //   const base64ImgUrl = "data:image/png;base64," + res.data;
        //   base64src(base64ImgUrl,'userCode',ress=>{
        //     that.setData({
        //       user_code: ress
        //     })
        //   })
        // })
      },
      fail () {
        console.log('登录已过期');
        wx.setStorage({
          data: 2,
          key: 'check',
        })
        // session_key 已经失效，需要重新执行登录流程
      }
    })
  },
  updateCoupon(){
    this.setData({
      look_list: [],
      collect_list: [],
      coupon_list: [],
      sellerList1: [],
      sellerList2: [],
      page: 1,
      page1: 1,
      page2: 1,
      page3: 1
    })
    this.getLookList();
    this.getBuyList();
  },
  getUserInfo(){
    // 用户二维码
    // showUserQRCode().then((res)=>{
    //   const base64ImgUrl = "data:image/png;base64," + res.data;
    //   base64src(base64ImgUrl,'userCode',ress=>{
    //     this.setData({
    //       user_code: ress
    //     })
    //   })
    // })
    
    let userinfo = wx.getStorageSync('userInfo');
    console.log('----用户信息----'+JSON.stringify(userinfo))
    this.setData({
      is_login: true,
      avatar: userinfo.headPortraitLink,
      name: userinfo.nickname,
      phone: userinfo.phone,
      identity: userinfo.type
    })
    // if(this.data.identity != 'seller'){
    //   // this.getLookList();
    //   // this.getCollectList();
    //   // this.getBuyList();
    // }
    // if(this.data.identity == 'seller'){
    //   if(this.data.is_look_sell == true){
    //     this.getSellList();
    //     this.getConsumeList();
    //   }else{
    //     this.getLookList();
    //     // this.getCollectList();
    //     this.getBuyList();
    //   }
    // }
  },
  getUserLogin(){
    // this.onShow();
    wx.checkSession({
      success () {
        console.log('登录未过期');
        wx.setStorageSync('check', 1)
      },
      fail () {
        console.log('登录已过期');
        wx.navigateTo({
          url: '/pages/login/index'
        })
        // session_key 已经失效，需要重新执行登录流程
      }
    })
  },
  scanCode() {
    wx.scanCode({
      success(res) {
        console.log('扫码返回的参数'+res.result);
        let data = wx.getQueryString({
          url: res.result,
          name: "data"
        });
        wx.setStorage({
          data: data,
          key: 'params',
        })
        wx.navigateTo({
          url: '/pages/demo/index?data=' + data
        })
      }
    })
  },
  toPromotion(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/promotion/index'
    })
  },
  getLookList() {
    //浏览列表
    queryUserVideoBrowseRecord({},this.data.page1,5).then(lookres=>{
      if(lookres.code == 200){
        if(this.data.page1 == 1){
          this.setData({
            look_list: lookres.data
          })
        }else{
          this.setData({
            look_list: this.data.look_list.concat(lookres.data)
          })
        }
      }
    })
  },
  getCollectList() {
    //收藏列表
    queryCouponCollectList({
      pageNum: this.data.page2,
      pageSize: 3
    }).then(res=>{
      if(res.code == 200){
        for(let i in res.data.records){
          let item = res.data.records[i];
          let base64 = "data:image/png;base64," + item.rqcode;
          let random = '';
          for (var i = 0; i < 8; i++) {
            random += Math.floor(Math.random(i)*10);
          }
          base64src(base64,random,ress=>{
            this.data.collect_list.push({
              certId: item.certId,
              id: item.couponId,
              coupon: ress,
              couponName: item.couponName
            });
            this.setData({
              collect_list: this.data.collect_list,
              pages: res.data.pages
            })
          })
        }
      }
    })
  },
  getBuyList(){
    querySellSuccessCouponImgList({
      consumerId: wx.getStorageSync('userInfo').unionId
    },this.data.page3,5).then(buyres=>{
      if(buyres.code == 200){
        if(this.data.page3 == 1){
          this.setData({
            coupon_list: buyres.data
          })
        }else{
          this.setData({
            coupon_list: this.data.coupon_list.concat(buyres.data)
          })
        }
      }
    })
  },
  getSellList(){
    querySellCouponListBySeller({
      pageNum: this.data.page,
      pageSize: 10
    }).then((res)=>{
      console.log('已出售促销券返回的json数据：'+JSON.stringify(res.data))
      if(res.code == 200){
        if(this.data.page == 1){
          this.setData({
            sellerList1: res.data.records,
            pages: res.data.pages
          })
        }else{
          this.setData({
            sellerList1: this.data.sellerList1.concat(res.data.records),
            pages: res.data.pages
          })
        }
      }
    })
  },
  getConsumeList(){
    queryUseCouponListBySeller({
      pageNum: this.data.page,
      pageSize: 10
    }).then((res)=>{
      console.log('已验收促销券返回的json数据：'+JSON.stringify(res.data))
      if(res.code == 200){
        if(this.data.page == 1){
          this.setData({
            sellerList2: res.data.records,
            pages: res.data.pages
          })
        }else{
          this.setData({
            sellerList2: this.data.sellerList2.concat(res.data.records),
            pages: res.data.pages
          })
        }
      }
    })
  },
  getSellerListMore1(){
    this.data.page++;
    this.setData({
      page: this.data.page
    })
  },
  getSellerListMore2(){
    this.data.page++;
    this.setData({
      page: this.data.page
    })
  },
  userInfo() {
    wx.getUserInfo({
      success: (res) => {
        var userInfo = res.userInfo;
        var nickName = userInfo.nickName;
        var avatarUrl = userInfo.avatarUrl;
        console.log(JSON.stringify(userInfo));
        this.setData({
          avatar: userInfo.avatarUrl,
          name: userInfo.nickName
        })
      }
    })
  },
  clickNav(e){
    let index = e.currentTarget.dataset.index;
    console.log(index,this.data.identity);
    this.setData({
      nav_active: index,
      page: 1,
      page1: 1,
      page2: 1,
      page3: 1,
      look_list: [],
      coupon_list: [],
      collect_list: [],
      // sellerList1: [],
      // sellerList2: []
    })
    
    if(wx.getStorageSync('check') == 1){
      if(index == 0){
        this.getLookList();
      }else{
        this.getBuyList();
      }
    }else{
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
    }
  },
  toLookSellList(){
    this.data.is_look_sell = !this.data.is_look_sell;
    if(this.data.is_look_sell == true){
      this.data.nav_list = ['已出售促销券','已验收促销券'];
    }else{
      this.data.nav_list = ['浏览促销券','已购促销券'];
    }
    this.setData({
      nav_active: 0,
      look_list: [],
      collect_list: [],
      coupon_list: [],
      sellerList1: [],
      sellerList2: [],
      page: 1,
      nav_list: this.data.nav_list,
      is_look_sell: this.data.is_look_sell
    })
    if(this.data.is_look_sell == true){
      this.getSellList();
      this.getConsumeList();
    }else{
      this.getLookList();
      // this.getCollectList();
      this.getBuyList();
    }
  },
  getLookMore(){
    this.data.page1++;
    this.setData({
      page1: this.data.page1
    })
    this.getLookList();
  },
  getCollectMore(){
    this.data.page2++;
    this.setData({
      page2: this.data.page2
    })
    this.getCollectList();
  },
  getCouponMore(){
    this.data.page3++;
    this.setData({
      page3: this.data.page3
    })
    this.getBuyList();
  },
  delCoupon(e){
    var that = this;
    let index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '确定删除该促销券？',
      success (res){
        if(res.confirm){
          updateByIdVideoBrowseRecord({
            idKey: that.data.look_list[index].idKey,
            status: 0
          }).then((resp)=>{
            if(resp.code == 200){
              that.data.look_list.splice(index,1);
              that.setData({
                look_list: that.data.look_list
              })
              // that.getLookList();
            }
          })
        }
      }
    })
  },
  delCollectCoupon(e){
    var that = this;
    let index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '确定删除该促销券？',
      success (res){
        if(res.confirm){
          del_coupon_collect({
            certId: that.data.collect_list[index].certId,
            couponId: that.data.collect_list[index].couponId
          }).then((resp)=>{
            if(resp.code == 200){
              that.data.collect_list.splice(index,1);
              that.setData({
                collect_list: that.data.collect_list
              })
              // that.getCollectList();
            }
          })
        }
      }
    })
  },
  delBuyCollectCoupon(e){
    var that = this;
    let index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '确定删除该促销券？',
      success (res){
        if(res.confirm){
          updateByIdVideoBrowseRecord({
            idKey: that.data.coupon_list[index].idKey,
            status: 0
          }).then((resp)=>{
            if(resp.code == 200){
              that.data.coupon_list.splice(index,1);
              that.setData({
                coupon_list: that.data.coupon_list
              })
              // that.getCollectList();
            }
          })
        }
      }
    })
  },
  selectLook(e){
    let index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/couponDetail/index?type=look&src='+this.data.look_list[index].coupon+'&id='+this.data.look_list[index].idKey
    })
  },
  toCollect(e){
    let item = e.currentTarget.dataset.item;
    couponCollect({
      certId: item.certId,
      couponId: item.couponId
    }).then((res)=>{
      if(res.code == 200){
        wx.showToast({
          title: '收藏成功！',
          icon: 'none'
        })
        this.setData({
          page2: 1,
          collect_list: []
        })
        this.getCollectList();
      }
    })
  },
  selectCollect(e){
    let index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/couponDetail/index?type=buy&src='+this.data.collect_list[index].coupon+'&certId='+this.data.collect_list[index].certId
    })
  },
  selectCoupon(e){
    let index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/couponDetail/index?type=buy&buy=ok&src='+this.data.coupon_list[index].coupon+'&id='+this.data.coupon_list[index].idKey+'&number='+this.data.coupon_list[index].number
    })
  },
  updateToken(){
    var that = this;
    refreshUserInfo().then((res)=>{
      if(res.code == 200){
        wx.setStorageSync('token', res.data.token);

        getInfo().then(login_res=>{
          if(login_res.code == 200){
            wx.setStorageSync('userInfo', login_res.data);
            that.updateCoupon();
            that.onShow();
          }
        })
      }
    })
  },
  clickItem(e){
    let index = e.currentTarget.dataset.index;
    let that = this;
    if(index == 0){
      // 申请成为销售员
      appRole({
        type: 'seller'
      }).then(res=>{
        if(res.code == 200){
          wx.showToast({
            title: '请求成功',
            icon: 'none'
          })
        }
      })
      // appRole({
      //   type: 'seller'
      // }).then(res=>{
      //   const base64Img = "data:image/png;base64," + res.data;
      //   base64src(base64Img,1,ress=>{
      //     that.setData({
      //       code_img: ress
      //     })
      //   })
      // })
    }else if(index == 1){
      appRole({
        type: 'agent'
      }).then(res=>{
        if(res.code == 200){
          wx.showToast({
            title: '请求成功',
            icon: 'none'
          })
        }
      })
    }else if(index == 2){
      wx.navigateTo({
        url: '/pages/merchant/index?pass='+this.data.is_pass
      })
    }else{
      // 我做编辑人
      
    }
  },
  previewCode(){
    let that = this;
    wx.previewImage({
      current: 0, // 当前显示图片的http链接
      urls: that.data.code_img // 需要预览的图片http链接列表
    })
  },
  pageTo(e){
    console.log(JSON.stringify(e.target.dataset.url))
    let url = e.target.dataset.url;
    if(wx.getStorageSync('check') == 1){
      wx.navigateTo({
        url: url
      })
    }else{
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
    }
  },
  changeMyInfo(){
    if(wx.getStorageSync('check') == 1){
      wx.navigateTo({
        url: '/pages/addCheck/index?type=edit'
      })
    }else{
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
    }
  },
  toRecordPage(){
    if(wx.getStorageSync('check') == 1){
      wx.navigateTo({
        url: '/pages/recordList/index'
      })
    }else{
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
    }
  },
  toInviteAgent(){
    if(wx.getStorageSync('check') == 1){
      wx.navigateTo({
        url: '/pages/inviteList/index'
      })
    }else{
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
    }
  },
  toMyBuyCoupon(){
    if(wx.getStorageSync('check') == 1){
      wx.navigateTo({
        url: '/pages/myBuyCoupon/index'
      })
    }else{
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
    }
  },
  toCouponUseList(){
    if(wx.getStorageSync('check') == 1){
      wx.navigateTo({
        url: '/pages/couponUseList/index'
      })
    }else{
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
    }
  },
  toCouponDealList(){
    if(wx.getStorageSync('check') == 1){
      wx.navigateTo({
        url: '/pages/couponDealList/index'
      })
    }else{
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
    }
  },
  showUserCode(){
    if(wx.getStorageSync('check') == 1){
      this.setData({
        is_showCode: true
      })
    }else{
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
    }
  },
  hideUserCode(){
    this.setData({
      is_showCode: false
    })
  },
  toShopTransfer(){
    if(wx.getStorageSync('check') == 1){
      wx.navigateTo({
        url: '/pages/shopTransfer/index?type=' + this.data.identity
      })
    }else{
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
    }
  },
  toTransferRecords(){
    if(wx.getStorageSync('check') == 1){
      wx.navigateTo({
        url: '/pages/transferRecords/index'
      })
    }else{
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
    }
  },
  toPromotionPage(){
    wx.navigateTo({
      url: '/pages/promotion/index'
    })
  }
})