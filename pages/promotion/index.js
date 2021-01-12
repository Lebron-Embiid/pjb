// pages/promotion/index.js
import {
  getInfo,
  appRole,
  shoWEditCouponList,
  query_editcoupon_list,
  getAgentCouponList,
  queryAllCouponAgentList,
  addCouponAgentList,
  editCoupon,
  addCouponAgent,
  queryCouponSellList,
  queryAllCouponSellList,
  queryCouponUseList,
  queryCouponUseList2,
  querySellCouponList,
  couponConsume,
  couponSell,
  queryBusinessInfo,
  queryBusinessImg,
  queryBusinessInfoByUserId,
  getSessinKey,
  update_phone,
  update_user_info,
  refreshUserInfo,
  delCoupon,
  delCouponAgent,
  changeUserType,
  hasUserType,
  my_business_list,
  getBusinessRole,
  getShopRole,
  getBeerShop,
  getCouponInfoList,
  query_boss_publish_coupon,
  queryCouponAgentList,
  updateByIdVideoBrowseRecord,
  beerSellCoupon,
  verifySellCoupon,
  queryUserBeerDeliveryList
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
    avatar: '/assets/avatar.svg',
    name: '',
    phone: '',
    coupon_id: '',
    is_home: true,
    identity: '',//boss agent seller 
    id_title: '',
    promotion_list: [],
    coupon_list: [],
    coupon_custom_list: [],
    issued_list: [],
    is_list: 0, //0: 编辑列表   1：发行列表
    index: '',
    page: 1,
    pages: 1,
    status: 1,
    is_pass: 0,
    is_issue: 0,
    back_img: '',
    shangjia_img: '',
    dataStr: '',
    consumerId: '',
    is_click: false,  //是否点击我的商家按钮  
    has_user: 0,
    myBusinessList: [],
    bus_index: 0,
    select_bossId: '',
    select_business: '',
    custom_isNull: true,  //自定义促销券是否为空
    is_edit_back: false,  //编辑促销券保存返回
    roleList: [],
    roleIdentity: '8',//当前用户的角色type
    beerList: [],//啤酒配送列表

    show_beer_num: false,//是否显示验证啤酒数量弹框
    beer_num: '1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getShowInit();
  },
  getBossShopRole(){
    getBeerShop({
      userId: wx.getStorageSync('userInfo').unionId
    }).then((shop_res)=>{
      if(shop_res.code == 200){
        if(shop_res.data!=null){
          wx.setStorageSync('shop_id', shop_res.data.idKey)
          wx.setStorageSync('back_img', shop_res.data.shopImg)
        }else{
          wx.removeStorageSync('back_img')
        }
      }
    })
  },
  getShopRole(){
    getShopRole({
      userId: wx.getStorageSync('userInfo').unionId
    }).then((shop_res)=>{
      if(shop_res.code == 200){
        if(shop_res.data!=null){
          wx.setStorageSync('shop_id', shop_res.data.shopId)
          getBeerShop({
            idKey: shop_res.data.shopId
          }).then((sp_res)=>{
            if(sp_res.code == 200){
              if(sp_res.data!=null){
                wx.setStorageSync('back_img', sp_res.data.shopImg)
              }else{
                wx.removeStorageSync('back_img')
              }
            }
          })
        }
      }
    })
  },
  getBeerDeviryList(){
    queryUserBeerDeliveryList({

    }).then((der_res)=>{
      if(der_res.code == 200){
        if(der_res.data!=null || der_res.data.length!=0){
          this.setData({
            beerList: der_res.data
          })
        }
      }
    })
  },
  getShowInit(){
    var that = this;
    wx.checkSession({
      success () {
        console.log('登录未过期');
        wx.setStorageSync('check',1);
        
        let userinfo = wx.getStorageSync('userInfo');
        console.log('----用户信息----'+JSON.stringify(userinfo))
        let identity = userinfo.type;
        let id_title = '';
        let is_click = false;
        let promotion_list = [];
        let role_list = [];

        that.getBeerDeviryList();

        getBusinessRole({
          userId: wx.getStorageSync('userInfo').unionId
        }).then((role_res)=>{
          if(role_res.code == 200){
            if(role_res.data != null){
              if(role_res.data.status == 1){
                if(role_res.data.type == 0 || role_res.data.type == 1){
                  role_list = ["县城老板","代理人","消费者"];//"服务员",
                }else if(role_res.data.type == 2){
                  role_list = ["啤酒老板","配送员","消费者"];
                  that.getBossShopRole();
                }else if(role_res.data.type == 3){
                  role_list = ["餐馆老板","店员","消费者"]
                  that.getBossShopRole();
                }
                
                if(role_res.data.type == 0 || role_res.data.type == 1 || role_res.data.type == 2 || role_res.data.type == 3){
                  changeUserType({
                    type: role_res.data.type
                  }).then((res)=>{
                    if(res.code == 200){
  
                    }
                  })
                }
  
                wx.setStorageSync('business_id', role_res.data.businessId);
                wx.setStorageSync('role_identity', role_res.data.type);
                that.setData({
                  roleIdentity: role_res.data.type,
                  roleList: role_list
                })
              }
            }else{
              wx.removeStorageSync('role_identity')
              that.setData({
                roleIdentity: 8
              })
            }
          }
        }).catch((cat_res)=>{
          let role_list = ["消费者"]
          that.setData({
            roleIdentity: 8,
            roleList: role_list
          })
        })

        if(identity != 8){
          is_click = true;
          if(identity == 0 || identity == 1){
            // 老板
            id_title = '县城老板';
            promotion_list = [
              {icon: '/assets/nav_icon2.png',title: '促销券编辑'},
              // {icon: '/assets/nav_icon9.png',title: '我的销售员'},
              {icon: '/assets/nav_icon6.png',title: '促销券发行'},
              // {icon: '/assets/nav_icon8.png',title: '我的代理人'},
              // {icon: '/assets/nav_icon7.png',title: '促销券收益'},
              {icon: '/assets/search.svg',title: '角色申请列表'},
              {icon: '/assets/search.svg',title: '店铺申请列表'},
              {icon: '/assets/nav_icon3.png',title: '数据统计报表'},
            ]
          }else if(identity == '2'){
            // 啤酒老板
            id_title = '啤酒老板';
            promotion_list = [
              {icon: '/assets/nav_icon1.png',title: '啤酒配送'},
              {icon: '/assets/nav_icon1.png',title: '餐馆库存配置'},
              {icon: '/assets/nav_icon1.png',title: '餐馆库存情况'},
              {icon: '/assets/search.svg',title: '角色申请列表'},
              {icon: '/assets/search.svg',title: '我的店铺'},
              {icon: '/assets/nav_icon3.png',title: '数据统计报表'},
            ]
          }else if(identity == '3'){
            // 餐馆老板
            id_title = '餐馆老板';
            promotion_list = [
              // {icon: '/assets/nav_icon1.png',title: '促销券收藏'},
              // {icon: '/assets/nav_icon1.png',title: '库存配置'},
              {icon: '/assets/nav_icon1.png',title: '啤酒配送列表'},
              {icon: '/assets/nav_icon1.png',title: '库存列表'},
              {icon: '/assets/search.svg',title: '角色申请列表'},
              {icon: '/assets/search.svg',title: '我的店铺'},
              {icon: '/assets/nav_icon3.png',title: '数据统计报表'},
            ]
          }else if(identity == '4'){
            // 代理人
            id_title = '代理人';
            promotion_list = [
              {icon: '/assets/nav_icon1.png',title: '促销券收藏'},
              {icon: '/assets/nav_icon6.png',title: '促销券再发行'},
              {icon: '/assets/nav_icon3.png',title: '数据统计报表'},
              // {icon: '/assets/nav_icon7.png',title: '促销券收益'},
              // {icon: '/assets/search.svg',title: '搜索商家'}
            ]
          }else if(identity == '5'){
            // 服务员
            id_title = '服务员';
            promotion_list = [
              {icon: '/assets/nav_icon4.png',title: '促销券销售'},
              {icon: '/assets/nav_icon5.png',title: '促销券验证'},
              // {icon: '/assets/nav_icon3.png',title: '促销券收入'},
              // {icon: '/assets/nav_icon7.png',title: '促销券折让'}
            ]
          }else if(identity == '6'){
            // 配送员
            id_title = '配送员';
            promotion_list = [
              {icon: '/assets/nav_icon1.png',title: '啤酒配送'},
              {icon: '/assets/nav_icon3.png',title: '数据统计报表'},
            ]
            that.getShopRole();
          }else if(identity == '7'){
            // 店员
            id_title = '店员';
            promotion_list = [
              {icon: '/assets/nav_icon4.png',title: '促销券销售'},
              {icon: '/assets/nav_icon5.png',title: '促销券验证'},
              {icon: '/assets/nav_icon3.png',title: '数据统计报表'},
            ]
            that.getShopRole();
          }
        }else{
          wx.removeStorageSync('back_img');
          id_title = '消费者';
          is_click = false;
          promotion_list = [
            // {icon: '/assets/nav_icon9.png',title: '我当销售员'},
            // {icon: '/assets/nav_icon8.png',title: '我做代理人'},
            // {icon: '/assets/nav_icon6.png',title: '我发促销券'},
            {icon: '/assets/search.svg',title: '申请公司角色'},
            {icon: '/assets/search.svg',title: '申请店铺角色'}
          ]
        }

        // 背景图
        let back_img = '';
        console.log("---背景图---"+wx.getStorageSync('back_img'))
        if(wx.getStorageSync('back_img')){
          back_img = wx.getStorageSync('back_img')
          that.setData({
            back_img: back_img
          })
        }else{
          that.getBusinessBackImg();
        }
        // that.getBusinessBackImg();
        that.setData({
          avatar: userinfo.headPortraitLink,
          name: userinfo.nickname,
          phone: userinfo.phone,
          identity: userinfo.type,
          is_login: true,
          promotion_list: promotion_list,
          id_title: id_title,
          is_click: is_click
        })

        //session_key 未过期，并且在本生命周期一直有效
        // hasUserType().then((ress)=>{
        //   if(ress.code == 200){
        //     that.setData({
        //       has_user: ress.data
        //     })
        //   }
        // })
        
        // if(userinfo.type == 'agent'){
        //   that.getMyBusinessList();
        // }else{
        //   queryBusinessImg({
        //     bossId: ''
        //   }).then((res)=>{
        //     if(res.code == 200){
        //       that.setData({
        //         shangjia_img: res.data
        //       })
        //     }
        //   })
        // }
      },
      fail () {
        console.log('登录已过期');
        wx.setStorageSync('check',2);
        // session_key 已经失效，需要重新执行登录流程
        let id_title = '';
        let is_click = false;
        let promotion_list = [
          // {icon: '/assets/nav_icon9.png',title: '我当销售员'},
          // {icon: '/assets/nav_icon8.png',title: '我做代理人'},
          // {icon: '/assets/nav_icon6.png',title: '我发促销券'},
          {icon: '/assets/search.svg',title: '申请公司角色'},
          {icon: '/assets/search.svg',title: '申请店铺角色'}
        ]
        that.setData({
          promotion_list: promotion_list,
          id_title: id_title,
          is_click: is_click,
          back_img: "https://b.3p3.top/upload/bg.png"
        })
      }
    })
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
    if(wx.getStorageSync('login_update')){
      this.getShowInit();
      wx.removeStorageSync('login_update');
    }

    if(wx.getStorageSync('is_addDelivery')){
      this.updateToken();
    }
    // var that = this;
    // console.log(that.data.is_edit_back)
    // if(that.data.is_edit_back == true){
    //   that.setData({
    //     page: 1,
    //     coupon_list: [],
    //     coupon_custom_list: []
    //   })
    //   that.getCouponList();
    //   that.getCouponCustomList();
    // }
  },
  onClick(){
    this.setData({
      show_beer_num: false
    })
  },
  getBusinessBackImg(){
    queryBusinessInfoByUserId({
      userId: wx.getStorageSync('userInfo').unionId
    }).then((res)=>{
      if(res.code == 200){
        if(res.data != null){
          // res.data.status   0：申请中  1：通过  2：未通过
          if(res.data.status == 1){
            wx.setStorageSync('back_img', res.data.businessImg)
            this.setData({
              back_img: res.data.businessImg
            })
          }else{
            wx.removeStorageSync('back_img');
            this.setData({
              back_img: "https://b.3p3.top/upload/bg.png"
            })
          }
        }else{
          this.setData({
            back_img: "https://b.3p3.top/upload/bg.png"
          })
        }
      }else{
        this.setData({
          back_img: "https://b.3p3.top/upload/bg.png"
        })
      }
    })
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
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.getSavedFileList({
      success: (res) => {
        res.fileList.forEach((val,key) => {
          wx.removeSavedFile({
            filePath: val.filePath
          })
        })
      }
    })
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
  userInfo() {
    wx.getUserInfo({
      success: (res) => {
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        this.setData({
          avatar: userInfo.avatarUrl,
          name: userInfo.nickName
        })
      }
    })
  },
  bindPickerChange(e){
    let index = e.detail.value;
    this.setData({
      select_bossId: this.data.myBusinessList[index].bossId,
      select_business: this.data.myBusinessList[index].businessName
    })
  },
  getMyBusinessList(){
    my_business_list().then((res)=>{
      if(res.data.length == 0){
        this.setData({
          select_bossId: ''
        })
        return;
      }
      if(res.code == 200){
        this.setData({
          myBusinessList: res.data,
          select_bossId: res.data[0].bossId,
          select_business: res.data[0].businessName
        })
        queryBusinessImg({
          bossId: res.data[0].bossId
        }).then((res)=>{
          if(res.code == 200){
            this.setData({
              shangjia_img: res.data
            })
          }
        })
      }
    })
  },
  getCouponList(){
    // 查看可编辑的促销券列表(老板)
    shoWEditCouponList({
      pageNum: this.data.page,
      pageSize: 5
    }).then(ress=>{
      if(ress.code == 200){
        let coupon_list = [];
        for(let i in ress.data){
          let random = Math.floor(Math.random()*99999999);
          let base64 = "data:image/png;base64," + ress.data[i];
          base64src(base64,i,image=>{
            this.data.coupon_list.push({
              id: i,
              src: image
            })
            this.setData({
              coupon_list: this.data.coupon_list,
              pages: ress.data.pages
            })
          })
        }
      }
    })
  },
  getCouponCustomList(){
    // 自定义促销券列表
    query_editcoupon_list({
      pageNum: this.data.page,
      pageSize: 5
    }).then((res)=>{
      if(res.code == 200){
        if(res.data.total != 0){
          this.setData({
            custom_isNull: false
          })
        }else{
          this.setData({
            custom_isNull: true
          })
        }
        for(let i in res.data.records){
          let item = res.data.records[i];
          let base64 = "data:image/png;base64," + item.image;
          base64src(base64,item.couponId,image=>{
            this.data.coupon_custom_list.push({
              id: item.couponId,
              src: image,
              couponName: item.couponName,
              imageNum: item.imageNum
            })
            this.setData({
              coupon_custom_list: this.data.coupon_custom_list
            })
          })
        }
        // if(this.data.page == 1){
        //   this.setData({
        //     coupon_custom_list: res.data.records
        //   })
        // }else{
        //   this.setData({
        //     coupon_custom_list: this.data.coupon_custom_list.concat(res.data.records)
        //   })
        // }
      }
    })
  },
  lookTemplate(){
    this.data.custom_isNull = !this.data.custom_isNull;
    console.log(this.data.custom_isNull);
    this.setData({
      custom_isNull: this.data.custom_isNull
    })
  },
  getCouponList1(){
    // 查看可发行的促销券列表(代理人)
    getAgentCouponList({
      pageNum: this.data.page,
      pageSize: 5,
      bossId: this.data.select_bossId
    }).then(res=>{
      if(res.code == 200){
        for(let i in res.data.records){
          let item = res.data.records[i];
          let random = Math.floor(Math.random()*99999999);
          let base64 = "data:image/png;base64," + item.rqcode;
          let coupon_list = [];
          base64src(base64,item.couponId,ress=>{
            this.data.coupon_list.push({
              id: item.couponId,
              src: ress,
              couponName: item.couponName
            });
            this.setData({
              coupon_list: this.data.coupon_list,
              pages: res.data.pages
            })
          })
        }
      }
    })
  },
  getIssuedList(status){
    // 查看已发行的促销券列表(老板)
    let data ={
      status: status,
      pageNum: this.data.page,
      pageSize: 5,
      userId: wx.getStorageSync('userInfo').unionId
    }
    query_boss_publish_coupon(data).then(res=>{
      if(res.code == 200){
        if(this.data.page == 1){
          this.setData({
            issued_list: res.data
          })
        }else{
          this.setData({
            issued_list: this.data.issued_list.concat(res.data)
          })
        }
      }
    })
  },
  getIssuedList1(status){
    // 查看已发行的促销券列表(代理人)
    console.log("---businesId---"+wx.getStorageSync('business_id'))
    let data = {
      status: status,//1:当前  0:回顾
      pageNum: this.data.page,
      pageSize: 5,
      userId: wx.getStorageSync('userInfo').unionId,
      businessId: wx.getStorageSync('business_id')
    }
    queryCouponAgentList(data).then(res=>{
      if(res.code == 200){
        if(this.data.page == 1){
          this.setData({
            issued_list: res.data
          })
        }else{
          this.setData({
            issued_list: this.data.issued_list.concat(res.data)
          })
        }
        // for(let i in res.data.records){
        //   let random = Math.floor(Math.random()*99999999);
        //   let item = res.data.records[i];
        //   let base64 = "data:image/png;base64," + item.rqcode;
        //   let issued_list = [];
        //   base64src(base64,item.couponId,ress=>{
        //     this.data.issued_list.push({
        //       id: item.couponId,
        //       src: ress,
        //       certId: item.certId,
        //       couponName: item.couponName
        //     });
        //     this.setData({
        //       issued_list: this.data.issued_list,
        //       pages: res.data.pages
        //     })
        //   })
        // }
      }
    })
  },
  // 编辑列表分页
  getCouponMore(e){
    if(this.data.page <= this.data.pages){
      this.data.page++;
      this.setData({
        page: this.data.page
      })
      if(this.data.identity == 'boss'){
        this.getCouponList();
      }
      if(this.data.identity == 'agent'){
        this.getCouponList1();
      }
    }
  },
  getCouponCustomMore(e){
    this.data.page++;
    this.setData({
      page: this.data.page
    })
    this.getCouponCustomList();
  },
  // 发行列表分页
  getIssuedMore(e){
    this.data.page++;
    this.setData({
      page: this.data.page
    })
    if(this.data.identity == 0 || this.data.identity == 1){
      this.getIssuedList(this.data.status);
    }
    if(this.data.identity == 4){
      this.getIssuedList1(this.data.status);
    }
  },
  // 点击导航触发事件
  getListClick(e){
    console.log(this.data.is_click)
    console.log(this.data.identity);
    this.setData({
      index: e.detail.index
    })
    if(this.data.is_click == true){
      if(this.data.identity == 0 || this.data.identity ==  1){
        // 权益、县城老板
        if(e.detail.index == 0){
          this.selectUserCoupon();
          // this.setData({
          //   page: 1,
          //   is_list: 0,
          //   is_home: false,
          //   coupon_list: [],
          //   coupon_custom_list: []
          // })
          // console.log(this.data.is_list)
          // this.getCouponList();
          // this.getCouponCustomList();
        }
        if(e.detail.index == 1){
          // 发行列表
          this.setData({
            page: 1,
            is_list: 1,
            status: 1,
            is_home: false,
            is_issue: 1,
            issued_list: []
          })
          this.getIssuedList(1);
          return;
          // 我的销售员
          wx.navigateTo({
            url: '/pages/mySeller/index'
          })
        }
        // if(e.detail.index == 2){
        //   // 我的代理人
        //   wx.navigateTo({
        //     url: '/pages/myAgent/index'
        //   })
        // }
        if(e.detail.index == 2){
          // 角色申请列表
          wx.navigateTo({
            url: '/pages/roleApplyList/index'
          })
        }
        if(e.detail.index == 3){
          // 店铺申请列表
          wx.navigateTo({
            url: '/pages/shopList/index'
          })
          return;
          //促销券收益（查看促销券出售数量）--老板
          wx.navigateTo({
            url: '/pages/profitList/index?type=boss'
          })
          // queryAllCouponSellList({
          //   pageNum: this.data.page,
          //   pageSize: 5
          // }).then(res=>{

          // })
        }
        if(e.detail.index == 4){
          // 数据统计报表
          wx.navigateTo({
            url: '/pages/Browse/index'
          })
          // wx.navigateTo({
          //   url: '/pages/profitList/index?type=boss',
          // })
        }
        if(e.detail.index == 6){
          //搜索代理人
          wx.navigateTo({
            url: '/pages/search/index?type=boss'
          })
        }
      }else if(this.data.identity == 4){
        // 代理人
        if(e.detail.index == 0){
          // 促销券收藏
          this.setData({
            page: 1,
            is_list: 1,
            status: 1,
            is_home: false,
            is_issue: 1,
            issued_list: []
          })
          this.getIssuedList(1);
        }
        if(e.detail.index == 1){
          // 促销券再发行
          this.setData({
            page: 1,
            is_list: 1,
            is_home: false,
            status: 1,
            issued_list: []
          })
          this.getIssuedList1(1);
        }
        if(e.detail.index == 2){
          // 数据统计报表
          wx.navigateTo({
            url: '/pages/Browse/index'
          })
          // wx.navigateTo({
          //   url: '/pages/profitDetail/index?type=agent&bossId='+this.data.select_bossId
          // })
        }
        if(e.detail.index == 3){
          // 促销券收益
          wx.navigateTo({
            url: '/pages/profitDetail/index?type=agent&bossId='+this.data.select_bossId
          })
        }
        if(e.detail.index == 4){
          //搜索商家
          wx.navigateTo({
            url: '/pages/search/index?type=agent'
          })
        }
      }else if(this.data.identity == 5){
        // 服务员
        if(e.detail.index == 0){
          // 销售
          var that = this;
          wx.scanCode({
            success(res) {
              console.log('扫码返回的参数: '+res.result);
              console.log('截取字符串后：'+res.result.replace("https://b.3p3.top?data=",""))
              // console.log(res.result.length)
              that.setData({
                dataStr: res.result.replace("https://b.3p3.top?data=","")
              })
              if(that.data.dataStr != ''){
                console.log('请求的参数：'+that.data.dataStr);
                beerSellCoupon({
                  data: that.data.dataStr//要购买的促销劵二维码
                }).then(resg=>{
                  console.log('出售成功：'+JSON.stringify(resg));
                  if(resg.code == 200){
                    that.setData({
                      dataStr: ''
                    })
                    wx.showModal({
                      title: "提示",
                      content: "出售成功！",
                      showCancel: false
                    })
                  }
                })
              }
              // console.log('扫码返回的参数2'+data);
            }
          })
        }
        if(e.detail.index == 1){
          // 验证
          // this.setData({
          //   show_beer_num: true
          // })
          this.vertifyCoupon();
        }
        if(e.detail.index == 2){
          // 收入详情
          wx.navigateTo({
            url: '/pages/profitDetail/index?type=seller&index=0',
          })
        }
        if(e.detail.index == 3){
          // 折让详情
          wx.navigateTo({
            url: '/pages/profitDetail/index?type=seller&index=1',
          })
        }
      }else if(this.data.identity == 2){
        // 啤酒老板
        if(e.detail.index == 0){
          console.log("---啤酒列表---"+JSON.stringify(this.data.beerList))
          if(this.data.beerList.length != 0){
            // 啤酒配送列表
            wx.navigateTo({
              url: '/pages/beliveryList/index'
            })
          }else{
            // 发布啤酒配送
            wx.navigateTo({
              url: '/pages/beerDelivery/index'
            })
          }
        }else if(e.detail.index == 1){
          // 库存标准配置
          wx.navigateTo({
            url: '/pages/beerBuild/index'
          })
        }else if(e.detail.index == 2){
          // 库存情况
          wx.navigateTo({
            url: '/pages/stockList/index?from_type=1'
          })
        }else if(e.detail.index == 3){
          // 角色申请列表
          wx.navigateTo({
            url: '/pages/roleApplyList/index?type=shop'
          })
        }else if(e.detail.index == 4){
          // 我的店铺
          wx.navigateTo({
            url: '/pages/applyShop/index?is_edit=1'
          })
        }else if(e.detail.index == 5){
          // 数据统计报表
          wx.navigateTo({
            url: '/pages/Browse/index'
          })
          // wx.navigateTo({
          //   url: '/pages/profitList/index?type=boss'
          // })
        }
      }else if(this.data.identity == 6){
        // 配送员
        if(e.detail.index == 0){
          if(this.data.beerList.length != 0){
            // 啤酒配送列表
            wx.navigateTo({
              url: '/pages/beliveryList/index'
            })
          }else{
            // 发布啤酒配送
            wx.navigateTo({
              url: '/pages/beerDelivery/index'
            })
          }
        }
        if(e.detail.index == 1){
          // 店铺库存情况
          wx.navigateTo({
            url: '/pages/Browse/index'
          })
        }
      }else if(this.data.identity == 3){
        // 餐馆老板
        if(e.detail.index == 0){
          // 啤酒配送列表
          wx.navigateTo({
            url: '/pages/beliveryList/index'
          })
        }else if(e.detail.index == 1){
          // 库存列表
          wx.navigateTo({
            url: '/pages/stockList/index'
          })
        }else if(e.detail.index == 2){
          // 角色申请列表
          wx.navigateTo({
            url: '/pages/roleApplyList/index?type=shop'
          })
        }else if(e.detail.index == 3){
          // 我的店铺
          wx.navigateTo({
            url: '/pages/applyShop/index?is_edit=1'
          })
        }else if(e.detail.index == 4){
          // 数据统计报表
          wx.navigateTo({
            url: '/pages/Browse/index'
          })
          // wx.navigateTo({
          //   url: '/pages/profitList/index?type=boss',
          // })
        }
      }else if(this.data.identity == 7){
        // 店员
        if(e.detail.index == 0){
          // 销售
          var that = this;
          wx.scanCode({
            success(res) {
              console.log('扫码返回的参数: '+res.result);
              console.log('截取字符串后：'+res.result.replace("https://b.3p3.top?data=",""))
              // console.log(res.result.length)
              that.setData({
                dataStr: res.result.replace("https://b.3p3.top?data=","")
              })
              if(that.data.dataStr != ''){
                console.log('请求的参数：'+that.data.dataStr);
                beerSellCoupon({
                  data: that.data.dataStr//要购买的促销劵二维码
                }).then(resg=>{
                  console.log('出售成功：'+JSON.stringify(resg));
                  if(resg.code == 200){
                    that.setData({
                      dataStr: ''
                    })
                    wx.showModal({
                      title: "提示",
                      content: "出售成功！",
                      showCancel: false
                    })
                  }
                })
              }
              // console.log('扫码返回的参数2'+data);
            }
          })
        }
        if(e.detail.index == 1){
          // 验证
          // this.setData({
          //   show_beer_num: true
          // })
          this.vertifyCoupon();
        }
        if(e.detail.index == 2){
          // 数据统计报表
          wx.navigateTo({
            url: '/pages/Browse/index'
          })
        }
      }
    }else{
      // 消费者
      if(this.data.phone == null || this.data.phone == ''){
        // wx.showToast({
        //   title: '此功能需获取您的手机号',
        //   icon: 'none'
        // })
        this.getUserPhone();
        this.getOnShow();
        return;
      }
      if(e.detail.index == 0){
        // 申请公司角色
        wx.navigateTo({
          url: '/pages/searchCompany/index'
        })
      }else if(e.detail.index == 1){
        // 申请店铺角色
        wx.navigateTo({
          url: '/pages/searchShop/index'
        })
      }
      return;
      if(e.detail.index == 0){
        if(wx.getStorageSync('check') == 1){
          // 申请成为销售员
          appRole({
            type: 'seller'
          }).then((res)=>{
            if(res.code == 200){
              wx.showToast({
                title: '请求成功',
                icon: 'none'
              })
            }
          })
        }else{
          // session_key 已经失效，需要重新执行登录流程
          wx.showToast({
            title: '请先登录',
            icon: 'none'
          })
        }
      }
      if(e.detail.index == 1){
        if(wx.getStorageSync('check') == 1){
          // 申请成为代理人
          appRole({
            type: 'agent'
          }).then((res)=>{
            if(res.code == 200){
              wx.showToast({
                title: '请求成功',
                icon: 'none'
              })
            }
          })
        }else{
          // session_key 已经失效，需要重新执行登录流程
          wx.showToast({
            title: '请先登录',
            icon: 'none'
          })
        }
      }
      if(e.detail.index == 2){
        let that = this;
        if(wx.getStorageSync('check') == 1){
          // 我发促销券
          wx.navigateTo({
            url: '/pages/merchant/index?pass='+that.data.is_pass
          })
        }else{
          // session_key 已经失效，需要重新执行登录流程
          wx.showToast({
            title: '请先登录',
            icon: 'none'
          })
        }
      }
      if(e.detail.index == 3){
        // 我做编辑人
      }
    }
  },
  changeBeerNum(e){
    this.setData({
      beer_num: e.detail.value
    })
  },
  vertifyCoupon(){
    var that = this;
    wx.scanCode({
      success (res) {
        console.log('---扫码返回的参数1---'+res.result);
        let data = res.result.replace("https://b.3p3.top?data=","");
        console.log('---扫码返回的参数2---'+data);
        verifySellCoupon({
          data: data,
          beerNumber: that.data.beer_num
        }).then((resg)=>{
          if(resg.code == 200){
            // that.setData({
            //   show_beer_num: false,
            //   beer_num: 1
            // })
            wx.showModal({
              title: "提示",
              content: "验证成功！",
              showCancel: false
            })
          }else{
            // that.setData({
            //   show_beer_num: false,
            //   beer_num: 1
            // })
          }
        })
      }
    })
  },
  getOnShow(){
    this.onShow();
  },
  updateToken(){
    var that = this;
    refreshUserInfo().then((res)=>{
      if(res.code == 200){
        wx.setStorageSync('token', res.data.token);
        wx.removeStorageSync('is_addDelivery')
        getInfo().then(login_res=>{
          if(login_res.code == 200){
            wx.setStorageSync('userInfo', login_res.data);
          }
        })
        // var id_title = '';
        // var back_img = '../../assets/indexBackground.png';
        // var promotion_list = [
        //   {icon: '/assets/nav_icon9.png',title: '我当销售员'},
        //   {icon: '/assets/nav_icon8.png',title: '我做代理人'},
        //   {icon: '/assets/nav_icon6.png',title: '我发促销券'}
        // ]
        // that.setData({
        //   is_home: true,
        //   is_click: false,
        //   id_title: '',
        //   back_img: back_img,
        //   promotion_list: promotion_list
        // })
        that.getShowInit();
      }
    })
  },
  getUserPhone(e){
    var that = this;
    wx.getNetworkType({
      success (res) {
        if(res.networkType == 'unknown' || res.networkType == 'none'){
          wx.showToast({
            title: '请检查网络状态',
            icon: 'none'
          })
          return;
        }
      }
    })
    wx.login({
      success: (resg) => {
        getSessinKey(resg.code).then(skres => {
          update_phone({
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
            sessionKey: skres.data.sessionKey
          }).then((upres)=>{
            if(upres.code == 200){
              wx.setStorageSync('token', upres.data.token);
              that.onShow();
            }
          })
        })
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
          data: encodeURIComponent(res.result),
          key: 'params',
        })
        wx.navigateTo({
          url: '/pages/demo/index?data=' + data
        })
      }
    })
  },
  // 下载图片  
  downFile(url){  
    const _this = this;  
    wx.downloadFile({
      url: url,
      success: (ress) => {
        if (ress.statusCode === 200) {
          console.log(ress.tempFilePath);
          wx.saveImageToPhotosAlbum({
            filePath: ress.tempFilePath,
            success: (downImg)=> { 
              console.log(downImg);
            },
          })
        }
      }
    })
  },
  selectCoupon(e){
    let index = e.currentTarget.dataset.index;
    console.log(index)
    if(this.data.identity == 0 || this.data.identity == 1){
      if(this.data.index == 0){
        // 促销券编辑
        if(this.data.custom_isNull == true){
          wx.navigateTo({
            url: '/pages/editCoupon/index?id='+this.data.coupon_list[index].id
          })
        }else{
          wx.navigateTo({
            url: '/pages/editCoupon/index?id='+this.data.coupon_custom_list[index].imageNum
          })
        }
      }
      if(this.data.index == 1){
        wx.navigateTo({
          url: '/pages/couponDetail/index?src='+this.data.issued_list[index].src+'&id='+this.data.issued_list[index].idKey
        })
      }
    }else if(this.data.identity == 4){
      if(this.data.index == 0){
        // 促销券编辑
        wx.navigateTo({
          url: '/pages/bossCouponDetail/index?id='+this.data.issued_list[index].coupon_id
        })
      }
      if(this.data.index == 1){
        wx.navigateTo({
          url: '/pages/couponDetail/index?src='+this.data.issued_list[index].src+'&id='+this.data.issued_list[index].idKey
        })
      }
    }
  },
  toUser(){
    if(this.data.is_home == true){
      wx.navigateBack({
        delta: 1
      })
      // if(wx.getStorageSync('check') == 1){
      //   // wx.navigateTo({
      //   //   url: '/pages/userInfo/index',
      //   // })
        
      // }else{
      //   wx.showToast({
      //     title: '请先登录',
      //     icon: 'none'
      //   })
      // }
    }else{
      this.setData({
        is_home: true,
        is_issue: 0
      })
    }
  },
  toIssue(){
    wx.navigateTo({
      url: '/pages/editIssue/index'
    })
  },
  toMyHouse(){
    var promotion_list = [];
    var id_title = '';
    var identity = this.data.identity;
    var is_click = !this.data.is_click;
    var back_img = '';

    if(is_click){
      queryBusinessImg({
        bossId: this.data.select_bossId
      }).then((res)=>{
        if(res.code == 200){
          this.setData({
            shangjia_img: res.data
          })
        }
      })
      back_img = this.data.shangjia_img;
      if(identity == 'boss'){
        // 老板
        id_title = '老板';
        promotion_list = [
          {icon: '/assets/nav_icon2.png',title: '促销券编辑'},
          {icon: '/assets/nav_icon9.png',title: '我的销售员'},
          {icon: '/assets/nav_icon3.png',title: '促销券回顾'},
          {icon: '/assets/nav_icon6.png',title: '促销券发行'},
          {icon: '/assets/nav_icon8.png',title: '我的代理人'},
          {icon: '/assets/nav_icon7.png',title: '促销券收益'},
          {icon: '/assets/search.svg',title: '搜索代理人'}
        ]
      }else if(identity == 'agent'){
        // 代理人
        id_title = '代理人';
        promotion_list = [
          {icon: '/assets/nav_icon1.png',title: '促销券收藏'},
          {icon: '/assets/nav_icon6.png',title: '促销券再发行'},
          {icon: '/assets/nav_icon3.png',title: '促销券回顾'},
          {icon: '/assets/nav_icon7.png',title: '促销券收益'},
          {icon: '/assets/search.svg',title: '搜索商家'}
        ]
      }else if(identity == 'seller'){
        // 销售员
        id_title = '销售员';
        promotion_list = [
          {icon: '/assets/nav_icon4.png',title: '促销券销售'},
          {icon: '/assets/nav_icon5.png',title: '促销券验证'},
          {icon: '/assets/nav_icon3.png',title: '促销券收入'},
          {icon: '/assets/nav_icon7.png',title: '促销券折让'}
        ]
      }
    }else{
      back_img = '../../assets/indexBackground.png';
      promotion_list = [
        {icon: '/assets/nav_icon9.png',title: '我当销售员'},
        {icon: '/assets/nav_icon8.png',title: '我做代理人'},
        {icon: '/assets/nav_icon6.png',title: '我发促销券'}
      ]
    }
    this.setData({
      promotion_list: promotion_list,
      id_title: id_title,
      is_click: is_click,
      back_img: back_img,
      is_home: true
    })
  },
  selectUserCoupon(){
    console.log(wx.getStorageSync('custom'));
    // if(wx.getStorageSync('custom')){
    //   wx.navigateTo({
    //     url: '/pages/editCoupon/index?type=custom&id='+wx.getStorageSync('custom'),
    //   })
    // }else{
      publicFun.getImage(1,false,['album']).then((res)=>{
        console.log('----自定义上传促销券----：'+res[0]);
        wx.showLoading({
          title: '加载中'
        })
        wx.uploadFile({
          url: requestUrl + '/applet/file/upload', //仅为示例，非真实的接口地址
          filePath: res[0],
          name: 'file',
          header: {
            'Authentication': wx.getStorageSync('token')
          },
          formData:{
            type: 'cp'
          },
          success (imgRes){
            console.log('----自定义上传促销券----2：'+JSON.stringify(imgRes.data));
            console.log(JSON.parse(imgRes.data).msg);
            if(JSON.parse(imgRes.data).code == 200){
              wx.hideLoading();
              wx.navigateTo({
                url: '/pages/editCoupon/index?type=custom&id='+JSON.parse(imgRes.data).data,
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
    // }
  },
  delEditCoupon(e){
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
              // publicFun.getToast(resp.code);
              // that.setData({
              //   page: 1,
              //   is_list: 1,
              //   status: 1,
              //   is_home: false,
              //   coupon_list: []
              // })
              // that.getCouponList();
            }
          })
        }
      }
    })
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
            idKey: that.data.issued_list[index].idKey,
            status: 0
          }).then((resp)=>{
            if(resp.code == 200){
              that.data.issued_list.splice(index,1);
              that.setData({
                issued_list: that.data.issued_list
              })
              // publicFun.getToast(resp.code);
              // that.data.issued_list.splice(index,1);
              // that.setData({
              //   is_list: 1,
              //   status: 1,
              //   is_home: false,
              //   issued_list: that.data.issued_list
              // })
              // that.getIssuedList(1);
            }
          })
        }
      }
    })
  },
  changeIdentity(e){
    var index = e.detail.value;
    var id_type = '';
    var id_title = '';
    if(this.data.roleIdentity == 0 || this.data.roleIdentity == 1){
      if(index == 0){
        id_type = '1';
        id_title = '县城老板';
      }else if(index == 1){
        id_type = '4';
        id_title = '代理人';
      }else if(index == 2){
        id_type = '5';
        id_title = '服务员';
      }else if(index == 3){
        id_type = '8';
        id_title = '消费者';
      }
    }else if(this.data.roleIdentity == 2){
      if(index == 0){
        id_type = '2';
        id_title = '啤酒老板';
      }else if(index == 1){
        id_type = '6';
        id_title = '配送员';
      }else if(index == 2){
        id_type = '8';
        id_title = '消费者';
      }
    }else if(this.data.roleIdentity == 3){
      if(index == 0){
        id_type = '3';
        id_title = '餐馆老板';
      }else if(index == 1){
        id_type = '7';
        id_title = '店员';
      }else if(index == 2){
        id_type = '8';
        id_title = '消费者';
      }
    }
    this.setData({
      is_home: true,
      id_title: id_title
    })

    changeUserType({
      type: id_type
    }).then((res)=>{
      if(res.code == 200){
        this.updateToken();
      }
    })
  }
})