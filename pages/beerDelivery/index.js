// pages/qinqinhehe/companyApprove/index.js
import {
  getBeerTypeList,
  publishBeerDelivery,
  updateByIdBeerDelivery,
  getShopRoleInfoList,
  getBeerShopList,
  getUserRoleInfoList
} from '../../api/user.js'
import publicFun from '../../utils/public.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    beer_type: [{idKey: '-1',name: '请选择'}],
    beer_index: 0,
    shop_list: [{shopName: '请选择店铺'}],
    shop_index: 0,
    number: '',
    userInfo: {},
    shopInfo: {},
    delivery_shop_id: '',//配送店铺id
    delivery_user_id: '',//配送人id
    take_shop_id: '',//收货店铺id
    take_user_id: '',//收货人id
    is_from: '',
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    // 获取啤酒类型
    getBeerTypeList({
      businessId: wx.getStorageSync('business_id')
    }).then((res)=>{
      if(res.code == 200){
        if(res.data.length!=0){
          this.setData({
            beer_type: []
          })
        }
        for(let i in res.data){
          this.data.beer_type.push({
            idKey: res.data[i].idKey,
            name: res.data[i].name
          })
        }
        this.setData({
          beer_type: this.data.beer_type
        })
      }
    })
    
    // 获取店铺列表和店铺信息
    getBeerShopList({
      businessId: wx.getStorageSync('business_id'),
      type: 1
    }).then((res)=>{
      if(res.code == 200){
        if(res.data.length != 0){
          let item = res.data;
          for(let i in item){
            item[i].phone = item[i].phone.substr(0,3)+"****"+item[i].phone.substr(7);
          }
          this.setData({
            shop_list: item,
            shopInfo: item[0],
            take_shop_id: item[0].idKey,
            take_user_id: item[0].userId
          })
        }
      }
    })

    // 获取配送人（自己）店铺id 和 用户id
    getShopRoleInfoList({
      userId: wx.getStorageSync('userInfo').unionId
    }).then((res)=>{
      if(res.code == 200){
        this.setData({
          delivery_shop_id: res.data[0].shopId,
          delivery_user_id: wx.getStorageSync('userInfo').unionId
        })
      }
    })
    
    if(options.is_from == 'edit'){
      // 修改进来
      getBeerShopList({
        businessId: wx.getStorageSync('business_id'),
        type: 1
      }).then((res)=>{
        if(res.code == 200){
          if(res.data.length != 0){
            let item = res.data;
            for(let i in item){
              item[i].phone = item[i].phone.substr(0,3)+"****"+item[i].phone.substr(7);
            }

            let data = JSON.parse(decodeURIComponent(options.data));
            let select_shop_index = '';
            let shopinfo = {};
            let beer_index = 0;
            for(let i in item){
              if(item[i].idKey == data.takeShopId){
                select_shop_index = i;
                shopinfo.nickname = item[i].nickname;
                shopinfo.bossName = item[i].bossName;
                shopinfo.phone = item[i].phone;
              }
            }
            for(let i in this.data.beer_type){
              if(this.data.beer_type[i].idKey == data.beerTypeId){
                beer_index = i;
              }
            }
            this.setData({
              is_from: 'edit',
              id: data.deliveryIdKey,
              beer_index: beer_index,
              shop_list: item,
              number: data.beerCount,
              shop_index: select_shop_index,
              shopInfo: shopinfo,
              take_shop_id: data.takeShopId,
              take_user_id: data.takeUserId
            })
          }
        }
      })
    }
  },
  bindSelectorChange(e){
    this.setData({
      beer_index: e.detail.value
    })
  },
  bindShopChange(e){
    console.log(JSON.stringify(this.data.shop_list))
    this.setData({
      shop_index: e.detail.value,
      shopInfo: this.data.shop_list[e.detail.value],
      take_shop_id: this.data.shop_list[e.detail.value].idKey,
      take_user_id: this.data.shop_list[e.detail.value].userId
    })
    return;
    getUserRoleInfoList({
      userId: wx.getStorageSync('userInfo').unionId
    }).then((res)=>{
      if(res.code == 200){
        if(res.data!=null){
          this.setData({
            take_shop_id: res.data[e.detail.value].idKey,
            take_user_id: res.data[e.detail.value].userId
          })
        }
      }
    })
    this.setData({
      shop_index: e.detail.value,
      shopInfo: this.data.shop_list[e.detail.value]
    })
  },
  addBeerType(){
    wx.navigateTo({
      url: '/pages/beerType/index',
    })
  },
  getNumber(e){
    this.setData({
      number: e.detail.value
    })
  },
  addSubmit(){
    if(this.data.beer_type[this.data.beer_index].name == '请选择'){
      publicFun.getToast('请选择啤酒类型');
      return;
    }
    if(this.data.number == ''){
      publicFun.getToast("请输入配送的啤酒数量");
      return;
    }
    if(this.data.shop_list[0].shopName == '请选择店铺'){
      publicFun.getToast("请选择店铺");
      return;
    }
    let data = {
      beerTypeId: this.data.beer_type[this.data.beer_index].idKey,
      beerCount: this.data.number,
      deliveryShopId: this.data.delivery_shop_id,
      deliveryUserId: this.data.delivery_user_id,
      takeShopId: this.data.take_shop_id,
      takeUserId: this.data.take_user_id,
      businessId: wx.getStorageSync('business_id'),
      userId: wx.getStorageSync('userInfo').unionId
    }
    if(this.data.is_from == 'edit'){
      data.idKey = this.data.id;
      updateByIdBeerDelivery(data).then((res)=>{
        if(res.code == 200){
          publicFun.getToast("修改成功");
          setTimeout(()=>{
            wx.navigateBack()
          },1500)
        }
      })
    }else{
      publishBeerDelivery(data).then((res)=>{
        if(res.code == 200){
          publicFun.getToast("添加成功");
          setTimeout(()=>{
            wx.setStorageSync('is_addDelivery', 1)
            wx.navigateBack()
          },1500)
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})